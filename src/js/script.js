let buf_array = [];     //все значения времени введенные пользователем в формате 00:00 (буфер)        
// let bufArrayX = ['00:00', '02:30', '04:30', '08:20', '10:15', '14:40', '18:30', '20:20', '22:22']; //все значения времени в формате 00:00 (буфер)
let bufArrayX = ['00:00'];
let count_ID = 1;
let sum_h = 0;
let count_tab = 0;
let coordXY_day = {
    labels: [],         //все значения времени в формате 00:00 отображающиеся на графике
    arrayY: [],         //все значения емкости отображающиеся на графике
    get lastEnergi() {
        return this.arrayY[this.arrayY.length - 1];
    },
    get lastTime() {
        return this.labels[this.labels.length - 1];
    },
}
let coordXY_week = {
    labels: [],         //все значения времени в формате 00:00 отображающиеся на графике
    arrayY: [],         //все значения емкости отображающиеся на графике
    get lastEnergi() {
        return this.arrayY[this.arrayY.length - 1];
    },

}

let data = {};
let config = {
    type: 'line',
    data: data,
    options: {
        maintainAspectRatio: false,
        scales: {
            x: {
                min: 0,
                max: 24,
            }
        }
    }
};
const myChart = new Chart(
    document.getElementById('myChart'),
    config,
);

let dataWeek = {};
let configWeek = {
    type: 'line',
    data: dataWeek,
    options: {}
};
const myChart_week = new Chart(
    document.getElementById('myChartWeek'),
    configWeek
);

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



function createPlotDay(coordXY) {
    let data = {
        labels: coordXY.labels,
        datasets: [{
            label: 'Day',
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgb(0, 0, 255)',
            data: coordXY.arrayY,
        }]
    };

    let config = {
        data: data,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    };

    myChart.config.data = data;
    myChart.update();

    const containerPlot = document.querySelector('.containerPlot');
    if (myChart.data.labels.length > 10) {
        containerPlot.style.width = '1000px';
    }


    function scroller(scroll, chart) {
        const dataLength = myChart.data.labels.length;
        if (scroll.deltaY > 0) {

            if (myChart.config.options.scales.x.max >= dataLength) {
                myChart.config.options.scales.x.min = dataLength - 25;
                myChart.config.options.scales.x.max = dataLength;
            } else {
                myChart.config.options.scales.x.min += 12;
                myChart.config.options.scales.x.max += 12;
            }
        }
        else if (scroll.deltaY < 0) {
            if (myChart.config.options.scales.x.min <= 0) {
                myChart.config.options.scales.x.min = 0;
                myChart.config.options.scales.x.max = 24;
            }
            else {
                myChart.config.options.scales.x.min -= 12;
                myChart.config.options.scales.x.max -= 12;
            }

        }
        else {

        }
        myChart.update();
    }

    myChart.canvas.addEventListener('wheel', (e) => {
        scroller(e, myChart)
    });

}

// function createPlotWeek(coordXY) {
//     const data = {
//         labels: coordXY.labels,
//         datasets: [{
//             label: 'Week',
//             backgroundColor: 'rgb(0, 0, 255)',
//             borderColor: 'rgb(0, 0, 255)',
//             data: coordXY.arrayY,
//         }]
//     };

//     const config = {
//         data: data,
//     };
//     myChart_week.config.data = data;
//     myChart_week.update();
// }

$('.plus').click(function () {
    const start_time = $('.start').val();
    const stop_time = $('.stop').val();
    const stash = $('.stash');

    sum_h = Number(start_time.slice(0, 2)) + Number(stop_time.slice(0, 2));
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

    buf_array.push([start_time, stop_time]);

    count_ID++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});

