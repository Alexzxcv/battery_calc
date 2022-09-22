let power_batt = 0;
let power_truck = 0;
let buf_array = [];
let labels = [
    '0',
];
let arrayY = [100];


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

// let y = [100,];
// let x = [0,];

// x.forEach(element => {

// });

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

function creatMaxYCoord(arrayY) {
    let S = $('.power_batt').val();
    console.log(S);
    let V = $('.power_truck').val();
    console.log(V);
    let t = 0;
    console.log(t);


    for (let i = 1; i <= buf_array.length; i++) {
        t = (stop_time[1].slice(0, 2) * 3600 + stop_time[1].slice(3) * 60) - (start_time[1].slice(0, 2) * 3600 + start_time[1].slice(3) * 60);
        console.log(t);

        arrayY.push(V * t);
    }
    return arrayY;
}

$('.equel').click(function () {
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            labels.push(buf_array[i][j]);
        }
    }
    creatMaxYCoord(arrayY);
    console.log(arrayY);
    createPlot(labels, arrayY);
});

