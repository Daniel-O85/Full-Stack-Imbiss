import React, { useEffect, useState } from "react";
import "./Anfragen.css";

export default function Anfragen() {
    const [userAnfragen, userAnfragenUpdate] = useState([]);

    function readJSONFromServer(u, cb) {
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als JSON-Objekt weiterreichen
            .then(rohdaten => rohdaten.json())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }

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

    //*****//
    function deleteKontakt(kiD) {
        readTEXTFromServer(`http://localhost:3344/admin/kontakt/entf/${kiD}`, () => {
            // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
            const paragraph = document.createElement("p");
            paragraph.classList.add("delete-Kontakt");
            paragraph.textContent = "Anfrage wurde gelöscht";
            paragraph.style.color = "green";
            document.body.appendChild(paragraph);

            const table = document.querySelector("table");
            table.parentNode.insertBefore(paragraph, table.nextSibling);

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
    };

    //*****//

    function showUserKontakt() {
        readJSONFromServer("http://localhost:3344/admin/kontakt/abruf",
            (row) => {
                const htmlCode = [];

                //
                row.forEach(
                    (newRow) => {
                        console.log("ID test", newRow.KAID)
                        htmlCode.push(

                            <>
                                <tbody>
                                    <tr>
                                        <td>{newRow.KAID}</td>
                                        <td>{newRow.Vorname}</td>
                                        <td>{newRow.Nachname}</td>
                                        <td>{newRow.Telefon}</td>
                                        <td>{newRow.Email}</td>
                                        <td> <p>{newRow.Nachricht}</p>
                                            <button onClick={() => deleteKontakt(newRow.KAID)}>Löschen</button>
                                        </td>
                                    </tr>
                                </tbody>

                            </>

                        )
                    }
                )
                // *** //
                userAnfragenUpdate([...userAnfragen, htmlCode]);
            });
    };

    // Erstmaliges rendern des Inhalts
    useEffect(
        () => {
            showUserKontakt();
        },
        []
    );

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Telefon</th>
                        <th>Email</th>
                        <th>Nachricht</th>
                    </tr>
                </thead>

                {userAnfragen}

            </table>
        </div>
    );

}