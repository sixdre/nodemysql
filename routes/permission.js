import express from 'express'
import permissionCtrl from '../controllers/permission'
import newpermissionCtrl from '../controllers/newPermission'
import auth from '../middleware/auth'
const router = express.Router();





router.post('/',permissionCtrl.createPermissionByRoleId);
router.post('/getPermission',permissionCtrl.getPermission);
router.post('/getPermissionForUpdate',permissionCtrl.getPermissionByRoleIdForUpdate);
router.post('/role',permissionCtrl.createRole);
router.get('/menus',permissionCtrl.getMenus);
router.get('/roles',permissionCtrl.getRoles);



router.post('/v2/createPermission',newpermissionCtrl.createPermission);
router.get('/v2/getPermission',newpermissionCtrl.getPermissionList);
router.get('/v2/getPermissionByRoleId',newpermissionCtrl.getPermissionByRoleId);
router.get('/v2/getMenusPermission',auth.checkRole,newpermissionCtrl.getMenuToPermission);
router.post('/v2/saveRolePermission',newpermissionCtrl.saveRolePermission);


module.exports = router;
