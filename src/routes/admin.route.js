const express = require("express");
const router = express();

const permissionController = require("../controllers/admin/admin.controller");

const { permissionValidatoor } = require("../helpers/admin.validate");

router.post(
  "/add-permission",
  permissionValidatoor,
  permissionController.createPermission
);

module.exports = router;
