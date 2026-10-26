import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { threatService } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { 
  ShieldAlert, 
  Flame, 
  HeartHandshake, 
  Play,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ThreatLairPage = () => {
  const { user, updateUser, refillHearts } = useAuth();
  const [threatStatus, setThreatStatus] = useState(null);
  const [previewLevel, setPreviewLevel] = useState(2);
  const [begging, setBegging] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await threatService.getThreatStatus();
        if (res.success) {
          setThreatStatus(res);
          setPreviewLevel(res.threat_level || 2);
        }
      } catch (e) {
        console.error('Error fetching threat status:', e);
      }
    };

    fetchStatus();
  }, [user]);

  const handleBegForMercy = async () => {
    sounds.playClick();
    setBegging(true);
    try {
      const res = await threatService.begForMercy();
      if (res.success) {
        setMessage(res.message);
        sounds.playCorrect();
        updateUser({ threat_level: res.threat_level });
        setPreviewLevel(res.threat_level);
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (e) {
      console.error('Mercy plea failed:', e);
    } finally {
      setBegging(false);
    }
  };

  const handleRefillHearts = async () => {
    sounds.playClick();
    await refillHearts();
    setMessage('Hearts restored to 5.');
    setTimeout(() => setMessage(null), 3000);
  };

  const threatLevelsInfo = [
    {
      level: 1,
      title: 'Level 1: Calm State',
      subtitle: 'Daily quota satisfied.',
      image: '/mascots/happy.jpg',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'You completed your daily Java questions. Streak is secure.'
    },
    {
      level: 2,
      title: 'Level 2: Attention Required',
      subtitle: 'Inactive today.',
      image: '/mascots/menacing.jpg',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'No questions answered today yet. Practice to keep your streak alive.'
    },
    {
      level: 3,
      title: 'Level 3: Urgent Warning',
      subtitle: 'Streak deadline approaching.',
      image: '/mascots/menacing.jpg',
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      description: 'Deadline closing in before midnight. Complete 15 questions soon.'
    },
    {
      level: 4,
      title: 'Level 4: Critical Threat',
      subtitle: 'Streak at risk of resetting.',
      image: '/mascots/angry.jpg',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Maximum menace level. Complete a sublevel immediately to reset Koffi.'
    }
  ];

  const currentPreview = threatLevelsInfo.find((t) => t.level === previewLevel) || threatLevelsInfo[1];

  return (
    <div className="min-h-screen pb-16 bg-pastel-mesh">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header */}
        <section className="pastel-card p-6 border border-purple-200/80 bg-white text-center shadow-xs mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Daily Streak & Mascot Status
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Monitor your daily goal, threat level, and mascot states.
          </p>

          {message && (
            <div className="mt-3 max-w-sm mx-auto p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
              {message}
            </div>
          )}
        </section>

        {/* Mascot Stage Card */}
        <section className="pastel-card p-6 border border-purple-200/80 bg-white shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-purple-100 shadow-sm bg-purple-50 p-1">
                <img
                  src={currentPreview.image}
                  alt={currentPreview.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${currentPreview.badge}`}>
                Level {currentPreview.level}
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h2 className="text-xl font-black text-gray-900">{currentPreview.title}</h2>
                <p className="text-xs font-bold text-purple-600">{currentPreview.subtitle}</p>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                {currentPreview.description}
              </p>

              <div>
                <span className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Select Threat Level Preview:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {threatLevelsInfo.map((t) => (
                    <button
                      key={t.level}
                      onClick={() => {
                        sounds.playClick();
                        setPreviewLevel(t.level);
                        if (t.level === 4) sounds.playThreat();
                      }}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                        previewLevel === t.level
                          ? 'border-purple-600 bg-purple-50 text-purple-900'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Lvl {t.level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Link
                  to="/"
                  onClick={() => sounds.playClick()}
                  className="candy-btn candy-btn-purple px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Practice (15 Qs)</span>
                </Link>

                <button
                  onClick={handleBegForMercy}
                  disabled={begging}
                  className="candy-btn candy-btn-white px-3.5 py-2 text-xs flex items-center gap-1 text-gray-700 border-gray-200"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span>{begging ? 'Pleading...' : 'Plead Mercy'}</span>
                </button>

                <button
                  onClick={handleRefillHearts}
                  className="candy-btn candy-btn-pink px-3.5 py-2 text-xs flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Refill Hearts</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mascot Variants */}
        <section className="pastel-card p-5 border border-purple-200/80 bg-white">
          <h3 className="font-extrabold text-sm text-gray-900 mb-3">
            Mascot State Illustrations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-gray-100 text-center bg-gray-50/50">
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 mb-2 bg-white">
                <img src="/mascots/happy.jpg" alt="Happy" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-xs text-gray-800">Satisfied State</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Sublevel cleared with high score</p>
            </div>

            <div className="p-3 rounded-xl border border-gray-100 text-center bg-gray-50/50">
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 mb-2 bg-white">
                <img src="/mascots/menacing.jpg" alt="Enforcer" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-xs text-gray-800">Menace State</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Holding glowing semicolon</p>
            </div>

            <div className="p-3 rounded-xl border border-gray-100 text-center bg-gray-50/50">
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 mb-2 bg-white">
                <img src="/mascots/angry.jpg" alt="Tantrum" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-xs text-gray-800">High Threat State</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">"LEARN JAVA NOW OR ELSE!"</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ThreatLairPage;
