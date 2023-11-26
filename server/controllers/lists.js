import express from 'express';
import mongoose from 'mongoose';

import ListMessage from '../models/listMessage.js';

const router = express.Router();

export const getList = async (req, res) => { 
    const { id } = req.params;

    try {
        const list = await ListMessage.findById(id);
        
        res.status(200).json(list);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getLists = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await ListMessage.countDocuments({});
        const lists = await ListMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: lists, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const createList = async (req, res) => {
    const list = req.body

    const newList = new ListMessage(list);    

    try {
        await newList.save();

        res.status(201).json(newList);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateList = async (req, res) => {
    const { id: _id } = req.params;
    const list = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No list with that id');
    
    const updatedList = await ListMessage.findByIdAndUpdate(_id, { ...list, _id }, { new: true });

    res.json(updatedList);
}

export const deleteList = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No list with that id');

    await ListMessage.findByIdAndRemove(id);

    res.json({ message: 'List deleted successfully' })
}

export default router;



