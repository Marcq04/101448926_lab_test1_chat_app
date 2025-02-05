const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});

const groupMessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true },
    room: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now },
});

const privateMessageSchema = new mongoose.Schema({
    from_user: { type: String, required: true },
    to_user: { type: String, required: true },
    message: { type: String, required: true },
    date_sent: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = { User, GroupMessage, PrivateMessage };
