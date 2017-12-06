import express from 'express'
import UserCtrl from '../controllers/user'
const router = express.Router();

router.get('/',UserCtrl.getUsers);
router.post('/role',UserCtrl.updateUserRole);


module.exports = router;
