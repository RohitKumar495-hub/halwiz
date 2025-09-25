"use client";
import React, { useState } from "react";
import InputField from "../components/InputField";
import { IoIosMail } from "react-icons/io";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const Icon = showPassword ? FaEye : FaEyeSlash;

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    type fieldName = keyof typeof formData;

    const handleChange =
        (fieldName: fieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({
                ...prev,
                [fieldName]: e.target.value,
            }));
        };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("formData", formData);

        if (!formData.email) return toast.error("Email is requried");

        if (!formData.email.includes("gmail.com")) {
            toast.error("Email is not vaild.");
            return;
        }

        if (!formData.password) return toast.error("Password is requried");

        const loadingToast = toast.loading("Logging in....");

    };

    return (
        <div className="p-6 grid gap-6">
            <div className="grid gap-2">
                <h1 className="text-2xl font-semibold">Welcome back!</h1>
                <p className="text-gray-500 font-medium">
                    Sign in to your account to continue
                </p>
            </div>
            <form className="grid gap-4" onSubmit={handleSubmit}>
                <InputField
                    name="Email"
                    Icon={IoIosMail}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange("email")}
                />
                <div className="grid gap-1">
                    <label htmlFor="password">Password</label>
                    <div className="flex items-center w-full border-2 p-2 rounded-md border-gray-300 gap-4">
                        <FaLock size={20} color="gray" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full font-semibold rounded-sm outline-none"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange("password")}
                        />
                        <Icon
                            size={25}
                            color="gray"
                            className="cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            id="remember"
                            className="w-5 h-4 cursor-pointer"
                        />
                        <label htmlFor="remember" className="font-medium">
                            Remember me
                        </label>
                    </div>
                    <Link href={"/forgot-password"}>
                        <p className="text-[#6a6bf2]">Forgot password?</p>
                    </Link>
                </div>
                <button
                    className="bg-[#ebbf13] px-4 py-2 rounded-sm text-white font-semibold cursor-pointer hover:bg-[#997f15]"
                    type="submit"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
