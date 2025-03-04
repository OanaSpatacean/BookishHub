"use client"
import { Language, LanguageSession, TextWriting } from "@prisma/client";
import { ArrowLeft, ArrowRight, InfoIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TextWritingMenu from "./TextWritingMenu";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios  from 'axios';
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

type Props = 
{
  language: Language,
  languageSession: LanguageSession
  text: TextWriting
}

const Writing = ({ language, languageSession, text }: Props) => {
  const textSave = useMutation({
    mutationFn: async (updatedTextState: string) => {
      return axios.post("/api/language/writing/save_writing", {
        textId: text.id,
        textState: updatedTextState
      })
    }
  })

  const { complete, completion } = useCompletion({api: "/api/language/writing/autocompletion"})

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": async () => { 
          const prompt = this.editor.getText().split(" ").slice(-25).join(" ");
  
          try 
          {
            const response = await fetch("/api/language/writing/autocompletion", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt })
            })
  
            if (!response.body) 
              throw new Error("Empty response body");
  
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
  
            let resultText = "";
  
            while (true) 
            {
              const { done, value } = await reader.read();

              if (done) 
                break;

              resultText += decoder.decode(value, { stream: true });
              this.editor.commands.insertContent(resultText); 
            }
          } 
          catch (error) 
          {
            console.error("Autocompletion error:", error);
          }
  
          return true
  }}}})
  
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure(), customText],
    content: text.textState,
    onUpdate: ({ editor }) => {
      const updatedTextState = editor.getHTML();
      textSave.mutate(updatedTextState);
    },
    editorProps: {
      attributes: {
        class: cn("prose max-w-none [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg [&_ol]:list-decimal [&_ul]:list-disc [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600")
      }
    }
  })

  const lastCompletion = React.useRef("");

  React.useEffect(() => {
    if (!completion || !editor) 
        return;

    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;

    editor.commands.insertContent(diff)
  }, [completion, editor])

  const { toast } = useToast();
  const router = useRouter();

  const { mutate: createPronunciationWords, isLoading } = useMutation({
      mutationFn: async () => {
          const response = await axios.post("/api/language/pronunciation/create_pronunciations_words", {
          languageId: String(language.id),
          languageSessionId: String(languageSession.id),
          level: String(languageSession.level),
          });
          return response.data;
      },
      onSuccess: (data) => {
        toast({ title: "Success", description: "Welcome to stage 4!" });
        router.push(`/language/${language.id}/${languageSession.id}/pronunciation`);
      },
      onError: (error) => {
        toast({ title: "Error", description: "An error occurred: " + error, variant: "destructive" });
      }
  })

  const handleSubmit = () => {
    createPronunciationWords()
  }
  
  return (
    <div className="w-full">
      <div className="">
              <h1 className="sm:text-3xl 
                            text-left 
                            font-bold 
                            text-3xl  
                            mb-8
                            mt-5">
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
                  <div className="flex 
                                  items-center 
                                  gap-4">
                    <Button variant={"outline"} disabled className="">
                      {textSave.isLoading ? "Saving..." : "Saved"}
                    </Button>
                    
                    {editor && <TextWritingMenu editor={editor}/>}
                  </div>

                  <div className="prose 
                                  w-full">
                    <EditorContent editor={editor} className="min-h-[100px] 
                                                              h-full"/>
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
                                      shadow-sm"/>
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

                  <Button size="lg" className="flex 
                                    items-center 
                                    font-semibold 
                                    bg-purple-500 
                                    hover:bg-purple-800" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading 
                                  ? <>
                        <Loader2 className="animate-spin 
                                            mr-2 
                                            h-5 
                                            w-5" />
                        Loading...
                      </>
                    : <>
                        Go to the next stage
                        <ArrowRight strokeWidth={5} className="ml-1 
                                                                h-3 
                                                                w-3"/>
                      </>
                    }
                  </Button>
            </div>            
      </div>
    </div>
  )
}

export default Writing;