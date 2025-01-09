import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled Components
const ChatbotContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #000;
  color: #333;
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #000;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    display: ${({ showHistory }) => (showHistory ? "flex" : "none")};
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  background-color: #000;
  border-bottom: 1px solid #333;
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  padding: 10px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  border-bottom: 1px solid #333;
  &:hover {
    background-color: #000;
    color: #333;
  }
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #333;
  position: relative;
`;

const ChatHeader = styled.div`
  padding: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #000;
  border-bottom: 1px solid #333;
`;

const ChatWindow = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageBubble = styled.div`
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  background-color: ${({ isUser }) => (isUser ? "#007bff" : "#f1f1f1")};
  color: ${({ isUser }) => (isUser ? "#000" : "#333")};
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const InputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: #000;
  border-top: 1px solid #333;
`;

const Input = styled.input`
  flex: 1;
  background: #000;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 5px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ToggleButton = styled.button`
  display: none;
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  color: #000;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

// Chatbot Component
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // State to control the sidebar visibility

  // Handle sending a message
  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setHistory((prev) => [...prev, input]); // Add input to history
    setInput(""); // Clear input field

    try {
      // Change the endpoint and data format to match Gemini API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCijghyhNuBugDliG38h2qMvRWEZW01m04", // Use actual API key
        {
          prompt: input,  // Gemini API takes a 'prompt' field instead of 'messages'
          max_output_tokens: 100,  // Adjust output size as per your requirement
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response has candidates and content
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const botMessage = {
          text: response.data.candidates[0].content,  // Assuming 'candidates' is the array returned by Gemini
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("No valid response from the Gemini API");
      }
    } catch (error) {
      // Capture detailed error for debugging
      console.error("Error occurred while calling Gemini API:", error);

      const errorMessage = {
        text: "Sorry, something went wrong. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Optional: Show error message for debugging on UI
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      }
    }
  };

  // Toggle history sidebar visibility
  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    <ChatbotContainer>
      <Sidebar showHistory={showHistory}>
        <SidebarHeader>History</SidebarHeader>
        <HistoryList>
          {history.map((item, index) => (
            <HistoryItem key={index}>{item}</HistoryItem>
          ))}
        </HistoryList>
      </Sidebar>
      <ChatSection>
        <ToggleButton onClick={toggleHistory}>
          {showHistory ? "Hide History" : "Show History"}
        </ToggleButton>
        <ChatHeader>Chat Interface</ChatHeader>
        <ChatWindow>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.isUser}>
              {msg.text}
            </MessageBubble>
          ))}
        </ChatWindow>
        <InputArea>
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <SendButton onClick={handleSend}>Send</SendButton>
        </InputArea>
      </ChatSection>
    </ChatbotContainer>
  );
};

export default Chatbot;
