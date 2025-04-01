export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          icon: string
          type: 'rank' | 'trees' | 'points' | 'leaderboard' | 'activity'
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          icon: string
          type: 'rank' | 'trees' | 'points' | 'leaderboard' | 'activity'
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          icon?: string
          type?: 'rank' | 'trees' | 'points' | 'leaderboard' | 'activity'
          unlocked_at?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          username: string
          content: string
          type: 'text' | 'gif' | 'image' | 'video' | 'audio'
          media_url: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          content: string
          type: 'text' | 'gif' | 'image' | 'video' | 'audio'
          media_url?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          content?: string
          type?: 'text' | 'gif' | 'image' | 'video' | 'audio'
          media_url?: string | null
          timestamp?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          username: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          username: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          username?: string
          content?: string
          created_at?: string
        }
      }
      daily_eco_history: {
        Row: {
          id: string
          user_id: string
          date: string
          eco_points: number
          trees_planted: number
          trash_collected: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          eco_points?: number
          trees_planted?: number
          trash_collected?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          eco_points?: number
          trees_planted?: number
          trash_collected?: number
          created_at?: string
        }
      }
      friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'achievement' | 'leaderboard' | 'points' | 'reminder' | 'tree' | 'general' | 'marketplace'
          title: string
          message: string
          action_url: string | null
          read: boolean
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'achievement' | 'leaderboard' | 'points' | 'reminder' | 'tree' | 'general' | 'marketplace'
          title: string
          message: string
          action_url?: string | null
          read?: boolean
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'achievement' | 'leaderboard' | 'points' | 'reminder' | 'tree' | 'general' | 'marketplace'
          title?: string
          message?: string
          action_url?: string | null
          read?: boolean
          timestamp?: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          username: string
          user_image: string | null
          content: string
          media_url: string | null
          media_type: 'image' | 'video' | 'audio' | 'file' | null
          thumbnail_url: string | null
          likes: number
          is_official: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          user_image?: string | null
          content: string
          media_url?: string | null
          media_type?: 'image' | 'video' | 'audio' | 'file' | null
          thumbnail_url?: string | null
          likes?: number
          is_official?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          user_image?: string | null
          content?: string
          media_url?: string | null
          media_type?: 'image' | 'video' | 'audio' | 'file' | null
          thumbnail_url?: string | null
          likes?: number
          is_official?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          eco_points: number
          rank: string
          joined_date: string
          streak: number
          quiz_streak: number
          last_active: string
          profile_image: string | null
          chat_enabled: boolean
          last_quiz_date: string | null
          global_leaderboard_position: number | null
          local_leaderboard_position: number | null
          leaderboard_last_updated: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          eco_points?: number
          rank?: string
          joined_date?: string
          streak?: number
          quiz_streak?: number
          last_active?: string
          profile_image?: string | null
          chat_enabled?: boolean
          last_quiz_date?: string | null
          global_leaderboard_position?: number | null
          local_leaderboard_position?: number | null
          leaderboard_last_updated?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          eco_points?: number
          rank?: string
          joined_date?: string
          streak?: number
          quiz_streak?: number
          last_active?: string
          profile_image?: string | null
          chat_enabled?: boolean
          last_quiz_date?: string | null
          global_leaderboard_position?: number | null
          local_leaderboard_position?: number | null
          leaderboard_last_updated?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tree_milestones: {
        Row: {
          id: string
          user_id: string
          count: number
          species: string | null
          latitude: number | null
          longitude: number | null
          achieved_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          count: number
          species?: string | null
          latitude?: number | null
          longitude?: number | null
          achieved_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          count?: number
          species?: string | null
          latitude?: number | null
          longitude?: number | null
          achieved_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}