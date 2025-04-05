import { useState, useEffect, useCallback } from 'react';
import { blogService, Blog } from '../services/api/blogService';

export const useSearchBlogs = (query: string) => {
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const searchBlogs = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }
    
    try {
      setLoading(true);
      const data = await blogService.searchBlogs(searchQuery);
      setSearchResults(data.blogs);
      setTotalResults(data.totalCount);
      setError(null);
    } catch (err) {
      console.error('Error searching blogs:', err);
      setError('Failed to search blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchBlogs(query);
  }, [query, searchBlogs]);

  return {
    searchResults,
    loading,
    error,
    totalResults,
    searchBlogs
  };
};
