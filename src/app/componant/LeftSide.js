import NoProfile from "@/public/images/noprofile";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateChatRoomModal from "./CreateChatRoomModal";

const LeftSide = ({
  allusers,
  fetchChatRoomsById,
  loginuser,
  signeduser,
  fetchUser,
  ChatRoomDetails,
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
    const fetchUserschatroomsOfLoginUser = async () => {
      axios
        .get(`/api/getChatroomofCurrentUser`, { params: { id: userId } })
        .then((response) => {
          const data = response.data;
          if (data.error) {
            setError(data.error);
          } else {
            setUsers(data);
          }
        })
        .catch((err) => {
          setError("An error occurred while fetching the chatroom");
          console.error("Error:", err);
        });
    };
    if (userId) {
      fetchUserschatroomsOfLoginUser();
    }
  }, [userId, open]);
  console.log(users, "users");

  const createChatroom = async (id, name, url) => {
    try {
      const response = await axios.post(
        `/api/createchatroom`,
        {
          chatName: "hasti",
          user1Name: username,
          user2Name: name,
          user1: userId,
          user2: id,
          user1url: Profile,
          user2url: url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOpen(false);
      if (response.status === 201) {
        alert("user created");
        setOpen(false);
      }
      console.log(response, response.status, "rooms", chatname);
    } catch {
      console.log("error in creating chatrooms");
      alert(`You have already chat with ${name} ${id}`);
    }
  };

  const getChatRoomsById = (id) => {
    fetchChatRoomsById(id);
  };

  return (
    <div className="min-h-screen col-span-12 rounded-sm border border-stroke bg-white pb-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6 sm:col-span-6">
      <div className="sticky top-0 flex items-center space-x-4 bg-[#5a5269] z-10 sm:items-center justify-between py-6 px-2 border-b-2 border-gray-200">
        <div className="relative h-15 w-15 rounded-full">
          {Profile ? (
            <img
              src={Profile && Profile}
              alt=""
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full border border-white"
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
            className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            onClick={() => {
              setOpen(true);
            }}
          >
            <b>+</b>
          </button>
        </div>
      </div>
      <div className="overflow-auto h-full">
        {users &&
          users.length > 0 &&
          users.map((user, index) => (
            <Link
              href={"#"}
              className="flex items-center gap-1 py-3 px-7.5 hover:bg-[#f3d2be] dark:hover:bg-[#f3d2be]"
              onClick={() => getChatRoomsById(user._id)}
              key={index}
            >
              <div className="relative h-15 w-15 rounded-full">
                {user.user2url || user.user1url ? (
                  <img
                    src={user.user1 === userId ? user.user2url : user.user1url}
                    alt=""
                    className="w-10 sm:w-16 h-10 sm:h-16 rounded-full border border-white"
                  />
                ) : (
                  <NoProfile />
                )}
                <span className="absolute right-2 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
              </div>
              <div className="flex flex-1 items-center justify-between border-b-2 border-[#f3d2be]">
                <div className="m-2">
                  <h5 className="font-medium text-black dark:text-white">
                    {user.user1 === userId ? user.user2Name : user.user1Name}
                  </h5>
                  <p className="flex items-center text-xs text-black dark:text-white">
                    Hello, how are you?
                    <span className="ml-1 text-xs">. 12 min</span>
                  </p>
                </div>
                <div className="flex h-6 w-6 m-1 items-center justify-center rounded-full bg-[#5a5269]">
                  <span className="text-sm font-medium text-white">3</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LeftSide;
