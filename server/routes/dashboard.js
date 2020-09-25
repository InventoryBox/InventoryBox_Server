var express = require('express');
var dashboard = express.Router();

const dashboardController = require('../controllers/dashboard');
const authUtil = require('../middlewares/auth').checkToken

//이번주 그래프_홈
dashboard.get('/', authUtil, dashboardController.home);
// 선택적 그래프
dashboard.get('/:item/single', authUtil, dashboardController.getAMonthInfo);
// 비교 그래프
dashboard.get('/:item/double', authUtil, dashboardController.getWeeksInfo);
// 발주정보 수정
dashboard.post('/:item/modifyCnt', authUtil, dashboardController.updateCnt);

module.exports = dashboard;