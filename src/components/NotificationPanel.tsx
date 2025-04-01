import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, Trees as Tree, Star, Award, ShoppingBag, BookOpen, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const NotificationPanel = () => {
  const { user, markNotificationAsRead, addNotification } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const prevValuesRef = useRef({
    ecoPoints: user?.ecoPoints || 0,
    treesPlanted: user?.treeMilestones?.length || 0,
    quizStreak: user?.quizStreak || 0,
    rank: user?.rank || 'Eco Rookie'
  });
  
  const unreadCount = user?.notifications?.filter(n => !n.read).length || 0;
  const treesPlanted = user?.treeMilestones?.length || 0;

  // Check for achievements and milestones
  useEffect(() => {
    if (!user) return;

    // Check for eco points milestones
    if (user.ecoPoints > prevValuesRef.current.ecoPoints) {
      const pointsGained = user.ecoPoints - prevValuesRef.current.ecoPoints;
      addNotification({
        type: 'points',
        title: '🎯 Points Earned!',
        message: `You've earned ${pointsGained} eco points!`
      });
    }

    // Check for tree planting milestones
    if (treesPlanted > prevValuesRef.current.treesPlanted) {
      addNotification({
        type: 'tree',
        title: '🌳 Tree Planted!',
        message: `Congratulations on planting your ${treesPlanted}${
          treesPlanted === 1 ? 'st' :
          treesPlanted === 2 ? 'nd' :
          treesPlanted === 3 ? 'rd' : 'th'
        } tree!`
      });
    }

    // Check for quiz streak changes
    if (user.quizStreak > prevValuesRef.current.quizStreak) {
      addNotification({
        type: 'achievement',
        title: '🎯 Quiz Streak!',
        message: `Amazing! You're on a ${user.quizStreak}-day quiz streak!`
      });
    }

    // Check for rank changes
    if (user.rank !== prevValuesRef.current.rank) {
      addNotification({
        type: 'achievement',
        title: '🏆 New Rank Achieved!',
        message: `Congratulations! You've reached the rank of ${user.rank}!`
      });
    }

    // Update previous values
    prevValuesRef.current = {
      ecoPoints: user.ecoPoints,
      treesPlanted,
      quizStreak: user.quizStreak,
      rank: user.rank
    };
  }, [user?.ecoPoints, treesPlanted, user?.quizStreak, user?.rank, addNotification]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Helper functions
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="text-[#D0FD3E]" />;
      case 'tree': return <Tree className="text-[#D0FD3E]" />;
      case 'points': return <Star className="text-[#D0FD3E]" />;
      case 'leaderboard': return <Award className="text-[#D0FD3E]" />;
      case 'marketplace': return <ShoppingBag className="text-[#D0FD3E]" />;
      case 'reminder': return <BookOpen className="text-[#D0FD3E]" />;
      default: return <MessageCircle className="text-[#D0FD3E]" />;
    }
  };

  const filterNotifications = (notifications: any[]) => {
    if (selectedCategory === 'all') return notifications;

    const categoryMap: Record<string, string[]> = {
      achievements: ['achievement', 'leaderboard'],
      eco: ['tree', 'points'],
      marketplace: ['marketplace'],
      promotional: ['general'],
      quiz: ['reminder']
    };

    return notifications.filter(notification => 
      categoryMap[selectedCategory]?.includes(notification.type)
    );
  };

  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  const clearAllNotifications = async () => {
    if (!user?.notifications) return;
    
    try {
      for (const notification of user.notifications) {
        if (!notification.read) {
          await markNotificationAsRead(notification.id);
        }
      }
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  // Render component
  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
      >
        <Bell className="text-[#D0FD3E]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {unreadCount} </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-12 w-96 bg-[#0A1A2F] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-[#D0FD3E] hover:text-white transition-colors"
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-2 border-b border-white/10 flex gap-2 overflow-x-auto">
              {(['all', 'achievements', 'eco', 'marketplace', 'promotional', 'quiz']).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-[#D0FD3E] text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {user?.notifications && filterNotifications(user.notifications).length > 0 ? (
                filterNotifications(user.notifications).map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-white/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#D0FD3E]">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-[#D0FD3E]" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="mx-auto mb-4 opacity-50" size={32} />
                  <p>No notifications in this category</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;