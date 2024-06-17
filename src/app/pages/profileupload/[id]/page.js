"use client";

import { useEdgeStore } from "@/app/lib/edgestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState();
  const id = localStorage.getItem("id")
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  // const handleUpload = async (e) => {
  //   e.preventDefault(); // Prevent form submission
  //   if (file) {
  //     console.log("Uploading:", file.name);
  //     const res = await edgestore.publicFiles.upload({
  //       file,
  //       onProgressChange: (progress) => {
  //         setProgress(progress);
  //       },
  //     });
  //     console.log(res);
  //     setUrls({
  //       url: res.url,
  //       thumbnailUrl: res.thumbnailUrl,
  //     });
  //   }
  // };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      console.log("Uploading:", file.name);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      console.log(res,"res00000"); // Verify `res` structure here
      setUrls({
        url: res.url,
        thumbnailUrl: res.thumbnailUrl,
      });
  
      // Ensure that the fetch call to `/api/UploadProfilePicture` is correctly formatted
      const saveRes = await fetch("/api/UploadProfilePicture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: res.url, 
          userId : id,
        }),
      });
  
      const saveProfile = await saveRes.json();
      console.log(saveProfile, "profile");
      if (saveRes.status == 201) {
        router.push(`/pages/ChatBoard/${id}`);
      }else{
        alert(saveProfile.error)
      }
    }
  };
  

  return (
    <div className="">
      
      <div
        className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1621243804936-775306a8f2e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")`,
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              Upload your Profile!
            </h2>
            {/* <p className="mt-2 text-sm text-gray-400">
              Lorem ipsum is placeholder text.
            </p> */}
            {urls && urls?.url && (
        <div className="flex m-2 justify-center">
          <img
            src={urls.url}
            alt=""
            className="w-36 sm:w-36 h-36 sm:h-36 rounded-full border border-white"
          />
        </div>
      )}
          </div>
          <form className="mt-4 space-y-3" action="#" method="POST">
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Attach Document
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      <img
                        className="has-mask h-36 object-center"
                        src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                        alt="freepik image"
                      />
                    </div>
                    <p className="pointer-none text-gray-500">
                      <span className="text-sm">Drag and drop</span> files here{" "}
                      <br /> or{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        select a file
                      </a>{" "}
                      from your computer
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              <span>File type: doc, pdf, types of images</span>
            </p>
            <div>
              <button
                onClick={handleUpload}
                className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                Upload
              </button>
            </div>
          </form>
          <div className="h-[6px] w-44 border rounded overflow-hidden mt-4 mx-auto">
            {progress !== 0 && (
              <div
                className="h-full bg-blue-500 transition-all duration-150"
                style={{
                  width: `${progress}%`,
                }}
              />
            )}
          </div>
          {file && (
            <div className="mb-4 text-gray-700 text-center">
              Selected file: {file.name}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
