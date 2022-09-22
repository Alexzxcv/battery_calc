let power_batt = 0;
let power_truck = 0;
let buf_array = [];
let labels = [
    '0',
];
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
    // console.log(buf_array);

    power_batt = $('.power_batt').val();
    power_truck = $('.power_truck').val();

    count++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}`).remove();
        buf_array.splice(clickId, 1);
    });
});

function creatMaxYCoord(arrayY, buf_array) {
    let next_state = 0;
    let S = $('.power_batt').val();
    // console.log(S);
    let V = $('.power_truck').val();
    // console.log(V);
    let t = 0;
    // console.log(t);
    // console.log(buf_array);
    arrayY.push($('.power_batt').val());

    for (let i = 0; i < buf_array.length; i++) {
        let start_time_s = buf_array[i][0];
        let stop_time_s = buf_array[i][1];
        t = ((Number(stop_time_s.slice(0, 2)) * 3600 + Number(stop_time_s.slice(3)) * 60) - (Number(start_time_s.slice(0, 2)) * 3600 + Number(start_time_s.slice(3)) * 60))/3600;
        // console.log(t);

        if (next_state > 0) {
            arrayY.push(arrayY[-1] * t);
        }
        else {
            arrayY.push(S / t);

        }
        arrayY.push(V * t);
        console.log(next_state);
        next_state ^= 1;
    }
    return arrayY;
}

$('.equel').click(function () {
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            labels.push(buf_array[i][j]);
        }
    }

    creatMaxYCoord(arrayY, buf_array);
    console.log(arrayY);
    createPlot(labels, arrayY);
});

