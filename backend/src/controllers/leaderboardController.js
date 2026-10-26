const sqlDb = require('../config/db');

// Calculate rank title from marks
const getRankTitle = (marks) => {
  if (marks >= 1500) return '👑 JVM Overlord';
  if (marks >= 1000) return '💎 Byte Archmage';
  if (marks >= 600) return '⚡ Thread Master';
  if (marks >= 300) return '🌸 OOP Artisan';
  if (marks >= 100) return '🌱 Syntax Sprout';
  return '☕ Coffee Bean Baby';
};

exports.getLeaderboard = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;

    // Fetch top 50 students ordered by marks DESC, xp DESC
    const rows = sqlDb.all(`
      SELECT 
        u.id, 
        u.username, 
        u.avatar, 
        u.marks, 
        u.xp, 
        u.streak, 
        u.threat_level,
        u.created_at,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id AND completed = 1) as completed_sublevels,
        (SELECT COALESCE(SUM(stars), 0) FROM user_progress WHERE user_id = u.id) as total_stars,
        (SELECT COUNT(*) FROM user_answers WHERE user_id = u.id) as total_answers,
        (SELECT COUNT(*) FROM user_answers WHERE user_id = u.id AND is_correct = 1) as correct_answers
      FROM users u
      ORDER BY u.marks DESC, u.xp DESC
      LIMIT 50
    `);

    const leaderboard = rows.map((student, index) => {
      const total = student.total_answers || 0;
      const correct = student.correct_answers || 0;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : (student.marks > 0 ? 92 : 0);

      return {
        rank: index + 1,
        id: student.id,
        username: student.username,
        avatar: student.avatar || '☕',
        marks: student.marks,
        xp: student.xp,
        streak: student.streak,
        threat_level: student.threat_level,
        completed_sublevels: student.completed_sublevels,
        total_stars: student.total_stars,
        accuracy_percent: accuracy,
        tier: getRankTitle(student.marks),
        is_current_user: currentUserId === student.id
      };
    });

    // Find current user's position if not in top 50
    let currentUserRank = null;
    if (currentUserId) {
      const userInList = leaderboard.find((s) => s.id === currentUserId);
      if (userInList) {
        currentUserRank = userInList.rank;
      } else {
        const currentUser = sqlDb.get('SELECT marks FROM users WHERE id = ?', [currentUserId]);
        if (currentUser) {
          const rankCount = sqlDb.get(
            'SELECT COUNT(*) + 1 as r FROM users WHERE marks > ?',
            [currentUser.marks]
          ).r;
          currentUserRank = rankCount;
        }
      }
    }

    res.status(200).json({
      success: true,
      total_students: rows.length,
      current_user_rank: currentUserRank,
      leaderboard
    });
  } catch (error) {
    console.error('getLeaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve student rating leaderboard.' });
  }
};
