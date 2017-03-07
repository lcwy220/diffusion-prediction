var topic_name='mao_ze_dong_dan_chen_ji_nian_ri';

var line_url='/topic_time_analyze/mtype_count/?topic='+topic_name+'&start_ts=1482681600&end_ts=1483113600&pointInterval=900';
var unit_time='900';

function ckdate() {
    var starttime = $('.start').val();
    var endtime = $('.end').val();
    // var start = new Date(starttime.replace(/\-/g, "\/"));
    // var end = new Date(endtime.replace(/\-/g, "\/"));
    var start = Date.parse(new Date(starttime))/1000;
    var end = Date.parse(new Date(endtime))/1000;
    if (starttime==''||endtime==''){
        alert('日期不能为空！');
    }else {
        if (end < start) {
            alert('结束日期不能小于开始日期！');
            return false;
        } else {
            //正常情况下执行操作
            // line_url='/topic_time_analyze/mtype_count/?topic='+topic_name+
            //     '&start_ts='+start+'&end_ts='+end+'&pointInterval='+unit_time;
            $.ajax({
                url: line_url,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:hot_line
            });
        }
    }
}
function hot_line(data) {
    var data=eval(data);
    console.log(data)
    var myChart = echarts.init(document.getElementById('hot_list'));
    var option = {
        title: {
            // text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'邮件营销',
                type:'line',
                stack: '总量',
                data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
                name:'联盟广告',
                type:'line',
                stack: '总量',
                data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
                name:'视频广告',
                type:'line',
                stack: '总量',
                data:[150, 232, 201, 154, 190, 330, 410]
            },
            {
                name:'直接访问',
                type:'line',
                stack: '总量',
                data:[320, 332, 301, 334, 390, 330, 320]
            },
            {
                name:'搜索引擎',
                type:'line',
                stack: '总量',
                data:[820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    };
    myChart.setOption(option);
}
