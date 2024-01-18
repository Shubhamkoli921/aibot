import React from 'react'
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

    const data = [
        { name: "January", sales: 25 },
        { name: "February", sales: 59 },
        { name: "March", sales: 60 },
        { name: "April", sales: 811 },
        { name: "May", sales: 56 },
    ];

    const daydata = [
        { name: "Sunday", sales: 25 },
        { name: "Monday", sales: 89 },
        { name: "Tuesday", sales: 60 },
        { name: "Wednesday", sales: 211 },
        { name: "Thursday", sales: 56 },
        { name: "Friday", sales: 156 },
        { name: "Saturday", sales: 56 },
    ];


    return (
        <div className='w-full h-full scale-95  '>
            <div className='flex justify-center gap-4'>
                <div className='flex flex-col justify-center w-full items-center rounded-lg'>
                    <div className='w-[480px] h-[320px] flex bg-slate-800 p-4'>
                        <LineChart className="mt-1 w-full "
                            width={450}
                            height={300}
                            data={data}
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
                <div className='flex flex-col justify-center items-center w-full rounded-xl '>
                    <div className='w-[480px] h-[320px] flex bg-blue-600 p-4'>
                        <LineChart className="mt-1 w-full "
                            width={450}
                            height={300}
                            data={daydata}
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
            </div>

        </div>
    )
}

export default DashboardCom