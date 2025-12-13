import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserBlogCard from '../components/UserBlogCard';
import ProtectedRoute from '../components/ProtectedRoute';
import { FiPlus } from 'react-icons/fi';

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUserProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserBlogs();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setUserLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        setUserProfile(response.data.user);
        // Update auth context with fresh user data
        const updatedUser = {
          ...authUser,
          ...response.data.user,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to auth context user if API fails
      if (authUser) {
        setUserProfile(authUser);
      }
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getUserBlogs();
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      setError('Failed to load your blogs. Please try again later.');
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      setDeletingId(blogId);
      const response = await blogAPI.deleteBlog(blogId);
      if (response.data.success) {
        // Remove blog from state immediately for instant UI update
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      } else {
        alert('Failed to delete blog. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(error.response?.data?.message || 'Failed to delete blog. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const displayUser = user || authUser;

  if (!displayUser) {
    return null;
  }

  // Get joined date from user data
  const getJoinedDate = () => {
    if (displayUser.createdAt) {
      return new Date(displayUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return 'Recently';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          {/* User Profile Section */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 mb-12">
            {userLoading ? (
              <div className="text-center py-8">
                <div className="text-white text-xl">Loading profile...</div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {displayUser.fullname?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {displayUser.fullname || 'User'}
                  </h1>
                  <p className="text-gray-400 mb-1">@{displayUser.username}</p>
                  <p className="text-gray-400 mb-4">{displayUser.email}</p>
                  <p className="text-gray-500 text-sm">
                    Joined on {getJoinedDate()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User's Blogs Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                My Blogs ({blogs.length})
              </h2>
              <button
                onClick={() => navigate('/blog/create')}
                className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                <FiPlus className="w-5 h-5" />
                <span>Create Blog</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="text-white text-xl">Loading your blogs...</div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-400 text-xl mb-4">{error}</div>
                <button
                  onClick={fetchUserBlogs}
                  className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 bg-gray-900 rounded-lg border border-gray-800">
                <div className="text-gray-400 text-xl mb-4">You haven't created any blogs yet.</div>
                <button
                  onClick={() => navigate('/blog/create')}
                  className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-semibold mx-auto"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Create Your First Blog</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <UserBlogCard
                    key={blog._id}
                    blog={blog}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

