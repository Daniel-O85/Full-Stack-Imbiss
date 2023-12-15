import React, { useEffect, useState, useRef } from "react";

import "./Datenschutz.css";


export default function () {
    const [datenschutz, datenschutzUpdate] = useState("");
    const [updateText, setUpdateText] = useState("");
    const editTextRef = useRef(null);


    function readTextFromServer(u, cb) {
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }


    useEffect(() => {
        readTextFromServer("http://localhost:3344/abruf/datenschutz",
            (data) => {
                datenschutzUpdate(data)
            });
    }, []);


    function editDatenschutz() {
        const newText = editTextRef.current.value;

        readTextFromServer(`http://localhost:3344/admin/aendern/d/` + newText, (response) => {
            setUpdateText("Datenschutz wurde geändert");

            setTimeout(() => {
                setUpdateText("");
                window.location.reload();
            }, 1000);
        });
    }

    const eingeloggt = sessionStorage.getItem("eingeloggt");
    if (eingeloggt === "1") {
        return (
            <div className="adminDatenschutz">
                <h2>Datenschutz</h2>
                <textarea defaultValue={datenschutz} ref={editTextRef}></textarea>
                <p style={{ color: "green" }}>{updateText}</p>
                <br />
                <button onClick={editDatenschutz}>Speichern</button>
            </div>
        );
    } else {
        return (
            <div className="Datenschutz">
                <h2>Datenschutz</h2>
                <p>{datenschutz}</p>
            </div>
        );
    }
}
