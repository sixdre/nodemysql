import express from 'express'
import permissionCtrl from '../controllers/permission'
import newpermissionCtrl from '../controllers/newPermission'
import auth from '../middleware/auth'
const router = express.Router();



// auth.checkRole,

router.post('/',permissionCtrl.createPermissionByRoleId);
router.post('/getPermission',permissionCtrl.getPermission);
router.post('/getPermissionForUpdate',permissionCtrl.getPermissionByRoleIdForUpdate);


router.get('/v2/menus',auth.checkToken,auth.checkRole,newpermissionCtrl.getMenus);
router.post('/v2/createRole',auth.checkToken,auth.checkRole,newpermissionCtrl.createRole);
router.get('/v2/roles',auth.checkToken,auth.checkRole,newpermissionCtrl.getRoles);
router.post('/v2/createPermission',auth.checkToken,auth.checkRole,newpermissionCtrl.createPermission);
router.get('/v2/getPermission',auth.checkToken,auth.checkRole,newpermissionCtrl.getPermissionList);
router.get('/v2/getPermissionByRoleId',auth.checkToken,auth.checkRole,newpermissionCtrl.getPermissionByRoleId);
router.get('/v2/getMenusPermission',auth.checkToken,auth.checkRole,newpermissionCtrl.getMenuToPermission);
router.post('/v2/saveRolePermission',auth.checkToken,auth.checkRole,newpermissionCtrl.saveRolePermission);


module.exports = router;
