const API_URL = 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    const data = await response.json();
    return data;
};

export const register = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        try {
            const errorBody = await response.json();
            throw new Error(errorBody.message || response.statusText);
        } catch {
            throw new Error(response.statusText || "An error occurred during registration");
        }
    }

    const data = await response.json();
    return data;
};
