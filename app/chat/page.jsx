"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { FaFile } from "react-icons/fa";

const DUMMY_MESSAGES = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  sender: i % 2 === 0 ? "user" : "gemini",
  text: `This is message #${i + 1}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
})).reverse();

export default function ChatUI() {
  const [messages, setMessages] = useState(DUMMY_MESSAGES.slice(-20));
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const fileInputRef = useRef(null);
  const containerRef = useRef();
  const bottomRef = useRef();

  const theme = useSelector((state) => state.user.theme);
  console.log("theme",theme);

  const messagesPerPage = 20;

  useEffect(() => {
    const reload = sessionStorage.getItem("reload");
    if(reload) {
      window.location.reload();
      sessionStorage.clear("reload");
    }
    },[])

  const handleSend = () => {
    if (!input && !imgPreview) return;
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
      image: imgPreview,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImgPreview(null);
    simulateGeminiReply();
  };

  const simulateGeminiReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: "gemini",
        text: "This is Gemini's thoughtful response.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 2000);
  };

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setShowScrollButton(!nearBottom);

    if (el.scrollTop === 0 && page * messagesPerPage < DUMMY_MESSAGES.length) {
      const nextPage = page + 1;
      const more = DUMMY_MESSAGES.slice(
        -messagesPerPage * nextPage,
        -messagesPerPage * (nextPage - 1)
      );
      setMessages((prev) => [...more, ...prev]);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      setShowScrollButton(!nearBottom);
    };

    handleScroll(); // set initial visibility
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (nearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  return (
    <div className={`h-[100vh] w-full flex items-center justify-center 
    ${theme ? "bg-white text-black" : "bg-black text-white"}`}>
       <div className="w-full sm:w-[50vw] md:w-[55vw] lg:w-[70vw] mx-auto mt-10 p-4 border border-cyan-600 rounded shadow">
      <div className="relative">
        <div
          ref={containerRef}
          onScroll={onScroll}
          className="h-96 overflow-y-scroll scrollbar border-b p-2 flex flex-col-reverse"
        >
          <div ref={bottomRef} />
          {isTyping && (
            <div className="italic text-gray-500 mb-2">Gemini is typing...</div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded max-w-xs ${
                msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
              } relative group ${ theme ? "" : "text-black"} `}
            >
              {msg.image && <img src={msg.image} alt="upload" className="max-h-32 mb-1 rounded" />}
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              <button
                onClick={() => copyToClipboard(msg.text)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-xs text-blue-600"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm shadow-md"
          >
            ↓ Scroll to bottom
          </button>
        )}
      </div>

      <div className="w-full h-15 sm:w-[47vw] md:w-[52vw] lg:w-[67vw] xl:w-[68vw] overflow-auto">
        <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          // className="border p-2 rounded border-none outline-none bg-green-500 w-[70vw] sm:w-[70vw] md:w-[15vw] lg:w-[38vw] xl:w-[41vw]"
          className="bg-green-500 rounded-xl border-none outline-none p-2 flex-1"
        />
        <button className="text-xl hover:cursor-pointer"
        onClick={e => {
          fileInputRef.current.click();
        }}><FaFile /></button>
        <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display : "none"}} />
        <button
          onClick={handleSend}
          className="bg-blue-600 p-2 text-white rounded-xl"
        >
          Send
        </button>
        </div>
      </div>

      {imgPreview && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Image preview:</p>
          <img src={imgPreview} alt="preview" className="max-h-32 mt-1 rounded" />
        </div>
      )}
    </div>
    </div>
  );
}