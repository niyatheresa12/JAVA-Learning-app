import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';
import ThreatBanner from '../components/ThreatBanner';
import { 
  Star, 
  Lock, 
  Play, 
  CheckCircle2, 
  Flame, 
  Award,
  Layers
} from 'lucide-react';

const LevelsMapPage = () => {
  const [levels, setLevels] = useState([]);
  const [activeLevelId, setActiveLevelId] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await learningService.getLevels();
        if (res.success && res.levels) {
          setLevels(res.levels);
        }
      } catch (e) {
        console.error('Error fetching levels:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [user]);

  const activeLevel = levels.find((l) => l.id === activeLevelId) || levels[0];

  const handleStartSublevel = (sublevel) => {
    if (!sublevel.is_unlocked && !isAuthenticated) {
      sounds.playClick();
      navigate('/login');
      return;
    }

    if (!sublevel.is_unlocked) {
      sounds.playWrong();
      alert(`Complete Sublevel ${sublevel.sublevel_number - 1} to unlock this topic.`);
      return;
    }

    sounds.playClick();
    navigate(`/sublevel/${sublevel.id}`);
  };

  const totalSublevels = levels.reduce((acc, l) => acc + (l.sublevels?.length || 0), 0);
  const completedSublevels = levels.reduce(
    (acc, l) => acc + (l.sublevels?.filter((s) => s.completed).length || 0),
    0
  );
  const totalStars = levels.reduce(
    (acc, l) => acc + (l.sublevels?.reduce((sum, s) => sum + (s.stars || 0), 0) || 0),
    0
  );

  return (
    <div className="min-h-screen pb-16 bg-pastel-mesh">
      <ThreatBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Header Overview Card */}
        <section className="pastel-card p-6 border border-purple-200/80 bg-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                  Learning Roadmap
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  3 Levels • 36 Sublevels
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Java Curriculum
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                Practice Java syntax rearrangement, case-sensitivity rules, output predictions, and core concepts.
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100 shrink-0">
              <div className="text-center px-2">
                <div className="text-xl font-extrabold text-purple-700">
                  {completedSublevels} <span className="text-xs font-normal text-gray-400">/ {totalSublevels || 36}</span>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Completed</div>
              </div>
              <div className="w-px h-8 bg-purple-200" />
              <div className="text-center px-2">
                <div className="text-xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {totalStars}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Stars</div>
              </div>
              <div className="w-px h-8 bg-purple-200" />
              <div className="text-center px-2">
                <div className="text-xl font-extrabold text-rose-500 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                  {user?.streak || 1}d
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Streak</div>
              </div>
            </div>
          </div>

          {/* Level Switcher Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-purple-50">
            {levels.map((lvl) => {
              const isActive = lvl.id === activeLevelId;

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveLevelId(lvl.id);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1 font-bold">
                    <span className={isActive ? 'text-purple-200' : 'text-purple-600'}>
                      {lvl.id === 'beginner' ? 'Level 1' : lvl.id === 'moderate' ? 'Level 2' : 'Level 3'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      12 Sublevels
                    </span>
                  </div>
                  <h2 className="font-extrabold text-sm">{lvl.title}</h2>
                  <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                    {lvl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sublevels Grid */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                {activeLevel?.title}
              </h2>
              <p className="text-xs text-gray-500">
                12 sublevels • 15 questions each
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 mx-auto rounded-full border-3 border-purple-200 border-t-purple-600 animate-spin mb-3" />
              <p className="text-xs font-bold text-gray-500">Loading curriculum...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeLevel?.sublevels?.map((sublevel) => {
                const isUnlocked = sublevel.is_unlocked;
                const isCompleted = sublevel.completed;

                return (
                  <div
                    key={sublevel.id}
                    className={`pastel-card p-4 border transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-white border-purple-100 hover:border-purple-300'
                        : 'bg-gray-50/80 border-gray-200 opacity-65'
                    }`}
                  >
                    <div>
                      {/* Sublevel Badge & Status */}
                      <div className="flex items-start justify-between mb-2.5">
                        <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          #{sublevel.sublevel_number}
                        </span>

                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Passed
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                            Ready
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                            <Lock className="w-3 h-3" />
                            Locked
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-extrabold text-sm text-gray-900 leading-snug mb-1">
                        {sublevel.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {sublevel.description}
                      </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2.5 text-xs text-gray-500">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx <= (sublevel.stars || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">
                          Score: <strong className="text-gray-800">{sublevel.best_score || 0}</strong>/15
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartSublevel(sublevel)}
                        disabled={!isUnlocked}
                        className={`w-full candy-btn text-xs py-2 flex items-center justify-center gap-1.5 ${
                          isUnlocked
                            ? isCompleted
                              ? 'candy-btn-white text-purple-700 border-purple-200 hover:bg-purple-50'
                              : 'candy-btn-purple'
                            : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isCompleted ? 'Practice Again' : 'Start (15 Qs)'}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default LevelsMapPage;
