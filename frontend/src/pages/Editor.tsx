import { useState } from "react";
import { saveLetterToDrive } from "../utils/driveUtils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const LetterEditor = () => {
  const [title, setTitle] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  if (!editor) {
    return null;
  }

  // Save letter content to Google Drive
  const handleSaveToDrive = async () => {
    if (!editor) return;

    setIsSaving(true);
    setSaveMessage("");

    const content = editor.getHTML();
    const response = await saveLetterToDrive(title, content);

    setIsSaving(false);

    if (response) {
      setSaveMessage("Letter saved successfully!");
      editor.commands.clearContent();
      setTitle("")
    } else {
      setSaveMessage("Error saving letter.");
    }
  };

  // Formatting actions
  const applyStyle = (style: string) => {
    if (!editor) return;
    switch (style) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Filename"
        />

        {/* Formatting Buttons */}
        <div className="mb-4 space-x-2">
          <button
            onClick={() => applyStyle("bold")}
            className={`${
              editor.isActive("bold") ? "bg-gray-500 text-white" : "bg-gray-200"
            } px-2 py-1 rounded hover:bg-gray-300 cursor-pointer`}
          >
            Bold
          </button>
          <button
            onClick={() => applyStyle("italic")}
            className={`${
              editor.isActive("italic") ? "bg-gray-500 text-white" : "bg-gray-200"
            } px-2 py-1 rounded hover:bg-gray-300 cursor-pointer`}
          >
            Italic
          </button>
          <button
            onClick={() => applyStyle("bulletList")}
            className={`${
              editor.isActive("bulletList") ? "bg-gray-500 text-white" : "bg-gray-200"
            } px-2 py-1 rounded hover:bg-gray-300 cursor-pointer`}
          >
            Bullet list
          </button>
        </div>

        {/* TipTap Editor */}
        <EditorContent editor={editor} />

        {/* Save Button */}
        <button
          onClick={handleSaveToDrive}
          disabled={isSaving}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save to Google Drive"}
        </button>

        {/* Save status message */}
        {saveMessage && (
          <div
            className={`mt-4 text-center ${
              saveMessage === "Letter saved successfully!" ? "text-green-500" : "text-red-500"
            }`}
          >
            {saveMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default LetterEditor;
