import express from 'express';

import { getList, getLists, createList, updateList, deleteList } from '../controllers/lists.js'

console.log('server/routes/lists');

const router = express.Router();

router.get('/:id', getList);
router.get('/', getLists);
router.post('/', createList);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);


export default router;