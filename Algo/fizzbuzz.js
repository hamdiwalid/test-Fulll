const FIZZBUZZ_RULES = [
    { divisor: 3, label: "Fizz" },
    { divisor: 5, label: "Buzz" },
];

const fizzbuzzValue = (n, rules = FIZZBUZZ_RULES) => {
    const output = rules
        .filter(({ divisor }) => n % divisor === 0)
        .map(({ label }) => label)
        .join("");

    return output || n;
};

const assertValidN = (n) => {
    if (typeof n !== "number" || !Number.isInteger(n) || Number.isNaN(n)) {
        throw new TypeError(`N doit être un entier. Reçu : ${String(n)}`);
    }
    if (n < 1) {
        throw new RangeError(`N doit être supérieur ou égal à 1. Reçu : ${n}`);
    }
};

const fizzbuzz = (n) => {
    assertValidN(n);
    return Array.from({ length: n }, (_, i) => fizzbuzzValue(i + 1));
};

const printFizzbuzz = (n) => {
    fizzbuzz(n).forEach((value) => console.log(value));
};

console.log("Exemple 1 — fizzbuzz(15) :");
console.log(fizzbuzz(15));

console.log("\nExemple 2 — printFizzbuzz(5) :");
printFizzbuzz(5);

console.log("\nExemple 3 — gestion des cas invalides :");
try {
    fizzbuzz(-3);
} catch (err) {
    console.error(err.message);
}

try {
    fizzbuzz("10");
} catch (err) {
    console.error(err.message);
}

export { fizzbuzz, printFizzbuzz, fizzbuzzValue };
