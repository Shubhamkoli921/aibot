import React, { useEffect, useState } from "react";
// import { TbSofa } from "react-icons/tb";
import { IoPersonAddSharp } from "react-icons/io5";
import { connect } from 'react-redux';
import { FaShop } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
// import Report from "./report";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const DashBoardData = ({ token }) => {

  const [numusers, setNumusers] = useState('')
  const [todaychats, setTodaychats] = useState('')
  const [totalchats, settotalchats] = useState('')
  const [dashDayData, setDaydashData] = useState([]);
  const [dashmonthData, setdashMonthData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/chat/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setNumusers(response.data.totals.num_users)
        setTodaychats(response.data.totals.today_chats)
        settotalchats(response.data.totals.total_chats)
        setDaydashData(response.data.daywise_chat_counts);
        setdashMonthData(response.data.monthwise_chat_counts)


      } catch (err) {
        console.log("error fetching data>>>", err);
      }
    };

    fetchData();
  }, [token]);

  const chartData = Object.keys(dashDayData).map(day => ({ name: day, chats: dashDayData[day] }));
  const MonthData = Object.keys(dashmonthData).map(day => ({ name: day, chats: dashmonthData[day] }));

  return (
    <div className="w-full h-full">
      <div className="flex p-2 w-full justify-center">

        <div className=" flex flex-col p-2 m-2 w-[215px]  bg-white shadow h-full rounded-2xl">
          <div className="flex p-4 justify-between">
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-blue-500 -mt-10 rounded-lg  ">
              <ImStatsBars className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Total Users</span>
              <span className="text-right font-bold text-xl">{numusers}</span>
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
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-green-500 -mt-10 rounded-lg  ">
              <FaShop className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Today's Chat</span>
              <span className="text-right font-bold text-xl">{todaychats}</span>
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
            <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-rose-500 -mt-10 rounded-lg  ">
              <IoPersonAddSharp className="text-white" size={30} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="text-gray-400 text-md">Total Chats</span>
              <span className="text-right font-bold text-xl">{totalchats}</span>
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
      <div className="flex p-2 w-full justify-center  ">
        <div className="flex justify-center gap-4 items-center absolute mt-10  ">
          <div className="flex justify-center w-full ">
            <div className="w-[280px] bg-green-500 h-[200px] rounded-md shadow-md shadow-green-300 absolute top-0 -mt-10">
              <LineChart className="mt-1 w-full "
                width={260}
                height={220}
                data={chartData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
            <div className="w-[300px] bg-white h-[300px] rounded-lg shadow-md shadow-slate-300 flex flex-col justify-end p-4">
              <div className="w-full mt-40 h-full flex flex-col">
                <span className="font-bold">Websites Views</span>
                <span className="text-gray-400">Last Campaign Performance</span>
                <hr />
                <span className="text-gray-400">Campaign sent 2 days ago</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full ">
            <div className="w-[280px] bg-blue-500 h-[200px] rounded-md shadow-md shadow-blue-300 absolute top-0 -mt-10">
            <LineChart className="mt-1 w-full "
                width={260}
                height={220}
                data={MonthData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
            <div className="w-[300px] bg-white h-[300px] rounded-lg shadow-md shadow-slate-300 flex flex-col justify-end p-4">
              <div className="w-full mt-40 h-full flex flex-col">
                <span className="font-bold">Websites Views</span>
                <span className="text-gray-400">Last Campaign Performance</span>
                <hr />
                <span className="text-gray-400">Campaign sent 2 days ago</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full ">
            <div className="w-[280px] bg-rose-500 h-[200px] rounded-md shadow-md shadow-rose-300 absolute top-0 -mt-10">

            </div>
            <div className="w-[300px] bg-white h-[300px] rounded-lg shadow-md shadow-slate-300 flex flex-col justify-end p-4">
              <div className="w-full mt-40 h-full flex flex-col">
                <span className="font-bold">Websites Views</span>
                <span className="text-gray-400">Last Campaign Performance</span>
                <hr />
                <span className="text-gray-400">Campaign sent 2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
  // adminId: state.adminId,
});

export default connect(mapStateToProps)(DashBoardData);
