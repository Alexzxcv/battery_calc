let buf_array = [];
let bufArrayXY = [];
let countID = 1;
let count_tab = 0;
const firstTime = new Date('1.1.2022 00:00 +0');
let coordXY = [{ x: 0, y: 0 }];
let coordXYWeek = [{ x: 0, y: 0 }];
let realTime = new Date();
let timeZone = realTime.getTimezoneOffset() * 60000;

let options = {
    chart: {
        height: 300,
        width: "100%",
        type: 'line',
        animations: {
            initialAnimation: { enabled: false }
        },
        toolbar: {
            show: false,
        },
    },
    series: [
        {
            data: coordXY,
        },
    ],
    stroke: {
        curve: 'straight',
    },
    grid: {
        show: false,
    },
    yaxis: {
        floating: false,
        max: 100,
        min: 0,
        labels: {
            show: true,
            style: {
                colors: '#fff'
            },
            formatter: function (val) {
                return `${val.toFixed(0)}%`;
            },
        },
    },
    xaxis: {
        type: "datetime",
        labels: {
            show: true,
            style: {
                colors: '#fff'
            },
            datetimeFormatter: {
                month: 'd',
                day: 'd',
            },
        },
    },
};
let chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

let chartWeek = new ApexCharts(document.querySelector("#chartWeek"), options);
chartWeek.render();

function createPlotDay(coordXY, chart) {
    chart.updateSeries([{
        data: coordXY,
    }])
}

function createPlotWeek(coordXYWeek, chartWeek) {
    chartWeek.updateSeries([{
        data: coordXYWeek,
    }])
}

$(function () {
    $("[data-tooltip]").mousemove(function (eventObject) {
        $data_tooltip = $(this).attr("data-tooltip");
        $("#tooltip").html($data_tooltip).css({
            "top": eventObject.pageY + 5,
            "left": eventObject.pageX + 5
        }).show();
    }).mouseout(function () {
        $("#tooltip").hide().html("").css({
            "top": 0,
            "left": 0
        });
    });
});

$('.plus').click(function () {
    const stash = $('.stash');
    const start_time = $('.start').val();
    const stop_time = $('.stop').val();
    const start_time_parse = new Date(`1.1.2022 ${start_time}`);
    const stop_time_parse = new Date(`1.1.2022 ${stop_time}`);
    if ((start_time === "") || (stop_time === "")) {
        return;
    }
    else if (start_time > stop_time) {
        return;
    }
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {

            if ((start_time === buf_array[i][j]) || (stop_time === buf_array[i][j])) {
                return;
            }
            if (start_time < buf_array[buf_array.length - 1][j]) {
                return;
            }
        }
    }
    const stash_block = `<div class="post s${countID}"><span class="time_step" id="p${countID}">Start: ${start_time} Stop: ${stop_time}</span>
    <span class="del" id="d${countID}">-</span></div>`;
    stash.append(stash_block);
    buf_array.push([+start_time_parse, +stop_time_parse]);
    countID++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});

function creatYCoord(coordXY, coordXYWeek, bufArrayXY) {
    coordXY.splice(0, coordXY.length);
    coordXYWeek.splice(0, coordXYWeek.length);
    const batteryPower = $('.power_batt').val();
    const batteryVoltage = $('.battery_voltage').val();
    const chargeCurrent = $('.charge_current').val();
    const truckPower = $('.power_truck').val();
    let max = 0;
    let min = 100;
    let lastEnergi = batteryPower;
    let newYcoord = batteryPower;
    let newYcoordPercent = 0;
    let calcTime = 0;       //общее время расчета
    let timeWorking = 0;    //время работы 
    let timeCharging = 0;   //время заряда
    let shiftDay = 0;       //сдвиг дня
    let startTimeH = 0;     //время начала паузы
    let stopTimeH = 0;      //время конца паузы
    let lastTime = new Date('1.2.2022 00:00 +0');
    newYcoordPercent = newYcoord / (batteryPower / 100);
    coordXY.push({ x: new Date(firstTime), y: newYcoordPercent })
    coordXYWeek.push({ x: new Date(firstTime), y: newYcoordPercent })
    for (let j = 0; j < 7; j++) {
        for (let i = 1; i < bufArrayXY.length; i++) {
            startTimeH = (shiftDay + bufArrayXY[i - 1]) / 3600000;          //часы 
            stopTimeH = (shiftDay + bufArrayXY[i]) / 3600000;               //часы
            calcTime = stopTimeH - startTimeH;                              // время в часах + сдвиг
            if (i % 2 == 0) {
                newYcoord = lastEnergi + (calcTime * batteryVoltage * chargeCurrent / 1000);                        //координата вверх
                if (newYcoord >= batteryPower) {
                    newYcoord = batteryPower;
                    calcTime = startTimeH + (newYcoord - lastEnergi) * 1000 / (batteryVoltage * chargeCurrent);     //часы
                    newYcoordPercent = newYcoord / (batteryPower / 100);
                    coordXY.push({ x: new Date(calcTime * 3600000), y: newYcoordPercent });
                    calcTime = calcTime - startTimeH;
                }
                timeCharging += calcTime;
            }
            else {
                newYcoord = lastEnergi - (calcTime * truckPower); //координата вниз
                if (newYcoord < 0) {
                    newYcoord = 0;
                    calcTime = startTimeH + lastEnergi / truckPower;
                    newYcoordPercent = newYcoord / (batteryPower / 100);
                    coordXY.push({ x: new Date(calcTime * 3600000), y: newYcoordPercent });
                    calcTime = calcTime - startTimeH;

                }
                timeWorking += calcTime;
            }
            lastEnergi = newYcoord;
            newYcoordPercent = newYcoord / (batteryPower / 100);
            coordXY.push({ x: new Date(shiftDay + bufArrayXY[i]), y: newYcoordPercent });
        }
        calcTime = new Date(+lastTime + shiftDay - (bufArrayXY[bufArrayXY.length - 1] + shiftDay)) / 3600000;
        newYcoord = lastEnergi - (calcTime * truckPower); //координата вниз
        if (newYcoord < 0) {
            newYcoord = 0;
            calcTime = stopTimeH + lastEnergi / truckPower;
            newYcoordPercent = newYcoord / (batteryPower / 100);
            coordXY.push({ x: new Date(calcTime * 3600000), y: newYcoordPercent });
            calcTime = calcTime - startTimeH;
        }
        newYcoordPercent = newYcoord / (batteryPower / 100);
        coordXY.push({ x: new Date(+lastTime + shiftDay), y: newYcoordPercent })
        coordXYWeek.push({ x: new Date(+lastTime + shiftDay), y: newYcoordPercent })
        shiftDay += 86400000;
        timeWorking += calcTime;
        lastEnergi = newYcoord;
    }

    $('.working').text(function () {
        return (timeWorking.toFixed(1) + 'h');
    });
    $('.charging').text(function () {
        return (timeCharging.toFixed(1) + 'h');
    });
    $('.max_soc').text(function () {
        return (max + '%');
    });
    $('.min_soc').text(function () {
        return (min + '%');
    });
}

$('.equel').click(function () {
    if (buf_array.length === 0) {
        return;
    }
    bufArrayXY = [+firstTime]
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            bufArrayXY.push(buf_array[i][j] + Math.abs(timeZone));
        }
    }
    creatYCoord(coordXY, coordXYWeek, bufArrayXY);
    createPlotDay(coordXY, chart);
    createPlotWeek(coordXYWeek, chartWeek);
    bufArrayXY.splice(0, bufArrayXY.length);
    buf_array.splice(0, buf_array.length);
});