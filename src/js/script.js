let buf_array = [];
// let bufArrayX = ['2021-06-25T13:00:00', '2021-06-25T13:00:00', '11.12.2022 22:00', '08:20', '10:15', '14:40', '18:30', '20:20', '22:22']; //все значения времени в формате 00:00 (буфер)
let bufArrayXY = [];
let count_ID = 1;
let count_tab = 0;
const firstTime = new Date('11.12.2022 00:00');
let coordXY = [];

function createPlotDay(coordXY) {
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
                name: "Series 1",
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
            // decimalsInFloat: undefined,
            labels: {
                show: true,
                style: {
                    colors: '#fff'
                },
                formatter: function (val) {
                    return val.toFixed(1);
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
    const stash_block = `<div class="post s${count_ID}"><span class="time_step" id="p${count_ID}">Start: ${start_time} Stop: ${stop_time}</span>
    <span class="del" id="d${count_ID}">-</span></div>`;
    stash.append(stash_block);
    buf_array.push([+start_time_parse, +stop_time_parse]);
    console.log(buf_array);
    count_ID++;

    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});

function creatYCoord(coordXY, bufArrayXY) {
    let lastEnergi;
    const battery_power = $('.power_batt').val();
    const battery_voltage = $('.battery_voltage').val();
    const charge_current = $('.charge_current').val();
    const truck_power = $('.power_truck').val();
    let newYcoord = 0;
    let calcTime = 0;  //общее время расчета
    let timeWorking = 0;
    let timeCharging = 0;
    let shiftDay = 0;
    let startTimeH = 0;
    let stopTimeH = 0;
    coordXY.push({ x: new Date(firstTime), y: battery_power })
    lastEnergi = battery_power;
    // for (let i = 1; i < 7; i++) {
    for (let i = 1; i < bufArrayXY.length; i++) {
        startTimeH = (shiftDay + bufArrayXY[i - 1]) / 3600000;
        stopTimeH = (shiftDay + bufArrayXY[i]) / 3600000;
        calcTime = Math.abs(stopTimeH - startTimeH); // время в часах
        if (i % 2 == 0) {
            newYcoord = lastEnergi + (calcTime * battery_voltage * charge_current / 1000); //координата вверх
            if (newYcoord > battery_power) {
                newYcoord = battery_power;
                calcTime = startTimeH + (newYcoord - lastEnergi) * 1000 / (battery_voltage * charge_current);
                coordXY.push({ x: new Date(calcTime * 3600000 + shiftDay), y: newYcoord });
            }
            timeCharging += calcTime;
        }
        else {
            newYcoord = lastEnergi - (calcTime * truck_power); //координата вниз
            if (newYcoord < 0) {
                newYcoord = 0;
                calcTime = stopTimeH + lastEnergi / truck_power;
                coordXY.push({ x: new Date(calcTime * 3600000 + shiftDay), y: newYcoord });
            }
            timeWorking = Number(timeWorking) + Number(calcTime);
        }
        lastEnergi = newYcoord;
        coordXY.push({ x: new Date(bufArrayXY[i] + shiftDay), y: newYcoord });
    }
    //     shiftDay += 86400000;
    // }

    $('.working').text(function () {
        return (timeWorking.toFixed(1) + 'h');
    });
    $('.charging').text(function () {
        return (timeCharging.toFixed(1) + 'h');
    });
    // $('.max_soc').text(function () {
    //     let max = Math.max.apply(null, coordXY_day.arrayY)
    //     return (max * 100 / battery_power).toFixed(1) + '%';
    //     // return Math.max.apply(null, coordXY_day.arrayY);
    // });
    // $('.min_soc').text(function () {
    //     let min = Math.min.apply(null, coordXY_day.arrayY)
    //     return (min * 100 / battery_power).toFixed(1) + '%';
    // });
    console.log(coordXY);
    return coordXY;
}
// let j = new Date(`11.12.2022 00:00`);
// let a = new Date(`11.12.2022 03:00`);
// let b = new Date(`11.12.2022 04:00`);
// let c = new Date(`11.12.2022 10:00`);
// let d = new Date(`11.12.2022 12:00`);
// let e = new Date(`11.12.2022 18:00`);
// let f = new Date(`11.12.2022 20:00`);


$('.equel').click(function () {
    bufArrayXY = [+firstTime,];
    // bufArrayXY = [+j, +a, +b, +c, +d, +e, +f];
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            bufArrayXY.push(buf_array[i][j]);
        }
    }
    console.log(bufArrayXY);
    creatYCoord(coordXY, bufArrayXY);
    createPlotDay(coordXY);
    // createPlotWeek(coordXY_week);
});