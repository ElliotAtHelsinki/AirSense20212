const dashboardController = require('../controllers/dashboard.controller');
const { getAQIDaily } = require('../controllers/aqi.controller');
const dashboardRoute = require('express').Router();

dashboardRoute.get('/user', (req, res, next) => dashboardController.getOverviewUser(req, res, next));
dashboardRoute.get('/location', (req, res, next) => dashboardController.getOverviewLocation(req, res, next));
dashboardRoute.get('/sensor', (req, res, next) => dashboardController.getOverviewSensor(req, res, next));
dashboardRoute.get('/aqi', (req, res, next) => getAQIDaily(req, res));

module.exports = dashboardRoute;
