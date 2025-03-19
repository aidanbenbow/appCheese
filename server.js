import express from 'express';
const app = express();

import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import configurePassport from './config/passport.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from './routes/index.js';
import articleRouter from './routes/article.js';
import authRoutes from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

configurePassport(passport);

app.use('/', indexRouter);
app.use('/articles', articleRouter);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRouter);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    });