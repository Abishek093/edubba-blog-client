import { useState, useEffect, useCallback } from 'react';
import { blogService, Blog } from '../services/api/blogService';
import { toast } from 'sonner';

export const useUserBlogs = (userId: string) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBlogs = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await blogService.getUserBlogs(userId);
      setBlogs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user blogs:', err);
      setError('Failed to load your blogs');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  const deleteBlog = async (blogId: string) => {
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      toast.success('Blog deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error('Failed to delete blog');
      return false;
    }
  };

  const addBlog = (newBlog: Blog) => {
    setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
  };

  return {
    blogs,
    loading,
    error,
    refetch: fetchUserBlogs,
    deleteBlog,
    addBlog
  };
};