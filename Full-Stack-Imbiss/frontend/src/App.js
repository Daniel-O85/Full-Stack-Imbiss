import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./Menu/Menu";
import Startseite from "./Komponente/Startseite/Startseite";
import Login from "./Komponente/Login/Login";
import Bestellungen from "./Komponente/Bestellungen/Bestellungen";
import Logout from "./Komponente/Logout/Logout";
import Angebote from "./Komponente/Angebote/Angebote";
import Warenkorb from "./Komponente/Warenkorb/Warenkorb";
import Kontakt from "./Komponente/Kontakt/Kontakt";
import Impressum from "./Komponente/Impressum/Impressum";
import Datenschutz from "./Komponente/Datenschutz/Datenschutz";
import Anfragen from "./Komponente/Anfragen/Anfragen";
import AdminProdukt from "./Komponente/AdminProdukt/AdminProdukt";
import AdminAngebote from "./Komponente/AdminAngebote/AdminAngebote";
import AdminSocialMedia from "./Komponente/AdminSocialMedia/AdminSocialMedia";


export default function App() {
  const eingeloggt = sessionStorage.getItem("eingeloggt");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route path="/" element={
            eingeloggt === "1" ? <Bestellungen /> : <Startseite />
          } />
          <Route path="/angebote" element={<Angebote />} />
          <Route path="/warenkorb" element={<Warenkorb />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/produkt" element={<AdminProdukt />} />
          <Route path="/admin/angebote" element={<AdminAngebote />} />
          <Route path="/adminAnfragen" element={<Anfragen />} />
          <Route path="/adminsocialMedia" element={<AdminSocialMedia />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
