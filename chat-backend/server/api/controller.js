const { query } = require('express');
const passwordEncryptor = require('../../security/passwordEncryptor');

const db = require('./db');


let connections = [];

const sse = async (req, res) => {
    // Add the response to open connections
    connections.push(res);

    // listen for client disconnection
    // and remove the client's response
    // from the open connections list
    req.on('close', () => {
        connections = connections.filter(openRes => openRes != res)

        // message all open connections that a client disconnected
        broadcast('disconnect', {
            message: 'client disconnected'
        });
    });

    // Set headers to mark that this is SSE
    // and that we don't close the connection
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
    });

    // message all connected clients that this 
    // client connected
    broadcast('connect', {
        message: 'clients connected: ' + connections.length
    });
}

// function to send message to all connected clients
function broadcast(event, data) {
    // loop through all open connections and send
    // some data without closing the connection (res.write)
    for (let res of connections) {
        // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
        res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n');
    }
}

const createUser = async (req, res) => {

    if (!req.body.username|| !req.body.password || !req.body.userRole) {
        res.status(403).json({ success: false, error: 'Incorrect parameters' });
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const hashedPassword = passwordEncryptor(req.body.password)
        const data = await db.query(
            'INSERT INTO users (user_name, password, user_role) VALUES ($1, $2, $3) RETURNING *',
            [req.body.username, hashedPassword , 'user', ]
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

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
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
            username: user.user_name,
            userRole: user.user_role
        }
        console.log(req.session.user)
        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
}

const logoutUser = async (req, res) => {

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }

}

const getLogin = async (req, res) => {
    
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }


    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
}

const blockUser = async (req, res) => {
    if (!req.params.id) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                INSERT INTO user_blockings(user_id, blocked_user_id)
                VALUES ($1, $2)
            `,
            [req.session.user.id, req.params.id]
        );

        res.status(200).json({ success: true, result: 'User blocked' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChats = async (req, res) => {
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT *
                FROM chats, chat_users
                WHERE chats.id = chat_users.chat_id
                AND chat_users.user_id = $1
            `,
            [req.session.user.id]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const createChat = async (req, res) => {
    if (!req.body.subject) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const insertChatQuery = await db.query(
            `
                INSERT INTO chats (subject)
                VALUES ($1)
                RETURNING *
            `,
            [req.body.subject]
        );

        await db.query(
            `
                INSERT INTO chat_users (chat_id, user_id, creator)
                VALUES ($1, $2, $3)
            `,
            [insertChatQuery.rows[0].id, req.session.user.id, true]
        );

        res.status(200).json({ success: true, result: 'Chat created' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const inviteToChat = async (req, res) => {
    console.log(req.query);
    console.log(req.route);
    if (!req.query.chatId || !req.query.userId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                INSERT INTO chat_users (chat_id, user_id)
                VALUES ($1, $2)
            `,
            [req.query.chatId, req.query.userId]
        );
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatInvites = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
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

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
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

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
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
    getChatInvites,
    acceptChatInvite,
    banFromChat,
    sendMessage,
    getChatMessages,
    deleteMessage
}