import axios from 'axios';
import { parseString } from 'xml2js';
import dotenv from 'dotenv'; 

dotenv.config();

const key = process.env.CAMPGROUND_API_KEY;

export const getCampgrounds = async (req, res) => {
    const { pname } = req.params;
   
    try {
        const url = `https://api.amp.active.com/camping/campgrounds/?pname=${pname}&api_key=${key}`;
        
        const response = await axios.get(url, { maxRedirects: 10 });
        
        const xmlData = response.data;

        // Use xml2js to parse the XML data
        parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                res.json(result);
            }
        });
    
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
