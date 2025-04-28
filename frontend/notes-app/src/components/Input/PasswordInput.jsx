import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative w-full mb-4">
      {/* Input Field */}
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Toggle Icon */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
        {isShowPassword ? (
          <FaRegEye
            size={22}
            className="hover:text-blue-600 transition-colors"
            onClick={toggleShowPassword}
          />
        ) : (
          <FaRegEyeSlash
            size={22}
            className="hover:text-blue-600 transition-colors"
            onClick={toggleShowPassword}
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
