const db = require('../db/connection');

exports.listExpenses = (req, res) => {
  const userId = req.session.userId;
  const sql = 'SELECT id, amount, category, description, date FROM expenses WHERE user_id = ? ORDER BY date DESC';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Error fetching expenses');
      return res.render('dashboard', { title: 'Dashboard', name: req.session.userName, expenses: [] });
    }
    res.render('dashboard', { title: 'Dashboard', name: req.session.userName, expenses: results });
  });
};

exports.addExpense = (req, res) => {
  const { amount, category, description, date } = req.body;
  const userId = req.session.userId;

  // Basic validation
  const parsedAmount = parseFloat(amount);
  const trimmedCategory = String(category || '').trim();
  const trimmedDescription = String(description || '').trim();
  const expenseDate = date ? new Date(date) : new Date();

  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    req.flash('error', 'Amount must be a positive number');
    return res.redirect('/expenses');
  }
  if (!trimmedCategory) {
    req.flash('error', 'Category is required');
    return res.redirect('/expenses');
  }
  if (isNaN(expenseDate.getTime())) {
    req.flash('error', 'Invalid date');
    return res.redirect('/expenses');
  }

  const sql =
    'INSERT INTO expenses (user_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [userId, parsedAmount, trimmedCategory, trimmedDescription, expenseDate], (err) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Error adding expense');
      return res.redirect('/expenses');
    }
    req.flash('success', 'Expense added');
    res.redirect('/expenses');
  });
};

exports.deleteExpense = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    req.flash('error', 'Invalid expense id');
    return res.redirect('/expenses');
  }

  const sql = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
  db.query(sql, [id, req.session.userId], (err, result) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Error deleting expense');
      return res.redirect('/expenses');
    }
    if (result.affectedRows === 0) {
      req.flash('error', 'Expense not found');
      return res.redirect('/expenses');
    }
    req.flash('success', 'Expense deleted');
    res.redirect('/expenses');
  });
};