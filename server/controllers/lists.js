import mongoose from 'mongoose';
import ListMessage from '../models/listMessage.js';

export const getLists = async (req, res) => {
    try {
        const listMessages = await ListMessage.find();

        console.log(listMessages);

        res.status(200).json(listMessages);
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
    console.log('Delete request made to server');

    res.json({ message: 'List deleted successfully' })
}