import React, { useState, useEffect } from "react";
import SessionStorageService from "../SessionStorageService";
import "./AdminAngebote.css";

export default function AdminAngebote() {
    const [angebot, angebotUpdate] = useState([]);
    const [neuesAngebot, setNeuesAngebot] = useState("");
    const [neuerPreis, setNeuerPreis] = useState("");
    const [neueDaten, setNeueDaten] = useState("");

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

    const ProduktAngebotZeile = ({ Data }) => {
        const [editMode, setEditMode] = useState(false);
        const [neuesAngebot, setNeuesAngebot] = useState(Data.Angebotsname);
        const [neuerPreis, setNeuerPreis] = useState(Data.Preis);
        const [neueDaten, setNeueDaten] = useState(Data.Daten);

        // Funktion, um JSON-Daten zu formatieren
        function formatiereDaten(daten) {
            const { Hauptspeise, Beilage, Getraenk } = JSON.parse(daten);
            const formattedDaten = [];

            if (Hauptspeise) formattedDaten.push(Hauptspeise);
            if (Beilage) formattedDaten.push(Beilage);
            if (Getraenk) formattedDaten.push(Getraenk);

            return formattedDaten.length > 0 ? formattedDaten.join(', ') : 'N/A';
        }


        const editOffer = (e) => {
            setEditMode(true);
        };

        const offerDelete = () => {
            readTEXTFromServer(`http://localhost:3344/admin/angebot/entf/${Data.AngID}`,
                (e) => {
                    // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                    const paragraph = document.createElement("p");
                    paragraph.classList.add("delete-Offer");
                    paragraph.textContent = "Angebot wurde gelöscht";
                    paragraph.style.color = "red";
                    document.body.appendChild(paragraph);

                    const table = document.querySelector("table");
                    table.parentNode.insertBefore(paragraph, table.nextSibling);

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
        };


        const angebotSave = () => {
            const defaultData = { Hauptspeise: "", Beilage: "", Getraenk: "" };

            // Annahme: "Gyros, Salat, Cola"
            const enteredDataArray = neueDaten.split(',').map(item => item.trim());

            // Erstelle ein Objekt mit den erwarteten Schlüsseln
            const enteredDataObject = {
                Hauptspeise: enteredDataArray[0] || "",
                Beilage: enteredDataArray[1] || "",
                Getraenk: enteredDataArray[2] || ""
            };

            const finalData = JSON.stringify({ ...defaultData, ...enteredDataObject });

            const url = `http://localhost:3344/admin/angebot/aendern/${Data.AngID}/${neuesAngebot}/${neuerPreis}/${finalData}`;

            readTEXTFromServer(url, (response) => {
                const paragraph = document.createElement("p");
                paragraph.classList.add("update-Produkt");
                paragraph.textContent = "Angebot wurde geändert";
                paragraph.style.color = "green";
                document.body.appendChild(paragraph);

                const table = document.querySelector("table");
                table.parentNode.insertBefore(paragraph, table);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });

            setEditMode(false);
        }


        return (
            <>
                <tr className={`menge-zero ${editMode ? 'verstecken' : 'anzeigen'}`}>
                    <td>
                        <p>
                            <b>{Data.Angebotsname}</b>
                        </p>
                    </td>
                    <td>
                        <p>
                            <b>{formatiereDaten(Data.Daten)}</b>
                        </p>
                    </td>
                    <td>
                        <p>
                            <u className="anzeigen" style={{ color: "blue" }}>{Data.Preis}€</u>
                        </p>
                    </td>
                    <td className="btn-start">
                        <button onClick={editOffer}>Bearbeiten</button>
                        <button onClick={offerDelete}>Entfernen</button>
                    </td>
                </tr>
                <tr className={`menge-zero ${editMode ? 'anzeigen' : 'verstecken'}`}>
                    <td>
                        <p>
                            <input
                                id={`neuerAngebotName_${Data.AngID}`}
                                value={neuesAngebot}
                                onChange={(e) => setNeuesAngebot(e.target.value)}
                            />
                        </p>
                    </td>
                    <td>
                        <p>
                            <input
                                id={`neueDaten_${Data.AngID}`}
                                defaultValue={formatiereDaten(Data.Daten)}
                                onChange={(e) => setNeueDaten(e.target.value)}
                            />
                        </p>
                    </td>
                    <td>
                        <p>
                            <input
                                id={`neuerPreis_${Data.AngID}`}
                                style={{ color: "blue" }}
                                value={neuerPreis}
                                onChange={(e) => setNeuerPreis(e.target.value)}
                            />
                        </p>
                    </td>
                    <td className="btn-start">
                        <button onClick={angebotSave}>Speichern</button>
                    </td>
                </tr>
            </>
        );
    };

    function readJSONFromServer(u, cb) {
        window
            .fetch(u)
            .then((rohdaten) => rohdaten.json())
            .then((daten) => cb(daten))
            .catch((fehler) => console.error(fehler));
    }

    function aktualisiereInhalt() {
        readJSONFromServer("http://localhost:3344/abruf/angebot/tabelle", (zeilen) => {
            const htmlCode = zeilen.map((zeile) => (
                <ProduktAngebotZeile key={zeile.id} Data={zeile} />
            ));
            angebotUpdate(htmlCode);
        });
    }



    useEffect(() => {
        aktualisiereInhalt();

    }, []);

    function addNewOffer() {
        // Überprüfen, ob alle Felder ausgefüllt sind
        if (neuesAngebot && neueDaten && neuerPreis) {
            // Neues Produkt erstellen
            const defaultData = { Hauptspeise: "", Beilage: "", Getraenk: "" };

            // Annahme: "Gyros, Salat, Cola"
            const enteredDataArray = neueDaten.split(',').map(item => item.trim());

            // Erstelle ein Objekt mit den erwarteten Schlüsseln
            const enteredDataObject = {
                Hauptspeise: enteredDataArray[0] || "",
                Beilage: enteredDataArray[1] || "",
                Getraenk: enteredDataArray[2] || ""
            };

            const finalData = JSON.stringify({ ...defaultData, ...enteredDataObject });

            const addOffer = {
                Angebotsname: neuesAngebot,
                Daten: finalData,
                Preis: neuerPreis
            };

            // Die Eingabefelder zurücksetzen
            setNeuesAngebot("");
            setNeueDaten("");
            setNeuerPreis("");


            // Anfrage an den Server senden, um das Produkt in die Datenbank einzufügen
            const url = `http://localhost:3344/admin/angebot/neu/${addOffer.Angebotsname}/${addOffer.Daten}/${addOffer.Preis}`;
            readTEXTFromServer(url, (response) => {

                const paragraph = document.createElement("p");
                paragraph.classList.add("add-Angebot");
                paragraph.textContent = "Angebot wurde hinzugefügt";
                paragraph.style.color = "green";
                document.body.appendChild(paragraph);

                const table = document.querySelector("table");
                table.parentNode.insertBefore(paragraph, table.nextSibling);

                setTimeout(() => {
                    // Nach einer gewissen Zeit die Erfolgsmeldung ausblenden
                    paragraph.remove();
                    window.location.reload();
                }, 2000);

            });
        }
        else {
            const paragraph = document.createElement("p");
            paragraph.classList.add("add-Angebot");
            paragraph.textContent = "Bitte alle Felder ausfüllen";
            paragraph.style.color = "red";
            document.body.appendChild(paragraph);

            const table = document.querySelector("table");
            table.parentNode.insertBefore(paragraph, table.nextSibling);

            setTimeout(() => {
                // Nach einer gewissen Zeit die Erfolgsmeldung ausblenden
                paragraph.remove();
            }, 2000);
        }

    }


    return (
        <div className="startseite">
            <table>
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Beinhaltet</th>
                        <th>Stückpreis</th>
                        <th>{/* Platzhalter */}</th>
                    </tr>
                </thead>
                <tbody>{angebot}</tbody>
            </table>
            <div>
                <input
                    type="text"
                    placeholder="Neues Angebot"
                    defaultValue={neuesAngebot}
                    onChange={(e) => setNeuesAngebot(e.target.value)} />
                <input
                    type="text"
                    placeholder="Angebot Inhalt"
                    defaultValue={neueDaten}
                    onChange={(e) => setNeueDaten(e.target.value)} />
                <input
                    type="number"
                    placeholder="Angebot Preis"
                    defaultValue={neuerPreis}
                    onChange={(e) => setNeuerPreis(e.target.value)} />
                <button onClick={addNewOffer}>Angebot Hinzufügen</button>
            </div>
        </div>
    );

}