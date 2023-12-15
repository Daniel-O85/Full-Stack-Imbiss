import React, { useEffect } from "react";

export default function Logout() {

    useEffect(() => {

        sessionStorage.setItem('eingeloggt', '0');
        sessionStorage.setItem("ID", "0");
        setTimeout(() => {
            window.location.href = "http://localhost:3000/";
        }, 2000);
    }, []);

    return (
        <div className="logout">
            <h3>Du bist ausgeloggt</h3>
        </div>
    )
};