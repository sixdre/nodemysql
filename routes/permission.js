import express from 'express'
import permissionCtrl from '../controllers/permission'
const router = express.Router();

router.post('/',permissionCtrl.createPermission);
router.get('/:roleId',permissionCtrl.getPermission);

module.exports = router;
