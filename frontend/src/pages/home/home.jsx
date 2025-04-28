import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from "react-icons/md";
import AddEditNotes from './AddEditNotes';
import moment from "moment";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useNotes } from '../../zustand/useNotes';

const Home = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const { notes, loading, getNotes, updateNote, deleteNote, togglePinNote } = useNotes(); // Use Zustand store
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  // Get user info
  const getUserInfo = async () => {
    setUserInfo(data);
  };

  useEffect(() => {
    getNotes(); // Use Zustand action instead of local function
    getUserInfo();
    return () => {};
  }, [getNotes]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchQuery]);

  const handleModalClose = () => {
    setOpenAddEditModel({ isShown: false, type: "add", data: null });
    getNotes(); // Refresh notes when modal closes
  };

  const handleEdit = (note) => {
    setOpenAddEditModel({
      isShown: true,
      type: "edit",
      data: note
    });
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const success = await deleteNote(noteId);
      if (success) {
        getNotes();
      }
    }
  };

  const handlePinNote = async (noteId, isPinned) => {
    await togglePinNote(noteId, isPinned);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Navbar userInfo={userInfo} onSearch={handleSearch} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            Array.isArray(filteredNotes) && filteredNotes.map((item) => (
              <NoteCard
                key={item._id}
                _id={item._id}  // Change from id to _id
                title={item.title}
                date={item.date}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)}
                onPinNote={() => handlePinNote(item._id, item.isPinned)}
              />
            ))
          )}
        </div>
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={handleModalClose}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        ariaHideApp={false}  // Add this line if you don't want to use Modal.setAppElement
        contentLabel="Add/Edit Note"
        className="w-[40%] max-h-3/4 bg-white rounded -md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={handleModalClose}
          getAllNotes={getNotes} // Pass Zustand action instead of local function
        />
      </Modal>
    </>
  );
};

export default Home;
