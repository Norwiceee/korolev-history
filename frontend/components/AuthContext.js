import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // При загрузке страницы — подхватываем пользователя и токен из localStorage
        const userStr = localStorage.getItem('user');
        const tokenStr = localStorage.getItem('token');
        if (userStr) setUser(JSON.parse(userStr));
        if (tokenStr) setToken(tokenStr);
    }, []);

    const login = (userObj, tokenValue) => {
        setUser(userObj);
        setToken(tokenValue);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('token', tokenValue);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
