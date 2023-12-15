import React, { useEffect, useState, useRef } from "react";
import "./Impressum.css";

export default function () {
    const [impressum, impressumUpdate] = useState("");
    const [updateText, setUpdateText] = useState("");
    const editTextRef = useRef(null);

    function readTextFromServer(u, cb) {
        window.fetch(u)
            .then(rohdaten => rohdaten.text())
            .then(daten => cb(daten))
            .catch((fehler) => console.error(fehler));
    }

    useEffect(() => {
        readTextFromServer("http://localhost:3344/abruf/impressum", (data) => {
            impressumUpdate(data);
        });
    }, []);

    function editImpressum() {
        const newText = editTextRef.current.value;

        readTextFromServer(`http://localhost:3344/admin/aendern/i/` + newText, (response) => {
            setUpdateText("Impressum wurde geändert");

            setTimeout(() => {
                setUpdateText("");
                window.location.reload();
            }, 1000);
        });
    }

    const eingeloggt = sessionStorage.getItem("eingeloggt");
    if (eingeloggt === "1") {
        return (
            <div className="adminImpressum">
                <h2>Impressum</h2>
                <textarea defaultValue={impressum} ref={editTextRef}></textarea>
                <p style={{ color: "green" }}>{updateText}</p>
                <br />
                <button onClick={editImpressum}>Speichern</button>
            </div>
        );
    } else {
        return (
            <div className="Impressum">
                <h2>Impressum</h2>
                <p>{impressum}</p>
            </div>
        );
    }
}
