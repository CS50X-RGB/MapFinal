import express from 'express';
import { isAuth } from "../middleWares/isAuth.js";
import { sendNotification } from '../Controllers/notifyController.js';
const router = new express.Router();

router.post('/notify',isAuth,sendNotification);

export default router;