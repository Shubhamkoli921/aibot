import React, { useEffect, useState } from "react";
import png from '../../src/admin/assets/chatbot.png';
import sci from '../../src/admin/assets/science (1).png';
import axios from "axios";
import { connect } from 'react-redux';

const Chat = ({ token, adminId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const initialMessages = [
      { text: "Hello! I'm Chatbot.ai. What's your name?", sender: 'bot', time: getTime() },
    ];
    setMessages(initialMessages);
    console.log("token>>>---",token);
    console.log("admin>>>---",adminId);

  }, []);

  const handleSendMessage = async () => {
    try {
      if (userName === '') {
        const isNameMessage = newMessage.trim().toLowerCase().includes('my name is');

        if (isNameMessage) {
          const extractedName = newMessage.trim().toLowerCase().replace('my name is', '').trim();
          setUserName(extractedName);
          setUserId(generateUserId());
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: `Nice to meet you, ${extractedName}! How can I help you?`, sender: 'bot', time: getTime() },
          ]);
          setNewMessage('');
          return;
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "I'd love to know your name! Please tell me your name by saying 'My name is [your name]'.", sender: 'bot', time: getTime() },
          ]);
          setNewMessage('');
          return;
        }
      }

      const currentTime = getTime();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, sender: 'user', time: currentTime },
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Typing...', sender: 'bot', time: getTime() },
      ]);
      setLoading(true);

      if (!token) {
        throw new Error('Token not available');
      }

      const response = await axios.post(
        `http://localhost:5000/chat?q=${encodeURIComponent(newMessage)}&userId=${userId}`,
        { message: newMessage, userId: userId, userName: userName },
        { headers: { Authorization: `Bearer ${token}` } }
        );
       
      if (!response.data) {
        throw new Error('Empty response');
      }

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { text: response.data.message, sender: 'bot', time: getTime() },
      ]);

      const chatContainer = document.getElementById('chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error fetching chat response. Please try again.', sender: 'bot', time: getTime() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const generateUserId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const getBackgroundColor = (message) => {
    if (message.sender === 'bot') {
      if (message.text.includes('Error')) {
        return 'bg-red-300';
      } else if (message.text.includes('Recommendation')) {
        return 'bg-green-300';
      }
      return 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white';
    } else {
      return 'bg-white text-black ';
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-5 gap-4 bg-gradient-to-tr from-blue-500 to-indigo-500 flex">
        <div className="w-[60px] flex justify-center items-center h-[60px]">
          <img className="w-full" src={png} alt="img" />
        </div>
        <div className="text-white">
          <h1>Hii user</h1>
          <span>i'm here to help, so if you have any question, go ahead and ask me!</span>
        </div>
      </div>
      <div id="chat-container" className="flex-1 overflow-y-auto bg-slate-100 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="w-auto flex">
              {message.sender === 'bot' && (
                <div className="flex items-center justify-center w-10 h-10">
                  <img
                    src={sci}
                    alt="Chatbot Logo"
                    className="h-7 w-7"
                  />
                </div>
              )}
              <div className={`p-2 w-full flex flex-col ml-2 rounded-lg ${getBackgroundColor(message)}`}>
                <span className="w-full inline-flex ">{message.text}</span>
                <span className="text-xs">{message.time}</span>
              </div>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-center">Loading...</p>}
      </div>
      <div className="p-4 flex items-center bg-slate-100">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md mr-2"
        />
        <button onClick={handleSendMessage} className="px-4 py-2 bg-gradient-to-tr from-blue-500 to-indigo-500 text-white rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.token,
  adminId: state.adminId,
});

export default connect(mapStateToProps)(Chat);