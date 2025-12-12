const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    startConversation,
    markMessagesAsRead
} = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:conversationId/messages', getMessages);
router.put('/:conversationId/read', markMessagesAsRead);
router.post('/conversation', startConversation);

module.exports = router;
