import crypto from "crypto";

const secret = crypto.randomBytes(64).toString("hex"); // génère une chaîne hexadécimale de 64 octets
console.log(secret);
