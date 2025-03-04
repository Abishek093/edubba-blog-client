import React from "react";
import { IUserResponse } from "../../store/services/authApi";
import defaultProfilePic from '../../assets/profile.png'; 

interface UserProfileHeaderProps {
  user: IUserResponse | null | undefined;
  onCreateBlogClick: () => void;
  onEditProfileClick: () => void;
  isCurrentUser: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ 
  user, 
  onCreateBlogClick, 
  onEditProfileClick,
  isCurrentUser 
}) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={user.profilePicture || defaultProfilePic}
            alt={`${user.username}'s profile`}
            className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-600 mt-1">{user.profession || "Writer"}</p>
              <p className="text-gray-500 mt-4 mb-4 max-w-2xl">
                {user.bio || "No bio provided yet. Tell the world about yourself!"}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
              {isCurrentUser && (
                <>
                  <button
                    onClick={onCreateBlogClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Blog
                  </button>
                  
                  <button
                    onClick={onEditProfileClick}
                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;