import React from 'react'
import "../Components/components.css"
import { Chip, IconButton, Typography } from '@material-tailwind/react'
import { LiaFacebookF } from "react-icons/lia";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { LiaLinkedinIn } from "react-icons/lia";
import { MdPhoneIphone } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { ImLocation } from "react-icons/im";
import { SlCalender } from "react-icons/sl";
import { PiDownloadLight } from "react-icons/pi";
export default function SideBar() {

    const socials=[
        {
            icon:LiaFacebookF,
            color:"#1773EA"
        },
        {
            icon:FaInstagram ,
            color:"#DB2E7A"
        },
        {
            icon:FaGithub  ,
            color:"#000"
        },
        {
            icon:LiaLinkedinIn  ,
            color:"#1A75D2"
        },
    ]

    const contacts=[  {
        icon:MdPhoneIphone,
        color:"#E93B81",
        title:"Phone",
        value:"+92 3204564409"
    },
    {
        icon:AiOutlineMail,
        color:"#6AB5B9",
        title:"Email",
        value:"wajahatalinaqvi929@gmail.com"
    }  
    ,
    {
        icon:ImLocation,
        color:"#FD7590",
        title:"Location",
        value:"Lahore, Pakistan"
    }
    ,
    {
        icon:SlCalender,
        color:"#C17CEB",
        title:"Date of Birth",
        value:"29th May 1999"
    }
]
  return (
    <div className='w-1/3  mx-4 flex flex-col justify-center items-center  '>
       <div className='cstm-dp'>
        <img className='shadow-xl' src="https://eu-images.contentstack.com/v3/assets/blt740a130ae3c5d529/bltf76b67fcef766397/650f05687d4ecacafd2d7351/insomniacspidermanfeatured.jpg?width=850&auto=webp&quality=95&format=jpg&disable=upscale" alt="" />
       </div>
       <Typography className='text-xl  font-bold mt-2 dark:text-slate-100' variant="h5">Wajahat Naqvi</Typography>
       <div className="badge text-md mt-3 p-3 shadow-md  badge-ghost rounded-md dark:badge-neutral ">FrontEnd Developer</div>

       <div className='flex my-3 gap-2  '>
       {socials.map((social, index)=>(
            <IconButton className='bg-zinc-200  dark:bg-slate-700 shadow-md rounded-md p-1'><social.icon   style={{fill:social.color, fontSize:"23px"}} /> </IconButton>  

            ))
            
        }
        </div>

        <div className="card w-96 bg-base-200 shadow-md">
  <div className="card-body p-8">
    {contacts.map((contact, index)=>(
        
        <div className='border-b my-2 border-zinc-400 flex items-center gap-2 dark:border-zinc-500'>
        <IconButton className='bg-zinc-200 text-center mb-2 dark:bg-slate-700 shadow-md rounded-md p-1'><contact.icon   style={{fill:contact.color, fontSize:"23px"}} /> </IconButton>
        <div>
            <Typography className='text-sm text-zinc-600 dark:text-zinc-400' variant='h4'>{contact.title}</Typography>
            <Typography className='text-md' variant='h4'>{contact.value}</Typography>
        </div>
    </div>
    ))}
   
  </div>
</div>


<div className='my-6'>
    <a href="/CORE_CV_template_2.doc" download={"Resume"}>

    <button className='btn rounded-3xl cstm-download-btn px-6 '><PiDownloadLight className='text-xl'/>Download CV</button>
    </a>
</div>
    </div>
  )
}
