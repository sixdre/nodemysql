import express from 'express'
import permissionCtrl from '../controllers/permission'
const router = express.Router();

router.get('/menus',permissionCtrl.getMenus);
router.post('/',permissionCtrl.createPermission);
router.get('/',permissionCtrl.getPermission);

module.exports = router;
