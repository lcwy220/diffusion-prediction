function big_line_1(data) {
    var item = [];
    console.log(data);
    var data = eval(data);
    item.push(Math.ceil(data[0]));
    item.push(Math.ceil(data[1]));
    console.log(item);
    var myChart = echarts.init(document.getElementById('big_img_weibo'));
    option = {
    title : {
        text: '总数量预测'
    },
    tooltip : {
        trigger: 'axis'
    },

    toolbox: {
        show : true,
        feature : {
            
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: [ 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['总微博数量','总参与人数']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'数值',
            type:'bar',
            data:item,
           
        }
    ]
};
                    
    myChart.setOption(option);   
}

function big_line_1_outter(){
    task_name = '毛泽东诞辰纪念日';
    var macro_value_url = '/prediction/get_macro_prediction/?task_name='+task_name;
    console.log(macro_value_url);
    $.ajax({
        url: macro_value_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:big_line_1
    });
}
    


function big_line_2(data) {
    data = eval(data)
    var myChart = echarts.init(document.getElementById('big_img_person'));
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
                name: '事件等级预测',
                type: 'gauge',
                max:10,
                detail: {formatter:'{value}分'},
                data: [{value: data[2], name: '事件等级'}]
            }
        ]
    }, true);
}

function big_line_2_outter(){

    task_name = '毛泽东诞辰纪念日';
    var macro_rank_url = '/prediction/get_macro_prediction/?task_name='+task_name;
    console.log(macro_rank_url);
    $.ajax({
        url: macro_rank_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:big_line_2
    });
}
    


function big_line_3(data) {
    var myChart = echarts.init(document.getElementById('big_img_line'));
    var data = eval(data);
    var data_time = [];
    var data_data = [];
    console.log(data);
    var exist_trend = data.exist_trend;
    var climax = data.climax;
    var rise_trend = data.rise_trend;
    var fall_trend = data.fall_trend;
    console.log(climax);
    if(exist_trend){
        for (var i=0; i< exist_trend.length; i++){
            date_time = new Date(parseInt(exist_trend[i][0]) * 1000).toLocaleString();
            data_time.push(date_time);
            data_data.push(exist_trend[i][1]);
        }
    }

    if(climax){
            date_time = new Date(parseInt(climax[0]) * 1000).toLocaleString();
            data_time.push(date_time);
            data_data.push(climax[1]);
        
    }

    if(rise_trend){
        for (var i=0; i< rise_trend.length; i++){
            date_time = new Date(parseInt(rise_trend[i][0]) * 1000).toLocaleString();
            data_time.push(date_time);
            data_data.push(rise_trend[i][1]);
        }
    }

    if(fall_trend){
        for (var i=0; i< fall_trend.length; i++){

            date_time = new Date(parseInt(fall_trend[i][0]) * 1000).toLocaleString();
            data_time.push(date_time);
            data_data.push(fall_trend[i][1]);
        }
    }

    console.log(data_time);
    console.log(data_data);

    myChart.setOption(option = {
        title: {
            text: '折线图'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['宏观趋势预测']
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
                name:'宏观趋势预测',
                type:'line',
                data:data_data,
            
            }
        ]
    }, true);
}


function big_line_3_outter(){
    task_name = '毛泽东诞辰纪念日';
    var macro_trend_url = '/prediction/get_macro_trendline/?task_name='+task_name;
    console.log(macro_trend_url);
    $.ajax({
        url: macro_trend_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:big_line_3
    });
}
   

big_line_1_outter();
big_line_2_outter();
big_line_3_outter();