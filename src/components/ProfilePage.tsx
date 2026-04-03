import React, { useState, useEffect } from 'react';
import { Camera, Save, Upload, X } from 'lucide-react';

interface Profile {
  username: string;
  bio: string;
  profilePic: string;
}

interface Post {
  id: string;
  type: 'photo' | 'video';
  content: string; // base64 or URL
  caption: string;
  timestamp: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    username: '',
    bio: '',
    profilePic: '',
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [showBuiltIn, setShowBuiltIn] = useState(false);

  // Built-in profile pictures (placeholder URLs)
  const builtInPics = [
    'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=A',
    'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=B',
    'https://via.placeholder.com/150/45B7D1/FFFFFF?text=C',
    'https://via.placeholder.com/150/96CEB4/FFFFFF?text=D',
    'https://via.placeholder.com/150/FECA57/FFFFFF?text=E',
    'https://via.placeholder.com/150/FF9FF3/FFFFFF?text=F',
    'https://via.placeholder.com/150/54A0FF/FFFFFF?text=G',
    'https://via.placeholder.com/150/5F27CD/FFFFFF?text=H',
    'https://via.placeholder.com/150/00D2D3/FFFFFF?text=I',
    'https://via.placeholder.com/150/FF9F43/FFFFFF?text=J',
  ];

  useEffect(() => {
    const savedProfile = localStorage.getItem('studyai-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    const savedPosts = localStorage.getItem('studyai-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('studyai-profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile({ ...profile, profilePic: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const selectBuiltInPic = (pic: string) => {
    setProfile({ ...profile, profilePic: pic });
    setShowBuiltIn(false);
  };

  const handlePostUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const newPost: Post = {
        id: Date.now().toString(),
        type: selectedFile.type.startsWith('video/') ? 'video' : 'photo',
        content: result,
        caption,
        timestamp: new Date().toISOString(),
      };
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('studyai-posts', JSON.stringify(updatedPosts));
      setSelectedFile(null);
      setCaption('');
    };
    reader.readAsDataURL(selectedFile);
  };

  const deletePost = (id: string) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('studyai-posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={profile.profilePic || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Profile'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <button
                  onClick={() => setShowBuiltIn(!showBuiltIn)}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Bio (max 50 characters)"
                    value={profile.bio}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        setProfile({ ...profile, bio: e.target.value });
                      }
                    }}
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="flex items-center px-3 py-1 bg-gray-200 rounded cursor-pointer"
                    >
                      <Upload size={16} className="mr-1" />
                      Upload Photo
                    </label>
                    <button
                      onClick={saveProfile}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      <Save size={16} className="mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold">{profile.username || 'Student'}</h1>
                  <p className="text-gray-600 mt-1">{profile.bio || 'No bio yet'}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Built-in Pictures */}
          {showBuiltIn && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Choose a profile picture:</h3>
              <div className="grid grid-cols-5 gap-2">
                {builtInPics.map((pic, index) => (
                  <img
                    key={index}
                    src={pic}
                    alt={`Profile ${index + 1}`}
                    className="w-16 h-16 rounded-full cursor-pointer object-cover"
                    onClick={() => selectBuiltInPic(pic)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload New Post */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Post</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handlePostUpload}
              disabled={!selectedFile}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={profile.profilePic || 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=P'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{profile.username || 'Student'}</h3>
                  <p className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => deletePost(post.id)}
                  className="ml-auto text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
              {post.type === 'photo' ? (
                <img src={post.content} alt="Post" className="w-full rounded-lg" />
              ) : (
                <video src={post.content} controls className="w-full rounded-lg" />
              )}
              <p className="mt-2">{post.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;