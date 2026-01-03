const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

router.get('/', isAuthenticated, expenseController.listExpenses);
router.post('/add', isAuthenticated, expenseController.addExpense);
router.post('/delete/:id', isAuthenticated, expenseController.deleteExpense);

module.exports = router;