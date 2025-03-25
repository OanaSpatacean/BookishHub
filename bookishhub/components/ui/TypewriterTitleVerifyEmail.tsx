"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitleVerifyEmail = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
        delay: 50, 
        deleteSpeed: 30,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('<span style="font-weight: bold; color: #1e3a8a;">Account verified. Redirecting you to log in...</span>')
          .pauseFor(20000)
          .deleteAll()
          .start();
      }}
    />
  )
}

export default TypewriterTitleVerifyEmail;
