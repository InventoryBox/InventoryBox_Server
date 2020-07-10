const itemModel = require('../models/item');
const categoryModel = require('../models/category');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/encryption');
const jwt = require('../modules/jwt');
const item = require('../models/item');


const dashboard = {
    //이번주 그래프_홈 /dashboard
    getAllItems: async (req, res) => {

        var categoryInfo = await categoryModel.searchInfoAll();
        console.log("category", categoryInfo);
        const thisWeek = getDatesOfThisWeek(new Date());
        console.log(thisWeek);
        const dates = new Array(7);
        const itemInfo = await itemModel.searchItemInfoToday();
        console.log("item", itemInfo);
        const stocksInfo = new Array(itemInfo.length);

        for (var a in itemInfo) {
            stocksInfo[a] = new Array(7);

            for (i = 0; i < 7; i++) {
                dates.push(thisWeek[i].getDate().toLocaleString());
                const date = dateToString(thisWeek[i]);
                const itemIdx = itemInfo[a].idx;

                const result = await itemModel.getStocksInfoOfDay(itemIdx, date);

                if (result == -1) stocksInfo[a][i] = result;
                else stocksInfo[a][i] = result[0].stocksCnt;
            }
        }

        for (var a in itemInfo)
            console.log("stocksInfo", a, stocksInfo[a]);

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_HOME_SUCCESS, {
            categoryInfo: categoryInfo,
            itemInfo: itemInfo,
            stocksInfo: stocksInfo
        }));
    },

    // 선택적 그래프 /dashboard/:item/single?year=2020&month=6
    getAMonthInfo: async (req, res) => {

        console.log("single graph", req.params, req.query);

        var itemIdx = req.params.item;
        var month = req.query.month;
        var year = req.query.year;
        if (!itemIdx || !month | !year)
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

        const alarmInfo = await itemModel.getItemAlarmCnt(itemIdx);
        const weeks = getWeeksStartAndEndInMonth(month - 1, year);

        var graphInfo = new Array();
        for (var i = 0; i < weeks.length; i++) {

            graphInfo.push(weeks[i]);
            var dates = getDatesOfTGivenWeek(year, month - 1, i + 1);
            const stocksInfo = new Array(7);

            for (var j = 0; j < 7; j++) {
                const result = await itemModel.getStocksInfoOfDay(itemIdx, dates[j]);
                if (result == -1) stocksInfo[j] = result;
                else stocksInfo[j] = result[0].stocksCnt;
            }

            graphInfo.push("stocksInfo", stocksInfo);
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.GRAPH_SINGLE_SUCCESS, {
                alarmCnt: alarmInfo,
                weeksCnt: weeks.length,
                graphInfo: graphInfo
            }));
    },

    // 비교 그래프 /dashboard/:item/double/:week
    getWeeksInfo: async (req, res) => {

        console.log("comparison graph", req.params, req.query);
        var itemIdx = req.params.item;
        var weekStr = new Array(2);
        var weeks = new Array(2);

        for (var j = 0; j < 2; j++) {
            weekStr[j] = req.query.week[j];
            weeks[j] = weekStr[j].split(",");
        }
        console.log("weeks", weeks, "itemIdx", itemIdx);

        var stocksInfo = new Array(2);
        for (var i = 0; i < 2; i++) {

            var dates = getDatesOfTGivenWeek(parseInt(weeks[i][0]), parseInt(weeks[i][1]) - 1, parseInt(weeks[i][2]));
            console.log("week", i, dates);
            stocksInfo[i] = new Array(7);

            for (var j = 0; j < 7; j++) {
                const result = await itemModel.getStocksInfoOfDay(itemIdx, dates[j]);
                if (result == -1) stocksInfo[i][j] = result;
                else stocksInfo[i][j] = result[0].stocksCnt;
            }
            continue;
        }

        for (i = 0; i < 2; i++) {
            var isRecorded = 0;
            for (j = 0; j < 7; j++)
                if (stocksInfo[i][j] !== -1) isRecorded = 1;
            if (!isRecorded)
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_DATA));
        }

        if (arrayEquals(stocksInfo[0], stocksInfo[1]))
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.SAME_DATE));

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GRAPH_DOUBLE_SUCCESS, {
            week1: stocksInfo[0],
            week2: stocksInfo[1]
        }));

    },

    // 발주정보 수정 /dashboard/:item/cnt-modify
    updateCnt: async (req, res) => {
        const itemIdx = req.params.item;
        const {
            alarmCnt,
            memoCnt
        } = req.body;
        console.log("/controller", req.params, req.body);
        console.log("/controller", itemIdx, alarmCnt, memoCnt);

        if (!itemIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        await itemModel.modifyItemCnt(itemIdx, alarmCnt, memoCnt);
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.ITEM_UPDATE_SUCCESS));
    }
}

function getDatesOfThisWeek(current) {
    var week = new Array();
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay()));
    for (var i = 0; i < 7; i++) {
        week.push(
            (new Date(current).getDate()).toLocaleString()
        );
        current.setDate(current.getDate() + 1);
    }
    return week;
}

function getWeeksStartAndEndInMonth(month, year) {
    var index = 1;
    let weeks = [];
    var firstSat;

    //first week) when the first day of week is not Sunday
    const firstDay = new Date(year, month, 1);
    firstDay.setDate(firstDay.getDate() + 1);
    if (firstDay.getDay() != 1)
        for (let day = 0; day < ((firstDay.getDay() === 0) ? 7 : firstDay.getDay()); day++) {
            let prevDay = new Date(firstDay - day * 24 * 60 * 60 * 1000);
            if (prevDay.getDay() === 1) {
                index++;
                firstSat = new Date(prevDay.getTime() + (6 * 24 * 60 * 60 * 1000));
                weeks.push({
                    start: prevDay,
                    end: firstSat
                });
            }
        }

    //get the rest weeks of month
    const _lastDay = new Date(year, month + 1, 1);
    lastDay = new Date(_lastDay - 1);
    var startDate = 0;
    if (firstDay.getDay() === 1) startDate = firstDay.getDate(); // when the first day of month starts in Sunday
    else startDate = firstSat.getDate() + 1; // you should get the next Sunday from the last scope
    for (let date = startDate; date <= lastDay.getDate() + 1; date++) {
        let thisDay = new Date(year, month, date);
        if (thisDay.getDay() === 1) {
            index++;
            weeks.push({
                start: thisDay,
                end: new Date(thisDay.getTime() + (6 * 24 * 60 * 60 * 1000))
            });
            date += 6;
        }
    }
    return weeks;
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function getDatesOfThisWeek(current) {
    var week = new Array();
    current.setDate((current.getDate() - current.getDay()));
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(current)
        );
        current.setDate(current.getDate() + 1);
    }
    return week;
}

function getDatesOfTGivenWeek(year, month, week) {
    var dates = new Array();
    const sunday = new Date(year, month, 1);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7 * (week - 1));
    for (i = 0; i < 7; i++) {
        var DateFunction = new Date(sunday.getTime() + i * 24 * 60 * 60 * 1000);
        dates.push(dateToString(DateFunction));
    }
    return dates;
}

function dateToString(DateFunction) {
    var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
    var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
    var date = DateFunction.getFullYear() + '-' + month + '-' + day;
    return date;
}

module.exports = dashboard;