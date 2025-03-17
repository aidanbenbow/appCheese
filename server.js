import express from 'express';
const app = express();

import indexRouter from './routes/index.js';
import articleRouter from './routes/article.js';

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/articles', articleRouter);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    });