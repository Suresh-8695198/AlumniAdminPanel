import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { Star, Filter, SortAsc, SortDesc, Flag, Trash2, Eye, EyeOff, Search, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Tooltip } from 'react-tooltip';

// Mock feedback data (14 entries)
const mockFeedback = [
  { id: 1, user: 'John Doe', email: 'john.doe@example.com', category: 'General Feedback', rating: 4, comment: 'The platform is great, but could use more networking events.', date: '2025-05-25', isRead: false, isFlagged: false },
  { id: 2, user: 'Jane Smith', email: 'jane.smith@example.com', category: 'Events & Programs', rating: 5, comment: 'Loved the recent alumni meetup! Well-organized and engaging.', date: '2025-05-24', isRead: true, isFlagged: false },
  { id: 3, user: 'Alex Brown', email: 'alex.brown@example.com', category: 'Platform Experience', rating: 3, comment: 'Navigation could be improved. Sometimes hard to find features.', date: '2025-05-23', isRead: false, isFlagged: true },
  { id: 4, user: 'Emily Davis', email: 'emily.davis@example.com', category: 'Mentorship', rating: 4, comment: 'Mentorship program is helpful, but more mentors needed.', date: '2025-05-22', isRead: true, isFlagged: false },
  { id: 5, user: 'Michael Lee', email: 'michael.lee@example.com', category: 'General Feedback', rating: 2, comment: 'The UI feels outdated, needs a modern refresh.', date: '2025-05-21', isRead: false, isFlagged: false },
  { id: 6, user: 'Sarah Wilson', email: 'sarah.wilson@example.com', category: 'Events & Programs', rating: 5, comment: 'The virtual conference was fantastic!', date: '2025-05-20', isRead: true, isFlagged: false },
  { id: 7, user: 'David Kim', email: 'david.kim@example.com', category: 'Platform Experience', rating: 3, comment: 'Search functionality could be faster.', date: '2025-05-19', isRead: false, isFlagged: true },
  { id: 8, user: 'Laura Martinez', email: 'laura.martinez@example.com', category: 'Mentorship', rating: 4, comment: 'Great mentors, but scheduling is tricky.', date: '2025-05-18', isRead: true, isFlagged: false },
  { id: 9, user: 'Chris Evans', email: 'chris.evans@example.com', category: 'General Feedback', rating: 5, comment: 'Amazing community support!', date: '2025-05-17', isRead: false, isFlagged: false },
  { id: 10, user: 'Anna Taylor', email: 'anna.taylor@example.com', category: 'Events & Programs', rating: 4, comment: 'More regional events would be great.', date: '2025-05-16', isRead: true, isFlagged: false },
  { id: 11, user: 'James White', email: 'james.white@example.com', category: 'Platform Experience', rating: 2, comment: 'Mobile app crashes occasionally.', date: '2025-05-15', isRead: false, isFlagged: true },
  { id: 12, user: 'Olivia Green', email: 'olivia.green@example.com', category: 'Mentorship', rating: 5, comment: 'Mentor feedback was incredibly valuable.', date: '2025-05-14', isRead: true, isFlagged: false },
  { id: 13, user: 'Liam Harris', email: 'liam.harris@example.com', category: 'General Feedback', rating: 3, comment: 'Could use more customization options.', date: '2025-05-13', isRead: false, isFlagged: false },
  { id: 14, user: 'Sophia Clark', email: 'sophia.clark@example.com', category: 'Events & Programs', rating: 4, comment: 'Loved the panel discussion format!', date: '2025-05-12', isRead: true, isFlagged: false },
];

