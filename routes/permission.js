import express from 'express'
import permissionCtrl from '../controllers/permission'
const router = express.Router();

router.post('/',permissionCtrl.createPermissionByRoleId);
router.post('/getPermission',permissionCtrl.getPermission);
router.post('/getPermissionForUpdate',permissionCtrl.getPermissionByRoleIdForUpdate);
router.post('/role',permissionCtrl.createRole);
router.get('/menus/menus',permissionCtrl.getMenus);
router.get('/roles/roles',permissionCtrl.getRoles);
module.exports = router;
