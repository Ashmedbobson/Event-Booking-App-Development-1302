import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';

const { FiMessageCircle, FiHeart, FiReply, FiMoreHorizontal, FiSend, FiUser, FiFlag, FiEdit, FiTrash2, FiSmile } = FiIcons;

// Available reactions with emojis
const REACTIONS = [
  { id: 'like', emoji: '👍', label: 'Like' },
  { id: 'love', emoji: '❤️', label: 'Love' },
  { id: 'laugh', emoji: '😂', label: 'Laugh' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
  { id: 'celebrate', emoji: '🎉', label: 'Celebrate' },
  { id: 'thinking', emoji: '🤔', label: 'Thinking' }
];

const CommentSystem = ({ eventId, comments, onAddComment, onReplyComment, onReactToComment, onEditComment, onDeleteComment, onReportComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular'

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment = {
      id: Date.now().toString(),
      eventId,
      userId: user.id,
      author: user.name || user.email,
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
      replies: [],
      isEdited: false
    };

    onAddComment(comment);
    setNewComment('');
  };

  const handleReply = (commentId) => {
    if (!replyText.trim() || !user) return;

    const reply = {
      id: Date.now().toString(),
      parentId: commentId,
      userId: user.id,
      author: user.name || user.email,
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    onReplyComment(commentId, reply);
    setReplyText('');
    setReplyingTo(null);
  };

  const handleEditComment = (commentId) => {
    if (!editText.trim()) return;
    
    onEditComment(commentId, editText.trim());
    setEditingComment(null);
    setEditText('');
  };

  const handleReaction = (commentId, reactionId, isReply = false, parentId = null) => {
    if (!user) return;
    onReactToComment(commentId, reactionId, user.id, isReply, parentId);
    setShowReactionPicker(null);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const sortComments = (comments) => {
    switch (sortBy) {
      case 'oldest':
        return [...comments].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case 'popular':
        return [...comments].sort((a, b) => {
          const aReactionCount = Object.values(a.reactions || {}).reduce((sum, users) => sum + users.length, 0);
          const bReactionCount = Object.values(b.reactions || {}).reduce((sum, users) => sum + users.length, 0);
          return bReactionCount - aReactionCount;
        });
      case 'newest':
      default:
        return [...comments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  };

  const sortedComments = sortComments(comments);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiMessageCircle} className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-bold text-gray-800">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Sort Options */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="bg-primary-100 p-2 sm:p-3 rounded-full flex-shrink-0">
              <SafeIcon icon={FiUser} className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this event..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm sm:text-base"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs sm:text-sm text-gray-500">
                  {newComment.length}/500
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || newComment.length > 500}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm sm:text-base"
                >
                  <SafeIcon icon={FiSend} className="h-4 w-4" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg mb-8">
          <SafeIcon icon={FiMessageCircle} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Sign in to join the conversation</p>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
            Sign In
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.length > 0 ? (
          sortedComments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              index={index}
              user={user}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              editText={editText}
              setEditText={setEditText}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              showReactionPicker={showReactionPicker}
              setShowReactionPicker={setShowReactionPicker}
              onReply={handleReply}
              onReaction={handleReaction}
              onEdit={handleEditComment}
              onDelete={onDeleteComment}
              onReport={onReportComment}
              formatTimeAgo={formatTimeAgo}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiMessageCircle} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-800 mb-2">No comments yet</h4>
            <p className="text-gray-600">Be the first to share your thoughts about this event!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ 
  comment, 
  index, 
  user, 
  replyingTo, 
  setReplyingTo, 
  replyText, 
  setReplyText,
  editingComment,
  setEditingComment,
  editText,
  setEditText,
  showDropdown,
  setShowDropdown,
  showReactionPicker,
  setShowReactionPicker,
  onReply, 
  onReaction, 
  onEdit,
  onDelete,
  onReport,
  formatTimeAgo 
}) => {
  const canEdit = user && user.id === comment.userId;
  const isEditing = editingComment === comment.id;
  const reactions = comment.reactions || {};
  const totalReactions = Object.values(reactions).reduce((sum, users) => sum + users.length, 0);

  const handleEditStart = () => {
    setEditText(comment.content);
    setEditingComment(comment.id);
    setShowDropdown(null);
  };

  const getUserReaction = () => {
    if (!user) return null;
    for (const [reactionId, users] of Object.entries(reactions)) {
      if (users.includes(user.id)) {
        return REACTIONS.find(r => r.id === reactionId);
      }
    }
    return null;
  };

  const userReaction = getUserReaction();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-4"
    >
      {/* Main Comment */}
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="bg-gray-100 p-2 sm:p-3 rounded-full flex-shrink-0">
          <SafeIcon icon={FiUser} className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{comment.author}</h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatTimeAgo(comment.timestamp)}
                  {comment.isEdited && <span className="ml-2">(edited)</span>}
                </p>
              </div>
              
              {/* Comment Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === comment.id ? null : comment.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <SafeIcon icon={FiMoreHorizontal} className="h-4 w-4" />
                </button>
                
                <AnimatePresence>
                  {showDropdown === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                    >
                      {canEdit && (
                        <>
                          <button
                            onClick={handleEditStart}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <SafeIcon icon={FiEdit} className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              onDelete(comment.id);
                              setShowDropdown(null);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                      {!canEdit && (
                        <button
                          onClick={() => {
                            onReport(comment.id);
                            setShowDropdown(null);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                        >
                          <SafeIcon icon={FiFlag} className="h-4 w-4" />
                          <span>Report</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(comment.id)}
                    className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditText('');
                    }}
                    className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-sm sm:text-base">{comment.content}</p>
            )}
          </div>

          {/* Reactions Display */}
          {totalReactions > 0 && (
            <div className="flex items-center space-x-2 mt-2 mb-2">
              <div className="flex items-center bg-white rounded-full border border-gray-200 px-2 py-1">
                {Object.entries(reactions).map(([reactionId, users]) => {
                  if (users.length === 0) return null;
                  const reaction = REACTIONS.find(r => r.id === reactionId);
                  return (
                    <div key={reactionId} className="flex items-center space-x-1">
                      <span className="text-sm">{reaction?.emoji}</span>
                      <span className="text-xs text-gray-600">{users.length}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Comment Actions */}
          {!isEditing && (
            <div className="flex items-center space-x-4 mt-3">
              {/* Reaction Button */}
              <div className="relative">
                <button
                  onClick={() => setShowReactionPicker(showReactionPicker === comment.id ? null : comment.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors px-2 py-1 rounded-lg ${
                    userReaction ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  {userReaction ? (
                    <>
                      <span className="text-base">{userReaction.emoji}</span>
                      <span className="text-xs">{userReaction.label}</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSmile} className="h-4 w-4" />
                      <span>React</span>
                    </>
                  )}
                </button>

                {/* Reaction Picker */}
                <AnimatePresence>
                  {showReactionPicker === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex space-x-1 z-10"
                    >
                      {REACTIONS.map((reaction) => (
                        <button
                          key={reaction.id}
                          onClick={() => onReaction(comment.id, reaction.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title={reaction.label}
                        >
                          <span className="text-xl">{reaction.emoji}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
                >
                  <SafeIcon icon={FiReply} className="h-4 w-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>
          )}
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 p-2 rounded-full flex-shrink-0">
                  <SafeIcon icon={FiUser} className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author}...`}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {replyText.length}/300
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onReply(comment.id)}
                        disabled={!replyText.trim() || replyText.length > 300}
                        className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  user={user}
                  onReaction={(replyId, reactionId) => onReaction(replyId, reactionId, true, comment.id)}
                  formatTimeAgo={formatTimeAgo}
                  onReport={onReport}
                  showReactionPicker={showReactionPicker}
                  setShowReactionPicker={setShowReactionPicker}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ReplyItem = ({ reply, user, onReaction, formatTimeAgo, onReport, showReactionPicker, setShowReactionPicker }) => {
  const reactions = reply.reactions || {};
  const totalReactions = Object.values(reactions).reduce((sum, users) => sum + users.length, 0);

  const getUserReaction = () => {
    if (!user) return null;
    for (const [reactionId, users] of Object.entries(reactions)) {
      if (users.includes(user.id)) {
        return REACTIONS.find(r => r.id === reactionId);
      }
    }
    return null;
  };

  const userReaction = getUserReaction();

  return (
    <div className="flex items-start space-x-3 ml-8">
      <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
        <SafeIcon icon={FiUser} className="h-4 w-4 text-gray-600" />
      </div>
      
      <div className="flex-1 bg-gray-50 rounded-lg p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h5 className="font-medium text-gray-800 text-sm">{reply.author}</h5>
            <p className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</p>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-2">{reply.content}</p>

        {/* Reply Reactions Display */}
        {totalReactions > 0 && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center bg-white rounded-full border border-gray-200 px-2 py-1">
              {Object.entries(reactions).map(([reactionId, users]) => {
                if (users.length === 0) return null;
                const reaction = REACTIONS.find(r => r.id === reactionId);
                return (
                  <div key={reactionId} className="flex items-center space-x-1">
                    <span className="text-xs">{reaction?.emoji}</span>
                    <span className="text-xs text-gray-600">{users.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          {/* Reply Reaction Button */}
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker(showReactionPicker === `reply-${reply.id}` ? null : `reply-${reply.id}`)}
              className={`flex items-center space-x-1 text-xs transition-colors px-2 py-1 rounded-lg ${
                userReaction ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-primary-600 hover:bg-gray-100'
              }`}
            >
              {userReaction ? (
                <>
                  <span className="text-sm">{userReaction.emoji}</span>
                  <span className="text-xs">{userReaction.label}</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSmile} className="h-3 w-3" />
                  <span>React</span>
                </>
              )}
            </button>

            {/* Reply Reaction Picker */}
            <AnimatePresence>
              {showReactionPicker === `reply-${reply.id}` && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex space-x-1 z-10"
                >
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => onReaction(reply.id, reaction.id)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      title={reaction.label}
                    >
                      <span className="text-base">{reaction.emoji}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSystem;