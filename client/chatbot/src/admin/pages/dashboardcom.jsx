import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ImStatsBars } from 'react-icons/im';
// import { IoPersonAddSharp } from 'react-icons/io5';
import { TbSofa } from 'react-icons/tb';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const DashboardCom = ({ token, adminId }) => {
    const [dashDayData, setDaydashData] = useState([]);
    const [dashmonthData, setdashMonthData] = useState([])
    const [totalUserMessage, setTotalUserMessage] = useState('')
    const [totalChatMessage, setTotalChatMessage] = useState('')
    const [allchatmessage, setAllchatMessage] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://chatbotserver1.onrender.com/chat/history", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAllchatMessage(response.data.total_no_chats)
                setTotalChatMessage(response.data.total_bot_messages)
                setTotalUserMessage(response.data.total_user_messages)
                setDaydashData(response.data.daywise_chat_counts);
                setdashMonthData(response.data.monthwise_chat_counts)
                console.log("day data>>", response.data.daywise_chat_counts);
                console.log("day data>>", response.data.monthwise_chat_counts);
              
            } catch (err) {
                console.log("error fetching data>>>", err);
            }
        };

        fetchData();
    }, [token]);

    // Extracting data for LineChart
    const chartData = Object.keys(dashDayData).map(day => ({ name: day, chats: dashDayData[day] }));
    const MonthData = Object.keys(dashmonthData).map(day => ({ name: day, chats: dashmonthData[day] }));

    return (
        <div className='w-full h-screen scale-95  '>
            <div className="flex p-2 w-full justify-end">
                <div className=" flex flex-col p-2 m-2 w-[215px]  bg-white shadow h-full rounded-2xl">
                    <div className="flex p-4 justify-between">
                        <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-slate-950 -mt-10 rounded-lg  ">
                            <TbSofa className="text-white" size={30} />
                        </div>
                        <div className="flex flex-col justify-end">
                            <span className="text-gray-400 text-md">Bookings</span>
                            <span className="text-right font-bold text-xl">{totalUserMessage}</span>
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
                        <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-blue-500 -mt-10 rounded-lg  ">
                            <ImStatsBars className="text-white" size={30} />
                        </div>
                        <div className="flex flex-col justify-end">
                            <span className="text-gray-400 text-md">Today's Users</span>
                            <span className="text-right font-bold text-xl">{totalChatMessage}</span>
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
                        <div className="w-[50px] h-[50px] shadow-sm flex items-center justify-center   shadow-black bg-blue-500 -mt-10 rounded-lg  ">
                            <ImStatsBars className="text-white" size={30} />
                        </div>
                        <div className="flex flex-col justify-end">
                            <span className="text-gray-400 text-md">Today's Users</span>
                            <span className="text-right font-bold text-xl">{allchatmessage}</span>
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
            <div className='flex justify-center gap-4'>
                <div className='flex flex-col justify-center w-full items-center rounded-lg'>
                    <div className='w-[480px] h-[300px] flex -mt-10 absolute bg-blue-500 rounded-xl p-4'>
                        <LineChart className="mt-1 w-full "
                            width={450}
                            height={300}
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
                    <div className='w-[500px] h-[340px] mt-14 flex bg-white rounded-xl items-end '>
                        <h1 className='text-2xl font-semibold text-center w-full
                        p-4'>Data Showing Number of chats of today</h1>
                    </div>
                </div>
                <div className='flex flex-col justify-center w-full items-center rounded-lg'>
                    <div className='w-[480px] h-[300px] flex -mt-10 absolute rounded-xl bg-slate-800 p-4'>
                        <LineChart className="mt-1 w-full "
                            width={450}
                            height={300}
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
                    <div className='w-[500px] h-[340px] mt-14 flex bg-white rounded-xl items-end '>
                        <h1 className='text-2xl font-semibold text-center w-full
                        p-4'>Data Showing Number of chats of today</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    token: state.token,
    adminId: state.adminId,
});

export default connect(mapStateToProps)(DashboardCom);
