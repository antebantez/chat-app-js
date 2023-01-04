const { query } = require('express');
const passwordEncryptor = require('../../security/passwordEncryptor');

const db = require('./db');

const createUser = async (req, res) => {

    if (!req.body.username|| !req.body.password || !req.body.userRole) {
        res.status(403).json({ success: false, error: 'Incorrect parameters' });
    }

    try {
        const hashedPassword = passwordEncryptor(req.body.password)
        const data = await db.query(
            'INSERT INTO users (user_name, password, user_role) VALUES ($1, $2, $3) RETURNING *',
            [req.body.username, hashedPassword , req.body.userRole, ]
        )
        console.log(data.rows)
        if (data.rows.length === 0) {
            res.sendStatus(403)
        }
        const user = data.rows[0]

        req.session.user = {
            id: user.id,
            username: user.username,
            userRole: user.userRole
        }

        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
}



const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (username == null || password == null) {
        return res.sendStatus(403)
    }

    try {
        const data = await db.query(
            'SELECT id, user_name, password, user_role FROM users WHERE user_name = $1',
            [username]
        )

        if (data.rows.length === 0) {
            return res.sendStatus(403)
        }
        const user = data.rows[0]

        const matches = passwordEncryptor(req.body.password) === user.password;
        if (!matches) {
            return res.sendStatus(403)
        } 

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            userRole: user.userRole
        }

        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
}

const logoutUser = async (req, res) => {
    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }

}

const getLogin =  async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
}

const blockUser = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChats = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const createChat = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const inviteToChat = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const acceptChatInvite = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const banFromChat = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}


const sendMessage = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatMessages = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const deleteMessage = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

/* const x = async (req, res) => {
    if (!req.) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
} */

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getLogin,
    blockUser,
    getChats,
    createChat,
    inviteToChat,
    acceptChatInvite,
    banFromChat,
    sendMessage,
    getChatMessages,
    deleteMessage
}