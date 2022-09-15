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




let count = 1;

$('.plus').click(function () {
    start_time = $('#start').val();
    stop_time = $('.stop').val();
    let stash = $('.time_step');
    const stash_block = `<span class="post" id="p${count}">Start: ${start_time} Stop: ${stop_time}</span>`;            
    const del = `<span class="del" id="d${count}">Удалить</span>`;
    
    stash.append(stash_block);
    stash.append(del);

    labels.push(start_time);
    labels.push(stop_time);
    // alert(labels);

    count++;
    $('.del').click(function () {
        const clickId = $(this).attr('id').substring(1);
        $(`#p${clickId}, #d${clickId}`).remove();
    });
});

$('.equel').click(function () {
    createPlot(labels);
    labels = [
        '0',
    ];
});
