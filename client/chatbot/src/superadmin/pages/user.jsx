import React from "react";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import '../css/style.css'
// import { IoPersonAddSharp } from "react-icons/tb";

const User = () => {
  const data = [
    {
      logo: 1,
      name: "John Doe",
      businessName: "Trading",
      email: "shubhamkk922@gmail.com",
      phone: 9890845263,
      city: "pune",
      pincode: 411039,
    },
    {
      logo: 2,
      name: "shubham Doe",
      businessName: "Information Technology",
      email: "shubhamkk922@gmail.com",
      phone: 9890845263,
      city: "pune",
      pincode: 411039,
    },
    {
      logo: 3,
      name: "aditya Doe",
      businessName: "Interior",
      email: "shubhamkk922@gmail.com",
      phone: 9890845263,
      city: "pune",
      pincode: 411039,
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="flex flex-col">
        <div className="flex p-2 w-full justify-center">
          <div className=" flex flex-col p-2 m-2 w-[215px]  bg-white shadow h-full rounded-2xl">
            <div className="flex p-4 justify-between">
              <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-gradient-to-tr from-blue-500 to-purple-600 -mt-10 rounded-lg  ">
                <IoPersonAddSharp className="text-white" size={30} />
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-gray-400 text-md">Total User's</span>
                <span className="text-right font-bold text-xl">281</span>
              </div>
            </div>
            <hr className="mb-2 flex w-[150px] justify-center m-auto" />
            <div>
              <h1 className="text-green-500 font-bold">
                +55%{" "}
                <span className=" font-normal text-gray-500">than last week</span>
              </h1>
            </div>
          </div>
          <div className=" flex flex-col p-2 m-2 w-[215px]  bg-white  shadow h-full rounded-2xl">
            <div className="flex p-4 justify-between">
              <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center    shadow-black bg-gradient-to-tr from-blue-500 to-purple-600 -mt-10 rounded-lg  ">
                <IoPersonAddSharp className="text-white" size={30} />
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-gray-400 text-md">Active User's</span>
                <span className="text-right font-bold text-xl">281</span>
              </div>
            </div>
            <hr className="mb-2 flex w-[150px] justify-center m-auto" />
            <div>
              <h1 className="text-green-500 font-bold">
                +55%{" "}
                <span className=" font-normal text-gray-500">than last week</span>
              </h1>
            </div>
          </div>
          <div className=" flex flex-col p-2 m-2 w-[215px]  bg-white shadow h-full rounded-2xl">
            <div className="flex p-4 justify-between">
              <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-gradient-to-tr from-blue-500 to-purple-600 -mt-10 rounded-lg  ">
                <IoPersonAddSharp className="text-white" size={30} />
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-gray-400 text-md">In-Active User's</span>
                <span className="text-right font-bold text-xl">281</span>
              </div>
            </div>
            <hr className="mb-2 flex w-[150px] justify-center m-auto" />
            <div>
              <h1 className="text-green-500 font-bold">
                +55%{" "}
                <span className=" font-normal text-gray-500">than last week</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;


{/* <div className="container mx-auto my-8  p-4 flex justify-center ">
        <h2 className="text-2xl font-semibold absolute w-[900px]  shadow-md shadow-blue-300  bg-blue-500 p-4 text-white rounded-xl">User Information Table</h2>
        <table className="flex flex-col rounded-xl w-full bg-white p-4 mt-10   ">
          <thead className="mt-5">
            <tr className="grid grid-cols-9 text-sm text-gray-600">
              <th className=" p-2 col-span-1">Logo</th>
              <th className=" p-2">Owner Name</th>
              <th className=" p-2">Business Name</th>
              <th className=" p-2 col-span-2  ">Email</th>
              <th className=" p-2">Phone</th>
              <th className=" p-2">City</th>
              <th className=" p-2">Pincode</th>
              <th className="p-2">Edit/Action</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 grid grid-cols-9 w-full text-xs "
              >
                <td className="p-2 text-center">{user.logo}</td>
                <td className="p-2 text-center">{user.name}</td>
                <td className="p-2 text-center">{user.businessName}</td>
                <td className="p-2 text-center col-span-2  ">{user.email}</td>
                <td className="p-2 text-center">{user.phone}</td>
                <td className="p-2 text-center">{user.city}</td>
                <td className="p-2 text-center">{user.pincode}</td>
                <td className="p-2 flex justify-between text-center">
                  <MdEdit size={18} className="cursor-pointer" />
                  <label class="switch">
                    <input type="checkbox" />
                    <div class="slider"></div>
                    <div class="slider-card">
                      <div class="slider-card-face slider-card-front"></div>
                      <div class="slider-card-face slider-card-back"></div>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}