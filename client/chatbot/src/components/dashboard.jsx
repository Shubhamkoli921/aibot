// Dashboard.js

import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import { TbReportSearch,TbLogout2  } from "react-icons/tb";
import DashBoardData from '../pages/dashboardData';
import Profiles from '../pages/Profiles';
import User from '../pages/user';
import Report from '../pages/report';

const Dashboard = () => {
  // const [chatCount, setChatCount] = useState(0);
  // const [todayChats, setTodayChats] = useState([]);
  const [content,setContent] = useState('section1')

  const handleOnclick = (section)=>{
    setContent(section === content ? null : section);
  }

  // useEffect(() => {
  //   // Fetch data from the Flask backend for the dashboard
  //   const fetchDashboardData = async () => {
  //     try {
  //       const response = await fetch('your-backend-url/dashboard', {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });

  //       const data = await response.json();

  //       // Update state with fetched data
  //       setChatCount(data.chatCount);
  //       setTodayChats(data.todayChats);
  //     } catch (error) {
  //       console.error('Error fetching dashboard data', error);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <>
    <div className='flex h-screen w-full p-4'>
        <div className='w-full h-full overflow-auto bg-slate-900 text-white rounded-2xl'>
            <div className='flex text-center justify-center items-center h-[50px]'>
                chatbot.Ai
            </div>
            <div className='flex m-4 items-center'>
                <li onClick={()=>handleOnclick('section1')} className='p-2 cursor-pointer flex items-center '><ImProfile className='m-2' />Profiles</li>
            </div>

            <hr className='bg-gray-400 w-[220px] flex m-auto'/>
            <div className='flex flex-col m-4'>
                <div className='flex items-center'>
                    <li onClick={()=>handleOnclick('section2')} className='p-2 mt-2 cursor-pointer bg-blue-400 rounded-md flex items-center w-full'><MdDashboard className='m-2' />DashBoard</li>
                </div>
                <div className='flex items-center'>
                    <li onClick={()=>handleOnclick('section3')} className='p-2 mt-2 cursor-pointer bg-blue-400 rounded-md flex items-center w-full'><LuUsers className='m-2' />User's</li>
                </div>
                <div className='flex items-center'>
                    <li onClick={()=>handleOnclick('section4')} className='p-2 mt-2 cursor-pointer bg-blue-400 rounded-md flex items-center w-full'><TbReportSearch className='m-2' />Report's</li>
                </div>
            </div>
            <div className='flex flex-col m-4 justify-end  h-full'>

            
            <div className='flex bottom-0 m-4'>
              <li onClick={()=>handleOnclick('section4')} className='p-2 mt-2 cursor-pointer bg-blue-400 rounded-md flex items-center h-[40px] justify-center w-full'><TbLogout2  className='m-2' />Log out</li>
            </div>
            </div>
        </div>
            <div className='w-ful h-screen ml-2 '>
            <div className='p-4 bg-slate-100 w-[980px] rounded-xl h-screen text-black'>
                {content === 'section1' && <div><Profiles/></div>}
                {content === 'section2' && <div><DashBoardData/></div>}
                {content === 'section3' && <div><User/></div>}
                {content === 'section4' && <div> <Report /></div>}
               

            </div>
        </div>
    </div>
    </>
  );
};

export default Dashboard;
