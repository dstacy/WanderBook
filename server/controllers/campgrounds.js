import axios from 'axios';
import { parseString } from 'xml2js';

export const getCampgrounds = async (req, res) => {
    const { pname } = req.params;
    const encodedPname = encodeURIComponent(pname);
    try {
        const url = `https://api.amp.active.com/camping/campgrounds/?pname=${pname}&api_key=37jxdp7s73qwpbs6d7fx58f7`;
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

