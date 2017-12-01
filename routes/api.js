import express from 'express'
import permissionCtrl from '../controllers/permission'
import UserCtrl from '../controllers/user'
const router = express.Router();

router.post('/login',UserCtrl.login);



module.exports = router;
