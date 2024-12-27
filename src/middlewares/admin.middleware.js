const onlyAdminAccess = async (req, res, next) => {
  try {
    console.log(req.user);
    // Check: Not eqaul to admin
    if (req.user.role != 1) {
      return res.status(400).json({
        success: false,
        msg: "You have not permission to access this routes!",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Something weng wrong!!!",
    });
  }
  return next();
};

module.exports = {
  onlyAdminAccess,
};
