function small_left() {
    var myChart = echarts.init(document.getElementById('left'));
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption(option = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '业务指标',
                type: 'gauge',
                detail: {formatter:'{value}%'},
                data: [{value: 50, name: '完成率'}]
            }
        ]
    }, true);
}
small_left();

function small_right() {
    var myChart = echarts.init(document.getElementById('right'));
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption(option = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '业务指标',
                type: 'gauge',
                detail: {formatter:'{value}%'},
                data: [{value: 50, name: '完成率'}]
            }
        ]
    }, true);
}
small_right();
