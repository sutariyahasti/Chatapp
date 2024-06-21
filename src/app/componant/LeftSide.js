import NoProfile from "@/public/images/noprofile";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const LeftSide = ({
  allusers,
  fetchChatRoomsById,
  loginuser,
  signeduser,
  fetchUser,
  ChatRoomDetails,
}) => {
  const [users, setUsers] = useState([]);
  const [chatname, setChatname] = useState();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState("")
  const [error, setError] = useState(null);
  const [Profile, setProfile] = useState(null);

  useEffect(() => {
    // Check if window is defined to ensure we're on the client-side
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('name');
      const id = localStorage.getItem("id")
      const profileImage = localStorage.getItem("url")


      if (name) {
        setUsername(name);
      }
      if (id) {
        setUserId(id)
      }
      if (profileImage) {
        setProfile(profileImage)
      }
    }
  }, [userId]);

//   const [userProfile, setUseraProfile] = useState(null);
// console.log(userProfile,"image");
//   const fetchUserData = async () => {
//       try {
//           const response = await fetch(`/api/getImagebyUserid?id=${userId}`);
//           if (!response.ok) {
//               throw new Error('Failed to fetch user data');
//           }
//           const data = await response.json();
//           if (data.error) {
//               throw new Error(data.error);
//           }
//           setUseraProfile(data);
//           setError(null);
//       } catch (error) {
//           console.error('Error fetching user:', error.message);
//           setError('Failed to fetch user data');
//           // setUseraProfile(null);
//       }
//   };
//   useEffect(()=>{
//     fetchUserData()
//   },[userId])
  const url = process.env.NEXT_PUBLIC_API_URL;
  // console.log(loginuser,"loginuser");
  useEffect(() => {
    // const fetchUserschatrooms = async () => {
    //   const response = await fetch(
    //     `${url}/api/getChatrooms`,
    //     {
    //       method: "get",
    //       headers: {
    //         "content-type": "application/json",
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   const Users = await response.json();
    //   setUsers(Users);
    //   const loginUserId = loginuser?._id; // Assuming loginuser is an object with _id property
    // };
    // console.log(signeduser,"signeduser");
    // fetchUserschatrooms();
    const fetchUserschatroomsOfLoginUser = async () => {
      axios.get(`/api/getChatroomofCurrentUser`, { params: { id : userId } })
          .then((response) => {
              const data = response.data;
              if (data.error) {
                  setError(data.error);
              } else {
                setUsers(data);
              }
          })
          .catch((err) => {
              setError('An error occurred while fetching the chatroom');
              console.error('Error:', err);
          });
        }
        if (userId) {
          fetchUserschatroomsOfLoginUser()
        }
    // socket.on("newUserResponse", (data) => setUsers(data));
    }, [userId,open]);
  console.log(users,"users");

  const createChatroom = async (id, name,url) => {
    try {
      const response = await axios.post(
        // `${url}/api/createchatroom`,
`http://localhost:3000/api/createchatroom`,
        {
          chatName : "hasti",
          user1Name: username,
          user2Name: name,
          user1: userId,
          user2: id,
          user1url:Profile,
          user2url:url
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOpen(false);
      if (response.status == 400) {
        alert("user already exist");
        setOpen(false);
      }
      console.log(response, response.status, "rooms", chatname);
    } catch {
      console.log("error in creating chatrooms");
      alert(`You have already chat with ${name} ${id}`);
    }
  };


  const handleInputChange = (event) => {
    const name = event.target.value;
    setChatname(name);
  };

  const getChatRoomsById = (id) => {
    fetchChatRoomsById(id);
    // fetchUser(
    //   ChatRoomDetails?.user1 === loginuser?._id
    //     ? ChatRoomDetails.user2
    //     : ChatRoomDetails.user1
    // );
  };
  return (
    <div className="min-h-screen  col-span-12 rounded-sm border border-stroke bg-white pb-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="sticky top-0  flex items-center space-x-4   bg-[#5a5269] z-[9] sm:items-center justify-between p-6 border-b-2 border-gray-200">
        <div className="relative">
          <span className="absolute text-green-500 right-0 bottom-0">
            <svg width="20" height="20">
              <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
            </svg>
          </span>
          {Profile ? 
          <img
            src={Profile && Profile}
            alt=""
            className="w-16 sm:w-16   h-16 sm:h-16 rounded-full border border-white"
          /> 
          : <NoProfile />
        }
         
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-2xl mt-1 flex items-center">
            <span className="text-white mr-1">{username}</span>
          </div>
        </div>
        {/* model */}
        <div className="flex items-center space-x-2">
          {open && (
            <div
              id="myModal"
              className="modal fixed  inset-0 z-[50] overflow-auto bg-black bg-opacity-50"
            >
              <div className="modal-container mx-auto">
                <div className="modal-content bg-white w-96 mx-auto mt-10 p-4 rounded-lg z-[100]">
                  {/* <!-- Your popup content goes here --> */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      Create Chatroom with your favs!
                    </h2>
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
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  {/* <!-- Add your content here --> */}
                  <input
                    className="pl-2 outline-none border-none"
                    type="text"
                    name="chatName"
                    id="name"
                    placeholder="name"
                    onChange={handleInputChange}
                    // value={formData.email}
                  />
                  <div className="truncate overflow-auto">
                    {signeduser &&
                      signeduser.length > 0 &&
                      signeduser?.map((user, index) => (
                        <Link
                          // to={`/chat/${id}`}
                          href={"#"}
                          className="flex items-center  gap-5 py-3 px-7.5 hover:bg-[#f3d2be] dark:hover:bg-purple-100"
                          onClick={() => createChatroom(user?._id, user?.name, user?.url)}
                          key={index}
                        >
                          <div className="relative m-2 h-14 w-14 rounded-full">
                            <img
                              // src="https://images.unsplash.com/photo-1547093841-7c02540c29e9?w=300&h=300&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8Nnw3ODcyMzF8fGVufDB8fHx8fA%3D%3D"
                              src={`${user?.url}`}
                              alt="User"
                              className="rounded-full h-14 w-14"
                            />
                            <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
                          </div>

                          <div className="flex flex-1 items-center justify-between border-b-2 border-[#f3d2be] ">
                            <div>
                              <h5 className="font-medium text-black dark:text-white">
                                {user?.name}
                              </h5>
                            </div>
                            <div className="flex h-6 w-6 m-2 items-center justify-center rounded-full bg-[#e68e7f]"></div>
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

      <div className="truncate">
        {users &&
          users.length > 0 &&
          users?.map((user, index) => (
            <Link
              // to={`/chat/${id}`}
              href={"#"}
              className="flex items-center gap-5 py-3 px-7.5 hover:bg-[#f3d2be] dark:hover:bg-[#f3d2be]"
              onClick={() => getChatRoomsById(user?._id)}
              key={index}
            >
              <div className="relative h-14 w-14 rounded-full">
              {user.user2url || user.user1url ? 
          <img
            src={user?.user1 === userId
              ? user.user2url
              : user.user1url}
            alt=""
            className="w-8 sm:w-16 h-10 sm:h-16 rounded-full border border-white"
          /> : <NoProfile />
        }
                <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3"></span>
              </div>

              <div className="flex flex-1 items-center justify-between border-b-2 border-[#f3d2be]">
                <div className="m-2">
                  <h5 className="font-medium text-black dark:text-white">
                    {/* {user?.chatName} */}
                    {user?.user1 === userId
                      ? user.user2Name
                      : user.user1Name}
                    {/* {allusers[0]?.name} */}
                  </h5>

                  <p>
                    <span className="text-sm text-black dark:text-white">
                      Hello, how are you?
                    </span>
                    <span className="text-xs"> . 12 min</span>
                  </p>
                </div>
                <div className="flex h-6 w-6 m-2 items-center justify-center rounded-full bg-[#5a5269]">
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
