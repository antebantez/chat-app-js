const passwordEncryptor = require('../../security/passwordEncryptor');
const acl = require('../../security/acl');
const db = require('./db');

let connections = {};

const sse = async (req, res) => {
    // Add the response to open connections
    //connections.push(res);
    if (!connections[req.query.chatId]) {
        connections[req.query.chatId] = [res];
    }
    else {
        connections[req.query.chatId].push(res);
    }

    // listen for client disconnection
    // and remove the client's response
    // from the open connections list
    req.on('close', () => {
        //connections = connections.filter(openRes => openRes != res)
        connections[req.query.chatId] = connections[req.query.chatId].filter(openRes => openRes != res)

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
        //message: 'clients connected: ' + connections.length
        message: 'clients connected: ' + connections[req.query.chatId].length,
        chatId: req.query.chatId
    });
}

function broadcast(event, data) {
    console.log('broadcast event,', data);
    // loop through all open connections and send
    // some data without closing the connection (res.write)
    //for (let res of connections) {
    for (let res of connections[data.chatId]) {
        // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
        res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n');
    }
}

const createUser = async (req, res) => {

    if (!req.body.username|| !req.body.password ) {
        res.status(403).json({ success: false, error: 'Incorrect parameters' });
    }
    console.log(req.route.path)
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const hashedPassword = passwordEncryptor(req.body.password)
        const data = await db.query(
            'INSERT INTO users (user_name, password, user_role) VALUES ($1, $2, $3) RETURNING *',
            [req.body.username, hashedPassword , 'user' ]
        )
        console.log(data.rows)
        if (data.rows.length === 0) {
            res.sendStatus(403)
            
        }
        const user = data.rows[0]
        
        //TO BE CONTINUED
        /*req.session.user = {
            id: user.id,
            username: user.user_name,
            userRole: user.user_role
        }*/

        res.status(200)
        return res.json({ Success: 'User created' })
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
        res.status(405).json({ error: 'Not Allowed' })
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
        res.status(200).json({ success: true, result: 'Logged out' });

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

const getUsers = async (req, res) => {
    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT id, user_name
                FROM users
                WHERE id != $1
                AND user_role = 'user'
                LIMIT $2
            `,
            [req.session.user.id, req.query.limit ? req.query.limit : 10]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
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
                AND chat_users.invitation_accepted = true
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
        await db.query(
            `
                INSERT INTO chats (created_by, subject)
                VALUES ($1, $2)
            `,
            [req.session.user.id, req.body.subject]
        );

        res.status(200).json({ success: true, result: 'Chat created' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getInvitationEligbleUsers = async (req, res) => {
    if (!req.query.chatId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT id, user_name
                FROM users
                WHERE users.id != $1
                AND users.user_role = 'user'
                AND id NOT IN (
                    SELECT user_id
                    FROM chat_users
                    WHERE chat_id = $2
                )
                LIMIT $3
            `,
            [
                req.session.user.id, req.query.chatId,
                req.query.limit ? req.query.limit : 10
            ]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const inviteToChat = async (req, res) => {
    // make sure only the owner of the chat and admins can invite
    if (!req.query.chatId || !req.query.userId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            /* `
                INSERT INTO chat_users (chat_id, user_id)
                VALUES ($1, $2)
            `, */
            `
                INSERT INTO chat_users (chat_id, user_id)
                SELECT $1, $2
                WHERE NOT EXISTS(
                    SELECT *
                    FROM chat_users
                    WHERE chat_id = $1
                    AND user_id = $2
                )
            `,
            [req.query.chatId, req.query.userId]
        );

        res.status(200).json({ success: true, result: 'Chat invite sent' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatUsers = async (req, res) => {
    if (!req.query.chatId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        const query = await db.query(
            `
                SELECT users.id, users.user_name, chat_users.banned 
                FROM users, chats, chat_users
                WHERE users.id = chat_users.user_id
                AND chats.id = chat_users.chat_id
                AND chats.id = $1
                AND users.id != $2
            `,
            [req.query.chatId, req.session.user.id]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatInvites = async (req, res) => {
    /* console.log(req.route.path)
    console.log(req.session.user.userRole) */
     if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    } 

    try {
        const query = await db.query(
            `
                SELECT chats.id, chats.created_by, chats.subject
                FROM chats, chat_users
                WHERE chats.id = chat_users.chat_id
                AND chat_users.user_id = $1
                AND chat_users.invitation_accepted = false
            `,
            [req.session.user.id]
        );

        res.status(200).json({ success: true, result: query.rows });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const acceptChatInvite = async (req, res) => {
    if (!req.params.id) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                UPDATE chat_users
                SET invitation_accepted = true
                WHERE chat_id = $1
                AND user_id = $2
            `,
            [req.params.id, req.session.user.id]
        );

        res.status(200).json({ success: true, result: 'Chat invitation accepcted' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const banFromChat = async (req, res) => {
    // make sure only chat owners and admins can ban users from a chat
    if (!req.query.chatId || !req.query.userId) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        await db.query(
            `
                UPDATE chat_users
                SET banned = NOT banned
                WHERE chat_id = $1
                AND user_id = $2
            `,
            [req.query.chatId, req.query.userId]
        );

        res.status(200).json({ success: true, result: 'User banned/unbanned from chat' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}


const sendMessage = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
        return;
    }

    if (!acl(req.route.path, req)) {
        res.status(405).json({ error: 'Not allowed' });
        return;
    }

    try {
        console.log("connections", connections)
        let message = req.body;
        message.timestamp = Date.now();
        broadcast('new-message', message);
        res.send('ok');
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const getChatMessages = async (req, res) => {
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

const deleteMessage = async (req, res) => {
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
    sse,
    createUser,
    loginUser,
    logoutUser,
    getUsers,
    getLogin,
    blockUser,
    getChats,
    createChat,
    getInvitationEligbleUsers,
    inviteToChat,
    getChatUsers,
    getChatInvites,
    acceptChatInvite,
    banFromChat,
    sendMessage,
    getChatMessages,
    deleteMessage
}