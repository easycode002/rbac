const express = require("express");
const router = express();
const auth = require("../middlewares/auth.middleware");

const permissionController = require("../controllers/admin/admin.controller");

const { permissionValidatoor } = require("../helpers/admin.validate");

router.post(
  "/add-permission",
  auth,
  permissionValidatoor,
  permissionController.createPermission
);

module.exports = router;
