import express from 'express';
const router = express.Router();

import { createCheeseArticle, getAllCheeseArticles } from '../config/dynamoDB.js  ';

router.get('/', (req, res) => {
    res.render('articlesadd');
});

router.get('/showall', async (req, res) => {
    const articles = await getAllCheeseArticles();
console.log(articles);
    res.render('showall', { articles: articles });
});

router.post('/submit', async (req, res) => {
    const article = {
        title: req.body.title,
        createdAt: req.body.createdAt,
        topic: req.body.topic,
        description: req.body.description,
        article: req.body.article
    };
  await createCheeseArticle(article);
    res.redirect('/articles/showall');
} );



export default router;