import { useState, useEffect } from 'react';
import { blogService, Blog } from '../services/api/blogService';

export const useBlog = (blogId: string | undefined) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await blogService.getBlogById(blogId);
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  return { blog, loading, error };
};