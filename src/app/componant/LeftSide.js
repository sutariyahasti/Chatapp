import NoProfile from "@/public/images/noprofile";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateChatRoomModal from "./CreateChatRoomModal";
import UseName from "@/public/images/UseName";
import { notify } from "./common/Toast";
import { child, get, ref } from "firebase/database";
import { database } from "@/firebase/firebase";
import addData from "@/firebase/utils/addData";
import Logout from "@/public/images/Logout";

const LeftSide = ({
  allusers,
  fetchChatRoomsById,
  loginuser,
  signeduser,
  fetchUser,
  ChatRoomDetails,
  setleftsideShow,
  leftsideShow,
  setRightsideShow,
  latestMessages
}) => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);
  const [Profile, setProfile] = useState(null);

  useEffect(() => {
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
        setProfile(profileImage);
      }
    }
  }, [userId]);

  const url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (userId) {
      async function fetchChatrooms() {
        try {
          const dbRef = ref(database);

          const q1 = child(dbRef, "Chatrooms");
          const snapshot1 = await get(q1);
          const querySnapshot1 = snapshot1.val();

          const q2 = child(dbRef, "Chatrooms");
          const snapshot2 = await get(q2);
          const querySnapshot2 = snapshot2.val();

          const combinedResults = [];

          if (querySnapshot1) {
            Object.keys(querySnapshot1).forEach((key) => {
              const chatroom = querySnapshot1[key];
              if (chatroom.user1 === userId) {
                combinedResults.push({ ...chatroom, id: key });
              }
            });
          }

          if (querySnapshot2) {
            Object.keys(querySnapshot2).forEach((key) => {
              const chatroom = querySnapshot2[key];
              if (chatroom.user2 === userId) {
                combinedResults.push({ ...chatroom, id: key });
              }
            });
          }
          setUsers(combinedResults);
          return { result: combinedResults, error: null };
        } catch (error) {
          console.error("Error fetching chatrooms:", error.message);
          return { result: null, error: error.message };
        }
      }
      fetchChatrooms();
    }
  }, [userId, open]);

  const getChatroomByUsers = async (user1, user2) => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `Chatrooms`));
      if (snapshot.exists()) {
        const chatrooms = snapshot.val();
        for (const chatroomId in chatrooms) {
          const chatroom = chatrooms[chatroomId];
          if (
            (chatroom.user1 === user1 && chatroom.user2 === user2) ||
            (chatroom.user1 === user2 && chatroom.user2 === user1)
          ) {
            return chatroomId;
          }
        }
      }
    } catch (error) {
      console.error("Error querying chatrooms: ", error);
    }
    return null;
  };

  function generateChatroomId(userId, id) {
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36).substring(2, 20);
    return `${timestamp}`;
  }

  const createChatroom = async (id, name, url) => {
    const chatroomId = generateChatroomId(userId, id);
    const collection = "Chatrooms";

    const existingChatroom = await getChatroomByUsers(userId, id);

    if (existingChatroom) {
      console.log("Chatroom already exists with ID: ", existingChatroom);
      notify(`You already have a chat with ${name} ${id}`);
      return;
    }

    const data = {
      chatName: username,
      user1Name: username,
      user2Name: name,
      user1: userId,
      user2: id,
      user1url: Profile,
      user2url: url,
    };

    try {
      const { result, error } = await addData(collection, chatroomId, data);
      console.log("Document written with ID: ", chatroomId, result);
      notify("User created");
      setOpen(false);
    } catch (error) {
      console.log("Error in creating chatrooms: ", error);
      notify(`Error in creating chatroom with ${name} ${id}`);
    }
  };

  const getChatRoomsById = (id) => {
    fetchChatRoomsById(id);
    setRightsideShow(true);
    setleftsideShow(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("url");
    window.location.href = "/"; // Redirect to the login or home page
  };

  return (
    <div
      className={`py-4 pl-4 pr-4 lg:pr-0 lg:block h-screen ${
        leftsideShow === true ? "block" : "hidden"
      }`}
    >
      <div
        className={`rounded-xl h-full p-3 overflow-auto  no-scrollbar lg:block col-span-12  bg-[#cec6c63a] text-gray-300  shadow-default md:col-span-6 sm:col-span-6 ${
          leftsideShow === true ? "block" : "hidden"
        }`}
      >
        <div className="sticky top-0 flex rounded-xl items-center space-x-4 bg-blackbg text-white z-10 sm:items-center justify-between py-6 px-2 border-b-2 border-gray-200">
          <div className="relative h-15 w-15 rounded-full">
            {Profile ? (
              <img
                src={Profile && Profile}
                alt=""
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full "
              />
            ) : (
              <NoProfile />
            )}
            <span className="absolute right-2 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-white">{username}</span>
            </div>
          </div>
          <div className="flex items-center ">
            {open && (
              <CreateChatRoomModal
                signeduser={signeduser}
                createChatroom={createChatroom}
                setOpen={setOpen}
              />
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-200 hover:bg-gray-200 focus:outline-none"
              onClick={() => {
                setOpen(true);
              }}
            >
              <b>
                <UseName />
              </b>
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          {users &&
            users.length > 0 &&
            users.map((user, index) => (
              <Link
                href={"#"}
                className="flex items-center gap-1 py-3 px-7.5 hover:bg-tan rounded-xl my-1 p-1 hover:text-yellow-50 "
                onClick={() => getChatRoomsById(user.id)}
                key={index}
              >
                <div className="relative h-15 w-15 rounded-full">
                  {user.user2url || user.user1url ? (
                    <img
                      src={
                        user.user1 === userId ? user.user2url : user.user1url
                      }
                      alt=""
                      className="w-10 sm:w-16 h-10 sm:h-16 rounded-full "
                    />
                  ) : (
                    <NoProfile />
                  )}
                  <span className="absolute right-2 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
                </div>
                <div className="flex flex-1 items-center justify-between  border-[#f3d2be]">
                  <div className="m-2">
                    <h5 className="font-medium">
                      {user.user1 === userId ? user.user2Name : user.user1Name}
                    </h5>
                    {latestMessages.filter(msg => msg.chatRoom === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((msg, index) => (
                      <p className="flex items-center text-xs">
                        {msg.content} &nbsp; &nbsp;
                        {Math.round((Date.now() - msg.createdAt) / 60000) < 60 ? (
                          <span className="ml-1 text-xs">
                            {Math.round((Date.now() - msg.createdAt) / 60000)} min
                          </span>
                        ) : (
                          <span className="ml-1 text-xs">
                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            })}
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                  <div className="flex h-6 w-6 m-1 items-center justify-center rounded-full bg-[#ebdddd52]">
                    <span className="text-sm font-medium text-white">3</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <button
          type="button"
          className=" inline-flex items-center justify-center rounded-lg border h-10 w-14 transition duration-500 ease-in-out text-gray-200 hover:bg-red-500 focus:outline-none absolute bottom-8 left-8"
          onClick={handleLogout}
        >
          <Logout />
        </button>
      </div>
    </div>
  );
};

export default LeftSide;
