"use client";
import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { FaEye, FaEyeSlash, FaLock, FaUserCircle } from "react-icons/fa";
import InputField from "../components/InputField";
import toast from "react-hot-toast";
import axios from "axios";
import BASE_URL from "@/config/axios"; // ✅ Import base URL

interface SignupFormProps {
  onSignupSuccess: () => void;
}

const SignupPage = ({ onSignupSuccess }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? FaEye : FaEyeSlash;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  type FieldName = keyof typeof formData;

  const handleChange =
    (fieldName: FieldName) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!formData.fullName) return toast.error("Full Name is required");
    if (!formData.email) return toast.error("Email is required");
    if (!formData.email.includes("gmail.com"))
      return toast.error("Email must be a valid Gmail address");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 4)
      return toast.error("Password must be at least 4 characters long");

    const loadingToast = toast.loading("Registering user...");

    try {
      // ✅ Send correct payload to backend
      const response = await axios.post(
        `${BASE_URL}/auth/register`, // ✅ use config instead of hardcoding
        {
          name: formData.fullName, // 👈 backend expects "name"
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.dismiss(loadingToast);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || "Signup successful!");

        // ✅ If backend sends a token, save it
        if (response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        if (response.data?.userId) {
          localStorage.setItem("userId", response.data.userId);
        }

        // ✅ Trigger callback after signup
        onSignupSuccess();
      } else {
        toast.error(response.data?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Signup Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Signup failed!");
    }
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
