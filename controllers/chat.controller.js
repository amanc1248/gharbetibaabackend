const asyncHandler = require('../utils/asyncHandler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc    Get all conversations for current user
 * @route   GET /api/chat/conversations
 * @access  Private
 */
exports.getConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
        participants: req.user.id
    })
        .populate('participants', 'name photoURL role')
        .populate('propertyId', 'title location price')
        .sort({ 'lastMessage.createdAt': -1 });

    res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations
    });
});

/**
 * @desc    Get messages for a conversation
 * @route   GET /api/chat/:conversationId/messages
 * @access  Private
 */
exports.getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    // Verify user is participant
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user.id
    });

    if (!conversation) {
        return res.status(404).json({
            success: false,
            message: 'Conversation not found or unauthorized'
        });
    }

    const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

/**
 * @desc    Start or Get generic conversation with a user
 * @route   POST /api/chat/conversation
 * @access  Private
 */
exports.startConversation = asyncHandler(async (req, res) => {
    const { recipientId, propertyId } = req.body;

    if (!recipientId) {
        return res.status(400).json({
            success: false,
            message: 'Recipient ID is required'
        });
    }

    // Build query to find existing conversation
    const query = {
        participants: { $all: [req.user.id, recipientId] }
    };

    // If propertyId is provided, look for property-specific conversation
    // This allows separate chats per property between same users
    if (propertyId) {
        query.propertyId = propertyId;
    }

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user.id, recipientId],
            propertyId: propertyId || null,
            lastMessage: {
                content: 'Conversation started',
                sender: req.user.id,
                createdAt: Date.now()
            }
        });
    }

    // Populate participants and property details
    conversation = await conversation.populate([
        { path: 'participants', select: 'name photoURL role' },
        { path: 'propertyId', select: 'title images location price owner' }
    ]);

    res.status(200).json({
        success: true,
        data: conversation
    });
});
