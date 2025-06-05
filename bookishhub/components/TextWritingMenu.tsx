import {Bold,Code,FileCode,Heading1,Heading2,Heading3,Heading4,Heading5,Italic,List,ListOrdered,Quote,Redo,Strikethrough,Undo} from "lucide-react";
import { Editor } from "@tiptap/react";

const icons = [
  { 
    icon: Bold, action: "toggleBold", name: "bold" 
  },
  { 
    icon: Italic, action: "toggleItalic", name: "italic" 
  },
  { 
    icon: Strikethrough, action: "toggleStrike", name: "strike" 
  },
  { 
    icon: Code, action: "toggleCode", name: "code" 
  }
]

const headings = [1, 2, 3, 4, 5];

const TextWritingMenu = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="mb-8 mt-8 flex flex-wrap gap-2">
      {icons.map(({ icon: Icon, action, name }) => (
        <button key={name} onClick={() => editor.chain().focus()[action]().run()} disabled={!editor.can().chain().focus()[action]().run()} className={`p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
            editor.isActive(name) ? "bg-purple-300 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
        }`}>
          <Icon className="w-5 
                           h-5"/>
        </button>
      ))}

      {headings.map((level) => {
        const Icon = [Heading1, Heading2, Heading3, Heading4, Heading5][level - 1];
        return (
          <button key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} className={`p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
              editor.isActive("heading", { level }) ? "bg-purple-500 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
          }`}>
            <Icon className="w-5 
                             h-5"/>
          </button>
        );
      })}

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
          editor.isActive("bulletList") ? "bg-purple-500 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
      }`}>
        <List className="w-5 h-5" />
      </button>

      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
          editor.isActive("orderedList") ? "bg-purple-500 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
      }`}>
        <ListOrdered className="w-5 
                                h-5"/>
      </button>

      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
          editor.isActive("codeBlock") ? "bg-yellow-500 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
      }`}>
        <FileCode className="w-5 
                             h-5"/>
      </button>

      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
          editor.isActive("blockquote") ? "bg-gray-600 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
      }`}>
        <Quote className="w-5 
                          h-5"/>
      </button>

      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="p-2 
                                                                                                                                   rounded-md 
                                                                                                                                   border 
                                                                                                                                   border-gray-300 
                                                                                                                                   dark:border-gray-700 
                                                                                                                                   bg-white 
                                                                                                                                   dark:bg-gray-900 
                                                                                                                                   text-gray-700 
                                                                                                                                   dark:text-gray-200 
                                                                                                                                   hover:bg-gray-100 
                                                                                                                                   dark:hover:bg-gray-800 
                                                                                                                                   disabled:opacity-50">
        <Undo className="w-5 
                         h-5"/>
      </button>

      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="p-2 
                                                                                                                                   rounded-md 
                                                                                                                                   border 
                                                                                                                                   border-gray-300 
                                                                                                                                   dark:border-gray-700 
                                                                                                                                   bg-white 
                                                                                                                                   dark:bg-gray-900 
                                                                                                                                   text-gray-700 
                                                                                                                                   dark:text-gray-200 
                                                                                                                                   hover:bg-gray-100 
                                                                                                                                   dark:hover:bg-gray-800 
                                                                                                                                   disabled:opacity-50">
        <Redo className="w-5 
                         h-5"/>
      </button>
    </div>
  )
}

export default TextWritingMenu;
