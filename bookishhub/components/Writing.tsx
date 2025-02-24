"use client"
import { Language, LanguageSession, TextWriting } from "@prisma/client";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TextWritingMenu from "./TextWritingMenu";
import { cn } from "@/lib/utils";
import { debounceSave } from "@/lib/debounce";
import { useMutation } from "@tanstack/react-query";
import axios  from 'axios';

type Props = 
{
  language: Language,
  languageSession: LanguageSession
  text: TextWriting
}

const Writing = ({ language, languageSession, text }: Props) => {
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
        class: cn('prose max-w-none [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg [&_ol]:list-decimal [&_ul]:list-disc [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600')
      }
    }
  })

  const editorStateDebounced = debounceSave(editorState, 500);

  const textSave = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/language/writing/writing_save", {
        textId: text.id,
        editorState,
      })
      return response.data;
    }
  })

  React.useEffect(() => {
    if (editorStateDebounced === "") 
      return;

    textSave.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Text updated successfully!", data);
      },
      onError: (err) => {
        console.error(err)
      }
    })
  }, [editorStateDebounced])
  
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
                  <Button variant={"outline"} disabled>
                    {textSave.isLoading ? "Saving..." : "Saved"}
                  </Button>
                  
                  <div className="flex">
                      {editor && <TextWritingMenu editor={editor}/>}
                  </div>

                  <div className="prose">                  
                    <EditorContent editor={editor}/>
                  </div>                  
              </div>

              <div className="bg-secondary 
                                border-none 
                                p-4 
                                flex
                                dark:bg-gray-900
                                mb-5">
                    <div className="flex-shrink-0">
                        <InfoIcon 
                            className="text-green-500 
                                    h-10 
                                    w-10 
                                    bg-green-100 
                                    rounded-full 
                                    p-2 
                                    shadow-sm" />
                    </div>

                    <div className="ml-5">
                      Here, you can practice and improve your writing skills in {language.name} with the support of AI. Our intelligent system assists you throughout the process, providing real-time feedback and suggestions to enhance clarity, grammar, and fluency. If needed, AI-powered autocompletion can help you construct well-formed sentences and refine your ideas, making the learning experience smoother and more effective. Start writing with confidence and take your language skills to the next level!
                      Press{" "}
                      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                        Shift + A
                      </kbd>{" "}
                      for AI-powered autocompletion.
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