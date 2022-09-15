

let labels = [
    '0',
];

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

$('.plus').click(function () {
    start_time = $('.start').value;
    stop_time = $('.stop').value;
    let stash = $('#stash');
    let div = document.createElement('div');
    div.innerHTML = `<span>Start: ${start_time}</span><span>Stop: ${stop_time}</span>`;
    stash.append(div);
});