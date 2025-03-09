import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm'; 
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] w-full max-w-[1000px] mx-auto my-10 shadow-lg rounded-xl overflow-hidden">
      <div className="flex flex-col justify-center items-center text-center bg-[#667ceb] text-white p-10 flex-1">
        <h1 className="text-4xl font-bold text-[#2E2E2E] mb-5 tracking-wide" onClick={()=>{navigate('/')}}>E.DUB.BA</h1>
        <p className="text-lg italic mb-10 leading-relaxed text-white opacity-90">
          Where thoughts become elegantly crafted stories
        </p>
        <div className="flex items-center w-4/5 mt-10">
          <div className="flex-1 h-px bg-[#2E2E2E] opacity-50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E2E2E] mx-2.5"></div>
          <div className="flex-1 h-px bg-[#2E2E2E] opacity-50"></div>
        </div>
      </div>
      
      <div className="flex flex-col bg-white p-10 flex-[1.2]">
        <div className="flex mb-8 border-b border-gray-200">
          <button 
            className={`flex-1 py-4 text-base font-semibold ${
              activeTab === 'login' 
                ? 'text-[#667ceb] opacity-100 relative after:content-[""] after:absolute after:bottom-[-1px] after:left-1/4 after:w-1/2 after:h-[3px] after:bg-[#667ceb]' 
                : 'text-[#2E2E2E] opacity-70'
            } transition-all duration-300`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            className={`flex-1 py-4 text-base font-semibold ${
              activeTab === 'signup' 
                ? 'text-[#667ceb] opacity-100 relative after:content-[""] after:absolute after:bottom-[-1px] after:left-1/4 after:w-1/2 after:h-[3px] after:bg-[#667ceb]' 
                : 'text-[#2E2E2E] opacity-70'
            } transition-all duration-300`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>
        
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
        
        <div className="mt-auto text-center text-sm text-[#2E2E2E] opacity-70">
          <p>© {new Date().getFullYear()} E.DUB.BA Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
