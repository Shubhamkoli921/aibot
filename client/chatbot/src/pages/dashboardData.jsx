import React from "react";
import { TbSofa } from "react-icons/tb";
import { IoPersonAddSharp } from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";

const DashBoardData = () => {
  return (
    <div className="w-full h-full">
      <div className="flex p-2 w-full justify-center">
        <div className=" flex flex-col p-2 m-2 w-[215px] shadow-gray-600 bg-white shadow h-full rounded-2xl">
          <div className="flex p-4 justify-between">
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-slate-950 -mt-10 rounded-lg  ">
              <TbSofa className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Bookings</span>
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
        <div className=" flex flex-col p-2 m-2 w-[215px] shadow-gray-600 bg-white shadow h-full rounded-2xl">
          <div className="flex p-4 justify-between">
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-blue-500 -mt-10 rounded-lg  ">
              <ImStatsBars className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Today's Users</span>
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
        <div className=" flex flex-col p-2 m-2 w-[215px] shadow-gray-600 bg-white shadow h-full rounded-2xl">
          <div className="flex p-4 justify-between">
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-green-500 -mt-10 rounded-lg  ">
              <FaShop className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Reports</span>
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
        <div className=" flex flex-col p-2 m-2 w-[215px] shadow-gray-600 bg-white shadow h-full rounded-2xl">
          <div className="flex p-4 justify-between">
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-rose-500 -mt-10 rounded-lg  ">
              <IoPersonAddSharp className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Bookings</span>
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
      {/* dfsdfsdfsfsdfsdfsdf */}
      <div className="flex p-2 w-full ">
        <div className="flex justify-center flex-col items-center absolute mt-10  ">
          <div className="w-[280px] bg-green-500 h-[200px] rounded-md shadow-md shadow-green-300 absolute top-0 -mt-10"></div>
          <div className="w-[300px] bg-white h-[300px] rounded-lg shadow-md shadow-slate-300 flex flex-col justify-end p-4">
            <div className="w-full mt-40 h-full flex flex-col">
              <span className="font-bold">Websites Views</span>
              <span className="text-gray-400">Last Campaign Performance</span>
              <hr/>
              <span className="text-gray-400">Campaign sent 2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardData;
