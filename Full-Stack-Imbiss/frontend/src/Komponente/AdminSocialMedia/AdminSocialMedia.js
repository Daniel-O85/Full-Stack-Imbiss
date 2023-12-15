import React, { useState, useEffect } from "react";
import { encodeText, decodeText } from "./../EncodeDecode/EncodeDecode";
import "./AdminSocialMedia.css";

export default function AdminSocialMedia() {
    const [socialMediaData, setSocialMediaData] = useState({
        X: "",
        F: "",
        L: "",
        I: "",
    });

    function readTEXTFromServer(u, cb) {
        window.fetch(u)
            .then((rohdaten) => rohdaten.text())
            .then((daten) => cb(daten))
            .catch((fehler) => console.error(fehler));
    }

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

    function updateSocialMedia(platform, value) {
        console.log(`Aktualisierung für Plattform ${platform} mit Wert ${value}`);

        readTEXTFromServer(`http://localhost:3344/admin/socialMedia/aendern/${platform}/${value}`, (response) => {


        });
    }

    function handleUpdate(platform) {
        const newValue = encodeText(document.getElementById(platform).value);
        updateSocialMedia(platform, newValue);
    }

    return (
        <div>
            <input
                type="url"
                id="X"
                defaultValue={socialMediaData.X}
            />
            <br />
            <button onClick={() => handleUpdate("X")}>Ändern</button>
            <br />
            <input
                type="url"
                id="F"
                defaultValue={socialMediaData.F}
            />
            <br />
            <button onClick={() => handleUpdate("F")}>Ändern</button>
            <br />
            <input
                type="url"
                id="L"
                defaultValue={socialMediaData.L}
            />
            <br />
            <button onClick={() => handleUpdate("L")}>Ändern</button>
            <br />
            <input
                type="url"
                id="I"
                defaultValue={socialMediaData.I}
            />
            <br />
            <button onClick={() => handleUpdate("I")}>Ändern</button>
        </div>
    );
}
