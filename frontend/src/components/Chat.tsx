import React, { useState, useRef } from "react";
import { Box, TextField, Button } from "@mui/material";

interface Message {
  content: string;
  fromUser: boolean;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hi I am your chatbot, how can I help you?",
      fromUser: false,
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (message: string) => {
    if (message.trim() === "") {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, fromUser: true },
    ]);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: "Chatbot response", fromUser: false },
      ]);
    }, 1000);
  };

  const handleButtonClick = () => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      handleSendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: "#fff",
          width: "100%",
          height: "100vh",
          padding: "20px",
        }}
      >
        {/* Chat messages */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: message.fromUser ? "flex-end" : "flex-start",
                width: "100%",
                margin: message.fromUser ? "0px" : "30px",
                marginRight: message.fromUser ? "60px" : "0px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: message.fromUser ? "#f5f5f5" : "#e0e0e0",
                  padding: "10px",
                  borderRadius: "8px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input message and Send button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "700px",
            position: "absolute",
            bottom: "10px",
          }}
        >
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: "10px",
              marginRight: "10px",
            }}
            inputRef={inputRef}
            onKeyDown={handleKeyDown}
          />

          <Button variant="contained" onClick={handleButtonClick}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatApp;
