import React, { useState } from "react";
import Link from "next/link";

const CreateChatRoomModal = ({ signeduser, createChatroom, setOpen }) => {
  const [chatname, setChatname] = useState("");

  const handleInputChange = (event) => {
    const name = event.target.value;
    setChatname(name);
  };

  return (
    <div id="myModal" className="modal fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="modal-container mx-auto">
        <div className="modal-content bg-white w-96 mx-auto mt-10 p-4 rounded-lg z-[100]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Create Chatroom with your favs!</h2>
            <button
              onClick={() => {
                setOpen(false);
              }}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <input
            className="pl-2 outline-none border-none"
            type="text"
            name="chatName"
            id="name"
            placeholder="name"
            onChange={handleInputChange}
            value={chatname}
          />
          <div className="truncate overflow-auto">
            {signeduser &&
              signeduser.length > 0 &&
              signeduser.map((user, index) => (
                <Link
                  href={"#"}
                  className="flex items-center gap-5 py-3 px-7.5 hover:bg-[#f3d2be] dark:hover:bg-purple-100"
                  onClick={() => createChatroom(user._id, user.name, user.url)}
                  key={index}
                >
                  <div className="relative m-2 h-14 w-14 rounded-full">
                    <img
                      src={`${user.url}`}
                      alt="User"
                      className="rounded-full h-14 w-14"
                    />
                    <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
                  </div>
                  <div className="flex flex-1 items-center justify-between border-b-2 border-[#f3d2be] ">
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {user.name}
                      </h5>
                    </div>
                    <div className="flex h-5 w-5 m-2 items-center justify-center rounded-full bg-[#50c960]"></div>
                  </div>
                </Link>
              ))}
          </div>
          <button
            type="submit"
            className="block w-full bg-[#e68e7f] mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
            onClick={createChatroom}
          >
            create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatRoomModal;
