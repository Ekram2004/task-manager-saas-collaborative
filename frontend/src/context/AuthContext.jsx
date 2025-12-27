    import React, { createContext, useState, useEffect, useContext } from 'react';
    import api from '../api'; // Our configured axios instance
    import { useNavigate } from 'react-router-dom';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [token, setToken] = useState(localStorage.getItem('token') || null);
        const [loading, setLoading] = useState(true); // To indicate if auth state is still being loaded
        const navigate = useNavigate();

        // Load user from local storage or validate token on initial load
        useEffect(() => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                // In a real app, you might want to verify the token with the backend
                // or fetch user details. For now, we trust local storage.
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`; // Set for immediate use
            }
            setLoading(false); // Finished loading auth state
        }, []);

        const login = async (email, password) => {
            try {
                const response = await api.post('/api/auth/login', { email, password });
                const { token, user: userData } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(token);
                setUser(userData);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default header for subsequent requests
                navigate('/dashboard'); // Redirect to dashboard on successful login
                return { success: true };
            } catch (error) {
                console.error('Login failed:', error.response?.data?.message || error.message);
                return { success: false, message: error.response?.data?.message || 'Login failed' };
            }
        };

        const register = async (name, email, password) => {
            try {
                const response = await api.post('/api/auth/register', { name, email, password });
                const { token, user: userData } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(token);
                setUser(userData);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default header for subsequent requests
                navigate('/dashboard'); // Redirect to dashboard on successful registration
                return { success: true };
            } catch (error) {
                console.error('Registration failed:', error.response?.data?.message || error.message);
                return { success: false, message: error.response?.data?.message || 'Registration failed' };
            }
        };

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization']; // Remove auth header
            navigate('/login'); // Redirect to login page on logout
        };

        return (
          <AuthContext.Provider
            value={{
              user,
              setUser,
              token,
              loading,
              login,
              register,
              logout,
              isAuthenticated: !!token,
            }}
          >
            {!loading && children}
          </AuthContext.Provider>
        );
    };

    // Custom hook to use the AuthContext easily
    export const useAuth = () => {
        return useContext(AuthContext);
    };
