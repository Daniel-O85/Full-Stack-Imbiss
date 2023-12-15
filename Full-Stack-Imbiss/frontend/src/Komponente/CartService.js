class CartService {
    // Diese Methode nimmt den gesamten Warenkorb als Eingabe und gibt eine Liste aller Einzelprodukte zurück
    static extractSingleProducts(cart) {
        let singleProducts = [];

        for (const item of cart) {
            // Prüft, ob das Hauptprodukt ein Einzelprodukt ist
            if (!item.isSpecialOffer) {
                singleProducts.push(item);
            }

            // Extrahiert Einzelprodukte aus dem "details"-Array, falls vorhanden
            if (Array.isArray(item.details)) {
                singleProducts = singleProducts.concat(
                    item.details.filter(detailItem => !detailItem.isSpecialOffer)
                );
            }
        }

        return singleProducts;
    }
}

export default CartService;

// Beispiel für die Verwendung
/*const warenkorb = [
    {
        produktname: "Sparmenü",
        details: [
            { produktname: "Pommes", isSpecialOffer: false },
            { produktname: "Getränk", isSpecialOffer: false }
        ],
        isSpecialOffer: true
    },
    {
        produktname: "Burger",
        isSpecialOffer: false
    }
];

const einzelprodukte = CartService.extractSingleProducts(warenkorb);
console.log(einzelprodukte);*/
