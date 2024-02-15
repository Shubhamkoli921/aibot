import React, { useCallback, useEffect, useState } from "react";
import { IoClose, IoPersonAddSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FcFullTrash, FcRules } from "react-icons/fc";
import { connect } from 'react-redux';
import Modal from "react-modal";
// import {  useSelector } from 'react-redux';
import '../css/style.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
// import { updateChatbotLink } from '../../state/action.js';
import { updateChatbotLink } from '../../state/action.js';

// import { IoPersonAddSharp } from "react-icons/tb";

const User = () => {

  const location = useLocation();
  const token = location.state ? location.state.token : '';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const chatbotLink = useSelector((state) => state.chatbotLink);
  const [content, setContent] = useState('ShowUser');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    logo: '',
    email: '',
    phone: '',
    city: '',
    pincode: '',
    password: '',
    confirmPassword: "",
    chatbotLink: '', // Added chatbot link state
    enabled: true,
  });
  const [updatingAdminId, setUpdatingAdminId] = useState(null); // Define updatingAdminId state
  // const [chatbotLink, setChatbotLink] = useState('');

  const handleOnclick = (section) => {
    setContent(section === content ? 'AddUsers' : section);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await fetch('https://chatbotserver1.onrender.com/admins', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
      const data = await response.json();
      setAdmins(data.admins);
      setFormData({ ...formData, chatbotLink: data.chatbot_link });
      dispatch(updateChatbotLink(data.chatbotLinks));// setChatbotLink(data.chatbot_link); // Set the chatbot link received from the server
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  }, [token,dispatch,formData]);

  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token, fetchAdmins]);

  const handleAddAdmin = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }

    try {
      const response = await fetch('https://chatbotserver1.onrender.com/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add admin');
      }
      const data = await response.json();

      alert("Added successfully");
      setFormData({ ...formData, chatbotLink: data.chatbot_link }); // Set the chatbot link received from the server
      setFormData({
        name: '',
        business_name: '',
        logo: '',
        email: '',
        phone: '',
        city: '',
        pincode: '',
        password: '',
        confirmPassword: '',
        enabled: true,
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };


  const handleDeleteAdmin = async (adminId) => {
    try {
      const response = await fetch(`https://chatbotserver1.onrender.com/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete admin');
      }
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };
  const handleUpdateAdmin = async (adminId) => {
    try {
      const response = await fetch(`https://chatbotserver1.onrender.com/admins/${adminId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch admin details');
      }
      const data = await response.json();
      setFormData({
        name: data.name || '',
        business_name: data.business_name || '',
        logo: data.logo || '',
        email: data.email || '',
        phone: data.phone || '',
        city: data.city || '',
        pincode: data.pincode || '',
        password: data.password || '',
        enabled: data.enabled || true,
      });
      setUpdatingAdminId(adminId);

      openModal();
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const handleSaveUpdate = async () => {
    try {
      const response = await fetch(`https://chatbotserver1.onrender.com/${updatingAdminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update admin');
      }
      fetchAdmins(); // Refresh the admins list after updating
      closeModal();
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };
  const handleChatbotLinkClick = (adminId, chatbotLink) => {
    // Dispatch the action to update the chatbot link in Redux
    dispatch(updateChatbotLink(chatbotLink));

    // Navigate to the chat page with the adminId
    navigate(`/chat/${adminId}`);
  };

  return (

    <div className="w-full h-full">
      <div className="flex flex-col">
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

          </div>
        </div>
        <div>
          <div className="flex w-full justify-end gap-4 scale-90 ">

            <li className="text-xl list-none cursor-pointer uppercase p-3 bg-blue-500 text-white rounded-xl font-semibold" onClick={() => handleOnclick('ShowUser')} value="ShowUser">Show users</li>
            <li className="text-xl list-none cursor-pointer uppercase p-3 bg-blue-500 text-white rounded-xl font-semibold" onClick={() => handleOnclick('AddUsers')} value="AddUsers">Add users</li>

          </div>
          {{
            'ShowUser':
              <div className="container mx-auto p-4 flex justify-center ">
                <h2 className="text-2xl font-semibold absolute w-[900px]  shadow-md shadow-blue-300  bg-blue-500 p-4 text-white rounded-xl">User Information Table</h2>
                <table className="flex flex-col rounded-xl w-full bg-white p-4 mt-10   ">
                  <thead className="mt-5">
                    <tr className="grid grid-cols-9 text-sm text-gray-600">
                      <th className=" p-2 ">Logo</th>
                      <th className=" p-2">Owner Name</th>
                      <th className=" p-2">Business Name</th>
                      <th className=" p-2 col-span-1  ">Email</th>
                      <th className=" p-2">Phone</th>
                      <th className=" p-2">City</th>
                      <th className=" p-2">Pincode</th>
                      <th className=" p-2">Link</th>
                      <th className="p-2">Action</th>
                      {/* <th className="p-2">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {admins && admins.length > 0 ? (
                      admins.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100 grid grid-cols-9 w-full text-xs">
                          <td className="p-2 text-center">{user.logo}</td>
                          <td className="p-2 text-center">{user.name}</td>
                          <td className="p-2 text-center">{user.business_name}</td>
                          <td className="p-2 text-center col-span-1">{user.email}</td>
                          <td className="p-2 text-center">{user.phone}</td>
                          <td className="p-2 text-center">{user.city}</td>
                          <td className="p-2 text-center">{user.pincode}</td>
                          <td className="p-2 text-center cursor-pointer">
                            <a href={user.chatbot_link} onClick={() => handleChatbotLinkClick(user._id, user.chatbot_link)}>cht</a>
                          </td>
                          <td className="p-2 flex justify-between text-center">
                            <MdEdit onClick={() => handleUpdateAdmin(user._id)} size={18} className="cursor-pointer" />
                            <FcFullTrash size={18} onClick={() => handleDeleteAdmin(user._id)} className="cursor-pointer" />
                            <label className="switch">
                              <input type="checkbox" />
                              <div className="slider"></div>
                              <div className="slider-card">
                                <div className="slider-card-face slider-card-front"></div>
                                <div className="slider-card-face slider-card-back"></div>
                              </div>
                            </label>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">No admins found</td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>,
            'AddUsers':
              <div>
                <h2 className="text-2xl font-semibold m-auto mt-4  w-[95%] relative  shadow-md shadow-blue-300  bg-blue-500 p-4 text-white rounded-xl">Add User Table</h2>
                <form className="grid grid-cols-3 bg-white p-4 -mt-3 rounded-xl ">
                  <input
                    type="text"
                    placeholder="User Name"
                    className="border-none items-center p-2 m-2 rounded-lg bg-gray-200"
                    value={formData.name}  // Set the value prop to formData.name
                    onChange={(e) => handleInputChange(e, 'name')}  // Pass the field name as a second argument
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="border-none items-center p-2 m-2 rounded-lg bg-gray-200"
                    value={formData.password}
                    onChange={(e) => handleInputChange(e, "password")}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="border-none items-center p-2 m-2 rounded-lg bg-gray-200"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange(e, "confirmPassword")}
                  />

                  <input type="text"
                    placeholder="Business Name"
                    className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                    value={formData.business_name}
                    onChange={(e) => handleInputChange(e, 'business_name')}
                  />
                  <input type="email"
                    placeholder="Email"
                    className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                  />
                  <input type="text"
                    placeholder="Phone No"
                    className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e, 'phone')}
                  />
                  <input type="text"
                    placeholder="City"
                    className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                    value={formData.city}
                    onChange={(e) => handleInputChange(e, 'city')}
                  />
                  <input type="text"
                    placeholder="Pincode"
                    className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                    value={formData.pincode}
                    onChange={(e) => handleInputChange(e, 'pincode')}
                  />
                  <input type="text"
                    placeholder="logo"
                    className=" border-none   items-center p-2 m-2 rounded-lg bg-gray-200 "
                    value={formData.logo}
                    onChange={(e) => handleInputChange(e, 'logo')}
                  />

                </form>
                <div className="flex justify-center w-full">

                  {updatingAdminId ? (
                    <button type="button" onClick={openModal}>
                      Update Admin
                    </button>
                  ) : (
                    <button type="button" onClick={handleAddAdmin}>
                      Add Admin
                    </button>
                  )}
                </div>

              </div>,
          }[content]}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Update User Modal"
          >
            <div className="flex justify-between w-full p-4 bg-blue-500 text-white rounded-md">

              <h2>Update User</h2>
              <button type="button" onClick={closeModal}>
                <IoClose size={20} />
              </button>
            </div>
            <form className="grid grid-cols-2 p-4 mt-3 rounded-xl ">
              <input
                type="text"
                placeholder="User Name"
                className="border-none items-center p-2 m-2 rounded-lg bg-gray-200"
                value={formData.name}  // Set the value prop to formData.name
                onChange={(e) => handleInputChange(e, 'name')}  // Pass the field name as a second argument
              />

              <input type="text"
                placeholder="Business Name"
                className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                value={formData.business_name}
                onChange={(e) => handleInputChange(e, 'business_name')}
              />
              <input type="email"
                placeholder="Email"
                className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                value={formData.email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              <input type="text"
                placeholder="Phone No"
                className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                value={formData.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
              />
              <input type="text"
                placeholder="City"
                className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                value={formData.city}
                onChange={(e) => handleInputChange(e, 'city')}
              />
              <input type="text"
                placeholder="Pincode"
                className=" border-none  items-center p-2 m-2 rounded-lg bg-gray-200 "
                value={formData.pincode}
                onChange={(e) => handleInputChange(e, 'pincode')}
              />
              <input type="text"
                placeholder="logo"
                className=" border-none col-span-2  items-center p-2 m-2 rounded-lg bg-gray-200 "
                value={formData.logo}
                onChange={(e) => handleInputChange(e, 'logo')}
              />

            </form>
            <div className="flex w-full justify-center items-center">

              <button className="text-xl" type="button" onClick={handleSaveUpdate}>
                Save
              </button>
              <FcRules size={20} />
            </div>

          </Modal>
        </div>
      </div>
      {/* {console.log("link....",chatbotLink)} */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  adminId: state.adminId,
  chatbotLinks: state.chatbotLinks,
});

export default connect(mapStateToProps)(User);

