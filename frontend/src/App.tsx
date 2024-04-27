import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecipeSearch from './components/RecipeSearch';
import { login, register } from './api/authService';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const onLogin = async (email: string, password: string) => {
        try {
            const data = await login(email, password);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (email: string, password: string) => {
        try {
            const data = await register(email, password); // error here
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <Router>
            <div className="app-container">
                <div className="header">
                    <img src="../public/pexels-mali-64208.jpg" alt="Hero"></img>
                    <div className="title">Recipe Repository</div>
                </div>
                <div className="tabs">
                </div>
                {isAuthenticated ? (
                    <Routes>
                        <Route path="/" element={!isAuthenticated ? <LoginForm onLogin={onLogin} /> : <Navigate to="/recipes" replace />} />
                        <Route path="/register" element={!isAuthenticated ? <RegisterForm onRegister={handleRegister} /> : <Navigate to="/recipes" replace />} />
                        <Route path="/recipes" element={isAuthenticated ? <RecipeSearch /> : <Navigate to="/" replace />} />
                        {/* Place other authenticated routes here */}
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/" element={<LoginForm onLogin={onLogin} />} />
                        <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />
                        <Route path="/recipes" element={<Navigate to="/" replace />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;
