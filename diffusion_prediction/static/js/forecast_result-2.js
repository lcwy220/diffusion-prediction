function small_trend(data) {
    var data = eval(data)
    var data_time = [];
    var data_truth = [];
    var data_predict = [];
    if(data){
        for(var i=0; i<data.length;i++){
            date_time = new Date(parseInt(data[i][0]) * 1000).toLocaleString();
            data_time.push(date_time);
            data_truth.push(data[i][1]);
            data_predict.push(data[i][2]);
        }
    }
    var myChart = echarts.init(document.getElementById('small_trend'));
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption(option = {
        title: {
            text: '折线对比图'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['真值','预测值']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: data_time
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} '
            }
        },
        series: [
            {
                name:'真值',
                type:'line',
                data:data_truth,
                
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'预测值',
                type:'line',
                data:data_predict,
                
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'},
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        }, {
                            symbol: 'circle',
                            label: {
                                normal: {
                                    position: 'start',
                                    formatter: '最大值'
                                }
                            },
                            type: 'max',
                            name: '最高点'
                        }]
                    ]
                }
            }
        ]
    }, true);
}

function small_trend_outter(){

    var task_name = '毛泽东诞辰纪念日';
    var start_ts = 1482681600;
    var end_ts = 1483113600;
    var micro_trend_url = '/prediction/get_micro_prediction/?task_name='+task_name+
    '&start_ts='+start_ts+'&end_ts='+end_ts;

    console.log(micro_trend_url);
    $.ajax({
        url: micro_trend_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:small_trend
    });

}




small_trend_outter();

