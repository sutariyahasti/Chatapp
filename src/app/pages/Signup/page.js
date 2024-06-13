"use client";
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import axios from "axios";

const Signup = ({ socket }) => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [image, setImage] = useState(null);
  const handleimageChange = (e) => {
    setImage(e.target.files[0]);
  };

console.log(formData,"formData");
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password } = formData;

    const formDataForUpload = new FormData();
    formDataForUpload.append("name", name);
    formDataForUpload.append("email", email);
    formDataForUpload.append("password", password);
    // formDataForUpload.append("image", image);

    //sends the username and socket ID to the Node.js server
    // socket.emit("newUser", { formData, socketID: socket.id });

    const response = await axios.post(
      "http://localhost:3000/api/signup",
      // `${url}/api/signup`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const receivedToken = response.data.token;
    if (response.status === 200) {
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("signUserInfo", JSON.stringify(formData));
      localStorage.setItem("id", JSON.stringify(response.data._id));
      router.push(`/ChatBoard/${response.data._id}`);
    } else {
      alert("email is alredy exist");
    }
  };
  return (
    <>
      <div className="mx-auto flex w-full h-screen  flex-col md:max-w-full md:flex-row md:pr-2">
        <div className="max-w-full w-full xl:w-1/2  bg-gradient-to-tr from-blue-800 to-purple-700  text-white ">
          <div
            className=" w-full h-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
            }}
          />
        </div>
        <div className="w-full xl:w-1/2 p-40 bg-white  ">
          <h2 className="mb-2 text-3xl font-bold">Sign Up</h2>
          <a href="/LoginPage" className="mb-10 block font-bold text-gray-600">
            Have an account? Login
          </a>

          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none"
              type="text"
              name="name"
              id="name"
              placeholder="Full name"
              onChange={handleInputChange}
              value={formData.name}
            />
          </div>

          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none"
              type="text"
              name="email"
              id="email"
              placeholder="Email Address"
              onChange={handleInputChange}
              value={formData.email}
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
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl my-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none"
              type="file"
              name="pic"
              id="pic"
              placeholder="profile"
              onChange={handleimageChange}
            />
          </div>

          <button
            className="hover:shadow-blue-600/40 rounded-xl bg-gradient-to-tr from-blue-800 to-purple-700 px-8 py-3 font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;

// {
//   "name": "Hasti",
//   "email": "sutariyahasti973797@gmail.com",
//   "password": "12345"
// }