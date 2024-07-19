import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import ProfilePage from "./ProfilePage";
import NoProfile from "@/public/images/noprofile.jsx";
import ChatHeader from "./ChatHeader";
import UseName from "@/public/images/UseName";
import CreateChatRoomModal from "./CreateChatRoomModal";
import CustomButton from "./common/CustomButton";
import { notify } from "./common/Toast";
import { database, storage } from "@/firebase/firebase";
import { child, get, onValue, ref, remove, serverTimestamp } from "firebase/database";
import addData from "@/firebase/utils/addData";
import updateData from "@/firebase/utils/updateData";
import { formatDate } from "../lib/FormatTime";
import { FaEllipsisV, FaTimesCircle } from "react-icons/fa";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
function RightSide({
  ChatRoomDetails,
  fetchChatRoomsById,
  loginuser,
  getprofile,
  profileuser,
  messages,
  setMessages,
  setleftsideShow,
  setRightsideShow,
  rightsideShow,
  signeduser,
}) {
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [loginUserProfile, setLoginUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showFaEllipsisV ,setShowFaEllipsisV] = useState(null)
  const [image, setImage] = useState()

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
    if (!ChatRoomDetails?.id) return;

    const dbRef = ref(database); // Reference to the root of your Realtime Database
    const messagesRef = child(dbRef, 'Messages');

    // Set up a real-time listener
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();

      // Process and set the messages
      const chatMessages = [];
      if (messages) {
        Object.keys(messages).forEach((key) => {
          const message = messages[key];
          if (message.chatRoom === ChatRoomDetails.id) {
            chatMessages.push({ ...message, id: key });
          }
        });
        // Sort messages by createdAt timestamp
        chatMessages.sort((a, b) => a.createdAt - b.createdAt);
      }

      setChats(chatMessages);
    }, (error) => {
      console.error('Error fetching chatrooms:', error.message);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [ChatRoomDetails]);

  function generateChatroomId(userId, id) {
    const timestamp = Date.now(); // Get the current timestamp
    // const randomValue = Math.random().toString(36).substring(2, 15); // Generate a random value
    return `${timestamp}`; // Combine all elements to form the unique ID
  }
  const createChatroom = async (id, name, url) => {
    const collection = 'Chatrooms';
    const chatroomId = generateChatroomId(userId, id) // Create a unique ID based on user IDs
    const data = {
      chatName: username,
      user1Name: username,
      user2Name: name,
      user1: userId,
      user2: id,
      user1url: loginUserProfile,
      user2url: url,
    };

    const { result, error } = await addData(collection, chatroomId, data);
    if (result) {
      console.log("Document written with ID: ", chatroomId);
      notify("User created");
      setOpen(false);
    } else {
      console.log("Error in creating chatrooms: ", error);
      notify(`You have already chat with ${name} ${id}`);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setMessages(value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const removeUndefinedFields = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
  };

  const handleSendMessage = async () => {
    const randomValue = Math.random().toString(36).substring(2, 15);
    const messageId = `${ChatRoomDetails?.id}_${randomValue}`;
    const timestamp = Date.now();
    const collection = "Chatrooms";
    const messagesCollection = "Messages";
    const chatroomId = `${ChatRoomDetails?.id}`;
    let imageUrl = null;
  
    try {
      if (!ChatRoomDetails?.id || !userId) {
        throw new Error("Missing required fields: ChatRoomDetails, loginuser, or messages.");
      }
  
      if (image) {
        const storageReference = storageRef(storage, `images/${messageId}/${image.name}`);
        await uploadBytes(storageReference, image);
        imageUrl = await getDownloadURL(storageReference);
      }
  
      // Create the message object
      const message = {
        chatRoom: ChatRoomDetails.id,
        sender: userId,
        receiver: ChatRoomDetails.user1 === userId ? ChatRoomDetails.user2 : ChatRoomDetails.user1,
        content: messages,
        imageUrl: imageUrl,
        chatName: ChatRoomDetails.chatName,
        createdAt: timestamp
      };
  
      // Add the message to the Messages collection (or however you are storing messages)
      const { result, error } = await addData(messagesCollection, messageId, message);
  
      if (error) {
        throw new Error(`Failed to add message to ${messagesCollection}: ${error}`);
      }
  
      // Update the latestMessages field in the chatroom
      const chatroomUpdate = {
        latestMessages: message.content,
        createdAt: timestamp
      };
  
      const { result: chatroomResult, error: chatroomError } = await updateData(collection, chatroomId, chatroomUpdate);
  
      if (chatroomError) {
        throw new Error(`Failed to update chatroom ${collection}: ${chatroomError}`,"error");
      }
  
      notify("Message sent");
      setMessages("");
      setImage("");
      setSelectedImage("");
  
    } catch (error) {
      console.log("Error in sending message: ", error);
      notify(`Error in sending message: ${error.message}`,"error");
    }
  };
  
  const [selectedImage, setSelectedImage] = useState(null);
  console.log(selectedImage, "selectedImage");
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserProfile = (id) => {
    getprofile(id);
    setProfile(true);
  };

  const showLeftside = () => {
    setleftsideShow(true);
    setRightsideShow(false);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChatDelet = async (id) => {
    try {
      await remove(ref(database, `Messages/${id}`));
      notify('Chat deleted successfully');
    } catch (error) {
      notify('Error deleting chat :', "error");
      console.log('Error deleting chat :', error);
    }
    setDropdownOpen(false);
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
      <div className={`p-4 h-screen  lg:block ${rightsideShow === true ? "block" : "hidden"
        }`}>
        <div
          className={`lg:flex flex-col h-full py-10 px-3 md:p-3 rounded-xl  bg-[#cec6c63a] md:col-span-6 sm:col-span-6 no-scrollbar  ${rightsideShow === true ? "flex" : "hidden"
            }`}
        >
          {ChatRoomDetails && ChatRoomDetails.id ? (
            <>
              {/* ChatHeader */}
              <div className="md:h-[12%] lg:[12%] ">
                <ChatHeader
                  ChatRoomDetails={ChatRoomDetails}
                  userId={userId}
                  getUserProfile={getUserProfile}
                  showLeftside={showLeftside}
                />
              </div>

              {/* chatwindow */}
              <div className="flex flex-col-reverse justify-between  h-[80%] md:h-[82%] lg:h-[82%] overflow-auto no-scrollbar ">
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
                          <div className="my-1 flex justify-center">
                            {(index === 0 ||
                              formatDate(chats[index - 1]?.createdAt) !==
                              formatDate(msg.createdAt)) && (
                                <div className="bg-[#d9d9d985] text-gray-800 py-1 px-4 rounded-3xl">
                                  {formatDate(msg.createdAt)}
                                </div>
                              )}
                          </div>
                          <div
                            key={index}
                            className={`flex text-justify ${userId === msg?.sender
                              ? "justify-end "
                              : "justify-start "
                              }`}
                            onMouseLeave={() => { setShowFaEllipsisV(null); setDropdownOpen(false) }}

                          >
                            {userId !== msg?.sender && (
                              <img
                                src={ChatRoomDetails.user1url}
                                className="object-cover h-8 w-8 rounded-full m-2 "
                                alt="🙂"
                              />
                            )}
                            <div className={"flex flex-col"}>
                              {/* {dayTag && (
                              <span
                                className={`text-xs text-gray-400 flex mx-2 ${
                                  userId === msg?.sender
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                {dayTag}===
                              </span>
                            )} */}
                              <div
                                className={`py-0 px-0 m-0 ${userId === msg?.sender
                                  ? "bg-[#0606063b] rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white flex flex-row"
                                  : "bg-[#959595c7] rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black flex flex-row"
                                  }`}
                              >
                                <div>
                                {msg?.imageUrl &&
                                  <img
                                    src={msg.imageUrl}
                                    className="object-cover h-[200px] w-[200px] rounded-3xl m-2  "
                                    alt="🙂"
                                  /> }
                                  <div className={`flex flex-row  ${msg?.content ? "justify-between" : "justify-end"} align-middle `}>
                                  {msg?.content && 
                                  <div className="m-2 p-1 lg:max-w-[400px] max-w-60 text-sm lg:text-base  break-words">
                                    {msg?.content}
                                  </div>
                                }
                                <span className={`font-thin text-xs p-1  ${msg?.content ? "mb-3" : ""} text-end content-end`}>
                                  {`${msgDate.toLocaleTimeString("en-IN", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                    timeZone: "Asia/Kolkata",
                                  })}`}
                                </span>
                                </div>
                                </div>
                              </div>
                            </div>
                            {userId === msg?.sender && (
                              <img
                                src={loginUserProfile}
                                className="object-cover h-8 w-8 rounded-full m-1"
                                alt="🙂"
                                onMouseEnter={() => { setShowFaEllipsisV(msg.id) }}
                              />
                            )}
                            <div className={`relative ${userId === msg?.sender && showFaEllipsisV == msg.id ? "block" : "hidden"}`}>
                              <button
                                className="p-1"
                                onClick={() => { toggleDropdown() }}
                              >
                                {/* &#x2022;&#x2022;&#x2022; Three-dots symbol */}
                                <FaEllipsisV />
                              </button>
                              {dropdownOpen && (
                                <div className="absolute right-0 mt-2 inline-block w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleChatDelet(msg.id)}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      Delet chat
                                    </button>

                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>

              {/* sendchat */}
              {selectedImage &&
                <div className="bg-[#0606063b] rounded-xl relative">
                  <div className=" absolute left-48" onClick={() => { setSelectedImage(null) }}><FaTimesCircle size={20} color="white" /></div>
                  <img
                    src={selectedImage}
                    className="object-cover h-52 w-52 rounded-3xl m-2  "
                    alt="🙂"
                  />
                </div>}
              <div className="md:h-[6%] lg:h-[6%] items-center text-center bg-[#a1999956]  rounded-xl p-0 px-1 mt-3 flex flex-row justify-center  ">
                <div className="relative flex-1 mr-2">
                  <span className="absolute inset-y-0 flex items-center">
                    <button
                      type="button"
                      className="hidden md:inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out text-gray-200 hover:bg-[#92574e] focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-200"
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
                    className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-200 bg-[#635f5f56] placeholder-gray-200 pl-12 rounded-md py-3"
                    value={messages}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="relative flex-2 right-0 items-center inset-y-0 flex">
                  <div>
                    <label
                      className="hidden md:inline-flex m-1 p-2 text-white items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out border-2 bg-[#312e2e69] border-[#5a5269] hover:bg-gray-300 focus:outline-none"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="z-20"
                      />
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-white hover:text-gray-600 z-30"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          ></path>
                        </svg>
                      </div>

                    </label>
                  </div>
                  <button
                    type="button"
                    className="hidden md:inline-flex m-1 p-2 items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out bg-[#312e2e69] text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                    className="hidden md:inline-flex m-1 p-2 items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out bg-[#312e2e69] text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                  <CustomButton
                    // variant="primary"
                    variant="success"
                    className=""
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
                  </CustomButton>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-300 rounded-xl py-10 px-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
                Hello (❁´◡`❁)
              </h1>
              <p
                className="text-lg sm:text-2xl text-gray-400 hover:text-[#5a5269] hover:underline  cursor-pointer"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Choose your fav ones!
              </p>
              <div className="flex items-center ">
                {open && (
                  <CreateChatRoomModal
                    signeduser={signeduser}
                    createChatroom={createChatroom}
                    setOpen={setOpen}
                  />
                )}

              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default RightSide;
