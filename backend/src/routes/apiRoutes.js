const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const authController = require('../controllers/authController');
const learningController = require('../controllers/learningController');
const leaderboardController = require('../controllers/leaderboardController');
const threatController = require('../controllers/threatController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/avatar', protect, authController.updateAvatar);

// Curriculum and Learning routes
// Note: getLevels can optionally accept auth to return user-specific stars & locks
router.get('/levels', (req, res, next) => {
  // Optional auth
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, learningController.getLevels);

router.get('/sublevels/:id/questions', protect, learningController.getSublevelQuestions);
router.post('/sublevels/:id/submit', protect, learningController.submitSublevel);

// Leaderboard / Student Ratings
router.get('/leaderboard', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, leaderboardController.getLeaderboard);

// Menacing / Threat routes
router.get('/threats/status', protect, threatController.getThreatStatus);
router.post('/threats/beg-for-mercy', protect, threatController.begForMercy);
router.post('/user/hearts/refill', protect, threatController.refillHearts);

module.exports = router;
