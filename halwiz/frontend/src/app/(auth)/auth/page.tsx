"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa6";
import LoginPage from "../components/login";
import SignupPage from "../components/Signup";

const AuthContainer = () => {
    const [isLogin, setIsLogin] = useState(true);
    const handleSignupSuccess = () => {
        setIsLogin(true);
    };

    return (
        <div className="h-screen flex items-center justify-center flex-col gap-4">
            {/* logo */}
            <div className="">
                <div>
                    <Link href="/">
                        <img src="/logo.png" alt="" className='w-25' />
                    </Link>
                </div>
            </div>
            <div className="bg-white shadow-2xl rounded-xl w-94">
                <div className="flex w-full justify-between items-center font-semibold">
                    <button
                        className={`w-[50%] p-4 ${isLogin
                            ? "border-b-2 border-[#ebbf13] text-[#ebbf13]"
                            : "bg-gray-50"
                            } rounded cursor-pointer`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`w-[50%] p-4 ${!isLogin
                            ? "border-b-2 border-[#ebbf13] text-[#ebbf13]"
                            : "bg-gray-50"
                            } rounded cursor-pointer`}
                        onClick={() => setIsLogin(false)}
                    >
                        Signup
                    </button>
                </div>

                {isLogin ? (
                    <LoginPage />
                ) : (
                    <SignupPage onSignupSuccess={handleSignupSuccess} />
                )}
            </div>
        </div>
    );
};

export default AuthContainer;
