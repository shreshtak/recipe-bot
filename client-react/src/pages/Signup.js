import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
      e.preventDefault()

      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            alert("Account created!");
            navigate("/login")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setErrorMessage(errorMessage)
            // ..
        });


    }

  return (
    <main >        
        <section>
            <div>
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
                        {errorMessage != null ? (
                            <p className='error-message'>{errorMessage}</p>
                        ): null}                                           

                        <button
                            type="submit" 
                            onClick={onSubmit}
                            className='signup-button'                       
                        >  
                            Sign up                                
                        </button>

                    </form>

                    <p>
                        Already have an account?{' '}
                        <NavLink to="/login" >
                            Sign in
                        </NavLink>
                    </p>                   
                </div>
            </div>
        </section>
    </main>
  )
}

export default Signup