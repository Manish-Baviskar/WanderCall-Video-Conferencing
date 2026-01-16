import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Get the URL parameters (e.g., ?token=abcdef123)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // 2. Save token to LocalStorage (Just like manual login)
            localStorage.setItem("token", token);
            
            // 3. Redirect to the Lobby/Meeting page
            navigate("/lobby"); // Change this to your actual route (e.g. /home, /dashboard)
        } else {
            // If something failed, go back to login
            navigate("/auth"); 
        }
    }, [navigate]);

    return (
        <div style={{ 
            height: "100vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            backgroundColor: "#1a1a1a",
            color: "#ff9800"
        }}>
            {/* Optional: A loading spinner while it processes */}
            <h2>Logging you in...</h2>
        </div>
    );
};

export default AuthSuccess;