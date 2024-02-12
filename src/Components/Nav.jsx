// components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from "react-icons/fa";
import { IconButton } from '@material-tailwind/react';
import "../Components/components.css"
function Nav() {
  const [activeNav, setActiveNav] = useState(0);
  const navs=[
    {
      link:"About",
    icon:FaInstagram,
    path:'/'

  },
    {
      link:"About",
    icon:FaInstagram,
    path:'/'

  },
    {
      link:"About",
    icon:FaInstagram,
    path:'/'

  },
    {
      link:"About",
    icon:FaInstagram,
    path:'/'

  },
]
const handleNavClick = (index) => {
  setActiveNav(index);
};
  return (
    <nav className='w-2/3 text-slate-950  dark:text-slate-300'>
      <ul className='cstm-ul flex gap-12 px-20'>

        {navs.map((nav, index)=>(

        <li className='flex'>
          <Link to={nav.path} > <button   onClick={() => handleNavClick(index)} className={`  shadow-md  rounded-md p-3 ${activeNav == index ? 'active' : 'dark:bg-slate-700 bg-zinc-200 '}`}><nav.icon className='mx-4'   style={{fill:"white", fontSize:"23px"}} /> {nav.link}</button> </Link>
        </li>
        ))

        }
       
       
      </ul>
    </nav>
  );
}

export default Nav;
