import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { threatService } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { Flame, ShieldAlert, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThreatBanner = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [threatData, setThreatData] = useState(null);
  const [begging, setBegging] = useState(false);
  const [mercyMessage, setMercyMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchThreat = async () => {
      try {
        const res = await threatService.getThreatStatus();
        if (res.success) {
          setThreatData(res);
        }
      } catch (e) {
        console.error('Error fetching threat status:', e);
      }
    };

    fetchThreat();
  }, [isAuthenticated, user?.threat_level, user?.streak]);

  if (!isAuthenticated || !threatData) return null;

  const handleBegForMercy = async () => {
    sounds.playClick();
    setBegging(true);
    try {
      const res = await threatService.begForMercy();
      if (res.success) {
        setMercyMessage(res.message);
        sounds.playCorrect();
        updateUser({ threat_level: res.threat_level });
        setThreatData((prev) => ({
          ...prev,
          threat_level: res.threat_level,
          mood: res.threat_level === 1 ? 'happy' : 'menacing'
        }));
        setTimeout(() => setMercyMessage(null), 4000);
      }
    } catch (e) {
      console.error('Beg mercy failed:', e);
    } finally {
      setBegging(false);
    }
  };

  let mascotImg = '/mascots/menacing.jpg';
  let bannerBorder = 'border-purple-200';
  let bgGradient = 'from-purple-50/70 to-pink-50/50';

  if (threatData.mood === 'happy' || threatData.threat_level === 1) {
    mascotImg = '/mascots/happy.jpg';
    bannerBorder = 'border-emerald-200';
    bgGradient = 'from-emerald-50/60 to-teal-50/40';
  } else if (threatData.mood === 'angry' || threatData.threat_level >= 4) {
    mascotImg = '/mascots/angry.jpg';
    bannerBorder = 'border-rose-300';
    bgGradient = 'from-rose-50 to-amber-50/60';
  }

  return (
    <aside className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className={`pastel-card p-4 sm:p-5 bg-gradient-to-r ${bgGradient} border ${bannerBorder} shadow-xs`}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Mascot Image */}
          <div className="relative shrink-0">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-white p-0.5">
              <img
                src={mascotImg}
                alt="Koffi Mascot"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {threatData.threat_level >= 4 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
                HIGH
              </span>
            )}
          </div>

          {/* Threat Information */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-purple-600" />
                Threat Level {threatData.threat_level} / 4
              </span>
              
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {threatData.hours_until_streak_loss}h left before streak resets
              </span>
            </div>

            <p className="text-sm font-bold text-gray-800 leading-snug truncate sm:whitespace-normal">
              "{threatData.message}"
            </p>

            {mercyMessage && (
              <p className="mt-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md inline-block">
                {mercyMessage}
              </p>
            )}

            {/* Clean Progress Meter */}
            <div className="mt-2.5 flex items-center gap-2 max-w-sm mx-auto sm:mx-0">
              <span className="text-[11px] font-bold text-gray-400">Menace:</span>
              <div className="flex-1 bg-gray-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    threatData.threat_level === 1
                      ? 'bg-emerald-400 w-1/4'
                      : threatData.threat_level === 2
                      ? 'bg-amber-400 w-2/4'
                      : threatData.threat_level === 3
                      ? 'bg-orange-400 w-3/4'
                      : 'bg-rose-500 w-full'
                  }`}
                />
              </div>
              <span className="text-[11px] font-extrabold text-gray-600">
                {threatData.threat_level * 25}%
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
            <Link
              to="/levels"
              onClick={() => sounds.playClick()}
              className="candy-btn candy-btn-purple text-xs px-4 py-2 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <span>Practice (15 Qs)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {threatData.threat_level > 1 && (
              <button
                onClick={handleBegForMercy}
                disabled={begging}
                className="candy-btn candy-btn-white text-xs px-3 py-1.5 flex items-center justify-center gap-1 text-gray-700 border-gray-200"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                <span>{begging ? 'Pleading...' : 'Plead For Mercy'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ThreatBanner;
