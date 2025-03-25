"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitleAwaitVerify = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
        delay: 50, 
        deleteSpeed: 30,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('<span style="font-weight: bold; color: #1e3a8a;">Please verify your email address to complete your authentication and to be able to log in...</span>')
          .pauseFor(1500)
          .deleteAll()
          .start();
      }}
    />
  )
}

export default TypewriterTitleAwaitVerify;
