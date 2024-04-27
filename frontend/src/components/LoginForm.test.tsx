import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
    it('renders email and password inputs', () => {
        render(<LoginForm onLogin={jest.fn()} />);

        const emailInput = screen.getByPlaceholderText(/enter email/i) as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText(/enter password/i) as HTMLInputElement;

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    it('allows typing in email and password fields', () => {
        render(<LoginForm onLogin={jest.fn()} />);

        const emailInput = screen.getByPlaceholderText(/enter email/i) as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText(/enter password/i) as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });
});
