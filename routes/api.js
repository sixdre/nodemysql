import express from 'express'
import permissionCtrl from '../controllers/permission'
import UserCtrl from '../controllers/user'
import authenticate from '../controllers/authenticate'
import auth from '../middleware/auth'


const router = express.Router();

router.post('/login',authenticate);
router.get('/users',auth.checkToken,auth.checkRole,UserCtrl.getUsers);
router.post('/users',auth.checkToken,auth.checkRole,UserCtrl.createUser);
//获取当前登录用户信息
router.get('/users/info',auth.checkToken,UserCtrl.getUserInfo);
router.post('/users/role',auth.checkToken,auth.checkRole,UserCtrl.updateUserRole);
router.delete('/users/:id',auth.checkToken,auth.checkRole,UserCtrl.removeUser);


router.get('/permission/menus',auth.checkToken,auth.checkRole,permissionCtrl.getMenus);
router.post('/permission/createRole',auth.checkToken,auth.checkRole,permissionCtrl.createRole);
router.get('/permission/roles',auth.checkToken,auth.checkRole,permissionCtrl.getRoles);
router.post('/permission/createPermission',auth.checkToken,auth.checkRole,permissionCtrl.createPermission);
router.post('/permission/updatePermission',auth.checkToken,auth.checkRole,permissionCtrl.updatePermission);
router.post('/permission/createMenu',auth.checkToken,auth.checkRole,permissionCtrl.createMenu);
router.post('/permission/updateMenu',auth.checkToken,auth.checkRole,permissionCtrl.updateMenu);
router.delete('/permission/menus/:id',auth.checkToken,auth.checkRole,permissionCtrl.removeMenu);
router.get('/permission/getPermission',auth.checkToken,auth.checkRole,permissionCtrl.getPermissionList);
router.get('/permission/getPermissionByRoleId',auth.checkToken,permissionCtrl.getPermissionByRoleId);
router.post('/permission/saveRolePermission',auth.checkToken,auth.checkRole,permissionCtrl.saveRolePermission);






/*RESTful API */
//router.get('/menus',permissionCtrl.getMenus);
//router.post('/menus',permissionCtrl.createMenu);
//router.put('/menus/:id',permissionCtrl.updateMenu);
//router.delete('/menus/:id',permissionCtrl.removeMenu);
//router.get('/permissions',permissionCtrl.getPermissionList);
//router.post('/permissions',permissionCtrl.createPermission);
//router.put('/permissions/:id',permissionCtrl.updatePermission);
//router.get('/roles',permissionCtrl.getRoles);
//router.post('/roles',permissionCtrl.createRole);
//router.get('/roles/:id/permission',permissionCtrl.getPermissionByRoleId);
//router.post('/roles/:id/permission',permissionCtrl.saveRolePermission);





module.exports = router;
