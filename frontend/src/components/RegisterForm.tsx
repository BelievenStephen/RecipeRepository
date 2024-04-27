import React, { useState, FormEvent } from 'react';
import { register } from '../api/authService';

interface RegisterFormProps {
    onRegister: (email: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasNumbers = /\d/.test(password);
        const hasLetters = /[a-zA-Z]/.test(password);
        return password.length >= minLength && hasNumbers && hasLetters;
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        let isValid = true;
        setGeneralError('');

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and include numbers and letters.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            try {
                await register(email, password);
                onRegister(email, password);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.message === 'User already exists') {
                        setGeneralError(error.message);
                    } else {
                        setPasswordError(error.message);
                    }
                } else {
                    setPasswordError("An unexpected error occurred. Please try again.");
                }
            }
        }
    };

    return (
        <form className="entry-form" onSubmit={handleSubmit}>
            <h1 className="welcome-header">Welcome To Recipe Repository</h1>
            <input className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
            />
            {emailError && <div style={{color: 'red'}}>{emailError}</div>}
            <input className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
            />
            {generalError && <div style={{color: 'red'}}>{generalError}</div>}
            {passwordError && <div style={{color: 'red'}}>{passwordError}</div>}
            <button type="submit" className="button" role="button">
                <span className="text">Sign up</span>
            </button>
            { /* Link to the login page if they already have an account */}
            <p className="register-login">
                Already have an account? <a href="/">Log in</a>
            </p>
        </form>
    );
}

export default RegisterForm;
