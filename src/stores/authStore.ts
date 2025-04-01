import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

// Helper functions
const getCurrentDate = () => new Date().toISOString().split('T')[0];

const formatJoinDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateDaysActive = (joinDate: string) => {
  const start = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDaysActive = (days: number) => {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
};

// Calculate rank based on eco points
export const calculateRank = (points: number) => {
  if (points >= 1000000) return 'TrashTrek Grandmaster';
  if (points >= 900000) return 'Master of Restoration';
  if (points >= 800000) return 'Global Eco Leader';
  if (points >= 700000) return 'Earthian Visionary';
  if (points >= 600000) return 'Supreme Savior';
  if (points >= 500000) return 'Zero Waste Hero';
  if (points >= 400000) return "Nature's Guardian";
  if (points >= 300000) return 'Environmental Titan';
  if (points >= 200000) return 'Eco Pathfinder';
  if (points >= 150000) return 'Earth Trailblazer';
  if (points >= 100000) return 'Climate Crusader';
  if (points >= 75000) return 'Green Sentinel';
  if (points >= 50000) return 'Eco Commander';
  if (points >= 25000) return 'Planet Pioneer';
  if (points >= 10000) return 'Eco Legend';
  if (points >= 5000) return 'Environmental Master';
  if (points >= 2500) return 'Sustainability Champion';
  if (points >= 1000) return 'Green Warrior';
  if (points >= 500) return 'Eco Guardian';
  if (points >= 250) return 'Nature Protector';
  if (points >= 100) return 'Earth Defender';
  return 'Eco Rookie';
};

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: any;
  chatMessages: any[];
  allPosts: any[];
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUserData: () => Promise<void>;
  loadChatMessages: () => Promise<void>;
  loadPosts: () => Promise<void>;
  addEcoPoints: (points: number) => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
  updateUserSettings: (settings: any) => Promise<void>;
  addNotification: (notification: any) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  addChatMessage: (message: any) => Promise<void>;
  unlockAchievement: (achievement: any) => Promise<void>;
  updateLeaderboardPosition: (position: any) => Promise<void>;
  addTreeMilestone: (milestone: any) => Promise<void>;
  updateQuizStatus: (completed: boolean) => Promise<void>;
  addPost: (post: any) => Promise<void>;
  updatePost: (postId: string, updates: any) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, comment: any) => Promise<void>;
  getFormattedJoinDate: () => string;
  getDaysActive: () => number;
  getFormattedDaysActive: () => string;
  getUnreadNotificationsCount: () => number;
  getRecentAchievements: (count?: number) => any[];
  getTreesPlanted: () => number;
  getChatEligibility: () => { eligible: boolean; reason?: string };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      chatMessages: [],
      allPosts: [],
      
      signUp: async (email, password, username) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
          });
          
          if (authError) throw new Error(authError.message);
          if (!authData.user) throw new Error('No user data returned');
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              username,
              email,
              eco_points: 0,
              rank: 'Eco Rookie',
              joined_date: new Date().toISOString(),
              streak: 0,
              quiz_streak: 0,
              last_active: new Date().toISOString(),
              chat_enabled: false,
              settings: {
                game: {
                  crossPlatformPlay: true,
                  autoMatchmaking: true,
                  voiceChat: true,
                  pushNotifications: true,
                  soundEffects: true,
                  vibration: true
                },
                privacy: {
                  profileVisibility: 'friends',
                  onlineStatus: true,
                  activityFeed: true,
                  friendRequests: true,
                  dataCollection: true
                },
                security: {
                  twoFactorAuth: false,
                  biometricLogin: true,
                  rememberDevice: true,
                  autoLogout: false
                },
                notifications: {
                  push: true,
                  email: true,
                  updates: true
                }
              }
            });
            
          if (profileError) throw new Error(profileError.message);
          
          set({ isAuthenticated: true, isLoading: false });
          await get().loadUserData();
          
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw new Error(error.message);
          
          set({ isAuthenticated: true, isLoading: false });
          await get().loadUserData();
          
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
        
        set({
          isAuthenticated: false,
          user: null,
          chatMessages: [],
          allPosts: []
        });
      },
      
      loadUserData: async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (!authUser) {
            set({ user: null });
            return;
          }
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`
              *,
              achievements (*),
              notifications (*),
              tree_milestones (*),
              daily_eco_history (*)
            `)
            .eq('id', authUser.id)
            .single();
            
          if (profileError) throw new Error(profileError.message);
          
          const userData = {
            ...profile,
            achievements: profile.achievements || [],
            notifications: profile.notifications || [],
            treeMilestones: profile.tree_milestones || [],
            dailyEcoHistory: profile.daily_eco_history || [],
            leaderboardPosition: {
              global: profile.global_leaderboard_position,
              local: profile.local_leaderboard_position
            }
          };
          
          set({ user: userData });
          
        } catch (error) {
          console.error('Error loading user data:', error);
          set({ user: null });
        }
      },
      
      loadChatMessages: async () => {
        try {
          const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('timestamp', { ascending: true });
            
          if (error) throw new Error(error.message);
          
          set({ chatMessages: messages || [] });
          
        } catch (error) {
          console.error('Error loading chat messages:', error);
          set({ chatMessages: [] });
        }
      },
      
      loadPosts: async () => {
        try {
          const { data: posts, error } = await supabase
            .from('posts')
            .select(`
              *,
              comments (*)
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw new Error(error.message);
          
          set({ allPosts: posts || [] });
          
        } catch (error) {
          console.error('Error loading posts:', error);
          set({ allPosts: [] });
        }
      },
      
      addEcoPoints: async (points) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const currentPoints = state.user.eco_points || 0;
          const newPoints = currentPoints + points;
          const newRank = calculateRank(newPoints);
          
          const { error } = await supabase
            .from('profiles')
            .update({
              eco_points: newPoints,
              rank: newRank,
              last_active: new Date().toISOString()
            })
            .eq('id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          if (newRank !== state.user.rank) {
            await get().addNotification({
              type: 'achievement',
              title: 'New Rank Achieved!',
              message: `Congratulations! You've reached the rank of ${newRank}!`
            });
          }
          
          if (newPoints >= 1000 && currentPoints < 1000) {
            await get().addNotification({
              type: 'achievement',
              title: 'Global Chat Unlocked!',
              message: 'You can now participate in the global community chat!'
            });
          }
          
          // Add to daily eco history
          const today = getCurrentDate();
          const { data: existingHistory } = await supabase
            .from('daily_eco_history')
            .select('*')
            .eq('user_id', state.user.id)
            .eq('date', today)
            .single();
          
          if (existingHistory) {
            await supabase
              .from('daily_eco_history')
              .update({
                eco_points: existingHistory.eco_points + points
              })
              .eq('id', existingHistory.id);
          } else {
            await supabase
              .from('daily_eco_history')
              .insert({
                user_id: state.user.id,
                date: today,
                eco_points: points
              });
          }
          
          await get().loadUserData();
          
        } catch (error) {
          console.error('Error adding eco points:', error);
          throw error;
        }
      },
      
      updateUser: async (userData) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...userData,
              last_active: new Date().toISOString()
            })
            .eq('id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
      },
      
      updateUserSettings: async (newSettings) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const updatedSettings = {
            ...state.user.settings,
            ...newSettings
          };
          
          const { error } = await supabase
            .from('profiles')
            .update({
              settings: updatedSettings,
              last_active: new Date().toISOString()
            })
            .eq('id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error updating user settings:', error);
          throw error;
        }
      },
      
      addNotification: async (notification) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('notifications')
            .insert({
              user_id: state.user.id,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              action_url: notification.actionUrl,
              timestamp: new Date().toISOString(),
              read: false
            });
            
          if (error) throw new Error(error.message);
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error adding notification:', error);
          throw error;
        }
      },
      
      markNotificationAsRead: async (notificationId) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId)
            .eq('user_id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error marking notification as read:', error);
          throw error;
        }
      },
      
      addChatMessage: async (message) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('chat_messages')
            .insert({
              user_id: state.user.id,
              username: message.username,
              content: message.content,
              type: message.type,
              media_url: message.mediaUrl,
              timestamp: new Date().toISOString()
            });
            
          if (error) throw new Error(error.message);
          
          await get().loadChatMessages();
        } catch (error) {
          console.error('Error adding chat message:', error);
          throw error;
        }
      },
      
      unlockAchievement: async (achievement) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('achievements')
            .insert({
              user_id: state.user.id,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              type: achievement.type,
              unlocked_at: new Date().toISOString()
            });
            
          if (error) throw new Error(error.message);
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error unlocking achievement:', error);
          throw error;
        }
      },
      
      updateLeaderboardPosition: async (position) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const updates: any = {
            leaderboard_last_updated: new Date().toISOString()
          };
          
          if (position.global !== undefined) {
            updates.global_leaderboard_position = position.global;
          }
          
          if (position.local !== undefined) {
            updates.local_leaderboard_position = position.local;
          }
          
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          const iconicRanks = [10000, 1000, 750, 500, 250, 100, 50, 20, 10, 1];
          const oldGlobal = state.user.leaderboardPosition.global;
          const newGlobal = position.global || oldGlobal;
          
          if (newGlobal !== oldGlobal) {
            const achievedRank = iconicRanks.find(rank => newGlobal <= rank && oldGlobal > rank);
            if (achievedRank) {
              await get().addNotification({
                type: 'leaderboard',
                title: 'Iconic Rank Achieved!',
                message: `You've reached the top ${achievedRank} players globally!`
              });
            }
          }
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error updating leaderboard position:', error);
          throw error;
        }
      },
      
      addTreeMilestone: async (milestone) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('tree_milestones')
            .insert({
              user_id: state.user.id,
              count: milestone.count,
              species: milestone.species,
              latitude: milestone.latitude,
              longitude: milestone.longitude,
              achieved_at: new Date().toISOString()
            });
            
          if (error) throw new Error(error.message);
          
          await get().addNotification({
            type: 'tree',
            title: 'New Tree Planted!',
            message: `You've successfully planted your ${milestone.count}${
              milestone.count === 1 ? 'st' : 
              milestone.count === 2 ? 'nd' : 
              milestone.count === 3 ? 'rd' : 'th'
            } tree!`
          });
          
          await get().loadUserData();
        } catch (error) {
          console.error('Error adding tree milestone:', error);
          throw error;
        }
      },
      
      updateQuizStatus: async (completed) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const today = getCurrentDate();
          const wasCompletedToday = state.user.last_quiz_date === today;
          
          if (completed && !wasCompletedToday) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const streakContinues = state.user.last_quiz_date === yesterdayStr;
            const newStreak = streakContinues ? state.user.quiz_streak + 1 : 1;
            
            const { error } = await supabase
              .from('profiles')
              .update({
                last_quiz_date: today,
                quiz_streak: newStreak
              })
              .eq('id', state.user.id);
              
            if (error) throw new Error(error.message);
            
            if (newStreak > state.user.quiz_streak) {
              await get().addNotification({
                type: 'achievement',
                title: 'Quiz Streak!',
                message: `You're on a ${newStreak}-day quiz streak!`
              });
            }
            
            await get().loadUserData();
          }
        } catch (error) {
          console.error('Error updating quiz status:', error);
          throw error;
        }
      },
      
      addPost: async (post) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { data, error } = await supabase
            .from('posts')
            .insert({
              user_id: state.user.id,
              username: state.user.username,
              user_image: state.user.profile_image,
              content: post.content,
              media_url: post.mediaUrl,
              media_type: post.mediaType,
              thumbnail_url: post.thumbnailUrl,
              likes: 0,
              is_official: post.isOfficial || false
            })
            .select()
            .single();
            
          if (error) throw new Error(error.message);
          
          await get().loadPosts();
        } catch (error) {
          console.error('Error adding post:', error);
          throw error;
        }
      },
      
      updatePost: async (postId, updates) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const post = state.allPosts.find(p => p.id === postId);
          if (!post || post.user_id !== state.user.id) {
            throw new Error('You can only update your own posts');
          }
          
          const updateData: any = {};
          
          if (updates.content !== undefined) updateData.content = updates.content;
          if (updates.mediaUrl !== undefined) updateData.media_url = updates.mediaUrl;
          if (updates.mediaType !== undefined) updateData.media_type = updates.mediaType;
          if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url = updates.thumbnailUrl;
          if (updates.likes !== undefined) updateData.likes = updates.likes;
          if (updates.isOfficial !== undefined) updateData.is_official = updates.isOfficial;
          
          const { error } = await supabase
            .from('posts')
            .update(updateData)
            .eq('id', postId)
            .eq('user_id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          await get().loadPosts();
        } catch (error) {
          console.error('Error updating post:', error);
          throw error;
        }
      },
      
      deletePost: async (postId) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const post = state.allPosts.find(p => p.id === postId);
          if (!post || post.user_id !== state.user.id) {
            throw new Error('You can only delete your own posts');
          }
          
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', state.user.id);
            
          if (error) throw new Error(error.message);
          
          await get().loadPosts();
        } catch (error) {
          console.error('Error deleting post:', error);
          throw error;
        }
      },
      
      addComment: async (postId, comment) => {
        const state = get();
        if (!state.user) return;
        
        try {
          const { error } = await supabase
            .from('comments')
            .insert({
              post_id: postId,
              user_id: state.user.id,
              username: state.user.username,
              content: comment.content
            });
            
          if (error) throw new Error(error.message);
          
          await get().loadPosts();
        } catch (error) {
          console.error('Error adding comment:', error);
          throw error;
        }
      },
      
      getFormattedJoinDate: () => {
        const state = get();
        if (!state.user?.joined_date) return 'N/A';
        return formatJoinDate(state.user.joined_date);
      },
      
      getDaysActive: () => {
        const state = get();
        if (!state.user?.joined_date) return 0;
        return calculateDaysActive(state.user.joined_date);
      },
      
      getFormattedDaysActive: () => {
        const state = get();
        if (!state.user?.joined_date) return 'N/A';
        const days = calculateDaysActive(state.user.joined_date);
        return formatDaysActive(days);
      },
      
      getUnreadNotificationsCount: () => {
        const state = get();
        return state.user?.notifications.filter(n => !n.read).length || 0;
      },
      
      getRecentAchievements: (count = 5) => {
        const state = get();
        return (state.user?.achievements || [])
          .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
          .slice(0, count);
      },
      
      getTreesPlanted: () => {
        const state = get();
        return state.user?.treeMilestones?.length || 0;
      },
      
      getChatEligibility: () => {
        const state = get();
        if (!state.user) {
          return { 
            eligible: false, 
            reason: 'Please log in to access the chat.' 
          };
        }
        if (state.user.eco_points < 1000) {
          return { 
            eligible: false, 
            reason: `You need ${1000 - state.user.eco_points} more points to unlock the chat.` 
          };
        }
        return { eligible: true };
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);