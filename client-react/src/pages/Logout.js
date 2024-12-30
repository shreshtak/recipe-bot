import React from 'react';
import { signOut } from "firebase/auth";
import {auth} from '../firebase';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import DropdownMenu from '../components/DropdownMenu';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {               
        signOut(auth).then(() => {
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            console.log(error)
        });
    }

    return(
        <div>
            <DropdownMenu />
            <button className='logout-button' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Logout;