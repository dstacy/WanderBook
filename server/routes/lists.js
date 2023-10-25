import express from 'express';

import { getLists, createList, updateList, deleteList } from '../controllers/lists.js'

const router = express.Router();

router.get('/', getLists);
router.post('/', createList);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);


export default router;