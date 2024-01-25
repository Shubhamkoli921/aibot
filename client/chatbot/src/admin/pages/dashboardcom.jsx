import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const DashboardCom = () => {
    const [dashDayData, setDaydashData] = useState([]);
    const [dashmonthData,setdashMonthData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/chat/history");
                setDaydashData(response.data.daywise_chat_counts);
                setdashMonthData(response.data.monthwise_chat_counts)
                console.log("day data>>", response.data.daywise_chat_counts);
                console.log("day data>>", response.data.monthwise_chat_counts);
            } catch (err) {
                console.log("error fetching data>>>", err);
            }
        };

        fetchData();
    }, []);

    // Extracting data for LineChart
    const chartData = Object.keys(dashDayData).map(day => ({ name: day, sales: dashDayData[day] }));
    const MonthData = Object.keys(dashmonthData).map(day => ({ name: day, sales: dashmonthData[day] }));

    return (
        <div className='w-full h-full scale-95  '>
            <div className='flex justify-center gap-4'>
                <div className='flex flex-col justify-center w-full items-center rounded-lg'>
                    <div className='w-[480px] h-[320px] flex bg-slate-800 p-4'>
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
                                dataKey="sales"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </div>
                    <div className='w-[490px] h-[100px] flex bg-white justify-center items-center '>
                        <h1 className='text-2xl font-semibold text-center'>Data Showing Number of chats of today</h1>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-center w-full rounded-xl '>
                    <div className='w-[480px] h-[320px] flex bg-blue-600 p-4'>
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
                                dataKey="sales"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </div>
                    <div className='w-[490px] h-[100px] flex bg-white justify-center items-center '>
                        <h1 className='text-2xl font-semibold text-center '> Data Showing Number of chats till now</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCom;
