import express, { Request, Response } from 'express';
import {CountryCodeFinder} from "./utils";

const app = express();
const port = process.env.PORT || 3000;

const checker = new CountryCodeFinder();

app.get('/check', (req: Request, res: Response) => {
    const word: string | undefined = req.query.word as string | undefined;

    if (!word) {
        return res.status(400).json({ error: 'Parameter "word" is missing' });
    }
    
    let resultOfCheck = checker.checkIfBuildable(word);


    
    res.json({buildable: resultOfCheck.length > 0, sequence: resultOfCheck, readyToCopyPaste: resultOfCheck.join("")});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
