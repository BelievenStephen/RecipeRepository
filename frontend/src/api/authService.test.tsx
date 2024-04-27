import { login } from './authService';

global.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('authService', () => {
    it('successfully logs in a user', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-token' }),
        });

        const token = await login('user@example.com', 'password');

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/auth/login',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
            }),
        );
        expect(token).toEqual({ token: 'fake-token' });
    });

    it('fails to log in with wrong credentials', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ message: 'Invalid credentials' }),
        });

        await expect(login('user@example.com', 'wrongpassword')).rejects.toThrow('Failed to login');
    });

    it('successfully registers a user', async () => {
    });

    it('fails to register an existing user', async () => {
    });
});
