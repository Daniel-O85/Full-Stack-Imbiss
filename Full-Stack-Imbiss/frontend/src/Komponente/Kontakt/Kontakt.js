import React, { useState } from "react";
import "./Kontakt.css";

export default function Kontakt() {

    const [kontaktVorname, kontaktVornameUpdate] = useState(null);
    const [kontaktNachname, kontaktNachnameUpdate] = useState(null);
    const [kontaktEmail, kontaktEmailUpdate] = useState(null);
    const [kontaktTelefon, kontaktTelefonUpdate] = useState(null);
    const [kontaktNachricht, kontaktNachrichtUpdate] = useState(null);
    const [errorMessages, setErrorMessages] = useState({
        vorname: "",
        nachname: "",
        email: "",
        telefon: "",
        nachricht: ""
    });


    function readTextFromServer(u, cb) {
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    };

    function kontaktAnfrage() {
        const kontaktOjekt = {
            Vorname: kontaktVorname,
            Nachname: kontaktNachname,
            Email: kontaktEmail,
            Telefon: kontaktTelefon,
            Nachricht: kontaktNachricht
        };

        const errors = {};

        if (kontaktVorname === "") {
            errors.vorname = "Bitte Vorname eintippen";
        }
        if (kontaktNachname === "") {
            errors.nachname = "Bitte Nachnamen eintippen";
        }
        if (kontaktEmail === "") {
            errors.email = "Bitte Email eintippen";
        }
        if (kontaktTelefon === "") {
            errors.telefon = "Bitte Telefonnummer eintippen";
        }
        if (kontaktNachricht === "") {
            errors.nachricht = "Bitte Nachricht eintippen";
        }

        setErrorMessages(errors);

        if (Object.keys(errors).length === 0) {
            readTextFromServer("http://localhost:3344/ablegen/kontakt/" + JSON.stringify(kontaktOjekt),
                (e) => {
                    kontaktVornameUpdate("");
                    kontaktNachnameUpdate("");
                    kontaktEmailUpdate("");
                    kontaktTelefonUpdate("");
                    kontaktNachrichtUpdate("");
                    const inpudFeld = document.getElementsByTagName("input");
                    const textFeld = document.getElementsByTagName("textarea")[0];
                    // *** //
                    for (let x = 0; x < inpudFeld.length; x++)
                        inpudFeld[x].value = "";
                    textFeld.value = "";
                }
            );
        }
    };


    return (
        <div className="Kontakt">
            <h3>Bei Fragen und Anregungen</h3>
            <p>{errorMessages.vorname}</p>
            <input type="text" placeholder="Vorname" onKeyUp={(e) => kontaktVornameUpdate(e.target.value)} />
            <br />
            <p>{errorMessages.nachname}</p>
            <input type="text" placeholder="Nachname" onKeyUp={(e) => kontaktNachnameUpdate(e.target.value)} />
            <br />
            <p>{errorMessages.email}</p>
            <input type="email" placeholder="Email" onKeyUp={(e) => kontaktEmailUpdate(e.target.value)} />
            <br />
            <p>{errorMessages.telefon}</p>
            <input type="tel" placeholder="Telefon" onKeyUp={(e) => kontaktTelefonUpdate(e.target.value)} />
            <br />
            <p>{errorMessages.nachricht}</p>
            <textarea placeholder="Nachricht" onKeyUp={(e) => kontaktNachrichtUpdate(e.target.value)}></textarea>
            <br />
            <button onClick={() => kontaktAnfrage()}>Senden</button>
        </div>
    );
}