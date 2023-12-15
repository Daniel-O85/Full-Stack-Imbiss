import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./AdminProdukt.css";

export default function AdminProdukt() {
    const [produkt, produktUpdate] = useState([]);
    const [neuerProduktname, setNeuerProduktname] = useState("");
    const [neuerPreis, setNeuerPreis] = useState("");

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

    const ProduktAngebotZeile = ({ Daten }) => {
        const [editMode, setEditMode] = useState(false);
        const [neuerProduktname, setNeuerProduktname] = useState(Daten.Produktname);
        const [neuerPreis, setNeuerPreis] = useState(Daten.Preis);

        const produktEdit = () => {
            setEditMode(true);
        }

        const produktDelete = () => {
            readTEXTFromServer(`http://localhost:3344/admin/produkt/entf/${Daten.ProdID}`,
                (e) => {
                    // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                    const paragraph = document.createElement("p");
                    paragraph.classList.add("delete-Produkt");
                    paragraph.textContent = "Produkt wurde gelöscht";
                    paragraph.style.color = "red";
                    document.body.appendChild(paragraph);

                    const table = document.querySelector("table");
                    table.parentNode.insertBefore(paragraph, table.nextSibling);

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
        };

        const produktSave = () => {
            const url = `http://localhost:3344/admin/produkt/aendern/${Daten.ProdID}/${neuerProduktname}/${neuerPreis}`;

            readTEXTFromServer(url, (response) => {

                const paragraph = document.createElement("p");
                paragraph.classList.add("update-Produkt");
                paragraph.textContent = "Produkt wurde geändert";
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
                            <b>{Daten.Produktname}</b>
                        </p>
                    </td>
                    <td>
                        <p>
                            <u className="anzeigen" style={{ color: "blue" }}>{Daten.Preis}€</u>
                        </p>
                    </td>
                    <td className="btn-start">
                        <button onClick={produktEdit}>Bearbeiten</button>
                        <button onClick={produktDelete}>Entfernen</button>
                    </td>
                </tr>
                <tr className={`menge-zero ${editMode ? 'anzeigen' : 'verstecken'}`}>
                    <td>
                        <p>
                            <input
                                id={`neuerProduktname_${Daten.ProdID}`}
                                value={neuerProduktname}
                                onChange={(e) => setNeuerProduktname(e.target.value)}
                            />
                        </p>
                    </td>
                    <td>
                        <p>
                            <input
                                id={`neuerPreis_${Daten.ProdID}`}
                                style={{ color: "blue" }}
                                value={neuerPreis}
                                onChange={(e) => setNeuerPreis(e.target.value)}
                            />
                        </p>
                    </td>
                    <td className="btn-start">
                        <button onClick={produktSave}>Speichern</button>
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
        readJSONFromServer("http://localhost:3344/abruf/produkt/tabelle", (zeilen) => {
            const htmlCode = zeilen.map((zeile) => (
                <ProduktAngebotZeile key={zeile.id} Daten={zeile} />
            ));
            produktUpdate(htmlCode);
        });
    }

    useEffect(() => {
        aktualisiereInhalt();
    }, []);

    const addNewProdukt = () => {
        // Überprüfen, ob beide Felder ausgefüllt sind
        if (neuerProduktname && neuerPreis) {
            // Neues Produkt erstellen
            const neuesProdukt = {
                Produktname: neuerProduktname,
                Preis: neuerPreis
            };

            // Die Eingabefelder zurücksetzen
            setNeuerProduktname("");
            setNeuerPreis("");

            // Anfrage an den Server senden, um das Produkt in die Datenbank einzufügen
            const url = `http://localhost:3344/admin/produkt/neu/${neuesProdukt.Produktname}/${neuesProdukt.Preis}`;
            readTEXTFromServer(url, (response) => {

                const paragraph = document.createElement("p");
                paragraph.classList.add("add-Produkt");
                paragraph.textContent = "Produkt wurde hinzugefügt";
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
            paragraph.classList.add("add-Produkt");
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

    const eingeloggt = sessionStorage.getItem("eingeloggt");

    if (eingeloggt === "1") {
        return (
            <div className="startseite">
                <table>
                    <thead>
                        <tr>
                            <th>Produkt</th>
                            <th>Stückpreis</th>
                            <th>{/* Platzhalter */}</th>
                        </tr>
                    </thead>
                    <tbody>{produkt}</tbody>
                </table>
                <div>
                    <input
                        type="text"
                        placeholder="Neues Produkt"
                        value={neuerProduktname}
                        onChange={(e) => setNeuerProduktname(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Produkt Preis"
                        value={neuerPreis}
                        onChange={(e) => setNeuerPreis(e.target.value)}
                    />
                    <button onClick={addNewProdukt}>Produkt Hinzufügen</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="keinZugriff">
                <h3>Zugriff zu diesem Bereich der Webseite ist für Besucher nicht gestattet</h3>
                <hr />
                <p><Link to="/">weiter zur Startseite</Link></p>
            </div>
        );
    }
}
