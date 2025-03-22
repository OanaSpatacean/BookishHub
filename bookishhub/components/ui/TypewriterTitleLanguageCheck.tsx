"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitleLanguageCheck = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
        delay: 50, 
        deleteSpeed: 30,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('<span style="font-weight: bold; color: #BA55D3;">Language Check ➡ </span>Improve your language skills with interactive exercises')
          .pauseFor(1500)
          .deleteAll()
          .start();
      }}
    />
  )
}

export default TypewriterTitleLanguageCheck;
