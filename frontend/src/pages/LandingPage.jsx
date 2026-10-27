import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  Trophy, 
  RotateCcw,
  Star,
  Award,
  Flame,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  // Mini interactive demo on the front page: rearrange public static void main
  const demoCorrectOrder = ['public', 'static', 'void', 'main(String[] args)'];
  const [demoSelected, setDemoSelected] = useState([]);
  const [demoAvailable, setDemoAvailable] = useState(['main(String[] args)', 'void', 'public', 'static']);
  const [demoChecked, setDemoChecked] = useState(false);
  const [demoIsCorrect, setDemoIsCorrect] = useState(false);

  const handlePickDemo = (token, idx) => {
    sounds.playClick();
    const nextAvail = [...demoAvailable];
    nextAvail.splice(idx, 1);
    setDemoAvailable(nextAvail);
    const nextSel = [...demoSelected, token];
    setDemoSelected(nextSel);
    setDemoChecked(false);
  };

  const handleUnpickDemo = (token, idx) => {
    sounds.playClick();
    const nextSel = [...demoSelected];
    nextSel.splice(idx, 1);
    setDemoSelected(nextSel);
    setDemoAvailable([...demoAvailable, token]);
    setDemoChecked(false);
  };

  const handleResetDemo = () => {
    sounds.playClick();
    setDemoAvailable(['main(String[] args)', 'void', 'public', 'static']);
    setDemoSelected([]);
    setDemoChecked(false);
  };

  const handleCheckDemo = () => {
    const isCorrect = demoSelected.length === demoCorrectOrder.length &&
      demoSelected.every((val, i) => val === demoCorrectOrder[i]);
    setDemoChecked(true);
    setDemoIsCorrect(isCorrect);
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="min-h-screen bg-pastel-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-purple-200 shadow-xs text-xs font-bold text-purple-700">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span>36 Sublevels • 540 Questions • SQL Database</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Master Java with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                  Interactive Precision.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Rearrange disordered code into valid Java syntax, spot illegal keyword capitalizations, predict runtime outputs, and stay accountable with our daily streak mascot.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  to={isAuthenticated ? "/curriculum" : "/register"}
                  onClick={() => sounds.playClick()}
                  className="candy-btn candy-btn-purple px-6 py-3.5 text-sm font-extrabold flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isAuthenticated ? 'Resume Learning' : 'Get Started Free'}</span>
                </Link>

                <Link
                  to="/curriculum"
                  onClick={() => sounds.playClick()}
                  className="candy-btn candy-btn-white px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 text-gray-700 border-gray-200"
                >
                  <span>Explore 36 Sublevels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-100/70 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-purple-700">3 Tiers</div>
                  <div className="text-xs font-semibold text-gray-400">Beginner to Adv.</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600">540 Qs</div>
                  <div className="text-xs font-semibold text-gray-400">15 Per Sublevel</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-rose-600">5 Hearts</div>
                  <div className="text-xs font-semibold text-gray-400">Lives Tracking</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mascot & Interactive Teaser */}
            <div className="lg:col-span-5">
              <div className="pastel-card p-6 border-2 border-purple-200/90 bg-white shadow-xl relative">
                {/* Mascot Header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-purple-200 shrink-0 bg-purple-50 p-0.5">
                    <img
                      src="/mascots/menacing.jpg"
                      alt="Koffi Mascot"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Try Interactive Syntax Sorting</h3>
                    <p className="text-xs text-gray-500">Order the tokens to declare a main method:</p>
                  </div>
                </div>

                {/* Dropzone */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-600">Assembled Syntax:</span>
                    {demoSelected.length > 0 && !demoChecked && (
                      <button
                        onClick={handleResetDemo}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="min-h-16 p-3 rounded-xl bg-purple-50/60 border-2 border-dashed border-purple-200 flex flex-wrap items-center gap-1.5">
                    {demoSelected.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">
                        Click the tokens below in the correct Java order...
                      </span>
                    ) : (
                      demoSelected.map((tok, i) => (
                        <button
                          key={i}
                          disabled={demoChecked}
                          onClick={() => handleUnpickDemo(tok, i)}
                          className="candy-btn candy-btn-purple px-2.5 py-1 text-xs font-mono flex items-center gap-1"
                        >
                          <span>{tok}</span>
                          <span className="text-[10px] opacity-70">✕</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Token Pool */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {demoAvailable.map((tok, i) => (
                      <button
                        key={i}
                        disabled={demoChecked}
                        onClick={() => handlePickDemo(tok, i)}
                        className="candy-btn candy-btn-white px-2.5 py-1 text-xs font-mono border-gray-300 text-gray-800"
                      >
                        {tok}
                      </button>
                    ))}
                  </div>

                  {/* Check action */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleCheckDemo}
                      disabled={demoSelected.length === 0}
                      className={`candy-btn text-xs px-4 py-2 font-bold ${
                        demoSelected.length > 0 ? 'candy-btn-mint' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Check Syntax
                    </button>

                    {demoChecked && (
                      <span className={`text-xs font-bold ${demoIsCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {demoIsCorrect ? '✓ Correct syntax order!' : '✕ Incorrect order. Try again!'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curriculum Tiers Overview */}
      <section className="py-16 bg-white/70 border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              A Structured Path from Syntax to Concurrency
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Every level contains 12 sublevels with 15 questions each.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner */}
            <div className="pastel-card p-6 border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                🌱
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Tier 1 • Foundations
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-2 mb-1.5">Beginner Level</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Master JVM architecture, the <code>public static void main</code> signature, case sensitivity rules, primitive data types, branching logic, and loop constructs.
              </p>
              <div className="text-xs font-bold text-emerald-700">12 Sublevels • 180 Questions</div>
            </div>

            {/* Moderate */}
            <div className="pastel-card p-6 border border-purple-200/80 bg-gradient-to-b from-purple-50/40 to-white shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm mb-3">
                ⚡
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                Tier 2 • Object-Oriented
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-2 mb-1.5">Moderate Level</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Deep dive into Classes, Constructors, <code>this</code>, Encapsulation, Inheritance with <code>extends</code>, Polymorphism, Abstract classes, and Exception hierarchies.
              </p>
              <div className="text-xs font-bold text-purple-700">12 Sublevels • 180 Questions</div>
            </div>

            {/* Advanced */}
            <div className="pastel-card p-6 border border-rose-200/80 bg-gradient-to-b from-rose-50/40 to-white shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm mb-3">
                🚀
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Tier 3 • Enterprise & Concurrency
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-2 mb-1.5">Advanced Level</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Conquer Java Collections (Lists, Sets, Maps), Generics, Lambda Expressions, Streams API pipelines, Threads, Synchronization, and JVM Memory architecture.
              </p>
              <div className="text-xs font-bold text-rose-700">12 Sublevels • 180 Questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Gallery & Threat Accountability */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pastel-card p-8 bg-white border border-purple-200/90 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                  Accountability Mascot
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  Meet Koffi ☕ <br />Your Daily Java Coach.
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Inspired by Duolingo-style gamification, Koffi monitors your daily practice streak. Complete your 15 questions every day to keep Koffi calm. Skip days, and his threat level elevates from Calm to DEFCON JAVA!
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to="/threats"
                    className="candy-btn candy-btn-purple text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5"
                  >
                    <span>Inspect Threat Monitor</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* The 3 Professional Mascot Illustrations */}
              <div className="lg:col-span-7 grid grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="aspect-square rounded-xl overflow-hidden border border-emerald-200 mb-2 bg-white">
                    <img src="/mascots/happy.jpg" alt="Satisfied Koffi" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800">Satisfied</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">3 Stars earned</p>
                </div>

                <div className="text-center p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="aspect-square rounded-xl overflow-hidden border border-purple-200 mb-2 bg-white">
                    <img src="/mascots/menacing.jpg" alt="Enforcer Koffi" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-800">Menacing</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">Semicolon Enforcer</p>
                </div>

                <div className="text-center p-2.5 rounded-2xl bg-rose-50/50 border border-rose-100">
                  <div className="aspect-square rounded-xl overflow-hidden border border-rose-200 mb-2 bg-white">
                    <img src="/mascots/angry.jpg" alt="Angry Koffi" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-800">Critical</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">"LEARN JAVA NOW!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 text-center border-t border-purple-100/60 bg-white/40">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Ready to Begin Practicing?
          </h2>
          <p className="text-sm text-gray-600 mt-2 mb-6">
            Join the students advancing through all 36 Java sublevels.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/curriculum"
              onClick={() => sounds.playClick()}
              className="candy-btn candy-btn-purple px-6 py-3 text-sm font-bold flex items-center gap-2"
            >
              <span>Launch Java Curriculum</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
