// // import React, { useState } from 'react';
// // import { MdCreate, MdOutlinePushPin, MdDelete } from "react-icons/md";
// // import Modal from 'react-modal';

// // // Modal Styles
// // const customStyles = {
// //   overlay: {
// //     backgroundColor: "rgba(0,0,0,0.2)"
// //   },
// //   content: {
// //     width: "40%",
// //     maxHeight: "75%",
// //     margin: "auto",
// //     marginTop: "3.5rem",
// //     backgroundColor: "white",
// //     borderRadius: "0.375rem",
// //     padding: "1.25rem",
// //     overflow: "scroll"
// //   }
// // };

// // // NoteCard Component
// // const NoteCard = ({ id, title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
// //   const [modalIsOpen, setModalIsOpen] = useState(false);
// //   const [editData, setEditData] = useState({ title: '', content: '', tags: '' });

// //   const openEditModal = (note) => {
// //     setEditData(note);
// //     setModalIsOpen(true);
// //   };

// //   const closeEditModal = () => {
// //     setModalIsOpen(false);
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setEditData((prevData) => ({
// //       ...prevData,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSave = () => {
// //     onEdit(id, editData);
// //     closeEditModal();
// //   };

// //   return (
// //     <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h6 className="text-sm font-medium">{title}</h6>
// //           <span className="text-xs text-slate-500">{date}</span>
// //         </div>
// //         <MdOutlinePushPin
// //           className={`text-xl cursor-pointer hover:text-primary ${isPinned ? "text-primary" : "text-slate-300"}`}
// //           onClick={onPinNote}
// //         />
// //       </div>
// //       <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>
// //       <div className="flex items-center justify-between mt-2">
// //         <div className="text-xs text-slate-500">#{tags.join(', ')}</div>
// //         <div className="flex items-center gap-2">
// //           <MdCreate
// //             className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-green-600"
// //             onClick={() => openEditModal({ title, content, tags })}
// //           />
// //           <MdDelete
// //             className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-red-500"
// //             onClick={onDelete}
// //           />
// //         </div>
// //       </div>

// //       <Modal
// //         isOpen={modalIsOpen}
// //         onRequestClose={closeEditModal}
// //         style={customStyles}
// //         contentLabel="Edit Note"
// //       >
// //         <h2>Edit Note</h2>
// //         <form>
// //           <div>
// //             <label>Title</label>
// //             <input
// //               type="text"
// //               name="title"
// //               value={editData.title}
// //               onChange={handleInputChange}
// //               className="w-full border p-2"
// //             />
// //           </div>
// //           <div>
// //             <label>Content</label>
// //             <textarea
// //               name="content"
// //               value={editData.content}
// //               onChange={handleInputChange}
// //               className="w-full border p-2"
// //             />
// //           </div>
// //           <div>
// //             <label>Tags</label>
// //             <input
// //               type="text"
// //               name="tags"
// //               value={editData.tags}
// //               onChange={handleInputChange}
// //               className="w-full border p-2"
// //             />
// //           </div>
// //           <button type="button" onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white">
// //             Save
// //           </button>
// //         </form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default NoteCard;
// import React, { useState } from 'react';
// import { MdCreate, MdOutlinePushPin, MdDelete } from "react-icons/md";
// import Modal from 'react-modal';

// // Modal Styles
// const customStyles = {
//   overlay: {
//     backgroundColor: "rgba(0,0,0,0.2)"
//   },
//   content: {
//     width: "40%",
//     maxHeight: "75%",
//     margin: "auto",
//     marginTop: "3.5rem",
//     backgroundColor: "white",
//     borderRadius: "0.375rem",
//     padding: "1.25rem",
//     overflow: "scroll"
//   }
// };

// // NoteCard Component
// const NoteCard = ({ id, title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [editData, setEditData] = useState({ title: '', content: '', tags: '' });

//   const openEditModal = (note) => {
//     setEditData(note);
//     setModalIsOpen(true);
//   };

//   const closeEditModal = () => {
//     setModalIsOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSave = () => {
//     onEdit(id, editData);
//     closeEditModal();
//   };

//   return (
//     <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
//       <div className="flex items-center justify-between">
//         <div>
//           <h6 className="text-sm font-medium">{title}</h6>
//           <span className="text-xs text-slate-500">{date}</span>
//         </div>
//         <MdOutlinePushPin
//           className={`text-xl cursor-pointer hover:text-primary ${isPinned ? "text-primary" : "text-slate-300"}`}
//           onClick={onPinNote}
//         />
//       </div>
//       <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>
//       <div className="flex items-center justify-between mt-2">
//         <div className="text-xs text-slate-500">#{tags.join(', ')}</div>
//         <div className="flex items-center gap-2">
//           <MdCreate
//             className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-green-600"
//             onClick={() => openEditModal({ title, content, tags })}
//           />
//           <MdDelete
//             className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-red-500"
//             onClick={onDelete}
//           />
//         </div>
//       </div>

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={closeEditModal}
//         style={customStyles}
//         contentLabel="Edit Note"
//       >
//         <h2>Edit Note</h2>
//         <form>
//           <div>
//             <label>Title</label>
//             <input
//               type="text"
//               name="title"
//               value={editData.title}
//               onChange={handleInputChange}
//               className="w-full border p-2"
//             />
//           </div>
//           <div>
//             <label>Content</label>
//             <textarea
//               name="content"
//               value={editData.content}
//               onChange={handleInputChange}
//               className="w-full border p-2"
//             />
//           </div>
//           <div>
//             <label>Tags</label>
//             <input
//               type="text"
//               name="tags"
//               value={editData.tags}
//               onChange={handleInputChange}
//               className="w-full border p-2"
//             />
//           </div>
//           <button type="button" onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white">
//             Save
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default NoteCard;
import React, { useState } from 'react';
import { MdCreate, MdOutlinePushPin, MdDelete } from "react-icons/md";
import Modal from 'react-modal';
import axios from 'axios'

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
const NoteCard = ({ id, title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '', tags: '' });

  const openEditModal = (note) => {
    setEditData(note);
    setModalIsOpen(true);
  };

  const closeEditModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async() => {
    const token=localStorage.getItem("token");
    const response=await axios.put(`http://localhost:8000/edit-note/${id}`,editData,{
      headers:{
        Authorization:token
      }
    })
    console.log(response.data)
    console.log(editData);
    console.log(id)
    onEdit(id, editData);
    closeEditModal();
  };

  const handleDelete = async () => {
    const token=localStorage.getItem("token");
        try {
      const response = await axios.delete(`http://localhost:8000/delete-note/${id}`,{
        headers:{
          Authorization:token
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
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
            onClick={() => openEditModal({ title, content, tags })}
          />
          <MdDelete
            className="text-xl text-slate-300 cursor-pointer hover:text-primary hover:text-red-500"
            onClick={()=>handleDelete()}
          />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
        contentLabel="Edit Note"
      >
        <h2>Edit Note</h2>
        <form>
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label>Content</label>
            <textarea
              name="content"
              value={editData.content}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={editData.tags}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </div>
          <button type="button" onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white">
            Save
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default NoteCard;
