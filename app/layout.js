"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import Navbar from "./Components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className=""
      >
        <Provider store={store}>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}