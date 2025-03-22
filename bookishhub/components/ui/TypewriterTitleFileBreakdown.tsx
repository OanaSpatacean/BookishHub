"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitleFileBreakdown = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
        delay: 50, 
        deleteSpeed: 30,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('<span style="font-weight: bold; color: 	#228B22;">File Breakdown ➡ </span>Upload and analyze PDFs effortlessly')
          .pauseFor(1500)
          .deleteAll()
          .start();
      }}
    />
  )
}

export default TypewriterTitleFileBreakdown;
