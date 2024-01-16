import React, { useState } from 'react';
import axios from 'axios';
import { MdChat } from "react-icons/md";
import '../chatbot/chat.css'
import { GiReactor } from "react-icons/gi";

function App() {
    const [inputValue, setInputValue] = useState('');
    const [userMessages, setUserMessages] = useState([]);
    const [chatResponses, setChatResponses] = useState([]);
    const [recommendations, setRecommendations] = useState(['python', 'business plan', 'Recommendation 3', 'new']);
    const [preText, setPreText] = useState('Ask me anything!');

    const handleUserMessageChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        const message = inputValue.trim(); // Remove leading and trailing whitespaces
        if (message === '') {
            return; // Ignore empty messages
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/chat', {
                user_message: message,
            });

            setUserMessages((prevMessages) => [...prevMessages, message]);
            setChatResponses((prevResponses) => [...prevResponses, response.data.chat_response]);
            setInputValue('');  // Clear input after submission
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to handle recommendation click
    const handleRecommendationClick = (recommendation) => {
        setInputValue(recommendation);
        setRecommendations([]);
        setPreText('');
        handleSubmit();
    };

    return (
        <>
            <div className='w-full h-screen scale-95 bg-gradient-to-tr from-gray-900 to-gray-700 text-white p-4'>
                <h1 className='text-center text-2xl'>Chat with <span className='font-bold uppercase'>Chatbot.ai</span></h1>
                <div className='w-full  flex flex-col p-4 h-full justify-between'>
                    <div className='overflow-container'>
                        {preText && (
                            <div className='justify-center w-full flex-col h-full items-center flex mb-4'>
                                <p>Welcome to ChatBot.ai assistance. It will be glad to help you out!!</p>
                                <p>{preText}</p>
                            </div>
                        )}
                        {userMessages.map((message, index) => (
                            <div key={index} className='flex flex-col'>
                                <div className='flex p-2 gap-4 m-2  items-center'>
                                    <MdChat size={25} />
                                    <h2 className=' flex items-center'>{message}.</h2>
                                </div>
                                <div className='flex gap-4 p-2 m-2 items-center '>
                                    {/* <GiReactor size={25} /> */}
                                    <p>{chatResponses[index]}.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form className='p-4 justify-end w-full ' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {inputValue === '' && (
                            <div className='recommendations mb-2'>
                                <ul className='grid grid-cols-2 gap-2 '>
                                    {recommendations.map((recommendation, index) => (
                                        <li key={index} className='flex rounded-lg p-4 justify-center bg-gray-300  cursor-pointer font-semibold' onClick={() => handleRecommendationClick(recommendation)}>
                                            {recommendation}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className='flex gap-2'>
                            <input placeholder='Enter a Prompt' type="text" className='w-full border-none text-black p-4 rounded' value={inputValue} onChange={handleUserMessageChange} />
                            <button className='p-4 bg-blue-500 text-white rounded' type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
