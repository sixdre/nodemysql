/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-12-25 17:15:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `menus`
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(10) NOT NULL,
  `path` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES ('1', '0', '/article', '文章管理', 'el-icon-menu', '0', '2017-12-01 02:35:41', '2017-12-25 08:36:53');
INSERT INTO `menus` VALUES ('2', '1', '/article/list', '文章列表', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');
INSERT INTO `menus` VALUES ('3', '1', '/article/publish', '文章发布', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');
INSERT INTO `menus` VALUES ('4', '0', '/permission', '权限管理', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');
INSERT INTO `menus` VALUES ('5', '4', '/permission/list', '权限列表', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');
INSERT INTO `menus` VALUES ('6', '4', '/permission/role', '角色列表', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');
INSERT INTO `menus` VALUES ('7', '4', '/permission/menu', '菜单列表', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');
INSERT INTO `menus` VALUES ('8', '4', '/permission/allot', '权限分配', null, '1', '2017-12-01 02:35:41', '2017-12-25 08:33:53');
INSERT INTO `menus` VALUES ('9', '0', '/users', '用户管理', null, '0', '2017-12-01 02:35:41', '2017-12-14 03:29:23');

-- ----------------------------
-- Table structure for `permissions`
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `resource` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `tag` int(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES ('1', '获取菜单', '/api/permission/menus', 'get', '4', '2017-12-01 02:35:41', '2017-12-14 03:38:12');
INSERT INTO `permissions` VALUES ('2', '创建菜单', '/api/permission/createMenu', 'post', '4', '2017-12-25 05:27:39', '2017-12-25 05:27:39');
INSERT INTO `permissions` VALUES ('3', '删除菜单', '/api/permission/menus/:id', 'delete', '4', '2017-12-25 07:17:10', '2017-12-25 07:17:10');
INSERT INTO `permissions` VALUES ('4', '获取权限列表', '/api/permission/getPermission', 'get', '4', '2017-12-01 02:35:41', '2017-12-14 03:47:40');
INSERT INTO `permissions` VALUES ('5', '创建权限', '/api/permission/createPermission', 'post', '4', '2017-12-01 02:35:41', '2017-12-14 03:47:23');
INSERT INTO `permissions` VALUES ('6', '获取角色列表', '/api/permission/roles', 'get', '4', '2017-12-01 02:35:41', '2017-12-14 03:47:06');
INSERT INTO `permissions` VALUES ('7', '创建角色', '/api/permission/createRole', 'post', '4', '2017-12-01 02:35:41', '2017-12-14 03:46:19');
INSERT INTO `permissions` VALUES ('8', '获取角色的权限', '/api/permission/getPermissionByRoleId', 'get', '4', '2017-12-01 02:35:41', '2017-12-14 03:47:52');
INSERT INTO `permissions` VALUES ('9', '给角色分配权限', '/api/permission/saveRolePermission', 'post', '4', '2017-12-01 02:35:41', '2017-12-14 03:49:03');
INSERT INTO `permissions` VALUES ('10', '获取用户列表', '/api/users', 'get', '9', '2017-12-01 02:35:41', '2017-12-14 05:10:41');
INSERT INTO `permissions` VALUES ('11', '创建用户', '/api/users', 'post', '9', '2017-12-01 02:35:41', '2017-12-14 05:11:29');
INSERT INTO `permissions` VALUES ('12', '删除用户', '/api/users/:id', 'delete', '9', '2017-12-20 07:26:32', '2017-12-20 07:26:32');
INSERT INTO `permissions` VALUES ('13', '用户角色分配', '/api/users/role', 'post', '9', '2017-12-01 02:35:41', '2017-12-14 05:11:48');
INSERT INTO `permissions` VALUES ('14', '更新菜单', '/api/permission/updateMenu', 'post', '4', '2017-12-25 08:11:06', '2017-12-25 08:11:06');

-- ----------------------------
-- Table structure for `roles`
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `menuIds` varchar(255) DEFAULT NULL,
  `resource` varchar(255) DEFAULT NULL,
  `super` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', '超级管理员', '1,2,3,4,5,6,7,8,9', '1,2,3,4,5,6,7,8,9,10,11,12,13,14', '1', '2017-12-01 02:35:41', '2017-12-25 08:11:11');
INSERT INTO `roles` VALUES ('2', '管理员', '4,5,6,7,8,9', '1,2,3,4,5,6,7,8,9,10,11,12,13', '0', '2017-12-01 02:35:41', '2017-12-25 07:36:53');
INSERT INTO `roles` VALUES ('3', '访客', '1,2,3,4,5,6,7,8,9', '1,5,6,8,10', '0', '2017-12-22 01:21:42', '2017-12-25 07:44:42');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '202cb962ac59075b964b07152d234b70', '1', '2017-12-01 02:35:41', '2017-12-01 03:29:23');
INSERT INTO `users` VALUES ('2', 'test', '202cb962ac59075b964b07152d234b70', '3', '2017-12-01 09:24:58', '2017-12-22 02:31:01');
INSERT INTO `users` VALUES ('3', 'benbenwll', '202cb962ac59075b964b07152d234b70', '2', '2017-12-02 17:27:19', '2017-12-02 17:27:22');
