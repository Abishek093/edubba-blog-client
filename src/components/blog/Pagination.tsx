import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage: number;
    let endPage: number;
    
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`w-8 h-8 rounded-full ${
            i === currentPage 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } flex items-center justify-center focus:outline-none transition-colors`}
          onClick={() => onPageChange(i)}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    
    if (startPage > 1) {
      pages.unshift(
        <button
          key="first"
          className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 focus:outline-none"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.splice(1, 0,
          <span key="ellipsis-start" className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
        );
      }
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
        );
      }
      
      pages.push(
        <button
          key="last"
          className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 focus:outline-none"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex items-center space-x-4 mt-8" role="navigation" aria-label="Pagination">
      <button 
        className={`text-gray-700 hover:text-blue-500 ${currentPage === 1 ? 'text-gray-300 pointer-events-none' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex space-x-1">
        {renderPageNumbers()}
      </div>
      
      <button 
        className={`text-gray-700 hover:text-blue-500 ${currentPage === totalPages ? 'text-gray-300 pointer-events-none' : ''}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;