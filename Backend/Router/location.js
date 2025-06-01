import express from 'express';
import { isAuth } from "../middleWares/isAuth.js";
import { RemoveFromList, UpdateLoc,getNearby } from '../Controllers/locControllers.js';
const router = express.Router();

router.post('/updateLoc',isAuth,UpdateLoc);
router.delete('/deleteLoc',isAuth,RemoveFromList);
router.get('/nearby/:r',isAuth,getNearby);

export default router;
