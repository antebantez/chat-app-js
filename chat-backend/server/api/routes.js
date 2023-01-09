const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/sse', controller.sse)

router.post('/user/register', controller.createUser);
router.post('/user/login', controller.loginUser);
router.get('/user/login', controller.getLogin);
router.delete('/user/logout', controller.logoutUser);
router.post('/user/block/', controller.blockUser);

router.get('/chats', controller.getChats);

router.post('/chat/create', controller.createChat);
router.post('/chat/invite', controller.inviteToChat);
router.get('/chat/invites', controller.getChatInvites);
router.post('/chat/accept-invite', controller.acceptChatInvite);
router.post('/chat/ban/', controller.banFromChat);
router.post('/chat/message', controller.sendMessage);
router.get('/chat/messages/:id', controller.getChatMessages);
router.delete('/chat/delete-message/:id', controller.deleteMessage);

module.exports = router;