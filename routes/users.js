import express from 'express'
import UserCtrl from '../controllers/user'
const router = express.Router();


router.get('/',UserCtrl.getUsers);
router.post('/',UserCtrl.createUser);
router.get('/:id',UserCtrl.getUserById);
router.put('/:id',UserCtrl.updateUser);
router.delete('/:id',UserCtrl.deleteUser);


module.exports = router;
