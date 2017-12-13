import express from 'express'
import permissionCtrl from '../controllers/permission'
import UserCtrl from '../controllers/user'
import authenticate from '../controllers/authenticate'

const router = express.Router();

router.post('/login',authenticate);



module.exports = router;
