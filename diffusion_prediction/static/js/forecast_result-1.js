function big_line_1(data) {
    var item = [];
    var data = eval(data);
    item.push(Math.ceil(data[0]));
    item.push(Math.ceil(data[1]));
    var small= '预计总微博数量为<b style="color:red;">'+Math.ceil(data[0])+'</b>，总参与人数为<b style="color:red;">'+Math.ceil(data[1])+'</b>';
    $('#_two').html(small);
    var myChart = echarts.init(document.getElementById('big_img_weibo'));
    option = {
//    title : {
//        text: '总数量预测',
//        subtext:small,
//        subtextStyle:{
//            fontSize:'14px',
//        },
//    },
    tooltip : {
        trigger: 'axis'
    },

    toolbox: {
        show : true,
        feature : {

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

function getLocalTime(nS) {
	var timeTrans = new Date(parseInt(nS) * 1000);
    return timeTrans.toLocaleString('chinese',{hour12:false});
}

function big_line_1_outter(){
    var macro_value_url = '/prediction/get_macro_prediction/?task_name='+task_name;
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
    var macro_rank_url = '/prediction/get_macro_prediction/?task_name='+task_name;
    $.ajax({
        url: macro_rank_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:big_line_2
    });
}


Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
function big_line_3(data) {
    var small= '预计爆发时间在<b style="color:red;">'+getLocalTime(data.climax[0])+'</b>';
    $('#_four').html(small);
    var myChart = echarts.init(document.getElementById('big_img_line'));
    var data = eval(data);
    console.log(data)

    var series_nums=[],series_time=[];
    var climax = data.climax;

    var exist_trend = data.exist_trend;
    var rise_trend = data.rise_trend;
    var fall_trend = data.fall_trend;
    var max_time=[],max_nums=[],
        exist_time=[],exist_nums=[],
        rise_time=[],rise_nums=[],
        fall_time=[],fall_nums=[];

    if (climax.length!=0){
        max_time.push(climax[0]);
        max_nums.push(climax[1]);
    };

    if (exist_trend.length!=0){
        for (var i=0; i< exist_trend.length; i++){
            exist_time.push(exist_trend[i][0]);
            exist_nums.push(exist_trend[i][1]);
        };
    };

    if (rise_trend.length!=0){
        for (var i=0; i< rise_trend.length; i++){
            rise_time.push(rise_trend[i][0]);
            rise_nums.push(rise_trend[i][1].toFixed(2));
        };
    };

    if (fall_trend.length!=0){
        for (var i=0; i< fall_trend.length; i++){
            fall_time.push(fall_trend[i][0]);
            fall_nums.push(fall_trend[i][1].toFixed(2));
        };
    };

    var rel_len=exist_time.length;
    var rise_len=rise_time.length;
    var fall_len=fall_time.length;
    var rel_last;
    if (rel_len!=0){
        rel_last=exist_nums[rel_len-1];
        var not_max='min',name='最小值';
        if (exist_time.contains(max_time[0])){
            not_max='max',name='最大值';
        }
        series_nums.push(
            {
                name:'宏观趋势预测',
                type:'line',
                smooth:true,
                itemStyle: {
                    color:'#FF7F50',
                    normal: {
                        color: '#FF7F50',
                    }
                },
                data:exist_nums,
                markPoint : {
                    data : [
                        {type : not_max, name: name},
                    ]
                },
            }
        );
    };
    if (rise_len!=0){
        if (rel_len!=0){
            rise_nums.unshift(rel_last);
            for (var t=0;t<rel_len-1;t++){
                rise_nums.unshift('-');
            }
        };
        var not_max='min',name='最小值';
        if (rise_time.contains(max_time[0])){
            not_max='max';name='最大值';
        }
        series_nums.push(
            {
                name:'宏观趋势攀高',
                type:'line',
                itemStyle:{
                    normal:{
                        color:'red',
                        lineStyle:{
                            color: 'red',
                            type:'dotted'
                        },
                    },

                },
                data:rise_nums,
                markPoint : {
                    data : [
                        {type : not_max, name: name},
                    ]
                },
            }
        );
    };
    if (fall_len!=0){
        if (rel_len!=0&&rise_len!=0){
            fall_nums.unshift(rise_nums[rise_nums-1]);
            for (var t=0;t<(rel_len+rise_len-2);t++){
                fall_nums.unshift('-');
            }
        }else if (rel_len!=0 && rise_len==0){
            fall_nums.unshift(exist_nums[rel_len-1]);
            for (var t=0;t<rel_len-1;t++){
                fall_nums.unshift('-');
            }
        }else if (rise_len!=0&&rel_len==0){
            fall_nums.unshift(rise_nums[rel_len-1]);
            for (var t=0;t<rise_len-1;t++){
                fall_nums.unshift('-');
            }
        }
        var not_max='min',name='最小值';
        if (fall_time.contains(max_time[0])){
            not_max='max',name='最大值';
        }
        series_nums.push(
            {
                name:'宏观趋势走低',
                type:'line',
                itemStyle:{
                    normal:{
                        color:'green',
                        lineStyle:{
                            color: 'green',
                            type:'dotted'
                        },
                    }
                },
                data:fall_nums,
                markPoint : {
                    data : [
                        {type : not_max, name: name},
                    ]
                },
            }
        );
    };
    var _time=exist_time.concat(rise_time).concat(fall_time);
    $.each(_time,function (index,item) {
        series_time.push(getLocalTime(item));
    })
    console.log(series_nums)
    var option = {
        // title: {
        //    text: '折线图'
        // },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['宏观趋势预测','宏观趋势攀高','宏观趋势走低']
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        calculable: false,
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: series_time
        },
        yAxis: {
            type: 'value',
            min:0,
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: series_nums
    };
    myChart.setOption(option);
}


function big_line_3_outter(){
    var macro_trend_url = '/prediction/get_macro_trendline/?task_name='+task_name;
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