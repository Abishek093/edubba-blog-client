import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/NavBar';
import BlogCard from '../components/blog/BlogCard'; 
import axiosInstance from '../store/services/axiosInstance';
import Pagination from '../components/blog/Pagination';

interface Blog {
  _id: string;
  title: string;
  brief: string;
  content: string;
  imageUrl?: string;
  userId: string;
  tags: string[];
  author: string;
  authorDetails?: {
    profilePicture?: string;
    profession?: string;
  };
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';
  
  const [searchResults, setSearchResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 9;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/blogs/search?query=${encodeURIComponent(query)}`);
        
        if (response.data.blogs && response.data.totalCount) {
          setSearchResults(response.data.blogs);
          setTotalResults(response.data.totalCount);
        } else {
          setSearchResults(response.data);
          setTotalResults(response.data.length);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error searching blogs:', err);
        setError('Failed to search blogs');
        setLoading(false);
      }
    };

    fetchSearchResults();
    setCurrentPage(1);
  }, [query]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            {query ? `Search results for "${query}"` : 'Search Results'}
          </h1>
          <p className="text-gray-600 mt-2">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">Searching...</div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : searchResults.length === 0 ? (
          <div className="p-4 text-center">
            {query ? `No results found for "${query}". Try a different search term.` : 'Enter a search term to find blogs.'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentResults.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing {Math.min(resultsPerPage, searchResults.length - (currentPage - 1) * resultsPerPage)} of {totalResults} results
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
