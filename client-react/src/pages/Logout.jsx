import React, {useState, useEffect} from 'react';
import { signOut, onAuthStateChanged } from "firebase/auth";
import {auth} from '../firebase';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import DropdownMenu from '../components/DropdownMenu';

const Logout = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserEmail(user.email);
          } else {
            setUserEmail(null); // No user logged in
          }
        });
    
        return () => unsubscribe(); // Cleanup subscription
      }, []);

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
            <p style={{textAlign: "center"}}> Logged in as: {userEmail}</p>
        </div>
    )
}

export default Logout;