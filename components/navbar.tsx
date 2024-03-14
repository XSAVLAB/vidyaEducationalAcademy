"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from "../public/Logo.webp";

export const Navbar = () => {
    const [descriptionText, setDescriptionText] = useState("Your description text goes here. This is a long text for demonstration purposes.");
    return (
        <div className=" w-full h-auto items-center sticky justify-between bg-sky-950 text-white">
            <div className="flex flex-col w-full sticky top-0 items-center font-bold shadow-md justify-between h-auto">
                <div className="flex flex-col justify-between sm:flex-row lg:gap-4 pb-4 lg:pb-2 w-full h-auto items-center">
                    <div className="flex items-center gap-2 italic w-auto h-auto lg:ml-4 cursor-pointer">
                        <div>
                            <Image src={logo} alt="Logo" className="object-contain w-[8rem] sm:w-[10rem] md:w-[12rem] lg:w-[10rem] h-auto hover:scale-125 rounded-lg" />
                        </div>
                        <a href="/" className='text-start'>
                            <div className=" text-sm xs:text-xl sm:text-xl md:text-2xl lg:text-3xl font-sans">VIDYA EDUCATIONAL ACADEMY</div>
                            <div className="text-2xs xs:text-sm font-medium md:text-sm">Commited to excellence in education</div>
                        </a>
                    </div>
                    <div className='flex flex-col justify-end w-auto items-end px-4 gap-2 text-2xs sm:text-xs lg:text-base'>
                        <div className='flex 3xs:hidden sm:flex flex-row w-full text-center align-items-end justify-end gap-4'>
                            <a href="/sign-in">
                                <div className='bg-blue-700 w-auto cursor-pointer text-white rounded-lg p-1 md:px-8 border-4 hover:bg-white border-blue-700 hover:text-blue-700 shadow-lg shadow-blue-700'>Login</div>
                            </a>
                            <a href="/sign-up">
                                <div className='bg-blue-700 w-auto cursor-pointer text-white rounded-lg p-1 md:px-8 border-4 hover:bg-white border-blue-700 hover:text-blue-700 shadow-lg shadow-blue-700'>Register</div>
                            </a>
                        </div>
                        <div className=" overflow-hidden hover:scale-110 flex items-center w-[90vw] sm:w-[40vw] mt-4 shadow-lg shadow-blue-700 rounded-full">
                            <div className='bg-blue-700 text-white w-fit md:px-4 p-2 rounded-l-full'>Announcements </div>
                            <div className="whitespace-nowrap animate-marquee -z-10">{descriptionText}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
