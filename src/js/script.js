let power_batt = 0;
let power_truck = 0;
let buf_array = [];
let labels = ['0',];
let arrayY = [];

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
    let next_state = 0;
    let battery_power = $('.power_batt').val();
    let battery_voltage = $('.battery_voltage').val();
    let truck_power = $('.power_truck').val();
    let charge_current = $('.charge_current').val();
    let new_Ycoord = 0;
    let t = 0;
    let En = 0; //энергия в батарее
    arrayY.push(battery_power);

    for (let i = 0; i < labels.length - 2; i++) {
        

        let start_time_s = labels[i + 1];
        console.log(start_time_s);
        let stop_time_s = labels[i + 2];

        t = (Number(stop_time_s.slice(0, 2)) * 3600 + Number(stop_time_s.slice(3)) * 60) - (Number(start_time_s.slice(0, 2)) * 3600 + Number(start_time_s.slice(3)) * 60) / 3600;
        console.log(t);

        En = arrayY[i];

        if (i % 2 === 0) {
            new_Ycoord = En - (t * truck_power); //координата вниз
        }
        else {
            new_Ycoord = En + (t * battery_voltage * charge_current); //координата вверх
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

