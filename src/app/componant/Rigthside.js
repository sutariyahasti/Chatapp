import axios from "axios";
import React, { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage.js";
import Link from "next/link.js";
import NoProfile from "@/public/images/noprofile.jsx";

function Rigthside({
  socket,
  ChatRoomDetails,
  fetchChatRoomsById,
  loginuser,
  getprofile,
  profileuser,
  messages,
  setMessages,
}) {
  const [inputvalue, setInputvalue] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [userChatNames, setUserChatNames] = useState([]);
  const [currentDayLabel, setCurrentDayLabel] = useState("");
  const [profile, setProfile] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [loginUserProfile, setLoginUserProfile] = useState(null);

  useEffect(() => {
    // Check if window is defined to ensure we're on the client-side
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("name");
      const id = localStorage.getItem("id");
      const profileImage = localStorage.getItem("url");

      if (name) {
        setUsername(name);
      }
      if (id) {
        setUserId(id);
      }
      if (profileImage) {
        setLoginUserProfile(profileImage);
      }
    }
  }, [userId]);

  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${url}/api/getAllChats`,
          { params: { id: ChatRoomDetails?._id } },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setChats(response.data.userChats);
        const data = await response.json();
        if (response.status == 200) {
          console.log("Fetched data:", data); // Debugging line
          setChats(data.userChats);
          setError(null);
        } else {
          setError(data.error || "An error occurred");
        }
      } catch (err) {
        setError("An error occurred while fetching the chat messages.");
      } finally {
        // setLoading(false);
      }
    };

    if (ChatRoomDetails) {
      fetchChats();
    }
  }, [ChatRoomDetails, messages]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setMessages(value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const sendMessage = (message) => {
    // Emit a message to the server
    // socket.emit("messageResponse", message);
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

        setInputvalue(response.data.message.content);
        sendMessage(response.data.message.content);
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

  // Helper function to get the day tag
  const getDayTag = (msgDate, currentDate) => {
    const differenceInDays = Math.floor(
      (currentDate - msgDate) / (24 * 60 * 60 * 1000)
    );
    // const differenceInDays = currentDate == msgDate;

    if (differenceInDays === 0) {
      return "Today";
    } else if (differenceInDays === 1) {
      return "Yesterday";
    } else if (differenceInDays < 7) {
      return msgDate.toLocaleDateString("en-IN", { weekday: "long" });
    } else {
      return msgDate.toLocaleDateString("en-IN");
    }
  };

  const [day, setDay] = useState("hello");

  return (
    <>
      {profile && (
        <ProfilePage
          profile={profile}
          setProfile={setProfile}
          profileuser={profileuser}
        />
      )}
      <div className=" flex pb-2 sm:pb-6 justify-between  bg-white flex-col h-screen ">
        {ChatRoomDetails && ChatRoomDetails?._id ? (
          <>
            <div className="flex sm:items-center  fixed w-[80%] bg-[#5a5269] z-[5] justify-between p-6  border-b-2 border-gray-200">
              <div className="relative flex items-center space-x-4">
                <div className="relative">
                  <span className="absolute text-green-500 right-0 bottom-0">
                    <svg width="20" height="20">
                      <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                    </svg>
                  </span>

                  {ChatRoomDetails.url ? (
                    <img
                      src={ChatRoomDetails && ChatRoomDetails.url}
                      alt=""
                      className="w-8 sm:w-16 h-10 sm:h-16 rounded-full border border-white"
                    />
                  ) : (
                    <NoProfile />
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <div className="text-2xl mt-1 flex items-center">
                    <span className="text-white mr-3">
                      {/* {ChatRoomDetails && ChatRoomDetails?.chatName} */}
                      {ChatRoomDetails?.user1 === userId
                        ? ChatRoomDetails?.user2Name
                        : ChatRoomDetails?.user1Name}
                    </span>
                  </div>
                  <span className="text-lg text-white">Web Developer</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Link
                  href="/Blog"
                  className="inline-flex items-center justify-center rounded-lg border h-10 w-30 px-1 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  Go to Blog
                </Link>
                <Link
                  href="/BlogPost"
                  className="inline-flex items-center justify-center rounded-lg border h-10 w-30 px-1 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  Create Blog
                </Link> */}
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  onClick={() =>
                    getUserProfile(
                      ChatRoomDetails?.user1 === loginuser?._id
                        ? ChatRoomDetails?.user2
                        : ChatRoomDetails?.user1
                    )
                  }
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className=" relative top-20 w-full  flex  flex-col-reverse justify-between h-[82%] overflow-auto">
              <div className="flex flex-col mt-5">
                {/* <h1>
                  {chats && (
                    <span
                      className={`top-[500px] sticky text-gray-400 bg-black flex mx-2 justify-center`}
                    >
                      {day}
                    </span>
                  )}
                </h1> */}
                <div className=" relative top-80 w-full px-5 text-center justify-between"></div>
                {chats &&
                  chats.length > 0 &&
                  chats.map((msg, index) => {
                    const msgDate = new Date(msg?.createdAt);
                    const currentDate = new Date();
                    const differenceInDays = Math.floor(
                      (currentDate - msgDate) / (24 * 60 * 60 * 365)
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
                      // Display the actual date for chats older than a week
                      dayTag = msgDate.toLocaleDateString("en-IN");
                    }

                    return (
                      <>
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
                              src={ChatRoomDetails.url}
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
                              className={`py-0 px-0 m-0  ${
                                userId === msg?.sender
                                  ? "bg-[#e68e7f]  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white flex flex-row"
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
                          {userId == msg?.sender && (
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
          </>
        ) : (
          <div className=" relative top-80 w-full px-5 text-center justify-between">
            <h1>Hello(❁´◡`❁)</h1>
          </div>
        )}

        <div className="border-t-2 bg-white border-gray-200 pt-4 px-2 mb-2 fixed flex flex-row  bottom-5 right-0 w-[80%]  sm:mb-0">
          <div className="relative flex-1 w-100 ">
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
          <div className="relative flex-2 right-0 items-center inset-y-0  sm:flex ">
            <button
              type="button"
              className="inline-flex m-1 text-white items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out border-2 bg-[#5a5269] border-[#5a5269]  hover:bg-gray-300 focus:outline-none"
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
              className="inline-flex m-1 items-center justify-center rounded-full h-10 w-10 transition duration-500 bg-[#5a5269] ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
      </div>
    </>
  );
}

export default Rigthside;

{
  /* image attechment */
}
{
}
{
  /* file attechment */
}
{
  /* <div className="flex items-start gap-2.5">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                    alt="Bonnie Green image"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Bonnie Green
                        </span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          11:46
                        </span>
                      </div>
                      <div className="flex items-start my-2.5 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
                        <div className="me-2">
                          <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                            <svg
                              fill="none"
                              aria-hidden="true"
                              className="w-5 h-5 flex-shrink-0"
                              viewBox="0 0 20 21"
                            >
                              <g clip-path="url(#clip0_3173_1381)">
                                <path
                                  fill="#E2E5E7"
                                  d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z"
                                />
                                <path
                                  fill="#B0B7BD"
                                  d="M15.024 5.5h3.75l-5-5v3.75c0 .688.562 1.25 1.25 1.25z"
                                />
                                <path
                                  fill="#CAD1D8"
                                  d="M18.774 9.25l-3.75-3.75h3.75v3.75z"
                                />
                                <path
                                  fill="#F15642"
                                  d="M16.274 16.75a.627.627 0 01-.625.625H1.899a.627.627 0 01-.625-.625V10.5c0-.344.281-.625.625-.625h13.75c.344 0 .625.281.625.625v6.25z"
                                />
                                <path
                                  fill="#fff"
                                  d="M3.998 12.342c0-.165.13-.345.34-.345h1.154c.65 0 1.235.435 1.235 1.269 0 .79-.585 1.23-1.235 1.23h-.834v.66c0 .22-.14.344-.32.344a.337.337 0 01-.34-.344v-2.814zm.66.284v1.245h.834c.335 0 .6-.295.6-.605 0-.35-.265-.64-.6-.64h-.834zM7.706 15.5c-.165 0-.345-.09-.345-.31v-2.838c0-.18.18-.31.345-.31H8.85c2.284 0 2.234 3.458.045 3.458h-1.19zm.315-2.848v2.239h.83c1.349 0 1.409-2.24 0-2.24h-.83zM11.894 13.486h1.274c.18 0 .36.18.36.355 0 .165-.18.3-.36.3h-1.274v1.049c0 .175-.124.31-.3.31-.22 0-.354-.135-.354-.31v-2.839c0-.18.135-.31.355-.31h1.754c.22 0 .35.13.35.31 0 .16-.13.34-.35.34h-1.455v.795z"
                                />
                                <path
                                  fill="#CAD1D8"
                                  d="M15.649 17.375H3.774V18h11.875a.627.627 0 00.625-.625v-.625a.627.627 0 01-.625.625z"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_3173_1381">
                                  <path
                                    fill="#fff"
                                    d="M0 0h20v20H0z"
                                    transform="translate(0 .5)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            Flowbite Terms & Conditions
                          </span>
                          <span className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                            12 Pages
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              className="self-center"
                              width="3"
                              height="4"
                              viewBox="0 0 3 4"
                              fill="none"
                            >
                              <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                            </svg>
                            18 MB
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              className="self-center"
                              width="3"
                              height="4"
                              viewBox="0 0 3 4"
                              fill="none"
                            >
                              <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                            </svg>
                            PDF
                          </span>
                        </div>
                        <div className="inline-flex self-center items-center">
                          <button
                            className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                            type="button"
                          >
                            <svg
                              className="w-4 h-4 text-gray-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                              <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Delivered
                      </span>
                    </div>
                  </div>
                  <button
                    id="dropdownMenuIconButton"
                    data-dropdown-toggle="dropdownDots"
                    data-dropdown-placement="bottom-start"
                    className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 4 15"
                    >
                      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                  </button>
                  <div
                    id="dropdownDots"
                    className="z-10 flex bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownMenuIconButton"
                    >
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Reply
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Forward
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Copy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Report
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </div> */
}
