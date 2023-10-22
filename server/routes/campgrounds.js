
import express from 'express';
import { getCampgrounds } from '../controllers/campgrounds.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/:pname', auth, getCampgrounds);

export default router;
