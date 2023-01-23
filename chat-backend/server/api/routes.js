const express = require('express');
const router = express.Router();
const {limiter, signInLimiter } = require('../../middleware/rate-limiter');
const controller = require('./controller');

//SignIn limiter limits user to 3 attempts
router.post('/user/login', signInLimiter, controller.loginUser);
router.get('/sse', controller.sse)


// General limiter to avoid DDOS-attacks
// Works on all routes
//router.use(limiter)

router.post('/user/register', controller.createUser);
router.get('/user/login', controller.getLogin);
router.delete('/user/logout', controller.logoutUser);
router.post('/user/block', controller.blockUser);
router.get('/user', controller.getUsers);
router.get('/user/search', controller.searchUsers)


router.get('/chats', controller.getChats);

router.post('/chat/create', controller.createChat);
router.get('/chat/invite', controller.getInvitationEligbleUsers);
router.post('/chat/invite', controller.inviteToChat);
router.get('/chat/users', controller.getChatUsers);
router.get('/chat/invites', controller.getChatInvites);
router.put('/chat/accept-invite/:id', controller.acceptChatInvite);
router.put('/chat/ban', controller.banFromChat);
router.post('/chat/message', controller.sendMessage);
router.get('/chat/messages/:id', controller.getChatMessages);
router.delete('/chat/delete-message/:id', controller.deleteMessage);
router.post('/chat/disconnect', controller.disconnectFromChat)

module.exports = router;