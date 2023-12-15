import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SocialMedia() {
    const [socialMediaData, setSocialMediaData] = useState({
        X: "",
        F: "",
        L: "",
        I: "",
    });

    useEffect(() => {
        const platforms = ["X", "F", "L", "I"];

        platforms.forEach((platform) => {
            readTEXTFromServer(`http://localhost:3344/admin/socialMedia/abrufen/${platform}`, (data) => {
                setSocialMediaData((prevData) => ({
                    ...prevData,
                    [platform]: data,
                }));

            });
        });

    }, []);

    function readTEXTFromServer(u, cb) {
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }

    return (
        <>
            <Link to={socialMediaData.X} target="blank"><img style={{ filter: "invert(1)" }} src={"https://cdn-icons-png.flaticon.com/128/5968/5968830.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Logo X"} /></Link>
            <Link to={socialMediaData.F} target="blank"><img src={"https://cdn-icons-png.flaticon.com/128/174/174848.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Logo Facebook"} /></Link>
            <Link to={socialMediaData.L} target="blank"><img src={"https://cdn-icons-png.flaticon.com/128/3536/3536505.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Logo LinkedIn"} /></Link>
            <Link to={socialMediaData.I} target="blank"><img src={"https://cdn-icons-png.flaticon.com/128/2111/2111463.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Insta"} /></Link>
        </>
    );
}
