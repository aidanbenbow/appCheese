import express from 'express';
const router = express.Router();

import { createCheeseArticle, getAllCheeseArticles,  deleteItem, queryByTopicAndCreatedAt, updateItem, getItem } from '../config/dynamoDB.js  ';

router.get('/', (req, res) => {
    res.render('articlesadd');
});

router.get('/showall', async (req, res) => {
    const articles = await getAllCheeseArticles();

    res.render('showall', { articles: articles });
});

router.get('/:id/edit', async (req, res) => {
    const article = await getItem(req.params.id);
    console.log(article);
    res.render('articlesedit', { article: article });
});

router.post('/submit', async (req, res) => {
    const article = {
        id: req.body.id,
        title: req.body.title,
        createdAt: req.body.createdAt,
        topic: req.body.topic,
        description: req.body.description,
        article: req.body.article
    };
  await createCheeseArticle(article);
    res.redirect('/articles/showall');
} );

router.post('/:id/delete', async (req, res) => {
    await deleteItem(req.params.id);
    res.redirect('/articles/showall');
});

router.post('/update/:id', async (req, res) => {
    const updatedAttributes = {
        title: req.body.title,
        description: req.body.description,
        article: req.body.article
    };

    const _method = req.body._method;

    if(_method === 'PUT') {
    await updateItem(req.body.topic, req.body.createdAt,  updatedAttributes);
    res.redirect('/articles/showall');
    }
} );



export default router;