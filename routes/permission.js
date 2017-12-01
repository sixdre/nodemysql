import express from 'express'
import permissionCtrl from '../controllers/permission'
const router = express.Router();

router.post('/',permissionCtrl.createPermission);
router.get('/:roleId',permissionCtrl.getPermission);
router.post('/role',permissionCtrl.createRole);
router.get('/menus/menus',permissionCtrl.getMenus);

module.exports = router;