const Feedback = () => {
  console.log('Feedback: Rendering Admin Feedback Section');

  // State management
  const [feedback, setFeedback] = useState(mockFeedback);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Feedback categories with vibrant colors
  const categories = [
    { id: 'All', name: 'All Categories', color: 'bg-gradient-to-r from-gray-700 to-gray-800' },
    { id: 'General Feedback', name: 'General Feedback', color: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
    { id: 'Events & Programs', name: 'Events & Programs', color: 'bg-gradient-to-r from-green-600 to-teal-600' },
    { id: 'Platform Experience', name: 'Platform Experience', color: 'bg-gradient-to-r from-orange-600 to-red-600' },
    { id: 'Mentorship', name: 'Mentorship', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  ];

  // Filter and sort feedback
  const filteredFeedback = feedback
    .filter((item) => filterCategory === 'All' || item.category === filterCategory)
    .filter((item) => filterRating === 'All' || item.rating === parseInt(filterRating))
    .filter((item) =>
      searchQuery
        ? item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.comment.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'rating-asc') return a.rating - b.rating;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  // Handle feedback actions
  const toggleRead = (id) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  };

  const toggleFlag = (id) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFlagged: !item.isFlagged } : item
      )
    );
  };

  const deleteFeedback = (id) => {
    setFeedback((prev) => prev.filter((item) => item.id !== id));
    if (selectedFeedback?.id === id) setSelectedFeedback(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const bulkMarkRead = () => {
    setFeedback((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, isRead: true } : item
      )
    );
    setSelectedIds([]);
  };

  const bulkDelete = () => {
    setFeedback((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    if (selectedIds.includes(selectedFeedback?.id)) setSelectedFeedback(null);
  };

  // Sentiment indicator
  const getSentiment = (rating) => {
    if (rating >= 4) return { text: 'Positive', color: 'text-green-500' };
    if (rating === 3) return { text: 'Neutral', color: 'text-yellow-500' };
    return { text: 'Negative', color: 'text-red-500' };
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800">
      <Sidebar />
    <main className="flex-1 p-6 md:p-8 bg-gray-50/95 md:rounded-tl-3xl overflow-y-auto max-h-screen relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 relative z-10 pt-8 md:pt-0"></div>
         <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-900 tracking-tight drop-shadow-md">
            Feedbacks and Review
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Manage and analyze alumni feedback with ease.
          </p>
         
        </motion.div>

        {/* Filter, Search, and Bulk Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Search Feedback
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by user "
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm sm:text-base bg-gray-50 transition-all duration-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Filter by Category
              </label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm sm:text-base bg-gray-50 transition-all duration-300 appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Filter by Rating
              </label>
              <div className="relative">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm sm:text-base bg-gray-50 transition-all duration-300 appearance-none"
                >
                  <option value="All">All Ratings</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
-controller
                      {star} Star{star > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm sm:text-base bg-gray-50 transition-all duration-300 appearance-none"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="rating-desc">Rating (Highest)</option>
                  <option value="rating-asc">Rating (Lowest)</option>
                </select>
                {sortBy.includes('asc') ? (
                  <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <SortDesc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap gap-3"
            >
              <button
                onClick={bulkMarkRead}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center text-sm sm:text-base font-medium transition-all duration-300 shadow-sm"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Mark Selected as Read
              </button>
              <button
                onClick={bulkDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center text-sm sm:text-base font-medium transition-all duration-300 shadow-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Feedback Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-7 sm:gap-7 lg:gap-15">
          <AnimatePresence>
            {filteredFeedback.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center text-gray-600 py-12 text-base sm:text-lg font-medium"
              >
                No feedback matches the current filters.
              </motion.div>
            ) : (
              filteredFeedback.map((item, index) => (
                <Tilt key={item.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 min-w-[300px] max-w-md mx-auto ${
                      item.isFlagged ? 'border-l-4 border-red-500' : ''
                    } ${selectedIds.includes(item.id) ? 'ring-2 ring-blue-400' : ''} cursor-pointer flex flex-col`}
                    onClick={() => setSelectedFeedback(item)}
                  >
                    {/* Category Badge */}
                    <div
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white mb-4 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                        categories.find((cat) => cat.name === item.category)?.color || 'bg-gray-700'
                      }`}
                    >
                      {item.category}
                    </div>

                    {/* Custom Checkbox */}
                    <label className="absolute top-6 right-6 flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="hidden"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span
                        className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                          selectedIds.includes(item.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selectedIds.includes(item.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </label>

                    {/* User Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{item.user}</h3>
                      <p className="text-sm text-gray-500 truncate">{item.email}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>

                    {/* Rating and Sentiment */}
                    <div className="flex items-center mb-4 space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                        />
                      ))}
                      <span className={`text-sm font-medium ${getSentiment(item.rating).color}`}>
                        {getSentiment(item.rating).text}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-base text-gray-600 mb-4 flex-grow line-clamp-3">{item.comment}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRead(item.id);
                        }}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-300 shadow-sm"
                        data-tooltip-id={`read-${item.id}`}
                        data-tooltip-content={item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {item.isRead ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                      <Tooltip id={`read-${item.id}`} place="top" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlag(item.id);
                        }}
                        className={`p-2 rounded-full ${
                          item.isFlagged
                            ? 'bg-red-100 hover:bg-red-200 text-red-600'
                            : 'bg-orange-100 hover:bg-orange-200 text-orange-600'
                        } transition-all duration-300 shadow-sm`}
                        data-tooltip-id={`flag-${item.id}`}
                        data-tooltip-content={item.isFlagged ? 'Unflag' : 'Flag for Follow-up'}
                      >
                        <Flag className="w-5 h-5" />
                      </motion.button>
                      <Tooltip id={`flag-${item.id}`} place="top" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFeedback(item.id);
                        }}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-300 shadow-sm"
                        data-tooltip-id={`delete-${item.id}`}
                        data-tooltip-content="Delete Feedback"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                      <Tooltip id={`delete-${item.id}`} place="top" />
                    </div>
                  </motion.div>
                </Tilt>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Feedback Details Modal */}
        <AnimatePresence>
          {selectedFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedFeedback(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-white rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Feedback Details</h2>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedFeedback.user}</h3>
                    <p className="text-sm text-gray-500 truncate">{selectedFeedback.email}</p>
                    <p className="text-xs text-gray-400">{selectedFeedback.date}</p>
                  </div>

                  {/* Category and Sentiment */}
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-md ${
                        categories.find((cat) => cat.name === selectedFeedback.category)?.color || 'bg-gray-700'
                      }`}
                    >
                      {selectedFeedback.category}
                    </span>
                    <span className={`text-sm font-medium ${getSentiment(selectedFeedback.rating).color}`}>
                      {getSentiment(selectedFeedback.rating).text}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < selectedFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-base text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    {selectedFeedback.comment}
                  </p>

                  {/* Status */}
                  <div className="flex space-x-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        selectedFeedback.isRead ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {selectedFeedback.isRead ? 'Read' : 'Unread'}
                    </span>
                    {selectedFeedback.isFlagged && (
                      <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600">
                        Flagged
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleRead(selectedFeedback.id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center text-sm font-medium transition-all duration-300 shadow-sm"
                    >
                      {selectedFeedback.isRead ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {selectedFeedback.isRead ? 'Mark Unread' : 'Mark Read'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFlag(selectedFeedback.id)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedFeedback.isFlagged
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-orange-600 hover:bg-orange-700'
                      } text-white flex items-center text-sm font-medium transition-all duration-300 shadow-sm`}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      {selectedFeedback.isFlagged ? 'Unflag' : 'Flag'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteFeedback(selectedFeedback.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center text-sm font-medium transition-all duration-300 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Feedback;