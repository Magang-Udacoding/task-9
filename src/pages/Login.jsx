/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await login(email, password);
            navigate('/items');
        } catch (err) {
            setError('Email or Password Incorrect! Try Again');
        }
    }

    return (
        <div>
            <h2>Login</h2>
            {error && 
            <p style={{color: 'red'}}>
                {error}
            </p>
            }

            <form onSubmit={handleSubmit}>
                {/* email */}
                <div>
                    <label>
                        Email
                    </label>

                    <input type="email"
                    value={email}
                    onChange={
                        (e) => setEmail(e.target.value)
                    }
                    />
                </div>

                {/* password */}
                <div>
                    <label>
                        Password
                    </label>

                    <input type="password"
                    value={password}
                    onChange={
                        (e) => setPassword(e.target.value)
                    }
                    />
                </div>

                {/* button */}
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login;