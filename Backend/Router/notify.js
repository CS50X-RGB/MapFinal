import express from 'express';
import { isAuth } from "../middleWares/isAuth.js";
import { sendNotification,sendNotificationAll } from '../Controllers/notifyController.js';
const router = new express.Router();

router.post('/single',isAuth,sendNotification);
//router.post('/all',isAuth,sendNotificationAll);
export default router;
