const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const permissionController = require("../controllers/admin/permission.controller");
const roleController = require("../controllers/admin/role.controller");

const { onlyAdminAccess } = require("../middlewares/admin.middleware");
const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
} = require("../helpers/admin.validator");
const { roleAddValidator } = require("../helpers/admin.validator");

// Permission routes
router.post(
  "/add-permission",
  auth,
  onlyAdminAccess,
  permissionAddValidator,
  permissionController.createPermission
);
router.get(
  "/get-permission",
  auth,
  onlyAdminAccess,
  permissionController.getPermission
);
router.delete(
  "/delete-permission",
  auth,
  onlyAdminAccess,
  permissionDeleteValidator,
  permissionController.deletePermission
);
router.put(
  "/update-permission",
  auth,
  onlyAdminAccess,
  permissionUpdateValidator,
  permissionController.updatePermission
);

// Role route
router.post(
  "/roles",
  auth,
  onlyAdminAccess,
  roleAddValidator,
  roleController.addRole
);
router.get("/roles", auth, onlyAdminAccess, roleController.getRole);

module.exports = router;
