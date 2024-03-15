"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkImporter = exports.CountryCodeFinder = void 0;
const fs = __importStar(require("fs"));
class CountryCodeFinder {
    constructor() {
        this.countries = this.getCountryInfos();
    }
    getCountryInfos() {
        const data = fs.readFileSync('country_codes.json', 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.countries;
    }
    checkIfBuildable(word) {
        console.log(`Called with ${word}`);
        if (word.length % 2 != 0)
            return [];
        let chunks = word.match(/.{1,2}/g);
        let result = [];
        if (chunks == null || word.length == 0) {
            return [];
        }
        console.log(`CHUNKS${chunks}`);
        for (let i = 0; i < chunks.length; i++) {
            let countryRes = this.countryCodeExists(chunks[i]);
            console.log(`Chunk with ${chunks[i]} returns ${countryRes}`);
            if (countryRes != null) {
                result.push(countryRes.flag);
            }
            else {
                return [];
            }
        }
        return result;
    }
    countryCodeExists(chunk) {
        if (chunk == "TS")
            chunk = "TZ";
        for (const country of this.countries) {
            if (country.code.toUpperCase() == chunk.toUpperCase()) {
                return country;
            }
        }
        return null;
    }
}
exports.CountryCodeFinder = CountryCodeFinder;
class BulkImporter {
    static readWordList(jsonPath, codeFinder) {
        let allWords = [];
        const wordData = fs.readFileSync(jsonPath, 'utf8');
        try {
            const jsonData = JSON.parse(wordData);
            allWords = jsonData.words;
            console.log(`${allWords.length}`);
            console.log("Starting filter");
            let filterdWords = allWords.filter(word => codeFinder.checkIfBuildable(word).length > 0);
            console.log("Starting map");
            let wordWithEmojis = filterdWords.map(word => ({ word, combi: codeFinder.checkIfBuildable(word) }));
            console.log(`${wordWithEmojis.length}`);
            console.log("Starting write");
            fs.writeFileSync('filtered_words2.json', JSON.stringify(wordWithEmojis, null, 2));
        }
        catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }
}
exports.BulkImporter = BulkImporter;
