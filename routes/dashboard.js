import express from 'express';
const router = express.Router();

import { getAllCheeseArticles } from '../config/dynamoDB.js';
import ensureAuthenticated from '../middlewares/authMiddleware.js';

router.get('/', ensureAuthenticated, async (req, res) => {
  const articles = await getAllCheeseArticles();
  
    res.render('showall', { articles: articles });
});

export default router;