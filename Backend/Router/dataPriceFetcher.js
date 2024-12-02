import express from 'express';
import { isAuth } from '../middleWares/isAuth.js';
import { getFuelPrices } from '../Controllers/dataFect.js';
const router = express.Router();


router.get("/fetchPrices", getFuelPrices);


export default router;
