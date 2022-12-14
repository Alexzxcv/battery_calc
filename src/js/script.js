let buf_array = [];
// let bufArrayX = ['2021-06-25T13:00:00', '2021-06-25T13:00:00', '11.12.2022 22:00', '08:20', '10:15', '14:40', '18:30', '20:20', '22:22']; //все значения времени в формате 00:00 (буфер)
let bufArrayXY = [];
let countID = 1;
let count_tab = 0;
const firstTime = new Date('11.12.2022 00:00 +0');
let coordXY = [{ x: 0, y: 0 }];
let realTime = new Date();
let timeZone = realTime.getTimezoneOffset() * 60000;
console.log(timeZone);


var options = {
    chart: {
        height: 300,
        width: "100%",
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
        }
    ],
    stroke: {
        curve: 'smooth',
    },
    grid: {
        show: false,
    },
    yaxis: {
        floating: false,
        max: 100,
        labels: {
            show: true,
            style: {
                colors: '#fff'
            },
            formatter: function (val) {
                return `${val.toFixed(0)}%`;
            }
        }
    },
    xaxis: {
        type: "datetime",
        labels: {
            show: true,
            style: {
                colors: '#fff'
            },

        }
    },
};
var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();


function createPlotDay(coordXY, chart) {
    chart.updateSeries([{
        data: coordXY,
    }])
    return chart;
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
    const start_time_parse = new Date(`11.12.2022 ${start_time}`);
    const stop_time_parse = new Date(`11.12.2022 ${stop_time}`);
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
    console.log(buf_array);
    countID++;


    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});

let percent = (min, max, newYcoord) => {
    if (newYcoord > max) {
        max = newYcoord;
        return max;
    }
    if (newYcoord < min) {
        min = newYcoord;
        return min;
    }
}

function creatYCoord(coordXY, bufArrayXY) {
    coordXY.splice(0, coordXY.length);
    let lastEnergi;
    const batteryPower = $('.power_batt').val();
    const batteryVoltage = $('.battery_voltage').val();
    const chargeCurrent = $('.charge_current').val();
    const truckPower = $('.power_truck').val();
    let max = 0;
    let min = 100;
    let newYcoord = batteryPower;
    let calcTime = 0;       //общее время расчета
    let timeWorking = 0;
    let timeCharging = 0;
    let shiftDay = 0;
    let startTimeH = 0;
    let stopTimeH = 0;
    let gg = 0;
    let lastTime = new Date('11.12.2022 00:00 +0');
    newYcoord = newYcoord / (batteryPower / 100);
    max = percent(min, max, newYcoord);
    coordXY.push({ x: new Date(firstTime), y: newYcoord })
    lastEnergi = batteryPower;
    for (let j = 0; j < 7; j++) {
        for (let i = 1; i < bufArrayXY.length; i++) {
            startTimeH = (shiftDay + bufArrayXY[i - 1]) / 3600000;          //часы 
            stopTimeH = (shiftDay + bufArrayXY[i]) / 3600000;               //часы
            calcTime = Math.abs(stopTimeH - startTimeH);                    // время в часах + сдвиг
            if (i % 2 == 0) {
                newYcoord = lastEnergi + (calcTime * batteryVoltage * chargeCurrent / 1000);                        //координата вверх
                if (newYcoord > batteryPower) {
                    newYcoord = batteryPower;
                    calcTime = startTimeH + (newYcoord - lastEnergi) * 1000 / (batteryVoltage * chargeCurrent);     //часы
                    newYcoord = newYcoord / (batteryPower / 100);                                                   //проценты
                    max = percent(min, max, newYcoord);
                    coordXY.push({ x: new Date(calcTime * 3600000), y: newYcoord });
                }
                lastEnergi = newYcoord;
                newYcoord = newYcoord / (batteryPower / 100);
                max = percent(min, max, newYcoord);
                timeCharging += calcTime;
            }
            else {
                newYcoord = lastEnergi - (calcTime * truckPower); //координата вниз
                if (newYcoord < 0) {
                    newYcoord = 0;
                    calcTime = startTimeH + lastEnergi / truckPower;
                    newYcoord = newYcoord / (batteryPower / 100);
                    min = percent(min, max, newYcoord);
                    coordXY.push({ x: new Date(calcTime * 3600000), y: newYcoord });
                }
                timeWorking = ((Number(timeWorking) + Number(calcTime) * 3600000) - new Date(lastTime + shiftDay)) / 3600000;
                lastEnergi = newYcoord;
                newYcoord = newYcoord / (batteryPower / 100);
                min = percent(min, max, newYcoord);
            }
            coordXY.push({ x: new Date(shiftDay + bufArrayXY[i]), y: newYcoord });
            gg = shiftDay + bufArrayXY[i];
        }
        calcTime = new Date(gg);
        newYcoord = lastEnergi - (calcTime * truckPower);
        if (newYcoord < 0) {
            newYcoord = 0;
            calcTime = stopTimeH + lastEnergi / truckPower;
            newYcoord = newYcoord / (batteryPower / 100);
            min = percent(min, max, newYcoord);
            coordXY.push({ x: new Date(calcTime * 3600000), y: newYcoord })
        }
        shiftDay += 86400000;
        coordXY.push({ x: new Date(+lastTime + shiftDay), y: newYcoord })
        timeWorking = ((Number(timeWorking) + Number(calcTime) * 3600000) - new Date(lastTime + shiftDay)) / 3600000;
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
    return coordXY;
}



$('.equel').click(function () {
    bufArrayXY = [+firstTime,];

    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            bufArrayXY.push(buf_array[i][j] + Math.abs(timeZone));
        }
    }
    console.log(bufArrayXY);
    creatYCoord(coordXY, bufArrayXY);
    createPlotDay(coordXY, chart);
    // createPlotWeek(coordXY_week);
    bufArrayXY.splice(0, bufArrayXY.length);
    buf_array.splice(0, buf_array.length);
});