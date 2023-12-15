import { Outlet, Link } from "react-router-dom";
import SocialMedia from "../Komponente/SocialMedia/SocialMedia";
import React from "react";
import "./Menu.css";

export default function Menu() {
    const eingeloggt = sessionStorage.getItem("eingeloggt");
    // wenn admin eingeloggt "eingeloggt wert 1" dann 
    if (eingeloggt === "1") {
        return (
            <>
                <header className="adminMenu">
                    <h2 className="feuer">Imbissbu.de</h2>
                    <ul>
                        <li>
                            <img src={"https://cdn-icons-png.flaticon.com/128/375/375884.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Logo"} />

                        </li>
                        <li>
                            <Link to="/">Bestellungen</Link>
                        </li>
                        <li>
                            <Link to="/admin/produkt">Produkte</Link>
                        </li>
                        <li>
                            <Link to="/admin/angebote">Angebote</Link>
                        </li>
                        <li>
                            <Link to="/adminAnfragen">Anfragen</Link>
                        </li>
                        <li>
                            <Link to="/adminsocialMedia">SocialMedia</Link>
                        </li>
                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    </ul>
                </header>
                <hr />
                <main>
                    <Outlet />
                </main>
                <hr />
                <footer >
                    <div>
                        <SocialMedia />
                    </div>
                    <ul>
                        <li>
                            <Link to="/impressum">Impressum</Link>
                        </li>
                        <li>
                            <Link to="/datenschutz"> Datenschutz</Link>
                        </li>
                    </ul>
                    <div className="copy">
                        <p>Copyright&copy; 2023 by Daniel Ottinger</p>
                    </div>
                </footer>
            </>
        );
        // wenn niemand eingeloggt ist "eingelogt wert 0" dann
    } else {
        return (
            <>
                <header className="adminMenu">
                    <h2 className="feuer">Imbissbu.de</h2>
                    <ul>
                        <li>
                            <img src={"https://cdn-icons-png.flaticon.com/128/375/375884.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Logo"} />

                        </li>
                        <li>
                            <Link to="/">Startseite</Link>
                        </li>
                        <li>
                            <Link to="/angebote">Angebote</Link>
                        </li>
                        <li>
                            <Link to="/warenkorb"> Warenkorb</Link>
                        </li>
                    </ul>
                </header>

                <main>
                    <div className="main-div"><Outlet /></div>
                </main>

                <footer >
                    <div>
                        <SocialMedia />
                    </div>
                    <ul>
                        <li>
                            <Link to="/kontakt">Kontakt</Link>
                        </li>
                        <li>
                            <Link to="/impressum">Impressum</Link>
                        </li>
                        <li>
                            <Link to="/datenschutz"> Datenschutz</Link>
                        </li>
                    </ul>
                    <div className="copy">
                        <p style={{ color: "gray" }}>Copyright&copy; 2023 by Daniel Ottinger</p>
                    </div>
                </footer>
            </>
        );
    }
}

