"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeftSide from "@/app/componant/LeftSide";
import axios from "axios";
import RightSide from "@/app/componant/Rigthside";
import { database } from "@/firebase/firebase";
import { child, get, onValue, ref } from "firebase/database";

function ChatBoard() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  // Initialize socket connection
  // const socket = socketIO.connect(`${url}`);
  const [messages, setMessages] = useState("");
  const [userName, setUsername] = useState();
  const [users, setUsers] = useState();
  const [signeduser, setSignedusers] = useState();
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatRoomDetails, setChatRoomDetails] = useState();
  const router = useRouter();
  const [rightsideShow, setRightsideShow] = useState(false)
  const [leftsideShow, setleftsideShow] = useState(true)
  const [latestMessages, setLatestMessages] = useState({});
  useEffect(() => {
    const user = localStorage.getItem("LoginUserInfo");
    const parsedUser = user ? JSON.parse(user) : null;
    const id = localStorage.getItem("id");
    setUsername(parsedUser);

    if (!id) {
      router.push("/pages/Login");
    }
  }, [messages]);
  useEffect(() => {
    fetchSignedUser();
  }, [])

  useEffect(() => {
    const dbRef = ref(database); // Reference to the root of your Realtime Database
    const messagesRef = child(dbRef, "messages");

    // Set up a real-time listener
    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const messages = snapshot.val();
        const chatMessages = [];
        if (messages) {
          var latestMessagesMap = {};
          Object.keys(messages).forEach((key) => {
            const message = messages[key];
            // if (message.chatRoom === chatRoomDetails.id) {
              chatMessages.push({ ...message, id: key });
            
            const chatRoomId = message.chatRoom;

            if (!latestMessagesMap[chatRoomId]) {
              latestMessagesMap[chatRoomId] = message;
            } else if (
              message.createdAt > latestMessagesMap[chatRoomId].createdAt
            ) {
              latestMessagesMap[chatRoomId] = message;
            }
          // }
          });
          if (latestMessagesMap) {
            if (!Array.isArray(latestMessagesMap)) {
              // Assuming latestMessagesMap is an object, convert it to an array of its values
              latestMessagesMap = Object.values(latestMessagesMap);
            }
          latestMessagesMap && latestMessagesMap?.sort((a, b) => a.createdAt - b.createdAt);
          }
          setLatestMessages(latestMessagesMap);
        }
        // setChats(chatMessages);
      },
      (error) => {
        console.error("Error fetching messages:", error.message);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [chatRoomDetails]);
  const fetchUserbyid = async (id) => {
   
    const response = await fetch(
      `/api/alluser/` + id,

      {
        method: "get",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const Users = await response.json();
    setUsers(Users);
  };

 const fetchChatRoomsById = async (id) => {
    try {
      if (!id) {
        console.log("Id is undefined");
        alert("Id is undefined");
        return;
      }
  
      const dbRef = ref(database); // Reference to the root of your Realtime Database
      const chatroomRef = child(dbRef, `Chatrooms/${id}`);
  
      // Fetch the chatroom details
      const snapshot = await get(chatroomRef);
      const chatroom = snapshot.val();
  
      if (chatroom) {
        console.log("Chatroom found:", chatroom);
        setChatRoomDetails({ ...chatroom, id });
        return { result: [{ ...chatroom, id }], error: null };
      } else {
        console.log("No such chatroom document!");
        return { result: [], error: "No such chatroom document!" };
      }
    } catch (error) {
      console.error('Error fetching chatroom details:', error.message);
      return { result: [], error: error.message };
    }
  }

  const fetchSignedUser = async () => {
    const response = await fetch(
      `/api/alluser`,

      {
        method: "get",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const user = await response.json();
    setSignedusers(user);
    console.log("sign", user);
  };
  return (
    <>
      <div className="font-[monospace] grid grid-cols-1  lg:grid-cols-5  rounded w-full bg-blackbg">
        {/* Left side */}
        <div className="md:col-span-1 lg:col-span-1 w-full overflow-auto rounded-xl  box-content no-scrollbar bg-blackbg">
          <LeftSide
            allusers={users}
            fetchChatRoomsById={fetchChatRoomsById}
            loginuser={userName}
            signeduser={signeduser}
            fetchUser={fetchUserbyid}
            ChatRoomDetails={chatRoomDetails}
            messages={messages}
            setleftsideShow={setleftsideShow}
            leftsideShow={leftsideShow}
            setRightsideShow={setRightsideShow}
            rightsideShow={rightsideShow}
            latestMessages={latestMessages}
          />
        </div>

        {/* Right side */}
        <div className="md:col-span-3 lg:col-span-4 rounded-xl w-full overflow-auto box-content no-scrollbar bg-blackbg">
          <RightSide
            ChatRoomDetails={chatRoomDetails}
            fetchChatRoomsById={fetchChatRoomsById}
            loginuser={userName}
            getprofile={fetchUserbyid}
            profileuser={users}
            messages={messages}
            setMessages={setMessages}
            setleftsideShow={setleftsideShow}
            leftsideShow={leftsideShow}
            setRightsideShow={setRightsideShow}
            rightsideShow={rightsideShow}
            signeduser={signeduser}
          />
        </div>
      </div>
    </>
  );
}

export default ChatBoard;
