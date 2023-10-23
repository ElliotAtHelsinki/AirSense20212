const permissionService = require('../services/permission.service');
const BaseController = require('./base.controller');

class PermissionController extends BaseController {
  constructor() {
    super(permissionService);
  }
}
module.exports = new PermissionController();
