import React, { useState, useEffect } from 'react';
import axios from "axios";
import './Chatbot.css'; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRec = new window.webkitSpeechRecognition();
      speechRec.continuous = false;
      speechRec.lang = 'en-US';

      speechRec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      speechRec.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRec);
    } else {
      alert('Speech Recognition API not supported in this browser.');
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/ask`, 
        { message: input }
      );
      
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/upload`,
        formData
      );
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileDownload = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/download`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "processed_file.txt");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && <div className="chat-icon" onClick={toggleChat}>💬</div>}
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>AI Doctor Chatbot</h3>
            <button className="close-button" onClick={toggleChat}>✖</button>
          </div>
          <div className="chat-body">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="chat-input"
            />
            <div className="chat-controls-container">
              <div className="chat-controls" style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button onClick={sendMessage} className="submit-button chat-btn">Submit</button>
                <button onClick={startListening} disabled={isListening} className="voice-button chat-btn">
                  {isListening ? 'Listening...' : '🎤 Voice Input'}
                </button>
                <input type="file" onChange={handleFileUpload} className="file-upload chat-btn" />
                <button onClick={handleFileDownload} className="download-button chat-btn">📥 Download</button>
              </div>
            </div>
            <div className="chat-response">
              <p><strong>Response:</strong></p>
              {messages.map((msg, index) => (
                <p key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                  {msg.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
