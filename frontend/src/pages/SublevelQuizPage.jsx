import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { learningService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';
import { 
  Heart, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Home,
  Code2,
  HelpCircle
} from 'lucide-react';

const SublevelQuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [sublevel, setSublevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userAnswers, setUserAnswers] = useState({});
  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const [hasCheckedCurrent, setHasCheckedCurrent] = useState(false);
  const [currentIsCorrect, setCurrentIsCorrect] = useState(null);
  const [koffiCommentary, setKoffiCommentary] = useState('');

  const [sessionHearts, setSessionHearts] = useState(user?.hearts ?? 5);

  const [isFinished, setIsFinished] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await learningService.getSublevelQuestions(id);
        if (res.success) {
          setSublevel(res.sublevel);
          setQuestions(res.questions);
        }
      } catch (e) {
        console.error('Error loading questions:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!currentQ) return;

    setHasCheckedCurrent(false);
    setCurrentIsCorrect(null);
    setKoffiCommentary('');

    if (currentQ.question_type === 'sorting') {
      setAvailableTokens([...currentQ.options]);
      setSelectedTokens([]);
    } else {
      setSelectedOption('');
    }
  }, [currentIndex, currentQ]);

  const handlePickToken = (token, tokenIndex) => {
    sounds.playClick();
    const nextAvail = [...availableTokens];
    nextAvail.splice(tokenIndex, 1);
    setAvailableTokens(nextAvail);

    const nextSelected = [...selectedTokens, token];
    setSelectedTokens(nextSelected);

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: nextSelected,
    }));
  };

  const handleUnpickToken = (token, tokenIndex) => {
    sounds.playClick();
    const nextSelected = [...selectedTokens];
    nextSelected.splice(tokenIndex, 1);
    setSelectedTokens(nextSelected);

    const nextAvail = [...availableTokens, token];
    setAvailableTokens(nextAvail);

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: nextSelected,
    }));
  };

  const handleResetSorting = () => {
    sounds.playClick();
    if (currentQ) {
      setAvailableTokens([...currentQ.options]);
      setSelectedTokens([]);
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: [],
      }));
    }
  };

  const handleSelectOption = (opt) => {
    if (hasCheckedCurrent) return;
    sounds.playClick();
    setSelectedOption(opt);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleCheckAnswer = () => {
    if (!currentQ) return;

    let answered = false;
    let givenAnswer = null;

    if (currentQ.question_type === 'sorting') {
      if (selectedTokens.length === 0) return;
      answered = true;
      givenAnswer = selectedTokens;
    } else {
      if (!selectedOption) return;
      answered = true;
      givenAnswer = selectedOption;
    }

    if (!answered) return;

    let isCorrectGuess = true;
    if (currentQ.question_type === 'sorting') {
      isCorrectGuess = selectedTokens.length === currentQ.options.length;
    } else {
      isCorrectGuess = givenAnswer.toLowerCase().includes('should be') || 
                       givenAnswer.toLowerCase().includes('lowercase') ||
                       givenAnswer.length > 0;
    }

    setHasCheckedCurrent(true);
    setCurrentIsCorrect(isCorrectGuess);
    sounds.playClick();

    if (isCorrectGuess) {
      sounds.playCorrect();
      setKoffiCommentary('Correct order. Well done!');
    } else {
      sounds.playWrong();
      setSessionHearts((h) => Math.max(0, h - 1));
      setKoffiCommentary('Incorrect. Review the syntax structure.');
    }
  };

  const handleNextQuestion = async () => {
    sounds.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await learningService.submitSublevel(id, userAnswers);
      if (res.success) {
        setSubmissionResult(res);
        setIsFinished(true);
        if (res.passed) {
          sounds.playVictory();
        } else {
          sounds.playThreat();
        }
        if (res.user) {
          updateUser(res.user);
        }
      }
    } catch (e) {
      console.error('Quiz submission error:', e);
      alert('Submission failed. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-mesh">
        <div className="pastel-card p-6 text-center max-w-xs border border-purple-100">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin mb-3" />
          <p className="text-xs font-bold text-gray-700">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-mesh p-4">
        <div className="pastel-card p-6 text-center max-w-md border border-purple-100">
          <p className="text-sm font-bold text-gray-800">No questions available for this sublevel.</p>
          <Link to="/" className="candy-btn candy-btn-purple px-5 py-2 mt-4 inline-block text-xs">
            Return to Curriculum
          </Link>
        </div>
      </div>
    );
  }

  // Results View
  if (isFinished && submissionResult) {
    const passed = submissionResult.passed;
    const score = submissionResult.score;
    const mascotImg = passed ? '/mascots/happy.jpg' : '/mascots/angry.jpg';

    return (
      <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-pastel-mesh">
        <div className="max-w-lg w-full pastel-card p-6 sm:p-8 bg-white border border-purple-200 shadow-lg text-center animate-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-purple-100 shadow-sm mb-3 p-0.5 bg-white">
            <img
              src={mascotImg}
              alt="Mascot Result"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md inline-block mb-1 ${
            passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {passed ? 'Sublevel Passed' : 'Needs Practice'}
          </span>

          <h2 className="text-2xl font-black text-gray-900 mt-1">
            {passed ? 'Quiz Completed' : 'Keep Practicing'}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {submissionResult.threat_message}
          </p>

          <div className="flex justify-center items-center gap-1.5 my-4">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-7 h-7 ${
                  starIdx <= submissionResult.stars
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-5">
            <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="text-lg font-black text-purple-700">{score} / 15</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Correct</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="text-lg font-black text-amber-600">+{submissionResult.marks_earned}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">Marks</div>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-100">
              <div className="text-lg font-black text-pink-600">+{submissionResult.xp_earned}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">XP</div>
            </div>
          </div>

          <div className="text-left mt-5 mb-5">
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              Answer Explanations
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
              {submissionResult.results?.map((res, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border ${
                    res.is_correct
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-rose-50/70 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-0.5">
                    <span className="flex items-center gap-1 text-[11px]">
                      {res.is_correct ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      Question {res.question_index}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-gray-400">{res.question_type}</span>
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed">{res.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => {
                sounds.playClick();
                setIsFinished(false);
                setCurrentIndex(0);
                setUserAnswers({});
              }}
              className="candy-btn candy-btn-white flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <Link
              to="/"
              onClick={() => sounds.playClick()}
              className="candy-btn candy-btn-purple flex-1 py-2 text-xs flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Levels</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-pastel-mesh">
      {/* Quiz Header Bar */}
      <div className="bg-white/95 border-b border-gray-200/80 py-3 px-4 sticky top-16 z-30 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => sounds.playClick()}
            className="text-xs font-bold text-gray-500 hover:text-gray-800"
          >
            ✕ Exit
          </Link>

          <div className="flex-1 max-w-sm">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
              <span>Question {currentIndex + 1} of 15</span>
              <span>{Math.round(((currentIndex + 1) / 15) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / 15) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100 text-xs font-black text-rose-600">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{sessionHearts}</span>
          </div>
        </div>
      </div>

      {/* Main Question View */}
      <main className="max-w-2xl mx-auto px-4 mt-6 animate-in fade-in duration-150">
        <div className="pastel-card p-6 bg-white border border-purple-200/90 shadow-md">
          {/* Question Tag */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
              currentQ.question_type === 'sorting'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : currentQ.question_type === 'case_fix'
                ? 'bg-pink-50 text-pink-700 border border-pink-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {currentQ.question_type === 'sorting'
                ? 'Code Rearrangement'
                : currentQ.question_type === 'case_fix'
                ? 'Syntax Inspection'
                : 'Multiple Choice'}
            </span>

            <span className="text-[11px] font-bold text-gray-400">
              10 pts
            </span>
          </div>

          <h3 className="text-lg font-black text-gray-900 leading-snug mb-3.5">
            {currentQ.prompt}
          </h3>

          {/* Code Snippet Box */}
          {currentQ.code_snippet && (
            <div className="mb-5 p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner overflow-x-auto">
              <div className="text-[10px] text-slate-500 uppercase font-sans font-bold mb-1">
                Java Code:
              </div>
              <pre className="whitespace-pre-wrap">{currentQ.code_snippet}</pre>
            </div>
          )}

          {/* SORTING TYPE */}
          {currentQ.question_type === 'sorting' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">
                    Reordered Syntax:
                  </span>
                  {selectedTokens.length > 0 && !hasCheckedCurrent && (
                    <button
                      onClick={handleResetSorting}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="min-h-20 p-3.5 rounded-xl bg-purple-50/50 border-2 border-dashed border-purple-200 flex flex-wrap items-center gap-2">
                  {selectedTokens.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">
                      Click the tokens below in the correct order...
                    </span>
                  ) : (
                    selectedTokens.map((token, idx) => (
                      <button
                        key={idx}
                        disabled={hasCheckedCurrent}
                        onClick={() => handleUnpickToken(token, idx)}
                        className="candy-btn candy-btn-purple px-3 py-1.5 text-xs font-mono flex items-center gap-1"
                        title="Click to remove"
                      >
                        <span>{token}</span>
                        <span className="text-[10px] opacity-70">✕</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {selectedTokens.length > 0 && (
                <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-white flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Preview:</span>
                  <span className="text-amber-300">{selectedTokens.join(' ')}</span>
                </div>
              )}

              <div>
                <span className="block text-xs font-bold text-gray-500 mb-1.5">
                  Available Tokens:
                </span>
                <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  {availableTokens.length === 0 ? (
                    <span className="text-xs text-gray-400">
                      All tokens placed.
                    </span>
                  ) : (
                    availableTokens.map((token, idx) => (
                      <button
                        key={idx}
                        disabled={hasCheckedCurrent}
                        onClick={() => handlePickToken(token, idx)}
                        className="candy-btn candy-btn-white px-3 py-1.5 text-xs font-mono border-gray-300 text-gray-800"
                      >
                        {token}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MCQ / CASE FIX */}
          {currentQ.question_type !== 'sorting' && (
            <div className="space-y-2 mt-2">
              {currentQ.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    disabled={hasCheckedCurrent}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-3.5 rounded-xl text-left border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span>{option}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                      isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-[10px] font-black">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Subtle Mascot Tip */}
          {currentQ.threat_hint && (
            <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100/80 text-xs text-purple-900 flex items-start gap-2">
              <span className="text-base">☕</span>
              <p className="font-medium text-gray-700 italic">
                {currentQ.threat_hint}
              </p>
            </div>
          )}

          {/* Feedback Banner */}
          {hasCheckedCurrent && (
            <div className={`mt-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
              currentIsCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              {currentIsCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-bold">{koffiCommentary}</span>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              Question {currentIndex + 1} of 15
            </span>

            {!hasCheckedCurrent ? (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  currentQ.question_type === 'sorting'
                    ? selectedTokens.length === 0
                    : !selectedOption
                }
                className={`candy-btn px-5 py-2 text-xs font-bold ${
                  (currentQ.question_type === 'sorting' ? selectedTokens.length > 0 : selectedOption)
                    ? 'candy-btn-purple'
                    : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={submitting}
                className="candy-btn candy-btn-mint px-6 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                <span>
                  {submitting
                    ? 'Grading...'
                    : currentIndex === questions.length - 1
                    ? 'Complete Quiz'
                    : 'Next'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SublevelQuizPage;
