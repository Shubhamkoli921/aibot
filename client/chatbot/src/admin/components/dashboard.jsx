import React, { useState } from "react";
import Data from "../pages/data";
import Profile from "../pages/profile";
import DashboardCom from "../pages/dashboardcom";
import Chats from "../../chatbot/chatbot";
import Chat from "../pages/chat";

const AdminDashBoard = ({ token, adminId }) => {
  const [content, setContent] = useState('dash');

  const handleClick = (section) => {
    setContent(section === content ? null : section);
  };

  const navigationItems = [
    { label: 'Dashboard', id: 'dash' },
    { label: 'Data processing', id: 'data' },
    { label: 'Profile', id: 'profile' },
    { label: 'Chat Data', id: 'chattext' },
    { label: 'chat History', id: 'chathistory' }
  ];

  return (
    <>
      <div className='w-full flex h-screen p-4'>
        <div className='w-[20%] bg-gradient-to-t from-gray-900 to-gray-950 0 h-full rounded-md'>
          <nav className='text-white flex flex-col justify-between w-full h-full'>
            <ul className='p-4 m-2 gap-4 flex flex-col'>
              <li>chatbot.ai</li>
              <hr />
              {navigationItems.map((item) => (
                <li
                  key={item.id}
                  className={`p-2 rounded cursor-pointer ${content === item.id ? 'bg-blue-400 ease-in-out ' : ''
                    }`}
                  onClick={() => handleClick(item.id)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
            <ul className='p-4 m-2'>
              <li className='p-2 bg-blue-400 rounded cursor-pointer'>logout</li>
            </ul>
          </nav>
        </div>
        <div className='w-[80%] bg-slate-100 h-full'>
          {content === 'dash' && <DashboardCom />}
          {content === 'data' && <Data />}
          {content === 'profile' && <Profile />}
          {content === 'chattext' && <Chats token={token} adminId={adminId} />}
          {content === 'chathistory' && <Chat />}
          {!content && <p>Select a section</p>}
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
