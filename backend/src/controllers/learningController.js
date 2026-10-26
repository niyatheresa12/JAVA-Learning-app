const sqlDb = require('../config/db');

// Helper to shuffle an array (Fisher-Yates)
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Get all 3 levels and their 36 sublevels with user's progress
exports.getLevels = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    // Fetch levels
    const levels = sqlDb.all('SELECT * FROM levels ORDER BY order_index ASC');

    // Fetch all sublevels
    const sublevels = sqlDb.all('SELECT * FROM sublevels ORDER BY sublevel_number ASC');

    // Fetch user progress if authenticated
    let userProgressMap = {};
    if (userId) {
      const progressRows = sqlDb.all(
        'SELECT sublevel_id, completed, best_score, stars, attempts FROM user_progress WHERE user_id = ?',
        [userId]
      );
      for (const row of progressRows) {
        userProgressMap[row.sublevel_id] = row;
      }
    }

    // Attach sublevels to levels
    const enrichedLevels = levels.map((lvl) => {
      const lvlSublevels = sublevels
        .filter((sl) => sl.level_id === lvl.id)
        .map((sl, index) => {
          const userProg = userProgressMap[sl.id] || {
            completed: 0,
            best_score: 0,
            stars: 0,
            attempts: 0
          };

          // Sublevel 1 is always unlocked. Subsequent sublevels are unlocked if previous is completed OR user has enough marks
          const prevSublevel = index > 0 ? sublevels.find((s) => s.sublevel_number === sl.sublevel_number - 1) : null;
          const prevCompleted = prevSublevel ? (userProgressMap[prevSublevel.id]?.completed === 1) : true;
          
          const isUnlocked = sl.sublevel_number === 1 || prevCompleted || (req.user && req.user.marks >= sl.min_marks_to_unlock);

          return {
            ...sl,
            completed: Boolean(userProg.completed),
            best_score: userProg.best_score,
            stars: userProg.stars,
            attempts: userProg.attempts,
            is_unlocked: Boolean(isUnlocked)
          };
        });

      return {
        ...lvl,
        sublevels: lvlSublevels
      };
    });

    res.status(200).json({
      success: true,
      levels: enrichedLevels
    });
  } catch (error) {
    console.error('getLevels error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve curriculum levels.' });
  }
};

// Get the 15 questions for a specific sublevel
exports.getSublevelQuestions = async (req, res) => {
  try {
    const sublevelId = Number(req.params.id);

    const sublevel = sqlDb.get('SELECT * FROM sublevels WHERE id = ?', [sublevelId]);
    if (!sublevel) {
      return res.status(404).json({ success: false, message: 'Sublevel not found' });
    }

    const rows = sqlDb.all(
      'SELECT id, sublevel_id, question_index, question_type, prompt, code_snippet, options_json, threat_hint FROM questions WHERE sublevel_id = ? ORDER BY question_index ASC',
      [sublevelId]
    );

    // Format and prepare interactive options (shuffling sorting tokens & options so user can rearrange/select)
    const questions = rows.map((q) => {
      let rawOptions = [];
      try {
        rawOptions = JSON.parse(q.options_json);
      } catch (e) {
        rawOptions = [];
      }

      // If it is sorting, shuffle the tokens so they are initially disordered for the user to rearrange!
      let displayTokens = rawOptions;
      if (q.question_type === 'sorting') {
        displayTokens = shuffleArray(rawOptions);
      }

      return {
        id: q.id,
        sublevel_id: q.sublevel_id,
        question_index: q.question_index,
        question_type: q.question_type,
        prompt: q.prompt,
        code_snippet: q.code_snippet,
        options: displayTokens,
        threat_hint: q.threat_hint
      };
    });

    res.status(200).json({
      success: true,
      sublevel,
      total_questions: questions.length,
      questions
    });
  } catch (error) {
    console.error('getSublevelQuestions error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve sublevel questions.' });
  }
};

