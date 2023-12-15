import React, { useEffect, useState } from "react";
import "./Login.css";

export default function Login() {
    // login
    const [adminUser, adminUserUpdate] = useState(null);
    const [adminPass, adminPassUpdate] = useState(null);
    //---//
    const [ergebnis, ergebnisUpdate] = useState("");
    //---//
    const [reloadMe, reloadMeUpload] = useState(null);
    //---//
    function readTextFromServer(u, cb) {
        // Anfrage an den Server scihcken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }


    //---//
    function anmeldung() {
        readTextFromServer(
            "http://localhost:3344/login/" + adminUser + "/" + adminPass,
            (antwort) => {
                console.log(antwort);
                sessionStorage.setItem("eingeloggt", antwort === "0" ? "0" : "1");
                sessionStorage.setItem("ID", antwort);
                ergebnisUpdate(antwort);

                // Den Wert von antwort überprüfen und entsprechend umleiten
                if (antwort === "0") {
                    // Umleitung zurück zum Login
                    reloadMeUpload(
                        () => {
                            window.setTimeout(
                                () => {
                                    window.location.href = "http://localhost:3000/login/";
                                },
                                2300
                            );
                        }
                    );
                } else if (antwort === "1") {
                    // Umleitung auf die AdminMenu seite
                    window.location.href = "http://localhost:3000/";
                }
            }
        );
    }


    return (
        <>
            {ergebnis === "" ? (
                <div className="login">
                    <div>
                        <h3>Einloggen</h3>
                        <input type="text" placeholder="Benutzer" onKeyUp={(e) => adminUserUpdate(e.target.value)} />

                        <br />
                        <input type="password" placeholder="Kennwort" onKeyUp={(e) => adminPassUpdate(e.target.value)} />

                        <br />
                        <button onClick={() => anmeldung()}>Anmelden</button>
                    </div>
                </div>
            ) : ergebnis === "0" ? (
                <div className="login">
                    <div>
                        <h3>Einloggen</h3>
                        <input type="text" placeholder="Benutzer" onKeyUp={(e) => adminUserUpdate(e.target.value)} />

                        <br />
                        <input type="password" placeholder="Kennwort" onKeyUp={(e) => adminPassUpdate(e.target.value)} />

                        <br />
                        <button onClick={() => anmeldung()}>Anmelden</button>
                        <p style={{ color: "red" }}>Benutername oder Kennwort Falsch <br />
                            Bitte versuchen sie es erneut</p>
                    </div>

                </div>
            ) : (
                <p>
                    {reloadMe}
                </p>
            )}
        </>
    );
}
