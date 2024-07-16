"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import User from "@/public/images/User";
import Password from "@/public/images/Password";
import CustomButton from "@/app/componant/common/CustomButton";
import CustomInput from "@/app/componant/common/CustomInput";
import { notify } from "@/app/componant/common/Toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;
  console.log(`${url}/api/login`);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    token: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.status === 200) {
        notify("Login successfully!", "success");
        localStorage.setItem("id", data.user._id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("password", data.user.password);
        localStorage.setItem("url", data.user.url);

        router.push(`/pages/ChatBoard/${data.user._id}`);
        // router.push(`/pages/profileupload/${data.user._id}`);

        console.log("Login successful");
      } else {
        notify(data.error, "error");
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred", error);
      notify(error, "error");
    }
  };
  return (
    <>
      <div className="h-screen md:flex">
        <div className="relative overflow-hidden lg:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
          <div>
            <h1 className="text-white font-bold text-4xl font-sans">
              Connect With Your Fav Ones!
            </h1>
            <p className="text-white mt-1">
              The most popular peer to peer lending at chats....
            </p>
          </div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        <div className="flex lg:w-1/2 w-full h-screen justify-center py-10  items-center bg-white">
          <form className="bg-white lg:w-3/5 w-full md:p-20 p-10 lg:p-0 ">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Hello Again!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Welcome Back
            </p>

            <CustomInput
              name="email"
              type="email"
              onChange={handleInputChange}
              placeholder="Email Address"
              leftIcon={<User />}
            />
            <CustomInput
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleInputChange}
              placeholder="Password"
              leftIcon={<Password />}
              rightIcon={
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              }
            />
           
            <CustomButton
              variant="primary"
              size="lg"
              isPill={false}
              onClick={handleSubmit}
              className="w-full rounded-2xl"
            >
              Login
            </CustomButton>
            <Link
              href="/pages/Signup"
              className="text-sm ml-2 hover:text-blue-500 cursor-pointer"
            >
              Don't have account ?
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
