import React, { useState } from 'react';
import { MdCreate, MdOutlinePushPin, MdDelete } from "react-icons/md";
import Modal from 'react-modal';
import { useNotes } from '../../zustand/useNotes';

// Modal Styles
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  content: {
    width: "40%",
    maxHeight: "75%",
    margin: "auto",
    marginTop: "3.5rem",
    backgroundColor: "white",
    borderRadius: "0.375rem",
    padding: "1.25rem",
    overflow: "scroll"
  }
};

// NoteCard Component
const NoteCard = ({ _id, title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  const { updateNote, deleteNote } = useNotes();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: title || '',
    content: content || '',
    tags: tags || []
  });
  const [error, setError] = useState(null);

  const openEditModal = () => {
    setEditData({ title, content, tags });
    setModalIsOpen(true);
  };

  const closeEditModal = () => {
    setModalIsOpen(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!editData.title || !editData.content) {
        setError('Title and content are required');
        return;
      }
      
      const success = await updateNote(_id, editData);
      if (success) {
        closeEditModal();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update note');
    }
  };

  const handleDelete = async () => {
    if (!_id) {
      console.error('Note ID is missing');
      return;
    }

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(_id);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <MdOutlinePushPin
          className={`text-xl cursor-pointer hover:text-primary ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">#{tags.join(', ')}</div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-red-500"
            onClick={handleDelete}
          />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
        contentLabel="Edit Note"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              name="content"
              value={editData.content}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              name="tags"
              value={Array.isArray(editData.tags) ? editData.tags.join(', ') : ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoteCard;
