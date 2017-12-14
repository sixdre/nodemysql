import express from 'express'
import permissionCtrl from '../controllers/permission'
import UserCtrl from '../controllers/user'
import authenticate from '../controllers/authenticate'
import auth from '../middleware/auth'


const router = express.Router();

router.post('/login',authenticate);
router.get('/users',auth.checkToken,auth.checkRole,UserCtrl.getUsers);
router.post('/users/role',auth.checkToken,auth.checkRole,UserCtrl.updateUserRole);
router.post('/users/createUser',auth.checkToken,auth.checkRole,UserCtrl.createUser);

router.get('/permission/menus',auth.checkToken,auth.checkRole,permissionCtrl.getMenus);
router.post('/permission/createRole',auth.checkToken,auth.checkRole,permissionCtrl.createRole);
router.get('/permission/roles',auth.checkToken,auth.checkRole,permissionCtrl.getRoles);
router.post('/permission/createPermission',auth.checkToken,auth.checkRole,permissionCtrl.createPermission);
router.get('/permission/getPermission',auth.checkToken,auth.checkRole,permissionCtrl.getPermissionList);
router.get('/permission/getPermissionByRoleId',auth.checkToken,permissionCtrl.getPermissionByRoleId);
router.get('/permission/getMenusPermission',auth.checkToken,auth.checkRole,permissionCtrl.getMenuToPermission);
router.post('/permission/saveRolePermission',auth.checkToken,auth.checkRole,permissionCtrl.saveRolePermission);


module.exports = router;
