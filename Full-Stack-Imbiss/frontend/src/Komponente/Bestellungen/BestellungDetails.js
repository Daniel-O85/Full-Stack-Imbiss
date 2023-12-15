import React, { useState, useEffect } from "react";
import "./BestellungDetails.css";
import { encodeText, decodeText } from "./../EncodeDecode/EncodeDecode"

export default function BestellungDetails({ BeNr, Daten }) {
    const [bestellungDetails, bestellungDetailsUpdate] = useState("");
    const [anAus, anAusUpdate] = useState(undefined);


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

    function readJSONFromServer(u, cb) {
        window.fetch(u)
            .then(rohdaten => rohdaten.json())
            .then(daten => cb(daten))
            .catch((fehler) => {
            });
    }

    function bestellungAbschliessen() {
        readTEXTFromServer(`http://localhost:3344/admin/bestellung/complete/${BeNr}`,
            (e) => {
                // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                const paragraph = document.createElement("p");
                paragraph.classList.add("orderComplete");
                paragraph.textContent = "Bestellung abgeschlossen";
                paragraph.style.color = "green";
                document.body.appendChild(paragraph);

                const konfirm = document.getElementById("orderDetail");
                konfirm.parentNode.insertBefore(paragraph, konfirm.nextSibling);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    }



    function showDetails() {
        readJSONFromServer("http://localhost:3344/warenkorb/bestelldetail/" + BeNr,
            (zeilen) => {
                const htmlCode = zeilen.map((zeile) => {
                    let sam = decodeText(zeile.Details);
                    let detailsArray = JSON.parse(sam);

                    return (
                        <div id={zeile.BestellNr} key={Daten.BestellNr}>
                            {detailsArray.map((detail, index) => (
                                <div id="orderDetail" key={index}>
                                    <p>Produkt: {detail.Produktname}</p>
                                    {detail.Inhalt !== undefined ? <p>Enthält: {detail.Inhalt}</p> : null}
                                    <p>Menge: {detail.Menge}</p>
                                    <p>Einzelpreis: {detail.EinzelPreis}€</p>
                                    <hr />
                                </div>
                            ))}
                            <p><button onClick={() => bestellungAbschliessen()}>Bestellung abschließen</button></p>
                        </div>
                    );
                });
                bestellungDetailsUpdate(htmlCode);
            });
    }

    useEffect(
        () => {
            showDetails()
        },
        []
    );

    function detailsAbrufen() {
        anAusUpdate(!anAus);
    }

    let datum = new Date();
    return (
        <>
            <tr key={Daten.BestellNr}>
                <td><p><b>{Daten.BestellNr}</b></p></td>
                <td><p>{(datum.getDate() + "." + (datum.getMonth() + 1) + "." + datum.getFullYear())}</p></td>
                <td><p><u>{Daten.Brutto.toFixed(2)}€</u></p></td>
                <td>
                    <button onClick={detailsAbrufen}>
                        Details
                    </button>
                </td>
                <td>
                    <div>
                        {anAus && (
                            <div className="BestellDetails">
                                <h3>Bestellnummer: {BeNr}</h3>
                                {bestellungDetails}
                            </div>
                        )}
                    </div>
                </td>
            </tr>

        </>
    );
}