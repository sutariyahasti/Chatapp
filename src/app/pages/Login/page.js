"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;
  console.log(`${url}/api/login`);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    token: "",
  });

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
        localStorage.setItem("id", data.user._id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("password",data.user.password);
        localStorage.setItem("url",data.user.url);

        router.push(`/pages/ChatBoard/${data.user._id}`);
      // router.push(`/pages/profileupload/${data.user._id}`);

        console.log("Login successful");
      } else {
        alert("Login failed. Please check your credentials.");
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };
  return (
    <>
      <div className="h-screen md:flex">
        <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
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
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
          <form className="bg-white">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Hello Again!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Welcome Back
            </p>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                type="text"
                name="email"
                id=""
                placeholder="Email Address"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none"
                type="text"
                name="password"
                id=""
                placeholder="Password"
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              href="/Login"
              className="block w-full bg-gradient-to-tr from-blue-800 to-purple-700 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
              onClick={handleSubmit}
            >
              Login
            </button>
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
}

export default Login;
