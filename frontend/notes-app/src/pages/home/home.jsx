import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from "react-icons/md";
import AddEditNotes from './AddEditNotes';
import moment from "moment";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Home = () => {
  const data=JSON.parse(localStorage.getItem("data"));  
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNote, setAllNote] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Get user info
  const getUserInfo = async () => {
        setUserInfo(data);
  };

  // Get all notes
  const getAllNote = async () => {
    try {
      const token=localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/get-all-note",{},
        {
          headers:{
            Authorization:token
          }
        });
      if (response.data && response.data.notes) {
        console.log(response.data.notes); // Log the fetched notes
        setAllNote(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred", error);
    }
  };

  useEffect(() => {
    getAllNote();
    getUserInfo();
    return () => {};
  }, []);

  // console.log(userInfo); 
  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNote.map((item, index) => (
            <NoteCard
              id={item._id}
              title={item.title}
              date={moment(item.createdOn).format('Do MMM YYYY')}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => {}}
              onDelete={() => {}}
              onPinNote={() => {}}
            />
          ))}
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
        onRequestClose={() => {
          setOpenAddEditModel({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded -md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllNotes = {getAllNote}
        />
      </Modal>
    </>
  );
};

export default Home;
