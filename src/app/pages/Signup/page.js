"use client";
import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEdgeStore } from "@/app/lib/edgestore";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // image upload
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState();
  const [loading, setLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  console.log(urls?.url, "urls?.url");

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true); 
      console.log("Uploading:", file.name);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      console.log(res);
      setUrls({
        url: res.url,
        thumbnailUrl: res.thumbnailUrl,
      });
      setLoading(false); 
    }
  };

  useEffect(() => {
    handleUpload();
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, url: urls && urls.url }),
    });

    const data = await response.json();
    const receivedToken = data.token;

    if (response.status === 201) {
      setSuccess("User registered successfully!");
      setName("");
      setEmail("");
      setPassword("");
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("id", data.result.insertedId);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("url", urls.url);

      if (file) {
        router.push(`/pages/ChatBoard/${data.result.insertedId}`);
      } else {
        router.push(`/pages/profileupload/${data.result.insertedId}`);
      }
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="mx-auto flex w-full h-screen flex-col md:max-w-full md:flex-row md:pr-2">
      <div className="max-w-full w-full xl:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 text-white">
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
          }}
        />
      </div>
      <div className="w-full xl:w-1/2 p-40 bg-white">
        <h2 className="mb-2 text-3xl font-bold">Sign Up</h2>
        <a href="/pages/Login" className="mb-10 block font-bold text-gray-600">
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
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="pl-2 outline-none border-none"
            type="text"
            name="name"
            id="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
            id="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-1">
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
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center w-full rounded-2xl my-4">
          <label className="flex flex-col rounded-lg border-4 w-full border-dashed p-10 group text-center">
            <div className="text-center flex flex-col items-center justify-center">
              <p className="pointer-none text-gray-500">
                <a href="#" className="text-blue-600 hover:underline">
                  Upload profile
                </a>
              </p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        <div className="h-[6px] w-44 border rounded overflow-hidden mt-4 mx-auto">
          <div
            className="h-full bg-blue-500 transition-all duration-150 text-white"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        {loading && ( 
          <div className="text-center text-gray-700 my-2">Uploading image...</div>
        )}
        {urls && urls?.url && (
          <div className="flex m-2">
            <img
              src={urls.url}
              alt=""
              className="w-20 h-20 rounded-full border border-white"
            />
            {file && (
              <div className="m-4 text-gray-700 text-center">
                Selected file: {file.name}
              </div>
            )}
          </div>
        )}
        <button
          className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;

// components/SignupForm.js
// "use client";
// import { useState } from "react";

// export function SignupForm() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const res = await fetch("/api/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, email, password }),
//     });

//     const data = await res.json();

//     if (res.status === 201) {
//       setSuccess("User registered successfully!");
//       setName("");
//       setEmail("");
//       setPassword("");
//     } else {
//       setError(data.error);
//     }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Signup</button>
//       </form>
//     </div>
//   );
// }
