"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeftSide from "@/app/componant/LeftSide";
import axios from "axios";
import RightSide from "@/app/componant/Rigthside";

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
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   const socketInstance = io.connect(url, {
  //     reconnection: true,
  //     reconnectionAttempts: 10, // Number of reconnection attempts before giving up
  //     reconnectionDelay: 1000, // Time delay in milliseconds between each reconnection attempt
  //   });
  
  //   setSocket(socketInstance);
  
  //   return () => {
  //     if (socketInstance) {
  //       socketInstance.disconnect();
  //     }
  //   };
  
   
  // }, [])
  
  // useEffect(() => {
  //   console.log(socket,"socket====");
  //   if (socket) {
      
   
  //   // Listen for incoming messages from the server
  //   socket.on("initial-chats", (initialChats) => {
  //     setMessages(initialChats);
  //   });

  //   socket.on("chat-message", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     socket.off("chat-message");
  //   };
  // }
  // }, [socket,messages]);

    useEffect(() => {
    const user = localStorage.getItem("LoginUserInfo");
    const parsedUser = user ? JSON.parse(user) : null;
    const id = localStorage.getItem("id");
    setUsername(parsedUser);

    if (!id) {
      router.push("/pages/Login");
    }
  }, [messages]);
  useEffect(()=>{
    fetchSignedUser();

  },[])
  const fetchUserbyid = async (id) => {
    console.log(id,"id----------chat");
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
  const [error, setError] = useState(null);

  const fetchChatRoomsById = async (id) => {
      if (id) {
      axios.get(`/api/getChatroombyid`, { params: { id } })
          .then((response) => {
              const data = response.data;
              if (data.error) {
                  setError(data.error);
              } else {
                setChatRoomDetails(data);
              }
          })
          .catch((err) => {
              setError('An error occurred while fetching the chatroom');
              console.error('Error:', err);
          });
  }else{
    console.log("Id is undefined");
    alert("Id is undefined")
  }
    console.log("ChatRoomDetails", chatRoomDetails);
  };

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
      <div className="font-[cursive] grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5  rounded w-full ">
        {/* Left side */}
        <div className="md:col-span-1 lg:col-span-1 rounded w-full overflow-auto">
          <LeftSide
            allusers={users}
            fetchChatRoomsById={fetchChatRoomsById}
            loginuser={userName}
            signeduser={signeduser}
            fetchUser={fetchUserbyid}
            ChatRoomDetails={chatRoomDetails}
            messages={messages}
          />
        </div>

        {/* Right side */}
        <div className="md:col-span-3 lg:col-span-4 rounded w-full overflow-auto">
          <RightSide
            ChatRoomDetails={chatRoomDetails}
            fetchChatRoomsById={fetchChatRoomsById}
            loginuser={userName}
            getprofile={fetchUserbyid}
            profileuser={users}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </>
  );
}

export default ChatBoard;
