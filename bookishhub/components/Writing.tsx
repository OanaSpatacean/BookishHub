"use client"
import { Language } from "@prisma/client";
import { LanguageSession } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TextWritingMenu from "./TextWritingMenu";
import { cn } from "@/lib/utils";

type Props = 
{
  language: Language,
  languageSession: LanguageSession
}

const Writing = ({ language, languageSession }: Props) => {
  const [editorState, setEditorState] = React.useState(``)

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit.configure(),
    ],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose max-w-none [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg [&_ol]:list-decimal [&_ul]:list-disc [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600'
        )
      }
    }
  })
  
  return (
    <div className="w-full">
      <div className="">
              <h1 className="sm:text-3xl 
                            text-left 
                            font-bold 
                            text-3xl  
                            mb-5">
                  Stage 3 - Writing
              </h1>

              <div className="w-full 
                              mb-5 
                              border 
                              shadow-lg 
                              border-stone-200 
                              px-16 
                              rounded-lg 
                              py-8">
                  <div className="flex">
                      {editor && <TextWritingMenu editor={editor}/>}
                  </div>

                  <div className="prose">                  
                    <EditorContent editor={editor}/>
                  </div>
              </div>

              <div className="w-full 
                              flex 
                              justify-between 
                              items-center 
                              mb-4">                
                  <Link href={`/language/${language.id}/${languageSession.id}/rephrasing`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>
                      <ArrowLeft strokeWidth={5} className="ml-1 
                                                              h-3 
                                                              w-3"/>
                      Return to the previous stage
                  </Link>

                  <Link href={`/language/${language.id}/${languageSession.id}/pronunciation`} className={`${buttonVariants({ className: "flex items-center font-semibold bg-purple-500 hover:bg-purple-800" })}`}>    
                      Go to the next stage
                      <ArrowRight strokeWidth={5} className="ml-1 
                                                              h-3 
                                                              w-3"/>
                  </Link>
            </div>
      </div>
    </div>
  )
}

export default Writing;