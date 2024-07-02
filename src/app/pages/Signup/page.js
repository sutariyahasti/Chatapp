"use client";
import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEdgeStore } from "@/app/lib/edgestore";
import CustomInput from "@/app/componant/common/CustomInput";
import User from "@/public/images/User";
import Password from "@/public/images/Password";
import UseName from "@/public/images/UseName";
import CustomButton from "@/app/componant/common/CustomButton";
import { notify } from "@/app/componant/common/Toast";

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
      notify("User registered successfully!", "success");

      setName("");
      setEmail("");
      setPassword("");
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("id", data.newUser.insertedId);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("url", urls.url);

      // if (file) {
      router.push(`/pages/ChatBoard/${data.newUser.insertedId}`);
      // } else {
      //   router.push(`/pages/profileupload/${data.newUser.insertedId}`);
      // }
    } else {
      notify(data.error, "error");
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
      <div className="w-full xl:w-1/2 xl:p-40 p-4 bg-white">
        <h2 className="mb-2 text-3xl font-bold">Sign Up</h2>
        <a href="/pages/Login" className="mb-10 block font-bold text-gray-600">
          Have an account? Login
        </a>

        <CustomInput
          name="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          leftIcon={<UseName />}
        />
        <CustomInput
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          leftIcon={<User />}
        />
        <CustomInput
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          leftIcon={<Password />}
        />

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
          <div className="text-center text-gray-700 my-2">
            Uploading image...
          </div>
        )}
        {urls && urls?.url && (
          <div className="flex m-2 w-full justify-center items-center">
            <img
              src={urls.url}
              alt=""
              className="w-20 h-20 rounded-full  border border-white items-center"
            />
            {/* {file && (
              <div className="m-4 text-gray-700 text-center">
                Selected file: {file.name}
              </div>
            )} */}
          </div>
        )}
        <CustomButton
          variant="primary"
          size="lg"
          isPill={false}
          onClick={handleSubmit}
          className="w-full rounded-2xl"
          isDisabled={loading}
        >
          Sign Up
        </CustomButton>
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
