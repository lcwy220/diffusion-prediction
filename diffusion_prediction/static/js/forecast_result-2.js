function getLocalTime(nS) {
	var timeTrans = new Date(parseInt(nS) * 1000);
    return timeTrans.toLocaleString('chinese',{hour12:false});
}

function small_trend(data) {
    var data = eval(data)
    var small= '预计下一时间点 <b style="color:red;">'+getLocalTime(data[data.length-1][0])+'</b>  的微博数为<b style="color:red;">'+Math.ceil(data[data.length-1][2])+'</b>';
    $('#_six').html(small);
    var data_time = [];
    var data_truth = [];
    var data_predict = [];
    if(data){
        for(var i=0; i<data.length;i++){
            date_time =getLocalTime(data[i][0]);
            data_time.push(date_time);
            data_truth.push(data[i][1]);
            data_predict.push(Math.ceil(data[i][2]));
        }
    }
    var myChart = echarts.init(document.getElementById('small_trend'));
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption(option = {
//        title: {
//            text: '折线对比图'
//        },
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
                // markPoint : {
                //     data : [
                //         {type : 'max', name: '最大值'},
                //     ]
                // },
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
                // markPoint : {
                //     data : [
                //         {type : 'max', name: '最大值',},
                //     ]
                // },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'},
                        [{
                            symbol: 'none',
                            x: '90%',
                            yAxis: 'max'
                        },
                            {
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
                    ],

                }
            }
        ]
    }, true);
}

function small_trend_outter(){

//    var start_ts = 1482681600;
//    var end_ts = 1483113600;
    var micro_trend_url = '/prediction/get_micro_prediction/?task_name='+task_name+
    '&start_ts='+start_ts+'&end_ts='+end_ts;

    $.ajax({
        url: micro_trend_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:small_trend
    });

}

small_trend_outter();

