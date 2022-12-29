const firstTime = new Date('1.1.2022 00:00 +0');
let buf_array = [[+new Date('1.1.2022 12:00'), +new Date('1.1.2022 13:00')],
[+new Date('1.1.2022 18:00'), +new Date('1.1.2022 19:00')],];
let bufArrayXY = [+firstTime];
let countID = 2;
let count_tab = 0;
let realTime = new Date();
let timeZone = realTime.getTimezoneOffset() * 60000;
let batteryPower = 4.94;
let chargeCurrent = 103;
let coordXY = [];
let coordXYWeek = [];

for (let i = 0; i < buf_array.length; i++) {
    for (let j = 0; j < 2; j++) {
        bufArrayXY.push(buf_array[i][j] + ~timeZone);
    }
}

$('.battery_voltage').change(function () {
    const batteryVoltage = $('.battery_voltage').val();
    const batteryCapacity = $('.battery_capacity').val();
    batteryPower = ((batteryVoltage * batteryCapacity) / 1000).toFixed(2);
    $('.power_batt').text(function () {
        return (`${batteryPower} kWh`);
    });
});

$('.battery_capacity').change(function () {
    const batteryVoltage = $('.battery_voltage').val();
    const batteryCapacity = $('.battery_capacity').val();
    batteryPower = ((batteryVoltage * batteryCapacity) / 1000).toFixed(2);
    $('.power_batt').text(function () {
        return (`${batteryPower} kWh`);
    });
});

$('.battery_capacity').change(function () {
    const chargeRate = $('.charge_rate').val();
    const batteryCapacity = $('.battery_capacity').val();
    chargeCurrent = ((chargeRate * batteryCapacity)).toFixed(1);
    $('.charge_current').text(function () {
        return (`${chargeCurrent} A`);
    });
});

$('.charge_rate').change(function () {
    const chargeRate = $('.charge_rate').val();
    const batteryCapacity = $('.battery_capacity').val();
    chargeCurrent = ((chargeRate * batteryCapacity)).toFixed(1);
    $('.charge_current').text(function () {
        return (`${chargeCurrent} A`);
    });
});

const input = document.querySelector('.power_truck');

input.addEventListener('input', () => {
    let inputValue = input.value.replace(/[-,+,=]/g, '');
    input.value = inputValue;

    if (input.value.length === 9) {
        input.classList.add('success');
    } else {
        input.classList.remove('success');
    }
});

function sortArray(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
}

function deleteTime() {
    bufArrayXY.splice(0, bufArrayXY.length);
    bufArrayXY.push(+firstTime);
    const clickId = $(this).attr('id').substring(1);
    $(`#p${clickId}, #d${clickId}, .s${clickId}`).remove();
    buf_array[clickId] = '';
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (buf_array[i] === '') {
                continue;
            }
            else {
                bufArrayXY.push(buf_array[i][j] + ~timeZone);
            }
        }
    }
    bufArrayXY.sort(sortArray);
}

let options = {
    chart: {
        height: 300,
        width: "100%",
        type: 'line',
        animations: {
            initialAnimation: { enabled: false }
        },

        toolbar: {
            show: true,
            tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: false,
                customIcons: []
            },
        },
        events: {
            beforeZoom: (e, { xaxis }) => {
                console.log(e);
                let minE = e.maxX - e.minX;
                let maxZoom = xaxis.max - xaxis.min;
                if (maxZoom <= minE)
                    return {
                        xaxis: {
                            min: xaxis.min,
                            max: xaxis.max
                        }
                    };
                else {
                    return {
                        xaxis: {
                            min: +new Date('12.31.2021 22:00 +0'),
                            max: +new Date('1.8.2022 00:00 +0')
                        }
                    }
                }
            }
        }
    },

    tooltip: {
        enabled: true,
        inverseOrder: true,
        shared: true,
        followCursor: false,
        x: {
            format: 'd HH:mm',
        },
    },
    series: [
        {
            name: 'SOC',
            data: '',

        },
        {
            name: 'Efficiency',
            data: '',
        }
    ],
    stroke: {
        curve: 'straight',
        width: 3,
    },
    grid: {
        show: false,
    },
    yaxis: {
        floating: false,
        max: 100,
        min: 0,
        labels: {
            show: true,
            style: {
                colors: '#fff'
            },
            formatter: function (val) {
                return `${val.toFixed(0)}%`;
            },
        },
    },
    xaxis: {
        type: "datetime",
        min: +new Date('12.31.2021 22:00 +0'),
        max: +new Date('1.8.2022 00:00 +0'),
        labels: {
            show: true,
            style: {
                colors: '#fff'
            },
            datetimeFormatter: {
                month: 'd',
                day: 'd',
            },
        },
    },
    legend: {
        show: true,
        labels: {
            colors: '#fff',
        },
    },
};

let chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

creatYCoord(coordXY, coordXYWeek, bufArrayXY);
createPlotDay();

function createPlotDay() {
    chart.updateSeries([{
        data: coordXY,
    }, {
        data: coordXYWeek,
    }]);
}

$('.del').click(deleteTime);

$('.plus').click(function () {
    const stash = $('.stash');
    const start_time = $('.start').val();
    const stop_time = $('.stop').val();
    const start_time_parse = new Date(`1.1.2022 ${start_time}`);
    const stop_time_parse = new Date(`1.1.2022 ${stop_time}`);
    if ((start_time === "") || (stop_time === "")) {
        return;
    }
    else if (start_time > stop_time) {
        return;
    }
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            if ((+(new Date(`1.1.2022 ${start_time}`)) === buf_array[i][j]) || (+(new Date(`1.1.2022 ${stop_time}`)) === buf_array[i][j])) {
                return;
            }
        }
    }
    const stash_block = `<div class="post s${countID}"><span class="time_step" id="p${countID}">Start: ${start_time} Stop: ${stop_time}</span>
    <span class="del" id="d${countID}">&#215;</span></div>`;
    stash.append(stash_block);
    buf_array.push([+start_time_parse, +stop_time_parse]);
    countID++;
    $('.del').click(deleteTime);
});

