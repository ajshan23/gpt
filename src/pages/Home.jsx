import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { query } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { updateAccessToken, updateChatId, updateUser } from "../app/chatSlice";
import { useNavigate } from "react-router-dom";
import logo from "../image/eveegpt.png";
import userLogo from "../image/user.png";
import sendIcon from "../image/Vector.png";
import roboIcon from "../image/robotLogo.png";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import "./Style.css";
import { MdOutlineSaveAlt } from "react-icons/md";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TypingEffect from "../Components/TypingEffect.jsx";
import { ClipLoader } from "react-spinners";
import conf from "../conf/index.js";

const Home = () => {
  const genAI = new GoogleGenerativeAI(conf.apikey);
  const dbRef = collection(db, "users");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveButtonOn, setSaveButtonOn] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isWrigintOFf, setIsWritingOff] = useState(false);
  const [upsavebutton, setUpsaveButton] = useState(false);
  const [please, setPlease] = useState(false);
  const [errLoading, setErrLoading] = useState(false);
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [titleInput, setTitleInput] = useState(false);
  const [history, setHistory] = useState([]);
  const [allChats, setAllChatHistory] = useState([]);
  const [current, setCurrent] = useState([]);
  // const accessToken = useSelector((state) => state.accessToken);
  const currentUseremail = useSelector((state) => state.userEmail);
  const currentChatId = useSelector((state) => state.chatIdFromFirebase);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setAllChatHistory([]);
    setTitle("");
    getUserPreviousChats();
    if (!currentUseremail) {
      navigate("/login");
    }
  }, [saveLoading, please]);
  const handleLogout = async () => {
    await signOut(auth)
      .then(
        sessionStorage.clear(),
        dispatch(updateUser("")),
        dispatch(updateAccessToken("")),
        console.log("logout successfully"),
        navigate("/login")
      )
      .catch((err) => console.log("error while logout", err));
  };

  const saveChatSessionToFirebaseHandler = async () => {
    //todo saving an existed chat session,means updation
    if (!current) {
      return null;
    }
    if (isUpdate) {
      try {
        if (!currentChatId) {
          return null;
        }
        // setSaveLoading(true);
        await updateDoc(doc(db, "users", currentChatId), {
          chats: current,
        });
        setCurrent([]);
        setHistory([]);
        setUpsaveButton(false);
        setIsUpdate(false);
        return null;
      } catch (error) {
        console.log(
          "error at update a doc in saveChatSessionToFirebaseHandler "
        );
      }
    }
    try {
      setSaveLoading(true);
      await addDoc(dbRef, {
        title: title,
        email: currentUseremail,
        chats: current,
        time: Date.now(),
      });
      setCurrent([]);
      setHistory([]);
      setSaveLoading(false);
    } catch (error) {
      console.log("Error while adding doc to firebase:", error);
      setSaveLoading(false);
    }
  };

  const addChatFromFirebaseHandler = (data) => {
    dispatch(updateChatId(data.id));
    setIsWritingOff(true);
    setCurrent([]);
    setHistory([]);
    setIsUpdate(true);
    setTimeout(() => {
      setCurrent(data.chats);
      setHistory(data.chats);
    }, 200);

    setTimeout(() => {
      setIsWritingOff(false);
    }, 3000);
  };

  const getUserPreviousChats = async () => {
    try {
        setAllChatHistory([])
      let res = await getDocs(query(dbRef));
      if (Array.isArray(res.docs)) {
        res.docs.map((item) => {
          if (item.data().email === currentUseremail) {
            let aju = item.data();

            aju.id = item.id;
            setAllChatHistory((prev) => [...prev, aju]);
            // console.log(aju)
          }
        });
      }
      // console.log(allChats);
    } catch (error) {
      console.log("error occured whiile getting previous chats:", error);
    }
  };

  const run = async () => {
    setLoading(true);
    chatscroll();
    try {
      const generationConfig = {
        stopSequences: ["red"],
        temperature: 0.3,
      };
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: generationConfig,
      });
      const chat = model.startChat({
        history: history,
      });
      const result = await chat.sendMessage(input);
      // const result = await model.sendMessageStream(input);
      const response = result.response;
      const textPre = response.text();
      const text = textPre.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

      console.log(text);

      setHistory((prev) => [...prev, { role: "model", parts: text }]);
      setCurrent((prev) => [...prev, { role: "model", parts: text }]);

      setLoading(false);
      chatscroll();
    } catch (error) {
      setLoading(false);
      setErrLoading(true);
      throw error;
    }
  };

  const handleSubmit = () => {
    if (input.trim() !== "") {
      setHistory((prev) => [...prev, { role: "user", parts: input }]);
      setCurrent((prev) => [...prev, { role: "user", parts: input }]);
      chatscroll();
      run();
      setInput("");
      setSaveButtonOn(true);
    }
  };
  const saveButtonHandler = () => {
    if (title.trim() === "") {
      console.log("without providing a heading");
      return null;
    }
    saveChatSessionToFirebaseHandler();
    titleinputHandler();
  };

  const cancelButtonHandler = () => {
    titleinputHandler();
    setTitle("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const chatscroll = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
  const titleinputHandler = () => {
    setTitleInput((prev) => !prev);
  };
  const updatesavebuttonHandler = () => {
    setUpsaveButton(true);
    saveChatSessionToFirebaseHandler();
    setPlease((prev) => !prev);
  };
  const handleNewChat = () => {
    setCurrent([]);
    setHistory([]);
  };
  const showProfileHandler = () => {
    setShowProfile((prev) => !prev);
  };


  const removeFromFirebaseHandler=async(id)=>{
    let check=confirm("Do you want to delete this item?")

    if (!check) {
      return null
    }
    await  deleteDoc(doc(db, "users", id)).then(setAllChatHistory([]),getUserPreviousChats()).catch((e)=>console.log("Error at removeFromFirebaseHandler"))
    setCurrent([])
    setHistory([])
  }

  return (
    <div className=" text-white overflow-hidden">
      <div className="bg-[#181818]">
        <div className="px-2  md:px-5 lg:px-24 xl:px-28 w-full h-screen flex flex-col py-3">
          <div className="navbar w-full h-20 sm:h-24 pt-2 flex items-center justify-between">
            <div className="logo">
              <img src={logo} className="h-[21px] w-[120px] flex" />
            </div>
            <div className=" flex gap-1 sm:gap-[17rem]">
              <button
                className="bg-[#FFDC27] mt-2 sm:mt-0 h-8 sm:h-full px-1 py-[1px] sm:px-8 sm:py-[10px] space-x-2 text-black font-bold border-none rounded-full sm:rounded-xl hover:scale-105 flex flex-row align-middle justify-center items-center "
                onClick={handleNewChat}
              >
                <div className="">
                  <FaPlus size={20} />
                </div>
                <div className="hidden sm:flex ">New Chat</div>
              </button>
              <div className="flex justify-center items-center gap-3">
                <div className="hidden sm:flex"></div>
                <img
                  src={userLogo}
                  alt=""
                  className="w-12 rounded-full hover:border-2 hover:border-white hover:scale-110"
                  onClick={showProfileHandler}
                />
                {showProfile ? (
                  <div className="absolute right-0 top-16 sm:right-20 w-52 h-24 bg-[#212121] rounded-xl flex flex-col justify-start items-center">
                    <div className="flex pt-3">
                      <div className="text-[#FFDC27]"> User</div>
                    </div>
                    <div className="pt-3 space-x-3">
                      <button
                        className="bg-green-800 px-2 rounded-lg"
                        onClick={showProfileHandler}
                      >
                        Back
                      </button>
                      <button
                        className="bg-red-800 px-2 rounded-lg"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className=" body w-full h-full py-2 flex gap-6">
            <div className="input+chat flex flex-col w-full gap-3">
              <div className="chat scroll-container w-full bg-[#444444] h-[500px] sm:h-[550px] rounded-xl overflow-scroll">
                {errLoading ? (
                  <div className="flex flex-col w-full h-full justify-center items-center text-3xl font-bold">
                    <div className=" text-yellow-400">
                      please refresh this page
                    </div>
                    <div className="text-red-800">Error Occured</div>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full px-1 sm:px-2 py-2 flex flex-col">
                      {current.map((item, index) => (
                        <div key={index}>
                          <div
                            className={`w-full py-4 gap-3 sm:gap-4  items-start ${
                              item.role === "user"
                                ? "pr-2px sm:pr-5 flex flex-row-reverse "
                                : " pl-2px sm:pl-5 flex "
                            }`}
                            key={index}
                          >
                            {item.role === "user" ? (
                              <img src={userLogo} className="w-8" />
                            ) : (
                              <img src={roboIcon} className="w-8" />
                            )}
                            <div>
                              <span className="py-1 typing-text">
                                {item.role === "user" ? (
                                  item.parts // For user messages, display immediately
                                ) : (
                                  <TypingEffect
                                    text={item.parts}
                                    isUpdate={isWrigintOFf}
                                  /> // For robot messages, use typing effect component
                                )}
                              </span>
                            </div>
                          </div>
                          <div ref={chatContainerRef}></div>
                        </div>
                      ))}
                      {loading ? (
                        <div className="pl-1 sm:pl-5 pt-2 sm:pt-4 flex items-center justify-start">
                          <img src={roboIcon} className="w-8" />
                          <div className="loading pl-24 pt-12">
                            <div className="obj"></div>
                            <div className="obj"></div>
                            <div className="obj"></div>
                            <div className="obj"></div>
                            <div className="obj"></div>
                            <div className="obj"></div>
                            <div className="obj"></div>
                            <div className="obj"></div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="relative input-box w-full h-[52px] rounded-full bg-[#212121] flex justify-between items-center">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Type Something..."
                    className="bg-transparent w-full outline-none px-5 sm:px-7 md:px-10 placeholder:font-sans"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                {isUpdate ? (
                  <>
                    {upsavebutton ? (
                      <>
                        <ClipLoader size={25}></ClipLoader>
                      </>
                    ) : (
                      <>
                        <MdOutlineSaveAlt
                          size={25}
                          onClick={updatesavebuttonHandler}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {saveButtonOn ? (
                      <>
                        {titleInput ? (
                          <div className="absolute -top-36 right-0 rounded-lg flex  bg-[#212121] border border-white w-full sm:w-80 h-32 ">
                            <div className="w-full px-3 flex flex-col justify-center">
                              <h1>Do you want to save it?</h1>
                              <div className="border border-white rounded-lg h-10 mt-3">
                                <input
                                  type="text"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  className="px-3 w-full h-full outline-none bg-transparent placeholder:text-sm placeholder:font-thin"
                                  placeholder="   Give a proper name to undentify"
                                />
                              </div>
                              <div className="flex flex-row justify-center space-x-5 mt-3">
                                <div className="border p-1 border-black rounded-lg text-white bg-red-700">
                                  <button onClick={cancelButtonHandler}>
                                    cancel
                                  </button>
                                </div>
                                <div className="border p-1 border-black rounded-lg text-white bg-green-700">
                                  <button onClick={saveButtonHandler}>
                                    save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {" "}
                            {saveLoading ? (
                              <ClipLoader size={25}></ClipLoader>
                            ) : (
                              <MdOutlineSaveAlt
                                size={25}
                                onClick={titleinputHandler}
                              />
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                <div className="pl-3 pr-5 sm:pr-6 cursor-pointer">
                  <img
                    src={sendIcon}
                    alt=""
                    className="w-5  "
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
            <div className="hidden sm:flex history  ">
              <div className="w-[341px] bg-[#444444] h-full pb-4 rounded-xl scroll-container overflow-scroll ">
                <div className="h-full w-full  scroll-container overflow-scroll">
                  <div className="px-5 flex flex-col gap-6">
                    <div className="pt-7 font-semibold">History</div>
                    <div className="history-list-secton  flex flex-col ">
                      <div className="w-full h-full flex flex-col gap-4  ">
                        {allChats &&
                          allChats.map((singlechat, index) => (
                            <div
                              className="flex flex-col gap-1 font-light"
                              key={index}
                            >
                              {/* <div className="text-sm">Today</div> */}
                              <div className="w-[297px] h-[56px] bg-[#6d6c6c] rounded-xl flex items-center px-3 justify-between ">
                                <div className="cursor-pointer w-full h-full flex items-center"
                                  onClick={(e) =>
                                    addChatFromFirebaseHandler(singlechat)
                                  }
                                >
                                  {singlechat.title}
                                </div>
                                <div>
                                  <MdDelete size={20} color="yellow" onClick={(e)=>removeFromFirebaseHandler(singlechat.id)}/>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
