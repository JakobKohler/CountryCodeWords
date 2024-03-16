# API Documentation

## Overview
This API provides a single endpoint to check if a given word can be constructed using country codes. If the word can be constructed, it returns the list of country codes along with a concatenated string for easy copy-pasting.

## Endpoint
- `/check?word=<word>`

## Parameters
- `word`: The word to be checked for constructability using country codes.

## Response
The response is in JSON format and includes the following fields:
- `buildable`: A boolean indicating whether the word can be constructed using country codes.
- `sequence`: An array of Unicode flag emoji representing the country codes used to construct the word.
- `readyToCopyPaste`: A concatenated string of the Unicode flag emoji, ready for copy-pasting.

### Example Usage
```bash
GET /check?word=Cars
```

### Example Response
```json
{
  "buildable": true,
  "sequence": ["🇨🇦","🇷🇸"],
  "readyToCopyPaste": "🇨🇦🇷🇸"
}
```