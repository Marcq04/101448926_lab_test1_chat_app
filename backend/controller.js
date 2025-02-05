const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, GroupMessage, PrivateMessage } = require('./model');

// POST /register
const registerUser = async (req, res) => {
    const { username, firstname, lastname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, firstname, lastname, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
};

// POST /login
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, 'secretkey');
    res.send({ token });
};

// POST /group-messages
const saveGroupMessage = async (from_user, room, message) => {
    const newMessage = new GroupMessage({ from_user, room, message });
    await newMessage.save();
};

// POST /private-messages
const savePrivateMessage = async (from_user, to_user, message) => {
    const newMessage = new PrivateMessage({ from_user, to_user, message });
    await newMessage.save();
};

module.exports = { registerUser, loginUser, saveGroupMessage, savePrivateMessage };

