"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socketIO from "socket.io-client";
import LeftSide from "@/app/componant/LeftSide";
import Rigthside from "@/app/componant/Rigthside";
import axios from "axios";

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
  
    useEffect(() => {
    const user = localStorage.getItem("LoginUserInfo");
    const parsedUser = user ? JSON.parse(user) : null;
    const id = localStorage.getItem("id");
    setUsername(parsedUser);

    if (!id) {
      router.push("/pages/Login");
    }

    // fetchSignedUser();
    // socket.on("messageResponse", (data) => {
    //   setMessages((prevMessages) => [...prevMessages, data]);
    //   //   setUnreadCount((prevCount) => prevCount + 1);
    // });

    // socket.on("notification", (message) => {
    //   // Show a browser notification if permission is granted
    //   if (Notification.permission === "granted") {
    //     new Notification("Chat App Notification", {
    //       body: message,
    //     });
    //   }
    // });

    // // Request notification permission if not granted
    // if (Notification.permission !== "granted") {
    //   Notification.requestPermission();
    // }
    // return () => {
    //   socket.disconnect();
    // };
  }, [messages]);
  useEffect(()=>{
    fetchSignedUser();

  },[])
  const fetchUserbyid = async (id) => {
    console.log(id,"id----------chat");
    const response = await fetch(
      `${url}/api/alluser/` + id,

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
    console.log(Users, "signuser-----------");
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
      `${url}/api/alluser`,

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
      <div className="font-[cursive] grid grid-cols-1 md:grid-cols-5 rounded w-full ">
        {/* Left side */}
        <div className="md:col-span-1 rounded w-full overflow-auto">
          <LeftSide
            // socket={socket}
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
        <div className="md:col-span-4 rounded w-full overflow-auto">
          <Rigthside
            // socket={socket}
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
