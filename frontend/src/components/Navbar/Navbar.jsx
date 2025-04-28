import React,{useState} from "react";
import ProfileInfo from '../../components/Cards/ProfileInfo'
import {useNavigate} from "react-router-dom"
import SearchBar from "../SearchBar/searchBar";

const Navbar = ({userInfo, onSearch}) => {
  const [searchQuery , setSearchQuery] = useState("");
  const navigate = useNavigate();
  

  const onLogout = () =>{
    localStorage.clear();
    navigate("/");
  }
  const handleSearch = ()=>{
    onSearch(searchQuery);
  };
  
  const onClearSearch = ()=>{
     setSearchQuery("");
     onSearch("");
  };




  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes Record</h2>

      <SearchBar 
      value={searchQuery}
      onChange={({target})=>{
           setSearchQuery(target.value);
      }}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo}  onLogout={onLogout}/>
    </div>
  );
};

export default Navbar;
