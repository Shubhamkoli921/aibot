import React from "react";
import { IoPersonAddSharp } from "react-icons/io5";
// import { IoPersonAddSharp } from "react-icons/tb";

const User = () => {
  const data = [
    { id: 1, name: "John Doe", age: 25, occupation: "Engineer" },
    { id: 2, name: "Jane Smith", age: 30, occupation: "Designer" },
    { id: 3, name: "Bob Johnson", age: 28, occupation: "Developer" },
  ];

  return (
    <div className="w-full h-full">
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
      <div className="container mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">User Information Table</h2>
      <table className="border-collapse border w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Occupation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.age}</td>
              <td className="border p-2">{user.occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default User;
