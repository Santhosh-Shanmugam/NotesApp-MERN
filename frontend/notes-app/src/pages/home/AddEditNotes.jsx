import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import axios from "axios";
import { useNotes } from '../../zustand/useNotes'; // Import useNotes

const AddEditNotes = ({ noteData, type, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  
  const { addToNotes, updateNote } = useNotes();

  const handleSave = async () => {
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      const success = type === "edit"
        ? await updateNote(noteData._id, { title, content, tags })
        : await addToNotes(title, content, tags);

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Save error:", error);
      setError(error.response?.data?.message || "Failed to save note");
    }
  };

  return (
    <div className="relative">
        <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}>
            <MdClose className="text-xl text-slate-400"/>
        </button>
        <div className="flex flex-col gap-2">
            <label className="input-label">Title</label>
            <input
            type="text"

            className="text-2xl text-slate-950 outline-none"
            placeholder="Go To Gym At 5"
            value={title}
            onChange={({target})=> setTitle(target.value)}></input>
        </div>
        <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">Commitment</label>
            <textarea type="text" className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder ="Content"
            rows={10}
            value={content}
            onChange={({target})=> setContent(target.value)}
            />
        </div>
        <div className="mt-3">
            <label className="input-label">Tags</label>
            <TagInput tags={tags} setTags={setTags}/>
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
        <button className="w-full text-sm bg-primary text-white p-2 rounded my-1 font-medium mt-5 p-3" 
        onClick={handleSave}>
            {type === "edit" ? "Update" : "Add"}
        </button>
    </div>
  )
}

export default AddEditNotes