import React from "react";
import signibg from "../assets/signin.jpg";
import {
  FaInstagramSquare,
  FaFacebookSquare,
  FaLinkedin,
} from "react-icons/fa";

const Login = () => {
  return (
    <div className="max-w-[1300px] p-2 m-auto h-screen bg-slate-100">
      <div className="object-contain absolute ">
        <img
          src={signibg}
          className="object-cover h-screen rounded-xl w-full"
          alt=""
        />
        {/* <div>fgkjfg</div> */}
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex justify-center flex-col items-center absolute mt-10  ">
          <div className="w-[290px] bg-blue-500 h-[180px] rounded-xl shadow-md shadow-blue-300 absolute top-0 -mt-10 flex justify-center flex-col items-center">
            <h1 className="font-bold text-2xl text-white">Sign in</h1>
            <div className="flex mt-5 w-full justify-center gap-4 items-center">
              <FaLinkedin  size={30} className="text-white cursor-pointer"/>
              <FaFacebookSquare  size={30} className="text-white cursor-pointer"/>
              <FaInstagramSquare size={30} className="text-white cursor-pointer" />
            </div>
          </div>
          <div className="w-[320px] bg-white h-[500px] rounded-lg flex flex-col justify-end p-4">
            <div className="w-full  h-full flex flex-col mt-40 ">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="border-2  flex items-center p-2 m-2 rounded-lg"
              />
              <input
                type="password"
                name="email"
                id="password"
                placeholder="Password"
                className="border-2 flex items-center p-2 m-2 rounded-lg"
              />
            </div>
            <span className="text-gray-400 text-center p-2">
              Sign In To Proceed
            </span>
            <button className="p-4 rounded-md text-white font-bold bg-blue-500 shadow-sm shadow-slate-900">
              Sign in
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
