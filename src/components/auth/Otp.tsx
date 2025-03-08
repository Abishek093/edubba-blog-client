import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {useOtpVerificationMutation } from '../../store/services/authApi';
import { toast } from 'sonner'

const OTP_EXPIRY_KEY = 'otpExpiryTime'

const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const storedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const currentTime = Math.floor(Date.now() / 1000); 
      const remainingTime = expiryTime - currentTime;
      return remainingTime > 0 ? remainingTime : 0; 
    }
    return 120; 
  });  

  // const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const location = useLocation();
  const email = location.state?.email || 'user@example.com';
  const [otpVerification, { isLoading}] = useOtpVerificationMutation();
  const navigate = useNavigate()

  useEffect(()=>{
    if(!location.state?.email){
        navigate('/auth')
    }
  },[location.state])
  
  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem(OTP_EXPIRY_KEY); 
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000); 
    const expiryTime = currentTime + timeLeft;
    localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiryTime - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(timer); 
  }, [timeLeft]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.substring(0, 1);
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      if (digits.length < 6) {
        inputRefs.current[digits.length]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    try {
      const response = await otpVerification({ otp: enteredOtp, email }).unwrap();
      console.log('OTP Verified:', response);
      toast.success('OTP verified successfully! Login to continue');
      navigate('/auth');
    } catch (error: any) {
      console.error('OTP Verification Failed:', error);
      const errorMessage = error.data?.error || 'OTP verification failed. Please try again.';
      toast.error(errorMessage, {
        description: error.status === 404 ? 'The OTP may have expired.' : undefined,
      });
    }
  };

  // const handleResend = () => {
  //   if (timeLeft === 0) {
  //     setIsResending(true);
  //     setTimeout(() => {
  //       setTimeLeft(120); 
  //       setIsResending(false);
  //       setOtp(Array(6).fill(''));
  //       inputRefs.current[0]?.focus();
  //     }, 1000);
  //   }
  // };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // const formatTime = (seconds: number): string => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  // };

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] w-full max-w-[1000px] mx-auto my-10 shadow-lg rounded-xl overflow-hidden">
      <div className="flex-1 bg-[#667ceb] text-white p-10 flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-bold text-[#2E2E2E] mb-5 tracking-wide">E.DUB.BA</h1>
        <p className="text-lg italic mb-10 leading-relaxed opacity-90">
          Where thoughts become elegantly crafted stories
        </p>
        <div className="flex items-center mt-10 w-4/5">
          <div className="flex-1 h-px bg-[#2E2E2E] opacity-50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E2E2E] mx-2.5"></div>
          <div className="flex-1 h-px bg-[#2E2E2E] opacity-50"></div>
        </div>
      </div>

      {/* Right Section - OTP Verification */}
      <div className="flex-[1.2] bg-white p-10 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">Verify Your Account</h2>
          <p className="text-[#2E2E2E] opacity-70">
            We've sent a 6-digit verification code to your email
          </p>
          <p className="font-medium text-[#2E2E2E]">{email}</p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-4 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el; 
              }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-[#667ceb] focus:ring-1 focus:ring-[#667ceb] focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6 && isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-300 ${
            otp.join('').length === 6
              ? 'bg-[#667ceb] text-white hover:bg-[#600010]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Verify
        </button>

        {/* <div className="mt-8 text-center">
          <p className="text-[#2E2E2E] opacity-70 mb-2">
            Didn't receive the code? {timeLeft > 0 && `(${formatTime(timeLeft)})`}
          </p>
          <button
            onClick={handleResend}
            disabled={timeLeft > 0 || isResending}
            className={`font-semibold ${
              timeLeft > 0 || isResending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#667ceb] hover:underline'
            }`}
          >
            {isResending ? 'Resending...' : 'Resend Code'}
          </button>
        </div> */}

        <div className="mt-auto text-center text-sm text-[#2E2E2E] opacity-70">
          <p>© {new Date().getFullYear()} E.DUB.BA Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;