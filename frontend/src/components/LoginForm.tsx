import React, {useState, FormEvent} from 'react';

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
        const minLength = 8;
        const hasNumbers = /\d/.test(password);
        const hasLetters = /[a-zA-Z]/.test(password);
        return password.length >= minLength && hasNumbers && hasLetters;
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
            setPasswordError('Password must be at least 8 characters long and include numbers and letters.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            onLogin(email, password);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="welcome-header">Welcome To Recipe Repository</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
            />
            {emailError && <div style={{color: 'red'}}>{emailError}</div>}
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
            />
            {passwordError && <div style={{color: 'red'}}>{passwordError}</div>}
            <button type="submit">Log In</button>
            <p>
                Don't have an account? <a href="/register">Sign up</a>
            </p>
        </form>
    );

}
    export default LoginForm;