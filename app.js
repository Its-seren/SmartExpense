const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // secure: true, // enable in production behind HTTPS
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.userName = req.session.userName || null;
  next();
});

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);
app.use('/expenses', expenseRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).render('500', { title: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));