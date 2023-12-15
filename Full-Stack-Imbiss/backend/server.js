const express = require("express");
const server = express();
const cors = require("cors");
server.use(cors());
const sqlite3 = require("sqlite3");
const enDeCode = require("./EncodeDecode.js");

let db = new sqlite3.Database("./imbissBude.db", (fehler) => {
    if (fehler) console.error(fehler.message);
    else
        console.log(
            "Verbindung zur Datenbank imbissBude.db erfolgreich aufgebaut :-)"
        );
});

const PortNummer = 3344;

// /abruf/produkt...
server.get("/abruf/produkt/tabelle", (request, respond) => {
    db.all("SELECT * FROM Produkte", (fehler, zeile) => {
        if (fehler) {
            console.error(fehler);
        } else {
            respond.send(zeile);
        }
    }
    );
});

// /login...
server.get("/login/:u/:p", (request, respond) => {
    db.all(
        `SELECT * FROM Verwaltung WHERE EINTRAG = 'adminUser' 
    AND EINTRAG2 = 'adminPass'`,
        (fehler, zeile) => {
            if (fehler !== null) {
                console.error(fehler);
                respond.send("0");
            } else {
                if (zeile[0].WERT == `${request.params.u},${request.params.p}`)
                    respond.send("1");
                else respond.send("0");
            }
        }
    );
});

// /warenkorb...
server.get("/warenkorb/neu/:d/:k", (request, respond) => {
    const brutto = Number(request.params.k);
    const mwst = (7 / 100) * brutto;
    const netto = brutto - mwst;
    db.run(
        `INSERT INTO Bestellungen
        (Details, Netto, MwSt, Brutto)
        VALUES
        ('${request.params.d}',
        '${netto}',
        '${mwst}',
        '${brutto}')
        `,
        (fehler) => console.error(fehler)
    );
    respond.send("Warenkorb ok");
});
// /warenkorb/abrufen...
server.get("/warenkorb/abrufen", (request, respond) => {
    db.all("SELECT * FROM Bestellungen", (fehler, zeile) => {
        if (fehler) {
            console.error(fehler);
        } else {
            respond.send(zeile);
        }
    }
    );
});

// /warenkorb/bestelldetail...
server.get("/warenkorb/bestelldetail/:BeNr", (request, respond) => {
    db.all(`SELECT Details FROM Bestellungen WHERE BestellNr = '${request.params.BeNr}'`,
        (fehler, zeile) => {
            if (fehler) {
                console.error(fehler);
                respond.status(500).json({ error: "Interner Serverfehler" });
            } else {
                respond.send(zeile);
            }
        });
});

// /bestellung/complete...
server.get("/admin/bestellung/complete/:BestellNr", (request, respond) => {
    db.run(
        `DELETE FROM Bestellungen WHERE BestellNr = '${request.params.BestellNr}'`,
        (fehler) => console.error(fehler)
    );
    respond.send("Bestellung abgeschlossen");
});

// /abruf/datenschutz...
server.get("/abruf/datenschutz", (request, respond) => {
    db.get(`SELECT WERT FROM Verwaltung WHERE EINTRAG = 'Datenschutz'`, (fehler, row) => {
        if (fehler) {
            console.error(fehler);
            respond.status(500).send("Fehler beim Abrufen des Datenschutz");
        } else {
            if (row) {
                const datenschutzWert = row.WERT;
                respond.send(`${datenschutzWert}`);
            } else {
                respond.status(404).send("Datenschutz nicht gefunden");
            }
        }
    });
});

// /abruf/impressum...
server.get("/abruf/impressum", (request, respond) => {
    db.get(`SELECT WERT FROM Verwaltung WHERE EINTRAG = 'Impressum'`, (fehler, row) => {
        if (fehler) {
            console.error(fehler);
            respond.status(500).send("Fehler beim Abrufen des Impressums");
        } else {
            if (row) {
                const impressumWert = row.WERT;
                respond.send(`${impressumWert}`);
            } else {
                respond.status(404).send("Impressum nicht gefunden");
            }
        }
    });
});

// /ablegen/kontakt/:objekt...
server.get("/ablegen/kontakt/:objekt", (request, respond) => {
    const o = JSON.parse(request.params.objekt);
    if (o !== 0)
        db.run(
            `INSERT INTO KontaktAnfragen
        ( Vorname, Nachname, Telefon, Email, Nachricht )
        VALUES
        ('${o.Vorname}',
        '${o.Nachname}',
        '${o.Telefon}',
        '${o.Email}',
        '${o.Nachricht}'
        )`,
            (fehler) => console.error(fehler)
        );
    respond.send("hinzugefügt");
});

// /abruf/angebot...
server.get("/abruf/angebot/tabelle", (request, respond) => {
    db.all(`SELECT * FROM Angebote`, (fehler, zeile) => {
        if (fehler) {
            console.error(fehler);
        } else {
            respond.send(zeile);
        }
    });
});

// /angebot/inhalt...
server.get("/angebot/inhalt/:angebotsname", (request, respond) => {
    const angebotsname = request.params.angebotsname;

    db.all(`SELECT Daten, Preis FROM Angebote WHERE Angebotsname = ?`, [angebotsname], (fehler, zeile) => {
        if (fehler) {
            console.error(fehler);
            respond.status(500).send("Internal Server Error");
        } else {
            respond.send(zeile);
        }
    });
});


// /admin/produkt/aendern...
server.get(
    "/admin/produkt/aendern/:ProdID/:name/:preis/",
    (request, respond) => {
        db.run(
            `UPDATE Produkte SET 
             Produktname = "${request.params.name}",
             Preis = "${request.params.preis}"
             WHERE ProdID = "${request.params.ProdID}"`,
            (fehler) => console.error(fehler)
        );
        respond.send("ok");
    }
);

