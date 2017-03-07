function result_line() {
    var myChart = echarts.init(document.getElementById('timeTrend_figure'));
    myChart.showLoading();
    myChart.hideLoading();
    myChart.setOption(option = {
        backgroundColor: '#fff',
        title: {
            text: '',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['最高气温','最低气温'],
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: ['周一','周二','周三','周四','周五','周六','周日'],
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C',
            },

        },
        series: [
            {
                name:'最高气温',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'line',
                data:[1, -2, 2, 5, 3, 2, 0],
                markPoint: {
                    data: [
                        {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
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
    myChart.on('click', function (param) {
        console.log(param);
    });
}
result_line();
function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}
function words_cloud() {
    var myChart_2 = echarts.init(document.getElementById('weibo_key_words'));
    myChart_2.showLoading();
    myChart_2.hideLoading();
    myChart_2.setOption(option = {
        title: {
            text: 'Google Trends',
            link: 'http://www.google.com/trends/hottrends'
        },
        tooltip: {
            show: true
        },
        series: [{
            name: 'Google Trends',
            type: 'wordCloud',
            size: ['80%', '80%'],
            textRotation : [0, 45, 90, -45],
            textPadding: 0,
            autoSize: {
                enable: true,
                minSize: 14
            },
            data: [
                {
                    name: "Sam S Club",
                    value: 10000,
                    itemStyle: {
                        normal: {
                            color: 'black'
                        }
                    }
                },
                {
                    name: "Macys",
                    value: 6181,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Amy Schumer",
                    value: 4386,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Jurassic World",
                    value: 4055,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Charter Communications",
                    value: 2467,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Chick Fil A",
                    value: 2244,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Planet Fitness",
                    value: 1898,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Pitch Perfect",
                    value: 1484,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Express",
                    value: 1112,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Home",
                    value: 965,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Johnny Depp",
                    value: 847,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Lena Dunham",
                    value: 582,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Lewis Hamilton",
                    value: 555,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "KXAN",
                    value: 550,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Mary Ellen Mark",
                    value: 462,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Farrah Abraham",
                    value: 366,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Rita Ora",
                    value: 360,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Serena Williams",
                    value: 282,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "NCAA baseball tournament",
                    value: 273,
                    itemStyle: createRandomItemStyle()
                },
                {
                    name: "Point Break",
                    value: 265,
                    itemStyle: createRandomItemStyle()
                }
            ]
        }]
    }, true);
};
words_cloud();

