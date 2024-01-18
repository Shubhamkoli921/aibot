import React from 'react'
import pbg from '../assets/profilebg.jpg'

const Profile = () => {
  return (
    <>
        <div className='w-full p-4 h-full' >
            <div className='flex w-full flex-col'>
            <div className='h-[180px] p-2 flex object-contain justify-center'>
                <img className='w-full h-full object-cover rounded-md' src={pbg} alt="" />
            </div>
                <div>
                    
                </div>
            </div>    
        </div>
    </>
  )
}

export default Profile