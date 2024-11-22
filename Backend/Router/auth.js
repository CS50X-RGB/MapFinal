import express from 'express';
import { Login, Register,Logout, getMyProfile ,ForgotPassword, ResetPassword,setAuthToken, resetDetails ,SucessTrans,UnSucessTrans} from '../Controllers/authControllers.js';
import { isAuth } from '../middleWares/isAuth.js';
import validateUserData from '../middleWares/userSchmeaValid.js';
const router = express.Router();

router.post('/register',validateUserData,Register);
router.post('/login',Login);
router.get('/logout',isAuth,Logout);
router.post("/add-token",isAuth,setAuthToken);
router.get('/getMyProfile',isAuth,getMyProfile);
router.post('/forgot-password',ForgotPassword);
router.post('/resetpassword/:resetIdentifier', ResetPassword);
router.put('/resetDetails',isAuth,resetDetails);
router.put('/sucessTrans',isAuth,SucessTrans);
router.put('/UnsucessTrans',isAuth,UnSucessTrans);
export default router;
