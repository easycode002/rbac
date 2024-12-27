const express = require("express");
const router = express();
const auth = require("../middlewares/auth.middleware");

const permissionController = require("../controllers/admin/permission.controller");

const {
  permissionAddValidator,
  permissionDeleteValidator,
  permissionUpdateValidator,
} = require("../helpers/admin.validate");

// Permission routes
router.post(
  "/add-permission",
  auth,
  permissionAddValidator,
  permissionController.createPermission
);
router.get("/get-permission", auth, permissionController.getPermission);
router.delete(
  "/delete-permission",
  auth,
  permissionDeleteValidator,
  permissionController.deletePermission
);
router.put(
  "/update-permission",
  auth,
  permissionUpdateValidator,
  permissionController.updatePermission
);

module.exports = router;
