import * as fs from 'fs';

interface AllWords{
    words: string[]
}

interface Country{
    name: string,
    flag: string,
    code: string,
    dial_code: string,
}

interface CountryCollection{
    countries: Country[];
}


export class CountryCodeFinder{
    private countries: Country[];

    constructor(){
        this.countries = this.getCountryInfos();
    }

    private getCountryInfos(): Country[] {
        const data = fs.readFileSync('country_codes.json', 'utf8');
        const jsonData: CountryCollection = JSON.parse(data);
        return jsonData.countries;
    }

    checkIfBuildable(word: string): string[]{

        console.log(`Called with ${word}`);
        
        
        if (word.length % 2 != 0) return [];
    
        let chunks: string[] = word.match(/.{1,2}/g) as string[];
        let result: string[] = [];
        
        if(chunks == null || word.length == 0){
            return [];
        }

        console.log(`CHUNKS${chunks}`);
    
        for(let i =0; i < chunks.length; i++){
            let countryRes: (Country | null) = this.countryCodeExists(chunks[i]);
            console.log(`Chunk with ${chunks[i]} returns ${countryRes}`);        
            if(countryRes != null){
                result.push(countryRes.flag);
            }else{
                return [];
            }
        }
    
        return result;
    }

    private countryCodeExists(chunk: string): (Country | null){
        if(chunk == "TS") chunk = "TZ";    
    
        for (const country of this.countries) {        
            if (country.code.toUpperCase() == chunk.toUpperCase()) {
                return country;
            }
        }
    
        return null;
    }
}

export class BulkImporter{
    static readWordList(jsonPath: string, codeFinder: CountryCodeFinder): void{
        let allWords = [];
    
        const wordData = fs.readFileSync(jsonPath, 'utf8')
    
        try{
            const jsonData: AllWords = JSON.parse(wordData);
    
            allWords = jsonData.words;
            console.log(`${allWords.length}`);
            console.log("Starting filter");
            
            let filterdWords = allWords.filter(word => codeFinder.checkIfBuildable(word).length > 0)
    
            console.log("Starting map");
    
            let wordWithEmojis = filterdWords.map(word => ({word, combi: codeFinder.checkIfBuildable(word)}));
    
            console.log(`${wordWithEmojis.length}`);
            console.log("Starting write");
            fs.writeFileSync('filtered_words2.json', JSON.stringify(wordWithEmojis, null, 2));
    
        } catch(error) {
            console.error('Error parsing JSON:', error);
        }
    }
}