function creatYCoord(coordXY, coordXYWeek, bufArrayXY) {
    coordXY.splice(0, coordXY.length);
    coordXYWeek.splice(0, coordXYWeek.length);
    const batteryVoltage = $('.battery_voltage').val();
    const truckPower = $('.power_truck').val();
    let sumEnerge = 0;
    let countDot = 0;
    let max = 0;
    let min = 100;
    let lastEnergi = batteryPower;
    let newYcoord = batteryPower;
    let newYcoordPercent = 0;
    let calcTime = 0;       //общее время расчета
    let timeWorking = 0;    //время работы 
    let timeCharging = 0;   //время заряда
    let shiftDay = 0;       //сдвиг дня
    let lastTime = new Date('1.2.2022 00:00 +0');
    let startTimeH = new Date('1.1.2022 00:00 +0');   //время начала паузы
    let stopTimeH = new Date('1.2.2022 00:00 +0');      //время конца паузы
    let percent = () => {
        if (newYcoordPercent > max) {
            max = newYcoordPercent;
        }
        if (newYcoordPercent < min) {
            min = newYcoordPercent;
        }
    }
    newYcoordPercent = newYcoord / (batteryPower / 100);
    percent();
    countDot += 1;
    sumEnerge += newYcoordPercent;
    coordXY.push({ x: +(new Date(firstTime)), y: newYcoordPercent });
    coordXYWeek.push({ x: +(new Date(firstTime)), y: newYcoordPercent });
    if (bufArrayXY.length === 1) {
        calcTime = (stopTimeH - startTimeH + shiftDay) / 3600000;
        for (let i = 0; i < 7; i++) {
            newYcoord = lastEnergi - (calcTime * truckPower); //координата вниз
            if (newYcoord < 0) {
                newYcoord = 0;
                calcTime = (+startTimeH + shiftDay) / 3600000 + lastEnergi / truckPower;
                newYcoordPercent = newYcoord / (batteryPower / 100);
                percent();
                countDot += 1;
                sumEnerge += newYcoordPercent;
                coordXY.push({ x: calcTime * 3600000, y: newYcoordPercent });
                calcTime = calcTime - (+startTimeH + shiftDay) / 3600000;
                flagZero = true;
            }
            timeWorking += calcTime;
            lastEnergi = newYcoord;
            newYcoordPercent = newYcoord / (batteryPower / 100);
            percent();
            countDot += 1;
            sumEnerge += newYcoordPercent;
            coordXY.push({ x: +stopTimeH + shiftDay, y: newYcoordPercent });
            coordXYWeek.push({ x: +(new Date(+lastTime + shiftDay)), y: sumEnerge / countDot })
            shiftDay += 86400000;
        }
    }
    else {
        for (let j = 0; j < 7; j++) {
            for (let i = 1; i < bufArrayXY.length; i++) {
                startTimeH = (shiftDay + bufArrayXY[i - 1]) / 3600000;          //часы 
                stopTimeH = (shiftDay + bufArrayXY[i]) / 3600000;               //часы
                calcTime = stopTimeH - startTimeH;                              // время в часах + сдвиг
                if (i % 2 == 0) {
                    newYcoord = lastEnergi + (calcTime * batteryVoltage * chargeCurrent / 1000);                        //координата вверх
                    if (newYcoord >= batteryPower) {
                        newYcoord = batteryPower;
                        calcTime = startTimeH + (newYcoord - lastEnergi) * 1000 / (batteryVoltage * chargeCurrent);     //часы
                        newYcoordPercent = newYcoord / (batteryPower / 100);
                        percent();
                        countDot += 1;
                        sumEnerge += newYcoordPercent;
                        coordXY.push({ x: +(new Date(calcTime * 3600000)), y: newYcoordPercent });
                        calcTime = calcTime - startTimeH;
                    }
                    timeCharging += calcTime;
                }
                else {
                    newYcoord = lastEnergi - (calcTime * truckPower); //координата вниз
                    if (newYcoord < 0) {
                        newYcoord = 0;
                        calcTime = startTimeH + lastEnergi / truckPower;
                        newYcoordPercent = newYcoord / (batteryPower / 100);
                        percent();
                        countDot += 1;
                        sumEnerge += newYcoordPercent;
                        coordXY.push({ x: +(new Date(calcTime * 3600000)), y: newYcoordPercent });
                        calcTime = calcTime - startTimeH;
                    }
                    timeWorking += calcTime;
                }
                lastEnergi = newYcoord;
                newYcoordPercent = newYcoord / (batteryPower / 100);
                percent();
                countDot += 1;
                sumEnerge += newYcoordPercent;
                coordXY.push({ x: +(new Date(shiftDay + bufArrayXY[i])), y: newYcoordPercent });
            }
            calcTime = new Date(+lastTime + shiftDay - (bufArrayXY[bufArrayXY.length - 1] + shiftDay)) / 3600000;
            newYcoord = lastEnergi - (calcTime * truckPower); //координата вниз
            if (newYcoord < 0) {
                newYcoord = 0;
                calcTime = stopTimeH + lastEnergi / truckPower;
                newYcoordPercent = newYcoord / (batteryPower / 100);
                percent();
                countDot += 1;
                sumEnerge += newYcoordPercent;
                coordXY.push({ x: +(new Date(calcTime * 3600000)), y: newYcoordPercent });
                calcTime = calcTime - startTimeH;
            }
            newYcoordPercent = newYcoord / (batteryPower / 100);
            percent();
            countDot += 1;
            sumEnerge += newYcoordPercent;
            coordXY.push({ x: +(new Date(+lastTime + shiftDay)), y: newYcoordPercent })
            coordXYWeek.push({ x: +(new Date(+lastTime + shiftDay)), y: sumEnerge / countDot })
            shiftDay += 86400000;
            timeWorking += calcTime;
            lastEnergi = newYcoord;
        }
    }

    

    $('.working').text(function () {
        timeWorking = timeWorking / 168 * 100;
        return (timeWorking.toFixed(1) + '%');
    });
    $('.charging').text(function () {
        timeCharging = timeCharging / 168 * 100;
        return (timeCharging.toFixed(1) + '%');
    });
    $('.waiting').text(function () {
        timeWaiting = 100 - timeWorking - timeCharging;
        return (timeWaiting.toFixed(1) + '%');
    });
    $('.max_soc').text(function () {
        return (max.toFixed(0) + '%');
    });
    $('.min_soc').text(function () {
        return (min.toFixed(0) + '%');
    });
}

$('.equel').click(function () {
    bufArrayXY.splice(0, bufArrayXY.length);
    bufArrayXY.push(+firstTime);
    for (let i = 0; i < buf_array.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (buf_array[i] === '') {
                continue;
            }
            else {
                bufArrayXY.push(buf_array[i][j] + ~timeZone);
            }
        }
    }
    bufArrayXY.sort(sortArray);
    creatYCoord(coordXY, coordXYWeek, bufArrayXY);
    createPlotDay();
});