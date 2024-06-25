import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import ProfilePage from "./ProfilePage";
import NoProfile from "@/public/images/noprofile.jsx";
import ChatHeader from "./ChatHeader";

function RightSide({
  ChatRoomDetails,
  fetchChatRoomsById,
  loginuser,
  getprofile,
  profileuser,
  messages,
  setMessages,
}) {
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [loginUserProfile, setLoginUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
console.log(ChatRoomDetails,"ChatRoomDetails");
  useEffect(() => {
    const socketInstance = io.connect(url, {
      reconnection: true,
      reconnectionAttempts: 10, // Number of reconnection attempts before giving up
      reconnectionDelay: 1000, // Time delay in milliseconds between each reconnection attempt
    });

    setSocket(socketInstance);

    socketInstance.on("initial-chats", (initialChats) => {
      setChats(initialChats);
    });

    socketInstance.on("chat", (message) => {
      setChats((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("name");
      const id = localStorage.getItem("id");
      const profileImage = localStorage.getItem("url");

      if (name) setUsername(name);
      if (id) setUserId(id);
      if (profileImage) setLoginUserProfile(profileImage);
    }
  }, [userId]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${url}/api/getAllChats`, {
          params: { id: ChatRoomDetails?._id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setChats(response.data.userChats);
          setError(null);
        } else {
          setError(response.data.error || "An error occurred");
        }
      } catch (err) {
        setError("An error occurred while fetching the chat messages.");
      }
    };

    if (ChatRoomDetails) {
      fetchChats();
    }
  }, [ChatRoomDetails]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setMessages(value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (messages) {
      try {
        const response = await axios.post(
          `${url}/api/sendchat`,
          {
            chatRoom: ChatRoomDetails?._id,
            sender: loginuser?._id || userId,
            content: messages,
            chatName: ChatRoomDetails?.chatName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        socket.emit("chat", JSON.stringify(response.data.message));
        setMessages("");
      } catch (error) {
        console.error("Error sending chat:", error.message);
      }
    }
  };

  const getUserProfile = (id) => {
    getprofile(id);
    setProfile(true);
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      // Manually format the date as dd MMM yyyy
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
  };

  return (
    <>
      {profile && (
        <ProfilePage
          profile={profile}
          setProfile={setProfile}
          profileuser={profileuser}
        />
      )}
     <div className="flex flex-col h-screen bg-white">
  {ChatRoomDetails && ChatRoomDetails._id ? (
    <>
      {/* ChatHeader */}
      <div className="h-[12%]">
        <ChatHeader
          ChatRoomDetails={ChatRoomDetails}
          userId={userId}
          getUserProfile={getUserProfile}
        />
      </div>

      {/* chatwindow */}
      <div className="flex flex-col-reverse justify-between h-[80%] overflow-auto">
        <div className="flex flex-col mt-5">
          <div className="w-full px-5 text-center justify-between"></div>
          {chats &&
            chats.length > 0 &&
            chats.map((msg, index) => {
              const msgDate = new Date(msg?.createdAt);
              const currentDate = new Date();
              const differenceInDays = Math.floor(
                (currentDate - msgDate) / (24 * 60 * 60 * 1000)
              );

              let dayTag = "";
              if (differenceInDays === 0) {
                dayTag = "Today";
              } else if (differenceInDays === 1) {
                dayTag = "Yesterday";
              } else if (differenceInDays < 7) {
                dayTag = msgDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                });
              } else {
                dayTag = msgDate.toLocaleDateString("en-IN");
              }

              return (
                <>
                  <div className="mt-4 flex justify-center">
                    {(index === 0 ||
                      formatDate(chats[index - 1]?.createdAt) !==
                        formatDate(msg.createdAt)) && (
                      <div className="bg-[#1a1615] text-white py-1 px-4 rounded-3xl">
                        {formatDate(msg.createdAt)}
                      </div>
                    )}
                  </div>
                  <div
                    key={index}
                    className={`flex mb-4 ${
                      userId === msg?.sender
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {userId !== msg?.sender && (
                      <img
                        src={ChatRoomDetails.user1url}
                        className="object-cover h-8 w-8 rounded-full m-2 mt-7"
                        alt="🙂"
                      />
                    )}
                    <div className={"flex flex-col"}>
                      {dayTag && (
                        <span
                          className={`text-xs text-gray-400 flex mx-2 ${
                            userId === msg?.sender
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {dayTag}
                        </span>
                      )}
                      <div
                        className={`py-0 px-0 m-0 ${
                          userId === msg?.sender
                            ? "bg-[#e68e7f] rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white flex flex-row"
                            : "bg-gradient-to-tr from-slate-300 to-slate-200 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black flex flex-row"
                        }`}
                      >
                        <div className="m-2 p-2 ">{msg?.content}</div>
                        <span className="font-thin text-xs p-1 mt-6 mr-1">
                          {`${msgDate.toLocaleTimeString("en-IN", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                            timeZone: "Asia/Kolkata",
                          })}`}
                        </span>
                      </div>
                    </div>
                    {userId === msg?.sender && (
                      <img
                        src={loginUserProfile}
                        className="object-cover h-8 w-8 rounded-full m-2 mt-7"
                        alt="🙂"
                      />
                    )}
                  </div>
                  
                </>
              );
            })}
        </div>
        
      </div>
      

      {/* sendchat */}
      <div className="h-[8%] border-t-2 bg-white border-gray-200 pt-4 px-2 mb-2 flex flex-row fixed bottom-0 w-full">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </button>
          </span>
          <input
            type="text"
            name="chat"
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-[#e4a69c] rounded-md py-3"
            value={messages}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="relative flex-2 right-0 items-center inset-y-0 flex">
          <button
            type="button"
            className="inline-flex m-1 text-white items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out border-2 bg-[#5a5269] border-[#5a5269] hover:bg-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 text-white hover:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              ></path>
            </svg>
          </button>

          <button
            type="button"
            className="inline-flex m-1 items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out bg-[#5a5269] text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 text-white hover:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex m-1 items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out bg-[#5a5269] text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 text-white hover:text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-gradient-to-tr from-[#e68e7f] to-[#df3618] hover:bg-blue-400 focus:outline-none"
            onClick={handleSendMessage}
          >
            <span className="font-bold">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6 ml-2 transform rotate-90"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  ) : (
    <div className="flex-grow flex items-center justify-center">
      <h1>Hello(❁´◡`❁)</h1>
    </div>
  )}
</div>

    </>
  );
}

export default RightSide;

