let power_batt = 0;
let power_truck = 0;
let buf_array = [];
let labels = [
    '0',
];

function createPlot(labels) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'plot_day',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
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

$('.equel').click(function () {
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            labels.push(buf_array[i][j]);
        }
    }
    createPlot(labels);
});
