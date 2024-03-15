"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const port = 3000;
const checker = new utils_1.CountryCodeFinder();
app.get('/check', (req, res) => {
    const word = req.query.word;
    if (!word) {
        return res.status(400).json({ error: 'Parameter "word" is missing' });
    }
    let resultOfCheck = checker.checkIfBuildable(word);
    res.json({ buildable: resultOfCheck.length > 0, sequence: resultOfCheck, readyToCopyPaste: resultOfCheck.join("") });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
