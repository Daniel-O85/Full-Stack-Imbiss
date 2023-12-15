import React, { useState, useEffect } from "react";
import SessionStorageService from "../SessionStorageService";
import "./Startseite.css";

export default function Startseite() {
  const [produkt, produktUpdate] = useState([]);
  const [gesamtnetto, gesamtNettoUpdate] = useState(0);
  const [mwSt, mwStUpdate] = useState(0);

  const ProduktAngebotZeile = ({ Daten }) => {
    const [gesamt, gesamtUpdate] = useState(0);
    const [menge, mengeUpdate] = useState(0);
    const [preis, preisNotiz] = useState(0);

    function neuBerechnen(feld) {
      console.log(feld.value);
      mengeUpdate(feld.value);
      gesamtUpdate(Number(preis) * Number(feld.value));
    }

    useEffect(() => {
      mengeUpdate(0);
      preisNotiz(Daten.Preis);
      gesamtUpdate(Number(preis) * Number(menge));
    }, [Daten]);

    const addToCart = (e) => {
      const cartItems = SessionStorageService.getCart();

      const produktInfo = {
        id: Daten.ProdID,
        Produktname: Daten.Produktname,
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
            <b>{Daten.Produktname}</b>
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
    readJSONFromServer("http://localhost:3344/abruf/produkt/tabelle", (zeilen) => {
      const htmlCode = zeilen.map((zeile) => (
        <ProduktAngebotZeile key={zeile.id} Daten={zeile} />
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
