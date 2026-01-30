import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { FiImage, FiSave, FiX } from 'react-icons/fi';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setFetchLoading(true);
      const response = await blogAPI.getBlogById(id);
      if (response.data.success) {
        const blog = response.data.blog;
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          coverImage: null,
        });
        if (blog.coverImage) {
          setExistingImage(blog.coverImage);
        }
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      setError('Failed to load blog. Please try again.');
      console.error('Error fetching blog:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'coverImage' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, coverImage: file });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setExistingImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const response = await blogAPI.updateBlog(id, formData);
      if (response.data.success) {
        navigate('/profile');
      } else {
        setError(response.data.message || 'Failed to update blog');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <ProtectedRoute>
        <Loader className="min-h-screen" />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-heading text-white">Edit Story</h1>
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <FiX className="mr-2" /> Cancel
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Image Upload */}
          <div className="relative group">
            <div className={`
                 w-full h-64 sm:h-80 rounded-xl border-2 border-dashed border-slate-700 
                 flex flex-col items-center justify-center cursor-pointer overflow-hidden
                 transition-colors hover:border-primary-500/50 hover:bg-slate-800/50
                 ${(preview || existingImage) ? 'border-none' : ''}
              `}>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {(preview || existingImage) ? (
                <img
                  src={preview || existingImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <FiImage className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <p className="font-medium">Click to upload cover image</p>
                </div>
              )}

              {(preview || existingImage) && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <p className="text-white font-medium">Click to change image</p>
                </div>
              )}
            </div>
          </div>

          <Card className="p-6 sm:p-8 space-y-6 bg-dark-card/50">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your story title..."
              className="text-2xl font-bold placeholder:font-normal"
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Tell your story..."
                required
                rows="15"
                className="w-full bg-dark-bg border border-slate-700 rounded-lg px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none leading-relaxed text-lg"
              />
            </div>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" loading={loading} size="lg" className="px-8">
              <FiSave className="mr-2" /> Update Story
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EditBlog;
