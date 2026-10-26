import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThreatBanner from '../components/ThreatBanner';
import { Trophy, Award, Flame, Star, Shield } from 'lucide-react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await leaderboardService.getLeaderboard();
        if (res.success) {
          setLeaderboard(res.leaderboard);
          setCurrentUserRank(res.current_user_rank);
        }
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen pb-16 bg-pastel-mesh">
      <ThreatBanner />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Header */}
        <section className="pastel-card p-6 border border-purple-200/80 bg-white text-center shadow-xs">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Student Leaderboard
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Ranked by total marks earned through Java question sets.
          </p>

          {currentUserRank && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-extrabold text-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Your Standing: #{currentUserRank}</span>
            </div>
          )}
        </section>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin mb-3" />
            <p className="text-xs text-gray-400">Loading rankings...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6 items-end">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="pastel-card p-4 bg-white border border-slate-200 text-center order-2 md:order-1 shadow-xs">
                    <span className="text-xl">🥈</span>
                    <div className="w-14 h-14 mx-auto rounded-xl bg-slate-50 flex items-center justify-center text-2xl my-2 border border-slate-200">
                      {topThree[1].avatar}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Rank #2</span>
                    <h3 className="font-extrabold text-gray-900 text-sm">{topThree[1].username}</h3>
                    <p className="text-[11px] text-purple-600 font-medium">{topThree[1].tier}</p>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <span className="text-sm font-black text-gray-800">{topThree[1].marks} pts</span>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="pastel-card p-5 bg-gradient-to-t from-amber-50/70 to-white border-2 border-amber-300 text-center order-1 md:order-2 shadow-sm scale-102">
                    <span className="text-2xl">🥇</span>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-3xl my-2 border border-amber-200">
                      {topThree[0].avatar}
                    </div>
                    <span className="text-[10px] font-black text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded-full">
                      Rank #1
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-base mt-1">{topThree[0].username}</h3>
                    <p className="text-xs text-amber-800 font-bold">{topThree[0].tier}</p>
                    <div className="mt-2.5 pt-2 border-t border-amber-100">
                      <span className="text-xl font-black text-amber-900">{topThree[0].marks} pts</span>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="pastel-card p-4 bg-white border border-orange-200 text-center order-3 md:order-3 shadow-xs">
                    <span className="text-xl">🥉</span>
                    <div className="w-14 h-14 mx-auto rounded-xl bg-orange-50 flex items-center justify-center text-2xl my-2 border border-orange-200">
                      {topThree[2].avatar}
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">Rank #3</span>
                    <h3 className="font-extrabold text-gray-900 text-sm">{topThree[2].username}</h3>
                    <p className="text-[11px] text-purple-600 font-medium">{topThree[2].tier}</p>
                    <div className="mt-2 pt-2 border-t border-orange-100">
                      <span className="text-sm font-black text-gray-800">{topThree[2].marks} pts</span>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Leaderboard Table */}
            <section className="pastel-card overflow-hidden border border-purple-200/80 bg-white shadow-xs">
              <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">
                <span className="font-black text-gray-600 uppercase tracking-wide">
                  All Students
                </span>
                <span className="text-gray-400 font-medium">
                  {leaderboard.length} enrolled
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {leaderboard.map((student) => {
                  const isCurrent = student.is_current_user || (user && user.id === student.id);

                  return (
                    <div
                      key={student.id}
                      className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                        isCurrent
                          ? 'bg-purple-50/80 font-bold border-l-4 border-purple-600'
                          : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center text-xs font-bold ${
                          student.rank === 1 ? 'text-amber-500' : student.rank === 2 ? 'text-slate-500' : student.rank === 3 ? 'text-orange-500' : 'text-gray-400'
                        }`}>
                          #{student.rank}
                        </span>

                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-lg border border-purple-100 shrink-0">
                          {student.avatar || '☕'}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-gray-900">
                              {student.username}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-black">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {student.tier}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-right">
                        <div className="hidden sm:block text-center">
                          <div className="text-xs font-black text-amber-600 flex items-center justify-center gap-0.5">
                            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {student.streak}d
                          </div>
                          <span className="text-[9px] text-gray-400 uppercase font-medium">Streak</span>
                        </div>

                        <div className="text-right min-w-[60px]">
                          <span className="text-sm font-black text-purple-700">
                            {student.marks}
                          </span>
                          <span className="text-[9px] text-gray-400 uppercase font-medium block">
                            Points
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default LeaderboardPage;
