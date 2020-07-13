var express = require('express');
var dashboard = express.Router();

const dashboardController = require('../controllers/dashboard');
const authUtil = require('../middlewares/auth');

//이번주 그래프_홈
dashboard.get('/', dashboardController.getAllItems);
// 선택적 그래프
dashboard.get('/:item/single', dashboardController.getAMonthInfo);
// 비교 그래프
dashboard.get('/:item/double', dashboardController.getWeeksInfo);
// 발주정보 수정
dashboard.post('/:item/cnt-modify', dashboardController.updateCnt);

module.exports = dashboard;
