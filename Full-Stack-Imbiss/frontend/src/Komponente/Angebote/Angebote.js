import React, { useState, useEffect } from "react";
import SessionStorageService from "../SessionStorageService";
import "./Angebote.css";

export default function Angebote() {
    const [produkt, produktUpdate] = useState([]);
    const [gesamtnetto, gesamtNettoUpdate] = useState(0);
    const [mwSt, mwStUpdate] = useState(0);

    const ProduktAngebotZeile = ({ Data }) => {
        const [gesamt, gesamtUpdate] = useState(0);
        const [menge, mengeUpdate] = useState(0);
        const [preis, preisNotiz] = useState(0);

        // Funktion, um JSON-Daten zu formatieren
        function formatiereDaten(daten) {
            const { Hauptspeise, Beilage, Getraenk } = JSON.parse(daten);
            return `${Hauptspeise || 'N/A'}, ${Beilage || 'N/A'}, ${Getraenk || 'N/A'}`;
        }

        function neuBerechnen(feld) {
            console.log(feld.value);
            mengeUpdate(feld.value);
            gesamtUpdate(Number(preis) * Number(feld.value));
        }

        useEffect(() => {
            mengeUpdate(0);
            preisNotiz(Data.Preis);
            gesamtUpdate(Number(preis) * Number(menge));
        }, [Data]);

        const addToCart = (e) => {
            const cartItems = SessionStorageService.getCart();
            console.log("TEST", Data.Angebotsname);

            const produktInfo = {
                id: Data.AngID,
                Produktname: Data.Angebotsname,
                Inhalt: formatiereDaten(Data.Daten),
                Menge: menge,
                EinzelPreis: preis,
                GesamtPreis: gesamt.toFixed(2),
            };

            SessionStorageService.updateItem(produktInfo);
            e.target.parentElement.parentElement.querySelector(".inputMenge").value = 0;

            aktualisiereGesamtnetto();
        };

        return (
            <tr className={menge > 0 ? "menge-plus-zero" : "menge-zero"}>
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
                    <input
                        className="inputMenge"
                        type="number"
                        defaultValue={menge}
                        onKeyUp={(e) => {
                            neuBerechnen(e.target);
                        }}
                        onChange={(e) => {
                            neuBerechnen(e.target);
                        }}
                        onMouseUp={(e) => {
                            neuBerechnen(e.target);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e" || e.key === "E") {
                                e.preventDefault();
                            }
                        }}
                        min="0"
                    />
                </td>
                <td>
                    <p>
                        <u style={{ color: "blue" }}>{preis}€</u>
                    </p>
                </td>
                <td>
                    <p>
                        <u style={{ color: "green" }}>{gesamt.toFixed(2)}€</u>
                    </p>
                </td>
                <td className="btn-start">
                    <button onClick={addToCart}>+</button>
                </td>
            </tr>
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
            produktUpdate(htmlCode);
        });
    }

    function aktualisiereGesamtnetto() {
        const cartItems = SessionStorageService.getCart();
        const gesamtpreise = cartItems.map((item) => Number(item.GesamtPreis));
        const gesamtnettoFromStorage = gesamtpreise.reduce((total, price) => total + price, 0);
        gesamtNettoUpdate(gesamtnettoFromStorage);

        const mwSt = gesamtnettoFromStorage * 0.07;
        mwStUpdate(mwSt);
        gesamtNettoUpdate(gesamtnettoFromStorage);
    }

    useEffect(() => {
        aktualisiereInhalt();
        aktualisiereGesamtnetto();
    }, []);

    const netto = gesamtnetto - mwSt;

    return (
        <div className="startseite">
            <table>
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Beinhaltet</th>
                        <th>Menge</th>
                        <th>Stückpreis</th>
                        <th>Gesamtpreis</th>
                        <th>{/* Platzhalter */}</th>
                    </tr>
                </thead>
                <tbody>{produkt}</tbody>
            </table>
            <div>
                <p>Gesamtnetto: {netto.toFixed(2)}€</p>
                <p>MwSt: {mwSt.toFixed(2)}€</p>
                <p>Endbetrag: {(gesamtnetto).toFixed(2)}€</p>
            </div>
        </div>
    );
}
