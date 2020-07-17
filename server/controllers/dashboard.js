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
    home: async (req, res) => {
        const userIdx = req.idx;
        const categoryInfo = await categoryModel.searchInfoAll(userIdx);
        const itemList = await itemModel.getItemsInfoToday(userIdx);
        if ((itemList == -1) || !userIdx || (categoryInfo == -1))
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

        //get dates of this weeks
        const thisWeek = getDatesOfThisWeek(new Date());
        var thisWeekDates = new Array();
        for (i = 0; i < 7; i++)
            thisWeekDates.push(thisWeek[i].getDate().toLocaleString());

        //get stocksInfo and img
        for (var a in itemList) {
            var stocksInfo = new Array(7);
            const itemIdx = itemList[a].itemIdx;
            const icon = await itemModel.searchIcon_ItemIdx(itemIdx);

            for (i = 0; i < 7; i++) {
                const stockList = await itemModel.getStocksInfoOfDay(itemIdx, dateToString(thisWeek[i]));
                if (stockList == -1) stocksInfo[i] = stockList;
                else stocksInfo[i] = stockList[0].stocksCnt;
            }

            itemList[a].iconImg = icon[0].img;
            itemList[a].stocks = stocksInfo;
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GRAPH_HOME_SUCCESS, {
            thisWeekDates: thisWeekDates,
            categoryInfo: categoryInfo,
            itemInfo: itemList
        }));
    },

    // 선택적 그래프 /dashboard/:item/single?year=2020&month=6
    getAMonthInfo: async (req, res) => {
        const userIdx = req.idx;
        const itemIdx = req.params.item;
        const month = req.query.month;
        const year = req.query.year;
        if (!itemIdx || !month | !year)
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));

        const CntInfo = await itemModel.getItemCnt(itemIdx);
        const weeks = getWeeksStartAndEndInMonth(month - 1, year);
        var graphInfo = new Array();
        for (var i = 0; i < weeks.length; i++) {
            var dates = getDatesOfTGivenWeek(year, month - 1, i + 1);
            var stocksInfo = new Array(7);
            for (var j = 0; j < 7; j++) {
                const result = await itemModel.getStocksInfoOfDay(itemIdx, dates[j]);
                if (result == -1) stocksInfo[j] = result;
                else stocksInfo[j] = result[0].stocksCnt;
            }
            graphInfo.push({
                "startDay": dateToKORString_short(weeks[i].start),
                "endDay": dateToKORString_short(weeks[i].end),
                "stocks": stocksInfo
            });
        }

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.GRAPH_SINGLE_SUCCESS, {
                alarmCnt: CntInfo[0].alarmCnt,
                memoCnt: CntInfo[0].memoCnt,
                weeksCnt: weeks.length,
                graphInfo: graphInfo
            }));
    },

    // 비교 그래프 /dashboard/:item/double/query
    getWeeksInfo: async (req, res) => {
        //get itemIdx
        const itemIdx = req.params.item;
        if (!itemIdx)
            res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        //get weekInfo
        var weekStr = new Array(2);
        var weeks = new Array(2);
        for (var j = 0; j < 2; j++) {
            weekStr[j] = req.query.week[j];
            weeks[j] = weekStr[j].split(",");
            if (!weeks[j])
                res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        //get stocksInfo
        var stocksInfo = new Array(2);
        for (var i = 0; i < 2; i++) {
            var dates = getDatesOfTGivenWeek(parseInt(weeks[i][0]), parseInt(weeks[i][1]) - 1, parseInt(weeks[i][2]));
            stocksInfo[i] = new Array(7);
            for (var j = 0; j < 7; j++) {
                const result = await itemModel.getStocksInfoOfDay(itemIdx, dates[j]);
                if (result == -1) stocksInfo[i][j] = result;
                else stocksInfo[i][j] = result[0].stocksCnt;
            }
        }
        // if the date is in the future or doesn't have the data, we cannot compare those
        for (i = 0; i < 2; i++) {
            var isRecorded = 0;
            for (j = 0; j < 7; j++)
                if (stocksInfo[i][j] !== -1) isRecorded = 1;
            if (!isRecorded)
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.GRAPH_NO_DATA));
        }
        // if they are same week, we cannot compare those
        if (arrayEquals(stocksInfo[0], stocksInfo[1]))
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.GRAPH_SAME_DATE));
        // when success
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GRAPH_DOUBLE_SUCCESS, {
            week1: stocksInfo[0],
            week2: stocksInfo[1]
        }));

    },

    // 발주정보 수정 /dashboard/:item/cnt-modify
    updateCnt: async (req, res) => {
        const userIdx = req.idx;
        const itemIdx = req.params.item;
        const {
            alarmCnt,
            memoCnt
        } = req.body;

        if (!itemIdx) {
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        await itemModel.modifyItemCnt(itemIdx, alarmCnt, memoCnt);

        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.GRAPH_UPDATE_SUCCESS));
    }
}

function dateToKORString_short(DateFunction) {
    return (DateFunction.getMonth() + 1) + '월 ' + DateFunction.getDate() + '일';
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