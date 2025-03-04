import React from 'react';
import { FaLightbulb } from "react-icons/fa";
import { SlEnergy } from "react-icons/sl";
import { GiAstronautHelmet } from "react-icons/gi";
import { GrTechnology } from "react-icons/gr";

interface CategoryCardProps {
    title: string;
    icon: React.ReactNode;
    isAd?: boolean;
    onClick: () => void;
    isSelected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    title,
    icon,
    isAd = false,
    onClick,
    isSelected = false
}) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-md w-full h-24 flex flex-col items-center justify-center relative cursor-pointer
                ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={onClick}
        >
            {isAd && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-0.5 text-xs rounded-md">
                    Ad
                </div>
            )}
            <div className={`${isSelected ? 'text-blue-600' : 'text-blue-500'} mb-2`}>{icon}</div>
            <h3 className={`${isSelected ? 'text-blue-600 font-medium' : 'text-gray-600'} text-base`}>{title}</h3>
        </div>
    );
};

interface CategoryCardsProps {
    onCategorySelect: (category: string) => void;
    selectedCategory: string | null; // Add this prop
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ onCategorySelect, selectedCategory }) => {
    // Remove the local state since we're now using the parent's state

    const handleCategoryClick = (category: string) => {
        // If clicking on already selected category, deselect it
        if (selectedCategory === category) {
            onCategorySelect(''); // This will clear the filter
        } else {
            onCategorySelect(category);
        }
    };

    const categories = [
        {
            title: "Physics & Mathematics",
            icon: <SlEnergy className='w-8 h-8' />,
            isAd: true,
        },
        {
            title: "Innovation",
            icon: <FaLightbulb className='w-8 h-8' />,
            isAd: true,
        },
        {
            title: "Space",
            icon: <GiAstronautHelmet className='w-8 h-8' />,
            isAd: true,
        },
        {
            title: "Technology",
            icon: <GrTechnology className='w-8 h-8' />,
            isAd: true,
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
                <div
                    key={category.title}
                    className="relative z-0 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-gray-400"
                >
                    <CategoryCard
                        title={category.title}
                        icon={category.icon}
                        isAd={category.isAd}
                        onClick={() => handleCategoryClick(category.title)}
                        isSelected={selectedCategory === category.title}
                    />
                </div>
            ))}
        </div>
    );
};

export default CategoryCards;