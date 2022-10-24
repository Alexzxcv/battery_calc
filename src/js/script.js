let power_batt = 0;
let power_truck = 0;
let buf_array = [];
let labels = ['0',];
let arrayY = [];

$(function(){
    $("[data-tooltip]").mousemove(function (eventObject) {
        $data_tooltip = $(this).attr("data-tooltip");
        $("#tooltip").html($data_tooltip)
            .css({ 
              "top" : eventObject.pageY + 5,
              "left" : eventObject.pageX + 5
            })
            .show();
        }).mouseout(function () {
          $("#tooltip").hide()
            .html("")
            .css({
                "top" : 0,
                "left" : 0
            });
    });
});

function createPlot(labels, arrayY) {

    const data = {
        labels: labels,
        datasets: [{
            label: 'plot_day',
            backgroundColor: 'rgb(0, 0, 255)',
            borderColor: 'rgb(0, 0, 255)',
            data: arrayY,
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

    if ((start_time === "") || (stop_time === "")){
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

function creatYCoord(arrayY, labels) {
    let battery_power = $('.power_batt').val();
    let battery_voltage = $('.battery_voltage').val();
    let truck_power = $('.power_truck').val();
    let charge_current = $('.charge_current').val();
    let new_Ycoord = 0;
    let t = 0;
    let t1 = 0;
    let t2 = 0;
    let En = 0; //энергия в батарее
    arrayY.push(battery_power);

    for (let i = 0; i < labels.length - 1; i++) {

        let start_time_h = labels[i];
        let stop_time_h = labels[i + 1];

        t1 = (start_time_h.slice(0, 2) * 3600 + start_time_h.slice(3) * 60) / 3600;
        t2 = (stop_time_h.slice(0, 2) * 3600 + stop_time_h.slice(3) * 60) / 3600;
        t = Math.abs(t2 - t1) ;
        console.log(t);
        En = arrayY[i];

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
            if (new_Ycoord > battery_power){
                new_Ycoord = battery_power;
                t = (battery_power - En) / battery_power;
                
                labels.push(t);
            }
        }
        else {
            new_Ycoord = En - (t * truck_power); //координата вниз
            if (new_Ycoord < 0) {
                new_Ycoord = 0;
                t = En / truck_power;
            }
        }

        arrayY.push(new_Ycoord);
        console.log(labels);
        console.log(arrayY);
    }
    return arrayY;
}

$('.equel').click(function () {
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            labels.push(buf_array[i][j]);
        }
    }
    creatYCoord(arrayY, labels);
    // console.log(arrayY);
    createPlot(labels, arrayY);
});

