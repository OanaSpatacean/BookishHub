"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitleLessonDesign = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
        delay: 50, 
        deleteSpeed: 30,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('<span style="font-weight: bold; color: #1e3a8a;">Lesson Design ➡ </span>Create structured lessons with AI-powered content')
          .pauseFor(1500)
          .deleteAll()
          .start();
      }}
    />
  )
}

export default TypewriterTitleLessonDesign;
