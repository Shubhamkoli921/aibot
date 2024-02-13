import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const Chat = ({ token, adminId }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Set the number of items per page

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get("https://chatbotserver1.onrender.com/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChatHistory(response.data.chat_history);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        // Handle errors here, e.g., set an error state
      }
    };
  
    fetchChatHistory();
  }, [token]);

  const openModal = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  // Get current items based on page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chatHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='flex-col scale-95 flex w-full h-full items-center'>
      <h2 className="text-2xl justify-center items-center font-semibold w-full mt-10 shadow-md shadow-blue-300 bg-blue-500 p-4 text-white rounded-xl">User Chat Information Table</h2>
      {!loading && chatHistory.length > 0 ? (
        <div className='w-full'>
          <table className="flex flex-col rounded-xl w-full h-full bg-white p-4 relative">
            <thead className="mt-5">
              <tr className="grid grid-cols-3 text-sm text-gray-600">
                <th className="p-2">User's ID</th>
                <th className="p-2">User's Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index} className="grid grid-cols-3 text-sm text-gray-600  p-2 cursor-pointer hover:bg-gray-100">
                  <td className="text-center p-2">{user.user_id}</td>
                  <td className="p-2 text-center">{user.user_name}</td>
                  <td className='p-2 text-center'>
                    <button onClick={() => openModal(user)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination buttons */}
          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(chatHistory.length / itemsPerPage))].map((_, index) => (
              <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center mt-4">No chat history available.</p>
      )}

      {selectedUser && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
          <div className="bg-white overflow-auto p-8 w-full scale-95 h-full rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">User chat Details</h2>
            <p className='font-semibold'>User ID: {selectedUser.user_id}</p>
            <p className='font-semibold'>User Name: {selectedUser.user_name}</p>
            <p className='font-semibold'>Data:</p>
            {selectedUser.data.map((userData, index) => (
              <div key={index} className='mb-4'>
                <p className='font-semibold'>Role: <span className='font-normal'>{userData.role}</span></p>
                <p className='font-semibold'>Message: <span className='font-normal'>{userData.message}</span></p>
                <p className='font-semibold'>Time: <span className='font-normal'>{userData.timestamp}</span></p>
                <hr />
              </div>
            ))}
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
    token: state.token,
    adminId: state.adminId,
});

export default connect(mapStateToProps)(Chat);