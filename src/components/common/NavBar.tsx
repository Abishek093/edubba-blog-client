
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import logo from '../../assets/lOGO.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserQuery } from '../../store/services/authApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    const accessToken = Cookies.get('accessToken');
    const navigate = useNavigate();
    
    const { data: userData } = useGetUserQuery(undefined, {
        skip: !accessToken
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="mr-6 pl-52">
                        <a href="/" className="flex items-center">
                            <img src={logo} alt="Logo" className="h-24 w-auto" />
                        </a>
                    </div>
                    <div className="pl-44 relative">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Discover news, articles and more..."
                                className="bg-[#E2E8F0] pl-10 pr-4 py-2 rounded-md h-14 w-80 focus:outline-none"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <div className="pl-48 absolute inset-y-0 left-0 flex items-center">
                                <button type="submit" className="focus:outline-none">
                                    <BsSearch className="text-gray-400" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex items-center pr-40">
                    <a href="/" className="mx-3 hover:text-blue-500">Home</a>
                    {(isAuthenticated && user) || accessToken ? (
                        <a href={`/profile/${user?._id || userData?._id}`} className="mx-3 hover:text-blue-500">
                            {user?.username || userData?.username}
                        </a>
                    ) : (
                        <a href="/auth" className="mx-3 hover:text-blue-500">Login</a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;