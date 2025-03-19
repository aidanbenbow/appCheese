import express from 'express';
import passport from 'passport';
const router = express.Router();

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME} from '../config/dynamoDB.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.flash('error', 'Please fill in all fields');
        return res.redirect('/register');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const params = {
            TableName: TABLE_NAME,
            Item: {
                username: username,
                password: hashedPassword,
                id: uuidv4(),
            },
        };
        await docClient.send(new PutCommand(params));
        req.flash('success', 'You are now registered');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error registering. Please try again');
        res.redirect('/auth/register');
    }
});

// login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true,
}));

// logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err)  return next(err);
        req.flash('success', 'You are logged out'); 
        res.redirect('/');
    });
    
});

export default router;