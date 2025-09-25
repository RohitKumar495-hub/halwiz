"use client";
import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import {
    FaEye,
    FaEyeSlash,
    FaLock,
    FaUserCircle,
    FaUser,
} from "react-icons/fa";
import InputField from "../components/InputField";
import toast from "react-hot-toast";

interface SignupFormProps {
    onSignupSuccess: () => void;
}

const SignupPage = ({ onSignupSuccess }: SignupFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const Icon = showPassword ? FaEye : FaEyeSlash;

    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
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
        console.log("Formdata", formData);

        if (!formData.fullName) return toast.error("FullName is requried");

        if (!formData.userName) return toast.error("UserName is requried");

        if (!formData.email) return toast.error("Email is requried");

        if (!formData.email.includes("gmail.com")) {
            toast.error("Email is not vaild.");
            return;
        }

        if (!formData.password) return toast.error("Password is requried");

        if (formData.password.length < 4)
            return toast.error("Password must be greater than 4 digits");

        const loadingToast = toast.loading("Registering user...");



    };

    return (
        <div className="p-6 grid gap-6">
            <div className="grid gap-2">
                <h1 className="text-2xl font-semibold">Create an account</h1>
                <p className="text-gray-500 font-medium">Sign up to get started</p>
            </div>
            <form className="grid gap-4" onSubmit={handleSubmit}>
                <InputField
                    name="Full Name"
                    Icon={FaUserCircle}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange("fullName")}
                />
                <InputField
                    name="Username"
                    Icon={FaUser}
                    placeholder="Choose a username"
                    value={formData.userName}
                    onChange={handleChange("userName")}
                />
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
                <button
                    className="bg-[#ebbf13] px-4 py-2 rounded-sm text-white font-semibold cursor-pointer hover:bg-[#997f15]"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupPage;