// /admin/produkt/neu...
server.get("/admin/produkt/neu/:name/:preis", (request, respond) => {
    db.run(
        `INSERT INTO Produkte(Produktname, Preis)
        VALUES
        ('${request.params.name}',
        '${request.params.preis}')`,
        (fehler) => console.error(fehler)
    );
    respond.send("ok");
});

// /admin/produkt/entf..
server.get("/admin/produkt/entf/:ProdID", (request, respond) => {
    db.run(
        `DELETE FROM Produkte WHERE ProdID = '${request.params.ProdID}'`,
        (fehler) => console.error(fehler)
    );
    respond.send("Produkt wurde entfernt");
});

// /admin/angebot/aendern...
server.get("/admin/angebot/aendern/:angid/:titel/:preis/:objekt", (request, respond) => {
    const o = JSON.parse(request.params.objekt);
    if (o !== 0)
        db.run(
            `UPDATE Angebote SET
        Angebotsname = '${request.params.titel}',
        Preis = '${request.params.preis}',
        Daten = '${JSON.stringify(o)}'
        WHERE AngID = '${request.params.angid}'
        `,
            (fehler) => console.error(fehler)
        );
    respond.send("geändert");
});

// /admin/angebot/neu...
server.get("/admin/angebot/neu/:titel/:objekt/:preis", (request, respond) => {
    const o = JSON.parse(request.params.objekt);
    if (o !== 0)
        db.run(
            `INSERT INTO Angebote
        ( Angebotsname, Preis, Daten )
        VALUES
        ('${request.params.titel}',
        '${request.params.preis}',
        '${JSON.stringify(o)}'
        )`,
            (fehler) => console.error(fehler)
        );
    respond.send("neu ok");
});

// /admin/angebot/entf...
server.get("/admin/angebot/entf/:angid", (request, respond) => {
    db.run(
        `DELETE FROM Angebote WHERE AngID = '${request.params.angid}'`,
        (fehler) => console.error(fehler)
    );
    respond.send("Angebot wurde entfernt");
});

// /admin/kontakt/abruf...
server.get("/admin/kontakt/abruf", (request, respond) => {
    db.all(
        `SELECT * FROM KontaktAnfragen`, (fehler, zeile) => {
            if (fehler) {
                console.error(fehler);
            } else {
                respond.send(zeile);
            }
        });
});

// /admin/kontakt/entf...
server.get("/admin/kontakt/entf/:kaID", (request, respond) => {
    db.run(
        `DELETE FROM KontaktAnfragen WHERE KAID = '${request.params.kaID}'`,
        (fehler) => console.error(fehler)
    );
    respond.send("Kontakt wurde entfernt");
});

// /admin/socialMedia/abrufen...
server.get("/admin/socialMedia/abrufen/:platform", (request, respond) => {
    const platform = request.params.platform.toUpperCase();

    db.get(`SELECT WERT FROM Verwaltung WHERE EINTRAG = 'SocialMedia-${platform}'`, (fehler, row) => {
        if (fehler) {
            console.error(fehler);
            respond.status(500).send(`Fehler beim Abrufen von SocialMedia-${platform}`);
        } else {
            if (row) {
                const socialMediaWert = row.WERT;
                respond.send(`${socialMediaWert}`);
            } else {
                respond.status(404).send(`SocialMedia-${platform} nicht gefunden`);
            }
        }
    });
});


// /admin/socialMedia/aendern/:id/:wert..
server.get("/admin/socialMedia/aendern/:id/:wert", (request, respond) => {
    const o = request.params;
    const i = o.id.toUpperCase();
    const w = enDeCode.decodeText(o.wert);
    let sql = "";
    //
    switch (i) {
        case "X":
            sql = `UPDATE Verwaltung SET
            WERT = '${w}'
            WHERE EINTRAG = 'SocialMedia-${i}'`;
            break;
        case "F":
            sql = `UPDATE Verwaltung SET
            WERT = '${w}'
            WHERE EINTRAG = 'SocialMedia-${i}'`;
            break;
        case "L":
            sql = `UPDATE Verwaltung SET
            WERT = '${w}'
            WHERE EINTRAG = 'SocialMedia-${i}'`;
            break;
        case "I":
            sql = `UPDATE Verwaltung SET
            WERT = '${w}'
            WHERE EINTRAG = 'SocialMedia-${i}'`;
            break;
    }
    db.run(sql,
        (fehler) => {
            if (fehler) {
                console.error(fehler);
            }
        }
    )
    respond.send("ok");
});

// /admin/aendern/d...
server.get("/admin/aendern/d/:text", (request, respond) => {
    console.log(`Anfrage zum Ändern des Datenschutzes: ${request.params.text}`);
    db.run(
        `UPDATE Verwaltung SET
        WERT = '${request.params.text}'
        WHERE EINTRAG = 'Datenschutz'`,
        (fehler) => {
            if (fehler) {
                console.error(fehler);
            }
        }
    );
    respond.send("OK");
});


// /admin/aendern/i...
server.get("/admin/aendern/i/:text", (request, respond) => {
    db.run(
        `UPDATE Verwaltung SET
        WERT = '${request.params.text}'
        WHERE EINTRAG = 'Impressum'`,
        (fehler) => {
            if (fehler) {
                console.error(fehler);
            }
        }
    );
    respond.send("OK");
});

const newServer = server.listen(
    PortNummer, // Die Portnummer, die abgehört werden soll
    () =>
    // Die Callback-Funktion, die aufgerufen wird, wenn was reinkommt
    {
        // Beispiel auf Konsole
        console.log(`Server horcht nach http://localhost:${PortNummer}/`);
    }
);
