import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get("http://192.168.181.235:5000/api/auth/user", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("Auth Context User Data:", res.data.user);
                    setUser(res.data.user);
                } catch (err) {
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post("http://192.168.181.235:5000/api/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
    };

    const register = async (name, email, password) => {
        const response = await axios.post("http://192.168.181.235:5000/api/auth/register", { name, email, password });
        console.log("Registration Response:", response.data);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
