import React, {useState, FormEvent} from 'react';
import '../App.css'

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const validatePassword = (password: string) => {
        if (!password.trim()) {
            setPasswordError('Password is required');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        let isValid = true;

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!validatePassword(password)) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            onLogin(email, password);
        }
    };

    return (
        <form className="entry-form" onSubmit={handleSubmit}  data-testid="form">
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
            {passwordError && <div style={{color: 'red'}}>{passwordError}</div>}
            <button type="submit" className="button" role="button">
                <span className="text">Log In</span>
            </button>
            <p className="register-login">
                Don't have an account? <a href="/register"> Sign up</a>
            </p>
        </form>
    );

}
    export default LoginForm;