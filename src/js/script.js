let power_batt = 0;
let power_truck = 0;
let buf_array = [];     //все значения времени введенные пользователем в формате 00:00 (буфер)        
let bufArrayX = ['00:00']; //все значения времени в формате 00:00 (буфер)
let count_ID = 1;
let sum_h = 0;
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
        console.log(this.arrayY[this.arrayY.length - 1]);
        return this.arrayY[this.arrayY.length - 1];
    },
    
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

function createPlotDay(coordXY) {

    const data = {
        labels: coordXY.labels,
        datasets: [{
            label: 'Day',
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgb(0, 0, 255)',
            data: coordXY.arrayY,
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}

function createPlotWeek(coordXY) {

    const data = {
        labels: coordXY.labels,
        datasets: [{
            label: 'Week',
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgb(0, 0, 255)',
            data: coordXY.arrayY,
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    const myChart = new Chart(
        document.getElementById('myChartWeek'),
        config
    );
}


$('.plus').click(function () {
    let start_time = $('.start').val();
    let stop_time = $('.stop').val();
    let stash = $('.stash');

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

    power_batt = $('.power_batt').val();
    power_truck = $('.power_truck').val();

    count_ID++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});



function creatYCoord(coordXY_week, coordXY_day, bufArrayX) {
    let battery_power = $('.power_batt').val();
    let battery_voltage = $('.battery_voltage').val();
    let truck_power = $('.power_truck').val();
    let charge_current = $('.charge_current').val();
    let new_Ycoord = 0;
    let t = 0;  //общее время расчета
    let t1 = 0; //время старта
    let t2 = 0; //время стопа
    let En = 0; //энергия в батарее
    let th = 0; //парс часов
    let tm = 0; //парс минут
    coordXY_day.arrayY.push(battery_power);
    coordXY_day.labels.push('00:00');
    coordXY_week.arrayY.push(battery_power);
    coordXY_week.labels.push('00:00');

    // for (let i = 1; i < 7; i++) {

        

        for (let i = 1; i < bufArrayX.length; i++) {

            let start_time_h = bufArrayX[i - 1];
            let stop_time_h = bufArrayX[i];

            t1 = (start_time_h.slice(0, 2) * 3600 + start_time_h.slice(3) * 60) / 3600;
            t2 = (stop_time_h.slice(0, 2) * 3600 + stop_time_h.slice(3) * 60) / 3600;
            t = Math.abs(t2 - t1);
            console.log(t);
            En = coordXY_day.lastEnergi;
            console.log(En);


            if (i % 2 === 0) {
                new_Ycoord = En + (t * battery_voltage * charge_current / 1000); //координата вверх
                console.log(new_Ycoord);

                if (new_Ycoord > battery_power) {
                    new_Ycoord = battery_power;
                    coordXY_day.arrayY.push(new_Ycoord);
                    t = t1 + (new_Ycoord - En) * 1000 / (battery_voltage * charge_current);
                    th = Math.trunc(t);
                    tm = ((t - Math.trunc(t)) * 60).toFixed(0);
                    t = th + ':' + tm;
                    coordXY_day.labels.push(t);
                }
            }
            else {
                new_Ycoord = En - (t * truck_power); //координата вниз
                console.log(new_Ycoord);

                if (new_Ycoord < 0) {
                    new_Ycoord = 0;
                    coordXY_day.arrayY.push(new_Ycoord);
                    t = t1 + En / truck_power;
                    console.log(t);
                    th = Math.trunc(t);
                    tm = ((t - Math.trunc(t)) * 60).toFixed(0);
                    t = th + ':' + tm;
                    coordXY_day.labels.push(t);
                }
            }
            coordXY_day.labels.push(bufArrayX[i]);
            coordXY_day.arrayY.push(new_Ycoord);
        }
    //     coordXY_week.arrayY.push(coordXY_day.lastEnergi);
    //     coordXY_week.labels.push(coordXY_day.lastTime);
    // }


    $('.max_soc').text(function () {
        return Math.max.apply(null, coordXY_day.arrayY);
    });
    $('.min_soc').text(function () {
        return Math.min.apply(null, coordXY_day.arrayY);
    });
    return coordXY_day;
}

$('.equel').click(function () {
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            bufArrayX.push(buf_array[i][j]);
        }
    }
    console.log(bufArrayX);
    creatYCoord(coordXY_week, coordXY_day, bufArrayX);
    createPlotDay(coordXY_day);
    createPlotWeek(coordXY_week);
});

