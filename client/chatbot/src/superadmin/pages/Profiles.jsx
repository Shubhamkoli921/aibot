import React from 'react'
import pbackground from '../assets/profile-background.jpg'
import profilepic from '../assets/profilepic.jpg'
import { FaInstagramSquare,FaFacebookSquare ,FaLinkedin  } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoMdSettings  } from "react-icons/io";
const Profiles = () => {
  return (
    <>
        <div className='w-full h-full overflow-auto'>
            <div className='h-[180px] p-2 flex object-contain justify-center'>
                <img className='w-full h-full object-cover rounded-md' src={pbackground} alt="" />
            </div>
            <div className='bg-white max-w-[1100px] flex flex-col rounded-lg relative shadow-md shadow-black -mt-10 m-auto h-full'>
               <div className='flex w-full justify-around'>
                    <div className='w-full p-4 flex items-center'>
                        <img src={profilepic} className='w-[60px] rounded-full' alt="" />
                        <div className='flex flex-col items-center ml-2 h-full  '>
                            <h1 className='text-blue-800 uppercase font-bold mt-2'>shubham koli</h1>
                            <span className='text-gray-500 text-sm '>CEO / Co-Founder</span>
                        </div>

                    </div>
                    <div className='w-full justify-end flex p-4 items-center'>
                        <IoMdSettings  size={30} className='cursor-pointer hover:animate-spin' />
                    </div>
               </div>
                <hr className='w-[850px] m-auto'  />
               <div className='flex flex-col'>
                <div className='flex justify-between p-4'>
                    <h1 className='text-blue-800 font-bold'>Profile Information</h1>
                    <MdEdit />
                </div>
                <div className='p-4'>
                    <p className='text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium natus laudantium fugiat ut voluptates voluptatibus ipsum adipisci dolor exercitationem cupiditate eius error odit blanditiis, quasi aperiam debitis, repellendus et ducimus? Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero id debitis qui facilis ducimus provident voluptates sit tenetur laborum voluptatum quis quas impedit aliquid ipsam iste, unde numquam repellendus. Ea.</p>
                   <div className='p-4 m-2'>
                   <p className='m-2 font-bold text-blue-800 '>Full Name : <span className='text-gray-500 font-normal'>Shubham koli</span></p>
                    <p className='m-2 font-bold text-blue-800 '>Mobile : <span className='text-gray-500 font-normal'>9890845263</span></p>
                     <p className='m-2 font-bold text-blue-800 '>Email : <span className='text-gray-500 font-normal'>shubhamkk922@gmail.com</span></p>
                    <p className='m-2 font-bold text-blue-800 '>Location : <span className='text-gray-500 font-normal'>India</span></p>
                    <p className='m-2 font-bold text-blue-800 flex   '>Socials : <span className='text-gray-500 font-normal flex items-center ml-2'><FaLinkedin className='text-blue-600' /><FaFacebookSquare className='text-blue-700' /><FaInstagramSquare className='text-orange-500' /></span></p>
                   </div>
                </div>
               </div>
              
              
            </div>
        </div>
    </>
  )
}

export default Profiles
