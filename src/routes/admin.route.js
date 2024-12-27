const express = require("express");
const router = express();
const auth = require("../middlewares/auth.middleware");

const permissionController = require("../controllers/admin/permission.controller");
const { onlyAdminAccess } = require("../middlewares/admin.middleware");
const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
} = require("../helpers/admin.validate");

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

module.exports = router;
