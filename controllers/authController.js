const db = require('../db/connection');
const bcrypt = require('bcrypt');

// Render register page
exports.registerPage = (req, res) => {
  res.render('register', { title: 'Register' });
};

// Handle user registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if user exists
    db.query('SELECT id FROM users WHERE email = ?', [normalizedEmail], (checkErr, results) => {
      if (checkErr) {
        console.error(checkErr);
        req.flash('error', 'Database error');
        return res.redirect('/register');
      }
      if (results.length > 0) {
        req.flash('error', 'Email already exists');
        return res.redirect('/register');
      }

      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(sql, [name.trim(), normalizedEmail, hashedPassword], (err) => {
        if (err) {
          console.error(err);
          req.flash('error', 'Could not register user');
          return res.redirect('/register');
        }
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/login');
      });
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Server error');
    res.redirect('/register');
  }
};

// Render login page
exports.loginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

// Handle user login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Email and password are required');
    return res.redirect('/login');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [normalizedEmail], async (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Database error');
      return res.redirect('/login');
    }

    if (results.length === 0) {
      req.flash('error', 'No user found with that email');
      return res.redirect('/login');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      req.flash('error', 'Incorrect password');
      return res.redirect('/login');
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.flash('success', `Welcome back, ${user.name}`);
    res.redirect('/expenses');
  });
};

// Dashboard redirect
exports.dashboardPage = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.redirect('/expenses');
};

// Logout user
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Could not log out');
      return res.redirect('/expenses');
    }
    res.redirect('/login');
  });
};