function creatYCoord(coordXY_week, coordXY_day, bufArrayX) {
    coordXY_day.labels = [];
    coordXY_day.arrayY = [];
    const battery_power = $('.power_batt').val();
    const battery_voltage = $('.battery_voltage').val();
    const charge_current = $('.charge_current').val();
    const truck_power = $('.power_truck').val();
    console.log(truck_power);
    let new_Ycoord = 0;
    let t = 0;  //общее время расчета
    let t1 = 0; //время старта
    let t2 = 0; //время стопа
    let En = 0; //энергия в батарее
    let th = 0; //парс часов
    let tm = 0; //парс минут
    let t_parse = 0;
    let time_working = 0;
    let time_charging = 0;
    coordXY_day.arrayY.push(battery_power);
    coordXY_day.labels.push('00:00');
    coordXY_week.arrayY.push(battery_power);
    coordXY_week.labels.push('00:00');

    for (let i = 1; i < 7; i++) {
        for (let i = 1; i < bufArrayX.length; i++) {

            let start_time_h = bufArrayX[i - 1];
            let stop_time_h = bufArrayX[i];

            t1 = (start_time_h.slice(0, 2) * 3600 + start_time_h.slice(3) * 60) / 3600;
            t2 = (stop_time_h.slice(0, 2) * 3600 + stop_time_h.slice(3) * 60) / 3600;
            t = Math.abs(t2 - t1);
            En = coordXY_day.lastEnergi;

            if (i % 2 == 0) {
                new_Ycoord = En + (t * battery_voltage * charge_current / 1000); //координата вверх

                if (new_Ycoord > battery_power) {
                    new_Ycoord = battery_power;
                    coordXY_day.arrayY.push(new_Ycoord);
                    t = t1 + (new_Ycoord - En) * 1000 / (battery_voltage * charge_current);
                    th = Math.trunc(t);
                    tm = ((t - Math.trunc(t)) * 60).toFixed(0);
                    t_parse = th + ':' + tm;
                    coordXY_day.labels.push(t_parse);
                }
                time_charging += t;
            }
            else {

                t1 = (start_time_h.slice(0, 2) * 3600 + start_time_h.slice(3) * 60) / 3600;
                t2 = (stop_time_h.slice(0, 2) * 3600 + stop_time_h.slice(3) * 60) / 3600;
                t = Math.abs(t2 - t1);
                En = coordXY_day.lastEnergi;
                new_Ycoord = En - (t * truck_power); //координата вниз

                if (new_Ycoord < 0) {
                    new_Ycoord = 0;
                    coordXY_day.arrayY.push(new_Ycoord);
                    t = t1 + En / truck_power;
                    th = Math.trunc(t);
                    tm = ((t - Math.trunc(t)) * 60).toFixed(0);
                    t_parse = th + ':' + tm;
                    coordXY_day.labels.push(t_parse);
                }
                time_working = Number(time_working) + Number(t);
            }
            coordXY_day.labels.push(bufArrayX[i]);
            coordXY_day.arrayY.push(new_Ycoord);
        }
        coordXY_week.arrayY.push(coordXY_day.lastEnergi);
        coordXY_week.labels.push(coordXY_day.lastTime);
    }

    function percent_max(coordXY, battery_power) {
        let max = Math.max.apply(null, coordXY.arrayY)
        return max * 100 / battery_power;
    }

    $('.working').text(function () {
        return (time_working.toFixed(1) + 'h');
    });
    $('.charging').text(function () {
        return (time_charging.toFixed(1) + 'h');
    });
    $('.max_soc').text(function () {
        let max = Math.max.apply(null, coordXY_day.arrayY)
        return (max * 100 / battery_power).toFixed(1) + '%';
        // return Math.max.apply(null, coordXY_day.arrayY);
    });
    $('.min_soc').text(function () {
        let min = Math.min.apply(null, coordXY_day.arrayY)
        return (min * 100 / battery_power).toFixed(1) + '%';
    });
    return coordXY_day;
}

$('.equel').click(function () {
    bufArrayX = ['00:00'];
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            bufArrayX.push(buf_array[i][j]);
        }
    }
    creatYCoord(coordXY_week, coordXY_day, bufArrayX);
    createPlotDay(coordXY_day);
    createPlotWeek(coordXY_week);
});

