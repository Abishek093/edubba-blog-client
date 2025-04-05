import { useState, useEffect, useCallback } from 'react';
import { blogService, Blog } from '../services/api/blogService';

export const useBlogs = (initialCategory: string | null = null) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogs();
      setBlogs(data.blogs);
      setTotalCount(data.totalCount);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter blogs when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = blogs.filter(blog => 
        blog.tags.some(tag => {
          const normalizedTag = tag.toLowerCase();
          const normalizedCategory = selectedCategory.toLowerCase();
          
          return normalizedTag === normalizedCategory || 
                 normalizedTag === normalizedCategory.replace(' & ', ' and ') ||
                 normalizedTag.includes(normalizedCategory) ||
                 normalizedCategory.includes(normalizedTag);
        })
      );
      setFilteredBlogs(filtered);
      setTotalCount(filtered.length);
    } else {
      setFilteredBlogs(blogs);
      setTotalCount(blogs.length);
    }
  }, [selectedCategory, blogs]);

  // Initial fetch
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs: filteredBlogs,
    loading,
    error,
    totalCount,
    selectedCategory,
    setSelectedCategory,
    refetch: fetchBlogs
  };
};
