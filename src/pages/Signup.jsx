import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAccessToken, updateUser } from "../app/chatSlice";
import logo from "../image/eveegpt.png";
import first from "../image/first.png";
import robo from "../image/robo.png";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      [ email, username, password,confirm].some(
        (field) => field?.trim() === ""
      )
    ) {
      alert("all fields are required");
    } else {
      if (password !== confirm) {
        alert("both password must be same");
        setPassword("");
        setConfirm("");
        return null;
      }
    }

    createUserWithEmailAndPassword(auth, email, password,username)
      .then((response) => {
        let accessToken = response.user.accessToken;
        let user = response.user;
        dispatch(updateUser(user.email));
        dispatch(updateAccessToken(accessToken));
        sessionStorage.setItem("token", user.accessToken);
        sessionStorage.setItem("user", user.email);

        navigate("/");
      })
      .catch((err) => {
        // alert("email already exists");
        console.log(err);
      });
  };
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      dispatch(updateUser(sessionStorage.getItem("user")));
      dispatch(updateAccessToken(sessionStorage.getItem("token")));
      navigate("/");
    }
  }, []);

  return (
    <div className="bg-[#181818] w-screen h-screen overflow-hidden flex flex-col">
      <div className="w-full h-20 px-5 sm:px-20 flex items-center space-x-4 justify-center sm:justify-start">
        <img src={first} alt="" className="w-14 h-8" />
        <img src={logo} alt="" className=" h-8" />
      </div>
      <div className="w-full h-full my-12 items-start justify-center text-white flex">
        <div className="w-full h-full  sm:w-[475px] sm:h-[582px] mx-4 bg-[#444444] rounded-lg">
          <div className="w-full h-full px-4 py-4 sm:px-[53px] sm:py-[41px] flex flex-col justify-center">
            <div className="Login font-bold text-2xl text-[#FFDC27] my-4">
              Sign Up
            </div>
            <div className="flex flex-col w-full mb-2">
              <div className="w-full">Username:</div>
              <div className="w-full sm:w-[368px] h-[40px] bg-[#666666] rounded-xl my-2">
                <input
                  type="email"
                  value={username}
                  name="email"
                  className="rounded-xl outline-none w-full h-full px-3 bg-[#666666]"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col w-full mb-1">
              <div className="w-full">E-mail:</div>
              <div className="w-full sm:w-[368px] h-[40px] bg-[#666666] rounded-xl my-2">
                <input
                  type="email"
                  value={email}
                  name="email"
                  className="rounded-xl outline-none w-full h-full px-3 bg-[#666666]"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="">
              <div className="w-full">Password:</div>
              <div className="w-full sm:w-[368px] h-[40px] bg-[#666666] rounded-xl my-2">
                <input
                  type="password"
                  value={password}
                  name="password"
                  className="rounded-xl outline-none w-full h-full px-3 bg-[#666666]"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="w-full">Confirm Password:</div>
              <div className="w-full sm:w-[368px] h-[40px] bg-[#666666] rounded-xl my-2">
                <input
                  type="password"
                  value={confirm}
                  name="password"
                  className="rounded-xl outline-none w-full h-full px-3 bg-[#666666]"
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full sm:w-[368px] h-[40px] bg-[#FFDC27] rounded-xl my-2">
              <button
                className="w-full h-full text-black font-semibold"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
            <div className="flex text-xs text-[#adadad] justify-center">
              Do have an accout? <Link to="/login"> Login</Link>
            </div>
            <div></div>
          </div>
        </div>
        <img src={robo} alt="" className="absolute w-40 " />
      </div>
    </div>
  );
};

export default Signup;
