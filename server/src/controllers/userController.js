const userService = require('../services/userService');

class UserController {
  async enter(req, res, next) {
    try {
      const { name, password } = req.body;
      const user = await userService.enterUser(name, password);
      res.json({
        success: true,
        message: user.isNew ? `Welcome to PayTodo, ${user.name}!` : `Welcome back, ${user.name}!`,
        user: {
          id: user.id,
          name: user.name
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getDemoUsers(req, res, next) {
    try {
      const users = await userService.getDemoUsers();
      res.json({
        success: true,
        users
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
