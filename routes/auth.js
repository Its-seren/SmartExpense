const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', (req, res) => {
  res.render('home', { title: 'Smart Expense Tracker' });
});

router.get('/register', authController.registerPage);
router.post('/register', authController.registerUser);

router.get('/login', authController.loginPage);
router.post('/login', authController.loginUser);

router.get('/dashboard', authController.dashboardPage);
router.get('/logout', authController.logoutUser);

module.exports = router;