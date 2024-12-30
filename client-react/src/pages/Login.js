import React, {useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/askchefgpt")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });

    }

    return(
        <>
            <main >        
                <section>
                    <h1 className='title'> Ask ChefGPT </h1>
                    <div className='signup-form'>                                            
                        <form>                                              
                            <div>
                                <label htmlFor="email-address">
                                    Email address: 
                                </label>
                                <input
                                    type="email"
                                    label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}  
                                    required                                    
                                    placeholder="Email address" 
                                    style={{margin: "1%"}}                               
                                />
                            </div>

                            <div>
                                <label htmlFor="password">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    label="Create password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required                                 
                                    placeholder="Password" 
                                    style={{margin: "1%"}}                  
                                />
                            </div>  

                            <button
                                type="login" 
                                onClick={onLogin}
                                className='signup-button'                       
                            >  
                                Log in                                
                            </button>                            
                        </form>

                        <p className="text-sm text-white text-center">
                            No account yet? {' '}
                            <NavLink to="/signup">
                                Sign up
                            </NavLink>
                        </p>

                    </div>
                </section>
            </main>
        </>
    )
}

export default Login