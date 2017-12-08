import express from 'express'
import permissionCtrl from '../controllers/permission'
import newpermissionCtrl from '../controllers/newPermission'
const router = express.Router();

router.post('/',permissionCtrl.createPermissionByRoleId);
router.post('/getPermission',permissionCtrl.getPermission);
router.post('/getPermissionForUpdate',permissionCtrl.getPermissionByRoleIdForUpdate);
router.post('/role',permissionCtrl.createRole);
router.get('/menus',permissionCtrl.getMenus);
router.get('/roles',permissionCtrl.getRoles);



router.post('/v2/createPermission',newpermissionCtrl.createPermission);
router.get('/v2/getPermission',newpermissionCtrl.getPermissionList);
router.get('/v2/getMenusPermission',newpermissionCtrl.getMenuToPermission);
module.exports = router;
