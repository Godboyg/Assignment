import React from 'react'
import { MdOutlineLightMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { useSelector , useDispatch } from 'react-redux';
import { toggleTheme } from '../Redux/Slice';

function Navbar() {

    const dispatch = useDispatch();

    const theme = useSelector((state) => state.user.theme);
    console.log(theme);

  return (
    <div className={`px-5 fixed top-0 py-4 flex items-center justify-between w-full 
        ${theme ? "bg-white text-black border-b-1 border-purple-500" : "bg-black text-white border-b-1 border-purple-300"}`}>
        <h1 className='text-xl font-bold'>AI chat application</h1>
        { 
          theme ? (
            <span className='text-xl hover:cursor-pointer'
            onClick={() => dispatch(toggleTheme())}>
                <MdLightMode />
            </span>
          ) : (
            <span className='text-xl hover:cursor-pointer'
            onClick={() => dispatch(toggleTheme())}>
                <MdOutlineLightMode />
            </span>
          )
        }
    </div>
  )
}

export default Navbar