// Submit user's answers for grading and mark updates
exports.submitSublevel = async (req, res) => {
  try {
    const sublevelId = Number(req.params.id);
    const userId = req.user.id;
    const { answers } = req.body; // Map: { [questionId]: submittedAnswer }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Answers object is required' });
    }

    const questions = sqlDb.all(
      'SELECT id, question_index, question_type, prompt, options_json, correct_answer_json, explanation, threat_hint FROM questions WHERE sublevel_id = ? ORDER BY question_index ASC',
      [sublevelId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this sublevel.' });
    }

    let correctCount = 0;
    const results = [];

    for (const q of questions) {
      const userAnswer = answers[q.id];
      let isCorrect = false;

      let parsedCorrect;
      try {
        parsedCorrect = JSON.parse(q.correct_answer_json);
      } catch (e) {
        parsedCorrect = q.correct_answer_json;
      }

      if (q.question_type === 'sorting') {
        // userAnswer should be an array of strings
        if (Array.isArray(userAnswer) && Array.isArray(parsedCorrect)) {
          isCorrect = userAnswer.length === parsedCorrect.length &&
            userAnswer.every((val, idx) => String(val).trim() === String(parsedCorrect[idx]).trim());
        }
      } else {
        // String comparison
        isCorrect = String(userAnswer || '').trim().toLowerCase() === String(parsedCorrect || '').trim().toLowerCase();
      }

      if (isCorrect) {
        correctCount++;
      }

      // Record answer history
      sqlDb.run(
        'INSERT INTO user_answers (user_id, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
        [userId, q.id, typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : String(userAnswer || ''), isCorrect ? 1 : 0]
      );

      results.push({
        question_id: q.id,
        question_index: q.question_index,
        question_type: q.question_type,
        user_answer: userAnswer,
        correct_answer: parsedCorrect,
        is_correct: isCorrect,
        explanation: q.explanation,
        threat_hint: q.threat_hint
      });
    }

    const totalQuestions = questions.length; // 15
    const marksPerQuestion = 10;
    const marksEarned = correctCount * marksPerQuestion; // up to 150 marks
    const passed = correctCount >= 8; // >= 50% to pass

    // Calculate stars:
    let stars = 0;
    if (correctCount === 15) stars = 3;
    else if (correctCount >= 12) stars = 2;
    else if (correctCount >= 8) stars = 1;

    // Calculate XP: 10 XP per mark, plus 200 XP bonus for completion
    const xpEarned = (marksEarned * 10) + (passed ? 200 : 0);

    // Update user_progress in SQLite
    const existingProg = sqlDb.get(
      'SELECT * FROM user_progress WHERE user_id = ? AND sublevel_id = ?',
      [userId, sublevelId]
    );

    const prevBestScore = existingProg ? existingProg.best_score : 0;
    const newBestScore = Math.max(prevBestScore, correctCount);
    const newStars = Math.max(existingProg ? existingProg.stars : 0, stars);
    const isFirstTimeCompletion = (!existingProg || existingProg.completed === 0) && passed;

    if (existingProg) {
      sqlDb.run(
        `UPDATE user_progress 
         SET completed = CASE WHEN ? = 1 THEN 1 ELSE completed END,
             best_score = ?,
             stars = ?,
             attempts = attempts + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [passed ? 1 : 0, newBestScore, newStars, existingProg.id]
      );
    } else {
      sqlDb.run(
        `INSERT INTO user_progress (user_id, sublevel_id, completed, best_score, stars, attempts)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [userId, sublevelId, passed ? 1 : 0, newBestScore, newStars]
      );
    }

    // Update user stats in users table:
    // Only grant incremental marks if score beat previous best!
    const incrementalScore = Math.max(0, correctCount - prevBestScore);
    const incrementalMarks = incrementalScore * marksPerQuestion;

    // Threat level reaction:
    // If passed with flying colors: threat level decreases!
    // If failed: threat level increases!
    let threatAdjustment = 0;
    let threatMessage = '';
    let mascotMood = 'happy';

    if (correctCount >= 12) {
      threatAdjustment = -1; // Koffi is pleased
      threatMessage = 'Koffi is purring with satisfaction! Excellent Java syntax mastery!';
      mascotMood = 'happy';
    } else if (passed) {
      threatAdjustment = 0;
      threatMessage = 'You passed, but Koffi is keeping his eye on your minor mistakes!';
      mascotMood = 'menacing';
    } else {
      threatAdjustment = 1; // Threat escalates!
      threatMessage = 'FAILED! Koffi has confiscated your semicolon key until you re-try!';
      mascotMood = 'angry';
    }

    // Fetch user current hearts
    const currentUser = sqlDb.get('SELECT hearts, threat_level, streak FROM users WHERE id = ?', [userId]);
    let newHearts = currentUser.hearts;
    if (!passed && newHearts > 1) {
      newHearts -= 1; // Lose 1 heart on failing sublevel
    }
    const newThreatLevel = Math.min(4, Math.max(1, currentUser.threat_level + threatAdjustment));

    sqlDb.run(
      `UPDATE users 
       SET marks = marks + ?,
           xp = xp + ?,
           hearts = ?,
           threat_level = ?,
           last_active_date = DATE('now')
       WHERE id = ?`,
      [incrementalMarks, xpEarned, newHearts, newThreatLevel, userId]
    );

    // Fetch updated user
    const updatedUser = sqlDb.get(
      `SELECT id, username, email, avatar, marks, xp, streak, hearts, threat_level FROM users WHERE id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      score: correctCount,
      total_questions: totalQuestions,
      marks_earned: marksEarned,
      xp_earned: xpEarned,
      stars,
      passed,
      is_first_time: isFirstTimeCompletion,
      threat_level: newThreatLevel,
      threat_message: threatMessage,
      mascot_mood: mascotMood,
      user: updatedUser,
      results
    });
  } catch (error) {
    console.error('submitSublevel error:', error);
    res.status(500).json({ success: false, message: 'Failed to grade submission.' });
  }
};
