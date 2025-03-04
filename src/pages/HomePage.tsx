import { useState } from "react";
import Navbar from "../components/common/NavBar";
import CategoryCards from "../components/blog/CategoryCards";
import FeaturedArticle from "../components/blog/FeaturedArticle";
import BlogList from "../components/blog/BlogList";

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    if (category === '') {
      // Handle empty string as clearing the filter
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <CategoryCards 
          onCategorySelect={handleCategorySelect} 
          selectedCategory={selectedCategory} 
        />
        <div className="mt-10">
          <FeaturedArticle />
        </div>
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedCategory ? `${selectedCategory} Articles` : "Latest Articles"}
            </h2>
            {selectedCategory && (
              <button
                onClick={clearCategoryFilter}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <span className="mr-1">×</span> Clear filter
              </button>
            )}
          </div>
          <BlogList selectedCategory={selectedCategory} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;