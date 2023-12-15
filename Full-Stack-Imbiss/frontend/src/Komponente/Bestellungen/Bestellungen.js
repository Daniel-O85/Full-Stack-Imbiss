import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./Bestellungen.css";
import BestellungDetails from "./BestellungDetails";

export default function Bestellungen() {
    const [bestellung, bestellungUpdate] = useState([]);
    const eingeloggt = sessionStorage.getItem("eingeloggt");

    useEffect(() => {
        if (eingeloggt === "1") {
            aktualisiereInhalt();
        } else {
            bestellungUpdate([]);
        }
    }, [eingeloggt]);

    function readJSONFromServer(u, cb) {
        window.fetch(u)
            .then(rohdaten => rohdaten.json())
            .then(daten => cb(daten))
            .catch((fehler) => console.error(fehler));
    }

    function aktualisiereInhalt() {
        readJSONFromServer("http://localhost:3344/warenkorb/abrufen",
            (zeilen) => {
                const htmlCode = zeilen.map((zeile) => <BestellungDetails Daten={zeile} BeNr={zeile.BestellNr} />);
                bestellungUpdate(htmlCode);
            });
    }

    if (eingeloggt === "1") {
        return (
            <div className="bestellungen">
                <table>
                    <thead>
                        <tr>
                            <th>Bestellnummer</th>
                            <th>Datum</th>
                            <th>Endpreis</th>
                            <th>{/*placeholder*/}</th>
                        </tr>
                    </thead>
                    <tbody>{bestellung}</tbody>
                </table>
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