"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Link from 'next/link';

function ChatroomManager() {

  const theme = useSelector((state) => state.user.theme);

  const [chatrooms, setChatrooms] = useState([
    { id: 1, name: "General" },
    { id: 2, name: "Gaming" },
    { id: 3, name: "Study Buddies" },
  ]);
  const [newName, setNewName] = useState("");

  const createChatroom = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Chatroom name cannot be empty");
      return;
    }

    const exists = chatrooms.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      toast.warn("Chatroom with this name already exists");
      return;
    }

    const newChatroom = {
      id: Date.now(),
      name: trimmed,
    };

    setChatrooms([...chatrooms, newChatroom]);
    setNewName("");
    toast.success(`Created chatroom: ${trimmed}`);
  };

  const deleteChatroom = (id) => {
    const room = chatrooms.find((c) => c.id === id);
    if (!room) return;

    const confirm = window.confirm(`Delete "${room.name}"?`);
    if (!confirm) return;

    setChatrooms(chatrooms.filter((c) => c.id !== id));
    toast.success(`Deleted "${room.name}"`);
  };

  const handleClick = (e) => {
    sessionStorage.setItem("reload","true");
  }

  return (
    <div className={`h-[94vh] w-full ${theme ? "bg-white text-black" : "bg-black text-white"}`}>
    <div className={`max-w-md overflow-auto mx-auto p-6 space-y-6 rounded mt-10
      ${theme ? "shadow shadow-cyan-700" : "shadow shadow-cyan-500"}`}>
      <h2 className="text-2xl font-bold mt-2">💬 Your Chatrooms</h2>

      <ul className="space-y-2 max-h-[60dvh] overflow-auto">
        {chatrooms.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <Link href="/chat">
              <span className="hover:cursor-pointer" onClick={handleClick}>{c.name}</span>
            </Link>
            <button
              onClick={() => deleteChatroom(c.id)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="flex space-x-1">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New chatroom name"
          className="border-none w-10 outline-none rounded p-2 flex-1"
        />
        <button
          onClick={createChatroom}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Create
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
    </div>
  );
}

export default ChatroomManager;