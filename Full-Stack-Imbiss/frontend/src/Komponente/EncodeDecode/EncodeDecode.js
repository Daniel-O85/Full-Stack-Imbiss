// Verschlüsselt den Text, in dem es die einzelnen Zeichen in
// die jeweiligen Unicode-Zahlen umwandelt und mit einem
// | Zeichen voneinander trennt.

export const encodeText = (text) => {
  let ret = "";
  let Seperator = ["X", "L", "G", "H", "J", "P", "F", "E"];
  let index = 0;
  // *** //
  for (let p = 0; p < text.length; p++) {
    ret += text[p].charCodeAt(0).toString() + Seperator[index];
    index++;
    if (index > Seperator.length - 1) index = 0;
  }
  // *** //
  return ret;
};

// Entschlüsselt den Text, in dem es Ziffern sammelt,
// bis ein | Zeichen folgt und dann die Ziffernfolge
// als Unicode-Zeichen zurück konvertiert. Der Block
// wird leer gemacht, damit das nächste Zeichen durch
// Ziffernfolge ermittelt werden kann.

export const decodeText = (text) => {
  let ret = "",
    block = "";
  // *** //
  for (let p = 0; p < text.length; p++) {
    switch (text[p]) {
      case "X":
      case "L":
      case "G":
      case "H":
      case "J":
      case "P":
      case "F":
      case "E":
        ret += String.fromCharCode(Number(block));
        block = "";
        break;
      default:
        block += text[p];
        break;
    }
  }
  // *** //
  return ret;
};

// Beispiel hoch 10

/*

let test = JSON.stringify({
  a: true,
  b: [10, 20, 30],
  c: {
    d: 5.6,
    e: () => alert("WOW"),
  },
  d: "test & Mest = $45, Ätschi Bätschi ÜÜÜÜbel, Österreich, Straße 4€ fsfsaf",
});

console.log(test);
console.log("");
test = encodeText(test);

console.log(test);
console.log("");

test = decodeText(test);

console.log(test);
console.log("");

let o = JSON.parse(test);

console.log(o);

*/