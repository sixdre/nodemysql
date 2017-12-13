import express from 'express'
import permissionCtrl from '../controllers/permission'
import newpermissionCtrl from '../controllers/newPermission'
import auth from '../middleware/auth'
const router = express.Router();



// auth.checkRole,

router.post('/',permissionCtrl.createPermissionByRoleId);
router.post('/getPermission',permissionCtrl.getPermission);
router.post('/getPermissionForUpdate',permissionCtrl.getPermissionByRoleIdForUpdate);


router.get('/v2/menus',auth.checkRole,newpermissionCtrl.getMenus);
router.post('/v2/createRole',auth.checkRole,newpermissionCtrl.createRole);
router.get('/v2/roles',auth.checkRole,newpermissionCtrl.getRoles);
router.post('/v2/createPermission',auth.checkRole,newpermissionCtrl.createPermission);
router.get('/v2/getPermission',auth.checkRole,newpermissionCtrl.getPermissionList);
router.get('/v2/getPermissionByRoleId',auth.checkRole,newpermissionCtrl.getPermissionByRoleId);
router.get('/v2/getMenusPermission',auth.checkRole,newpermissionCtrl.getMenuToPermission);
router.post('/v2/saveRolePermission',auth.checkRole,newpermissionCtrl.saveRolePermission);


module.exports = router;
