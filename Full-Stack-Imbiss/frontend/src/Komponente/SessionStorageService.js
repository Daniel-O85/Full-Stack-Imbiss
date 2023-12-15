

class SessionStorageService {
    static CART_KEY = 'warenkorb';

    // Speichert den gesamten Warenkorb
    static setCart(cart) {
        sessionStorage.setItem(SessionStorageService.CART_KEY, JSON.stringify(cart));
    }

    // Liest den gesamten Warenkorb
    static getCart() {
        const cart = sessionStorage.getItem(SessionStorageService.CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    // Fügt ein neues Produkt zum Warenkorb hinzu oder aktualisiert es, falls es bereits existiert
    static updateItem(newItem) {
        const cart = SessionStorageService.getCart();
        const itemIndex = cart.findIndex(item => item.id === newItem.id);

        if (itemIndex > -1) {
            cart[itemIndex] = newItem;
        } else {
            cart.push(newItem);
        }

        SessionStorageService.setCart(cart);
    }

    // Entfernt ein Produkt aus dem Warenkorb
    static removeItem(itemId) {
        const cart = SessionStorageService.getCart();
        const updatedCart = cart.filter(item => item.id !== itemId);
        SessionStorageService.setCart(updatedCart);
    }

    // Löscht den gesamten Warenkorb
    static clearCart() {
        sessionStorage.removeItem(SessionStorageService.CART_KEY);
    }
}

export default SessionStorageService;

// Beispiel für die Verwendung in einer React-Komponente
/*class MyComponent extends React.Component {
    componentDidMount() {
        // Warenkorb laden
        const cart = SessionStorageService.getCart();
        console.log(cart);
    }
}*/

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

