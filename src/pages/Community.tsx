import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { 
  Search, UserPlus, UserMinus, Heart, MessageCircle, 
  Share2, AlertCircle, Camera, Mic, Video, X, 
  Image as ImageIcon, File
} from 'lucide-react';
import toast from 'react-hot-toast';

const MediaRecorder: React.FC<{
  onSave: (blob: Blob, type: 'audio' | 'video') => void;
  type: 'audio' | 'video';
}> = ({ onSave, type }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video' ? { facingMode: 'user' } : false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        onSave(blob, type);
        stopStream();
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="relative bg-black/20 rounded-lg p-4">
      {type === 'video' && (
        <video
          ref={videoPreviewRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg mb-4"
        />
      )}
      
      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
          >
            {type === 'video' ? <Video size={20} /> : <Mic size={20} />}
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2"
          >
            <X size={20} />
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};

const CreatePost: React.FC = () => {
  const { user, addPost } = useAuthStore();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | 'file' | null>(null);
  const [showRecorder, setShowRecorder] = useState<'audio' | 'video' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    setMediaFile(file);
    
    if (file.type.startsWith('image/')) {
      setMediaType('image');
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
      setMediaPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('audio/')) {
      setMediaType('audio');
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setMediaType('file');
      setMediaPreview(null);
    }
  };

  const handleRecordingSave = (blob: Blob, type: 'audio' | 'video') => {
    const file = new File([blob], `recorded-${type}.webm`, {
      type: type === 'video' ? 'video/webm' : 'audio/webm'
    });
    handleFileSelect(file);
    setShowRecorder(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isUploading || (!content.trim() && !mediaFile)) return;

    try {
      setIsUploading(true);
      
      // In a real implementation, you would upload the media file to storage
      // and get a URL back. For now, we'll use the preview URL.
      await addPost({
        userId: user.id,
        username: user.username,
        userImage: user.profileImage,
        content,
        mediaUrl: mediaPreview || undefined,
        mediaType: mediaType || undefined,
        thumbnailUrl: mediaType === 'video' ? mediaPreview || undefined : undefined,
        likes: 0,
        isOfficial: false
      });

      toast.success('Post created successfully!');
      setContent('');
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType(null);
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (mediaPreview && mediaType !== 'image') {
      URL.revokeObjectURL(mediaPreview);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white/5 rounded-lg p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your eco-journey..."
        className="w-full bg-transparent border border-white/10 rounded-lg p-3 min-h-[100px] focus:outline-none focus:border-[#D0FD3E]"
      />

      {mediaPreview && (
        <div className="relative mt-4">
          <button
            type="button"
            onClick={removeMedia}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full"
          >
            <X size={20} className="text-white" />
          </button>
          
          {mediaType === 'image' && (
            <img src={mediaPreview} alt="Preview" className="w-full rounded-lg" />
          )}
          {mediaType === 'video' && (
            <video src={mediaPreview} controls className="w-full rounded-lg" />
          )}
          {mediaType === 'audio' && (
            <audio src={mediaPreview} controls className="w-full" />
          )}
          {mediaType === 'file' && (
            <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
              <File size={20} />
              <span>{mediaFile?.name}</span>
            </div>
          )}
        </div>
      )}

      {showRecorder && (
        <div className="mt-4">
          <MediaRecorder
            type={showRecorder}
            onSave={handleRecordingSave}
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1 flex gap-2">
          <input
            type="file"
            id="file-upload"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          
          <button
            type="button"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            <ImageIcon size={20} />
          </button>
          
          <button
            type="button"
            onClick={() => setShowRecorder('video')}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            <Camera size={20} />
          </button>
          
          <button
            type="button"
            onClick={() => setShowRecorder('audio')}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            <Mic size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={isUploading || (!content && !mediaFile)}
          className="px-4 py-2 bg-[#D0FD3E] text-black rounded-lg font-medium hover:bg-[#D0FD3E]/90 disabled:opacity-50"
        >
          {isUploading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

const MediaPost: React.FC<{ post: any }> = ({ post }) => {
  const { user, updatePost, addComment } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const newLikes = isLiked ? post.likes - 1 : post.likes + 1;
      await updatePost(post.id, { likes: newLikes });
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Failed to update likes');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      await addComment(post.id, {
        userId: user.id,
        username: user.username,
        content: commentText
      });
      
      setCommentText('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const formatTimestamp = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.userImage || '/trashtrek.png'}
            alt={post.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium">{post.username}</h3>
            <p className="text-sm text-gray-400">
              {formatTimestamp(post.createdAt)}
            </p>
          </div>
        </div>

        <p className="mb-4">{post.content}</p>

        {post.mediaUrl && (
          <div className="mb-4">
            {post.mediaType === 'image' && (
              <img
                src={post.mediaUrl}
                alt="Post content"
                className="w-full rounded-lg"
              />
            )}
            {post.mediaType === 'video' && (
              <video
                src={post.mediaUrl}
                controls
                className="w-full rounded-lg"
              />
            )}
            {post.mediaType === 'audio' && (
              <audio src={post.mediaUrl} controls className="w-full" />
            )}
            {post.mediaType === 'file' && (
              <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                <File size={20} />
                <a
                  href={post.mediaUrl}
                  download
                  className="text-[#D0FD3E] hover:underline"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-gray-400">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            {post.likes}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1"
          >
            <MessageCircle size={20} />
            {post.comments?.length || 0}
          </button>
          <button className="flex items-center gap-1">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-white/10 p-4">
          <div className="space-y-4 mb-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-2">
                  <strong className="text-[#D0FD3E]">{comment.username}:</strong>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/10 rounded px-3 py-2 focus:outline-none focus:bg-white/20"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-[#D0FD3E] text-black rounded-lg font-medium hover:bg-[#D0FD3E]/90 disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const UserSearch: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you would make an API call to search users
  };

  if (!user) return null;

  return (
    <div>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search eco-warriors..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 pl-10 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D0FD3E]"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      <div className="space-y-3">
        {/* Placeholder for search results */}
        <div className="text-center text-gray-400 py-8">
          Search for other eco-warriors to connect with!
        </div>
      </div>
    </div>
  );
};

const PostsFeed: React.FC<{ official: boolean }> = ({ official }) => {
  const { user, allPosts, loadPosts } = useAuthStore();
  
  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);
  
  const filteredPosts = allPosts.filter(post => post.isOfficial === official);

  return (
    <div className="space-y-6">
      {filteredPosts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          {official ? 
            "No official announcements yet!" : 
            "Be the first to share your eco-journey!"}
        </div>
      ) : (
        filteredPosts.map((post) => (
          <MediaPost key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

const Community: React.FC = () => {
  const { user, getChatEligibility } = useAuthStore();
  const [activeTab, setActiveTab] = useState('feed');
  const { eligible, reason } = getChatEligibility();

  if (!eligible) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="p-6 bg-red-500/10 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={20} />
            <h2 className="font-semibold">Community Access Locked</h2>
          </div>
          <p className="mt-2 text-gray-300">{reason}</p>
          {user && user.ecoPoints < 1000 && (
            <div className="mt-4 bg-white/5 rounded-lg p-4">
              <h3 className="font-medium text-[#D0FD3E]">How to Unlock:</h3>
              <p className="mt-2">
                Collect litter and complete eco-challenges to earn more points!
                You need {1000 - user.ecoPoints} more points to join the community.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex gap-2 border-b border-white/10">
        {[
          { id: 'feed', label: 'Community Feed' },
          { id: 'official', label: 'Official Updates' },
          { id: 'search', label: 'Find Friends' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-[#D0FD3E] text-[#D0FD3E]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <>
          <CreatePost />
          <PostsFeed official={false} />
        </>
      )}

      {activeTab === 'official' && (
        <>
          <div className="mb-4 p-4 bg-[#D0FD3E]/10 rounded-lg">
            <h2 className="text-[#D0FD3E] font-semibold">TrashTrek Official</h2>
            <p className="text-sm text-gray-400">
              Stay updated with the latest news and announcements
            </p>
          </div>
          <PostsFeed official={true} />
        </>
      )}

      {activeTab === 'search' && <UserSearch />}
    </div>
  );
};

export default Community;