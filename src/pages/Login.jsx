import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { updateAccessToken, updateUser } from "../app/chatSlice";
import { useDispatch } from "react-redux";
import logo from "../image/eveegpt.png";
import first from "../image/first.png";
import robo from "../image/robo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [session,setSession]=useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      dispatch(updateUser(sessionStorage.getItem("user")));
      dispatch(updateAccessToken(sessionStorage.getItem("token")));
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      sessionStorage.setItem("token", user.accessToken);
      sessionStorage.setItem("user", user.email);

      dispatch(updateUser(user.email));
      dispatch(updateAccessToken(user.accessToken));

      navigate("/");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        alert("invalid email or password");
      }
      console.log(error.message);
    }
  };
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
              Login
            </div>
            <div className="flex flex-col w-full my-4">
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

            <div className="mb-1">
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
            <div className="w-full flex items-center gap-2 mb-10">
              <div className="w-3 h-3 bg-[#666666] rounded-sm"></div>
              <div className="">Forgott password?</div>
            </div>
            <div className="w-full sm:w-[368px] h-[40px] bg-[#FFDC27] rounded-xl my-2">
              <button className="w-full h-full text-black font-semibold" onClick={handleSubmit}>Sign in</button>
            </div>
            <div className="flex text-xs text-[#adadad] justify-center">
              Do have an accout? <Link to="/signup">Sing Up</Link>
            </div>
            <div></div>
          </div>
        </div>
        <img src={robo} alt="" className="absolute w-40 " />
      </div>
    </div>
  );
};

export default Login;
