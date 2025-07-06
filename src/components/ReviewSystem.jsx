import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiThumbsUp, FiThumbsDown, FiFlag, FiUser } = FiIcons;

const ReviewSystem = ({ event, reviews, onSubmitReview, onHelpfulReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: '',
    comment: '',
    wouldRecommend: true
  });

  const StarRating = ({ rating, onRate, interactive = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onRate(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
            disabled={!interactive}
          >
            <SafeIcon 
              icon={FiStar} 
              className={`h-5 w-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewData.rating > 0 && reviewData.comment.trim()) {
      onSubmitReview({
        ...reviewData,
        eventId: event.id,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        author: 'Current User', // In real app, this would be the actual user
        helpful: 0
      });
      setReviewData({ rating: 0, title: '', comment: '', wouldRecommend: true });
      setShowReviewForm(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Reviews & Ratings</h3>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Write Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-sm text-gray-600 mt-2">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-4">{star}</span>
                  <SafeIcon icon={FiStar} className="h-4 w-4 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {reviews.filter(r => r.wouldRecommend).length}
            </div>
            <p className="text-sm text-gray-600">
              would recommend this event
            </p>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitReview}
            className="border-t border-gray-200 pt-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <StarRating 
                  rating={reviewData.rating} 
                  onRate={(rating) => setReviewData(prev => ({ ...prev, rating }))}
                  interactive={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewData.title}
                  onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Share your thoughts about this event..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recommend"
                  checked={reviewData.wouldRecommend}
                  onChange={(e) => setReviewData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="recommend" className="text-sm text-gray-700">
                  I would recommend this event to others
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{review.author}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StarRating rating={review.rating} />
                {review.wouldRecommend && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Recommends
                  </span>
                )}
              </div>
            </div>

            {review.title && (
              <h5 className="font-medium text-gray-800 mb-2">{review.title}</h5>
            )}

            <p className="text-gray-700 mb-4">{review.comment}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onHelpfulReview(review.id, true)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <SafeIcon icon={FiThumbsUp} className="h-4 w-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                  <SafeIcon icon={FiFlag} className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;