let power_batt = 0;
let power_truck = 0;
let buf_array = [];     //все значения времени введенные пользователем в формате 00:00 (буфер)
// let labels = [];        //все значения времени в формате 00:00 отображающиеся на графике
// let arrayY = [];        //все значения емкости в формате 00:00 отображающиеся на графике
let bufArrayX = ['0',]; //все значения времени в формате 21.5 (буфер)
let coordXY = {
    labels: [],
    arrayY: [],
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

function createPlot(coordXY) {

    const data = {
        labels: coordXY.labels,
        datasets: [{
            label: 'plot_day',
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

let count = 1;

$('.plus').click(function () {
    let start_time = $('.start').val();
    let stop_time = $('.stop').val();
    let stash = $('.stash');

    if ((start_time === "") || (stop_time === "")) {
        return;
    }

    const stash_block = `<div class="post s${count}"><span class="time_step" id="p${count}">Start: ${start_time} Stop: ${stop_time}</span>
    <span class="del" id="d${count}">-</span></div>`;

    stash.append(stash_block);

    buf_array.push([start_time, stop_time]);

    power_batt = $('.power_batt').val();
    power_truck = $('.power_truck').val();

    count++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});

function creatYCoord(coordXY, bufArrayX) {
    let battery_power = $('.power_batt').val();
    let battery_voltage = $('.battery_voltage').val();
    let truck_power = $('.power_truck').val();
    let charge_current = $('.charge_current').val();
    let new_Ycoord = 0;
    let t = 0;
    let t1 = 0;
    let t2 = 0;
    let En = 0; //энергия в батарее
    coordXY.arrayY.push(battery_power);
    console.log(coordXY.arrayY)

    for (let i = 0; i < bufArrayX.length - 1; i++) {

        let start_time_h = bufArrayX[i];
        let stop_time_h = bufArrayX[i + 1];

        t1 = (start_time_h.slice(0, 2) * 3600 + start_time_h.slice(3) * 60) / 3600;
        t2 = (stop_time_h.slice(0, 2) * 3600 + stop_time_h.slice(3) * 60) / 3600;
        t = Math.abs(t2 - t1);
        console.log(t);
        En = coordXY.arrayY[coordXY.arrayY.length];
        console.log(En);
        // if ((i + 1) % 2 === 0) {

        //     new_Ycoord = En + (t * battery_voltage * charge_current / 1000); //координата вверх
        //     if (new_Ycoord > battery_power) new_Ycoord = battery_power
        // }
        // else {
        //     new_Ycoord = En - (t * truck_power); //координата вниз
        //     if (new_Ycoord < 0) new_Ycoord = 0
        // }

        if ((i + 1) % 2 === 0) {

            new_Ycoord = En + (t * battery_voltage * charge_current / 1000); //координата вверх
            if (new_Ycoord > battery_power) {
                new_Ycoord = battery_power;
                coordXY.arrayY.push(new_Ycoord);
                t = t + (battery_power - En) / battery_power;
                coordXY.labels.push(t);

            }
        }
        else {
            new_Ycoord = En - (t * truck_power); //координата вниз
            if (new_Ycoord < 0) {
                new_Ycoord = 0;
                coordXY.arrayY.push(new_Ycoord);
                t = t + En / truck_power;
                coordXY.labels.push(t);
            }
        }
        coordXY.labels.push(bufArrayX[i]);
        coordXY.arrayY.push(new_Ycoord);
        console.log(coordXY.labels);
        console.log(coordXY.arrayY);
    }
    return coordXY;
}

$('.equel').click(function () {
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            bufArrayX.push(buf_array[i][j]);
        }
    }
    creatYCoord(coordXY, bufArrayX);
    // console.log(arrayY);
    createPlot(coordXY);
});

