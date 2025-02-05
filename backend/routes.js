const express = require('express');
const { registerUser, loginUser, saveGroupMessage, savePrivateMessage } = require('./controller');
const authenticate = require('./middleware'); // Middleware for JWT authentication

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.post('/group-messages', authenticate, async (req, res) => {
    const { from_user, room, message } = req.body;
    try {
        await saveGroupMessage(from_user, room, message);
        res.status(201).send('Group message sent');
    } catch (err) {
        res.status(500).send('Error sending message');
    }
});

router.post('/private-messages', authenticate, async (req, res) => {
    const { from_user, to_user, message } = req.body;
    try {
        await savePrivateMessage(from_user, to_user, message);
        res.status(201).send('Private message sent');
    } catch (err) {
        res.status(500).send('Error sending private message');
    }
});

module.exports = router;
