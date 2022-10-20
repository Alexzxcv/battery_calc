let power_batt = 0;
let power_truck = 0;
let buf_array = [];
let labels = ['0',];
let arrayY = [];

console.log(1);

$('.battery_capacity').onblur = function() {
   console.log($('#battery_capacity').val());
}

function createPlot(labels, arrayY) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'plot_day',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
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
    start_time = $('.start').val();
    stop_time = $('.stop').val();
    let stash = $('.stash');
    const stash_block = `<span class="post" id="p${count}">Start: ${start_time} Stop: ${stop_time}</span>`;
    const del = `<span class="del" id="d${count}">Del</span>`;

    stash.append(stash_block);
    stash.append(del);

    buf_array.push([start_time, stop_time]);

    power_batt = $('.power_batt').val();
    power_truck = $('.power_truck').val();

    count++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}`).remove();
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

        En = arrayY[i];

        if ((i + 1) % 2 === 0) {
           
            new_Ycoord = En + (t * battery_voltage * charge_current / 1000); //координата вверх
            if (new_Ycoord > battery_power) new_Ycoord = battery_power
        }
        else {
            new_Ycoord = En - (t * truck_power); //координата вниз
            if (new_Ycoord < 0) new_Ycoord = 0
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

