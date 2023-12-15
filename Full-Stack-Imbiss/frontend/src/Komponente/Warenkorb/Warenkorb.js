import React, { useState, useEffect } from "react";
import "./Warenkorb.css";
import { encodeText } from "./../EncodeDecode/EncodeDecode";
import SessionStorageService from "../SessionStorageService";

export default function Warenkorb() {
    const [warenkorb, setWarenkorb] = useState([]);
    const [gesamtPreis, setGesamtPreis] = useState(0);

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

    useEffect(() => {
        const cartFromStorage = SessionStorageService.getCart();
        const warenkorbArray = cartFromStorage.map((item) => ({
            id: item.ProdID,
            Produktname: item.Produktname,
            Menge: parseInt(item.Menge),
            EinzelPreis: parseFloat(item.EinzelPreis),
            GesamtPreis: item.GesamtPreis,
            Inhalt: item.Inhalt,
        }));

        setWarenkorb(warenkorbArray);

        const gesamt = warenkorbArray.reduce(
            (acc, item) => acc + item.EinzelPreis * item.Menge,
            0
        );
        setGesamtPreis(gesamt);
    }, []);

    const updateSessionStorage = (updatedWarenkorb) => {
        updatedWarenkorb.forEach((item) => {
            SessionStorageService.updateItem({
                id: item.id,
                Produktname: item.Produktname,
                Menge: item.Menge.toString(),
                EinzelPreis: item.EinzelPreis.toString(),
                GesamtPreis: item.GesamtPreis,
                Inhalt: item.Inhalt,
            });
        });
    };

    const handleQuantityChange = (angebotsname, modus) => {
        setWarenkorb((prevWarenkorb) =>
            prevWarenkorb.map((item) =>
                item.Produktname === angebotsname
                    ? {
                        ...item,
                        Menge:
                            modus === "erhöhen"
                                ? item.Menge + 1
                                : Math.max(0, item.Menge - 1),
                        GesamtPreis:
                            modus === "erhöhen"
                                ? (item.Menge + 1) * item.EinzelPreis
                                : Math.max(0, (item.Menge - 1) * item.EinzelPreis),
                    }
                    : item
            )
        );
    };

    const handleLeeren = () => {
        SessionStorageService.clearCart();
        setWarenkorb([]);
        setGesamtPreis(0);
    };

    const handleBestellen = () => {
        if (!isNaN(gesamtPreis)) {
            const packet = encodeText(JSON.stringify(SessionStorageService.getCart()));

            readTEXTFromServer(
                `http://localhost:3344/warenkorb/neu/${packet}/${gesamtPreis}`,
                (e) => {
                    if (e === "Warenkorb ok") {
                        handleLeeren();
                    }
                }
            );
        } else {
            console.error("Ungültiger Gesamtpreis:", gesamtPreis);
        }
    };

    return (
        <div className="warenkorb">
            <h3>Bestellliste</h3>
            {warenkorb.map((item) => (
                <div key={item.Produktname}>
                    <p>Produkt: {item.Produktname}</p>
                    {item.Inhalt !== undefined ? <p>Enthält: {item.Inhalt}</p> : null}
                    <p>Preis: {item.EinzelPreis.toFixed(2)}€</p>
                    <p id={item.Produktname}>Menge: {item.Menge}</p>
                    <button onClick={() => handleQuantityChange(item.Produktname, "erhöhen")}>+</button>
                    <button onClick={() => handleQuantityChange(item.Produktname, "verringern")}>-</button>
                    <hr />
                </div>
            ))}
            <p>Gesamtbetrag: {gesamtPreis.toFixed(2)}€</p>
            <button onClick={handleBestellen}>Kostenpflichtig bestellen</button>
            <button onClick={handleLeeren}>Warenkorb leeren</button>
        </div>
    );
}
