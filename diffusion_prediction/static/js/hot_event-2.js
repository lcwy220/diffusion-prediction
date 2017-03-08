var place_url_map='/topic_time_analyze/mtype_count/?topic=mao_ze_dong_dan_chen_ji_nian_ri' +
    '&start_ts=1482681600&end_ts=1483113600&pointInterval=900';
var place_url_text='/topic_time_analyze/time_order_weibos/?topic=mao_ze_dong_dan_chen_ji_nian_ri' +
    '&start_ts=1482681600&end_ts=1483113600&sort_item=timestamp';
var starttime,endtime,unit_time='900';

$('.unit_time button').on('click',function () {
    if ($(this).text()=='15 min'){
        unit_time='900';
        request();
    }else if ($(this).text()=='30 min'){
        unit_time='1800';
        request();
    }else {
        unit_time='3600';
        request();
    }
});
function ckdate() {
    starttime = $('.start').val();
    endtime = $('.end').val();
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
            place_url_map='/topic_time_analyze/mtype_count/?topic='+topic_name+
                '&start_ts='+start+'&end_ts='+end+'&pointInterval='+unit_time;
            place_url_text='/topic_time_analyze/time_order_weibos/?topic='+topic_name+
                '&start_ts='+start+'&end_ts='+end+'&sort_item='+unit_time;
            request();
        }
    }
}
//---请求--
function request() {
    $.ajax({
        url: place_url_map,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:place_map
    });
    $.ajax({
        url: place_url_text,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:place_weibo
    });
};
request();


//时间戳转换
function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10);
}
//-----画折线图------
function place_map(data) {
    $('#hot_list').empty();
    var line=eval(data);
    var date=[],num_1=[],num_2=[],num_3=[];
    for (var key in line){
        date.push(getLocalTime(key));
        num_1.push(line[key][0]);
        num_2.push(line[key][1]);
        num_3.push(line[key][2]);
    }
    var myChart = echarts.init(document.getElementById('hot_list'));
    var option = {
        title: {
            // text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['原创','转发','评论']
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
            data: date
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'原创',
                type:'line',
                stack: '总量',
                data:num_1
            },
            {
                name:'转发',
                type:'line',
                stack: '总量',
                data:num_2
            },
            {
                name:'评论',
                type:'line',
                stack: '总量',
                data:num_3
            },
        ]
    };
    myChart.setOption(option);
}
//-----微博---
function place_weibo(data) {
    var data=eval(data);
    weibo_text(data);
}

function weibo_text(data){
    $('#group_emotion_loading').css('display', 'none');
    $('#input-table').css('display', 'block');
    var dataArray = data;
    var PageNo=document.getElementById('PageNo');                   //设置每页显示行数
    var InTb=document.getElementById('input-table');               //表格
    var Fp=document.getElementById('F-page');                      //首页
    var Nep=document.getElementById('Nex-page');                  //下一页
    var Prp=document.getElementById('Pre-page');                  //上一页
    var Lp=document.getElementById('L-page');                     //尾页
    var S1=document.getElementById('s1');                         //总页数
    var S2=document.getElementById('s2');                         //当前页数
    var currentPage;                                              //定义变量表示当前页数
    var SumPage;

    if(PageNo.value!="")                                       //判断每页显示是否为空
    {
        InTb.innerHTML='';                                     //每次进来都清空表格
        S2.innerHTML='';                                        //每次进来清空当前页数
        currentPage=1;                                          //首页为1
        S2.appendChild(document.createTextNode(currentPage));
        S1.innerHTML='';                                        //每次进来清空总页数
        if(dataArray.length%PageNo.value==0)                    //判断总的页数
        {
            SumPage=parseInt(dataArray.length/PageNo.value);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.value)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        var oTBody=document.createElement('tbody');               //创建tbody
        oTBody.setAttribute('class','In-table');                   //定义class
        InTb.appendChild(oTBody);
        //将创建的tbody添加入table
        var html_c = '';
        if(dataArray==''){
            html_c = "<div style='width:100%;'><span>用户未发布任何微博</span></div>";
            oTBody.innerHTML = html_c;
        }else{

            for(i=0;i<parseInt(PageNo.value);i++)
            {                                                          //循环打印数组值
                oTBody.insertRow(i);
                var name,photo;
                if (dataArray[i][1].uname==''||dataArray[i][1].uname=='unknown') {
                    name=dataArray[i][1].uid;
                }else {
                    name=dataArray[i][1].uname;
                };
                if (dataArray[i][1].photo_url==''||dataArray[i][1].photo_url=='unknown') {
                    photo='/static/images/unknown.png';
                }else {
                    photo=dataArray[i][1].photo_url;
                };
                html_c = '<div class="weibo_explain">'+
                    '                <div class="weibo_detail_left">'+
                    '                    <img class="user_photo" src="'+photo+'">'+
                    '                </div>'+
                    '                <div class="weibo_detail_right">'+
                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][1].mid+'">'+name+'：</a>'+
                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][1].text+
                    '                    </span>'+
                    '                    <div class="weibo_source">'+
                    '                        <span>'+getLocalTime(dataArray[i][1].timestamp)+'</span>'+
                    '                        <p class="weibo_operating" style="float: right">'+
                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i][1].retweeted+'）</span>'+
                    '                            <span>|</span>'+
                    '                            <span class="weibo_comment">评论数（'+dataArray[i][1].comment+'）</span>'+
                    '                        </p>'+
                    '                    </div>'+
                    '                </div>'+
                    '            </div>';
                oTBody.rows[i].insertCell(0);
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }
    Fp.onclick=function()
    {

        if(PageNo.value!="")                                       //判断每页显示是否为空
        {
            InTb.innerHTML='';                                     //每次进来都清空表格
            S2.innerHTML='';                                        //每次进来清空当前页数
            currentPage=1;                                          //首页为1
            S2.appendChild(document.createTextNode(currentPage));
            S1.innerHTML='';                                        //每次进来清空总页数
            if(dataArray.length%PageNo.value==0)                    //判断总的页数
            {
                SumPage=parseInt(dataArray.length/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.value)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            var oTBody=document.createElement('tbody');               //创建tbody
            oTBody.setAttribute('class','In-table');                   //定义class
            InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
            var html_c = '';

            if(dataArray==''){
                html_c = "<div style='width:100%;'><span style='margin-left:20px;'>用户未发布任何微博</span></div>";
                oTBody.rows[0].cells[0].innerHTML = html_c;
            }else{

                for(i=0;i<parseInt(PageNo.value);i++)
                {                                                          //循环打印数组值
                    oTBody.insertRow(i);
                    var name,photo;
                    if (dataArray[i][1].uname==''||dataArray[i][1].uname=='unknown') {
                        name=dataArray[i][1].uid;
                    }else {
                        name=dataArray[i][1].uname;
                    };
                    if (dataArray[i][1].photo_url==''||dataArray[i][1].photo_url=='unknown') {
                        photo='/static/images/unknown.png';
                    }else {
                        photo=dataArray[i][1].photo_url;
                    };
                    html_c = '<div class="weibo_explain">'+
                        '                <div class="weibo_detail_left">'+
                        '                    <img class="user_photo" src="'+photo+'">'+
                        '                </div>'+
                        '                <div class="weibo_detail_right">'+
                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][1].mid+'">'+name+'：</a>'+
                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][1].text+
                        '                    </span>'+
                        '                    <div class="weibo_source">'+
                        '                        <span>'+getLocalTime(dataArray[i][1].timestamp)+'</span>'+
                        '                        <p class="weibo_operating" style="float: right">'+
                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i][1].retweeted+'）</span>'+
                        '                            <span>|</span>'+
                        '                            <span class="weibo_comment">评论数（'+dataArray[i][1].comment+'）</span>'+
                        '                        </p>'+
                        '                    </div>'+
                        '                </div>'+
                        '            </div>';
                    oTBody.rows[i].insertCell(0);
                    oTBody.rows[i].cells[0].innerHTML = html_c;
                }
            }
        }
    }
    Nep.onclick=function()
    {
        if(currentPage<SumPage)                                 //判断当前页数小于总页数
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.value==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.value)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage+1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;                                                 //定义变量a
            a=PageNo.value*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
            var c;                                                  //定义变量c
            if(dataArray.length-a>=PageNo.value)                  //判断下一页数组数据是否小于每页显示行数
            {
                c=PageNo.value;
            }
            else
            {
                c=dataArray.length-a;
            }
            for(i=0;i<c;i++)
            {
                oTBody.insertRow(i);
                var name,photo;
                if (dataArray[i+a][1].uname==''||dataArray[i+a][1].uname=='unknown') {
                    name=dataArray[i+a][1].uid;
                }else {
                    name=dataArray[i+a][1].uname;
                };
                if (dataArray[i+a][1].photo_url==''||dataArray[i+a][1].photo_url=='unknown') {
                    photo='/static/images/unknown.png';
                }else {
                    photo=dataArray[i+a][1].photo_url;
                };
                oTBody.rows[i].insertCell(0);
                html_c = '<div class="weibo_explain">'+
                    '                <div class="weibo_detail_left">'+
                    '                    <img class="user_photo" src="'+photo+'">'+
                    '                </div>'+
                    '                <div class="weibo_detail_right">'+
                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][1].mid+'">'+name+'：</a>'+
                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][1].text+
                    '                    </span>'+
                    '                    <div class="weibo_source">'+
                    '                        <span>'+getLocalTime(dataArray[i+a][1].timestamp)+'</span>'+
                    '                        <p class="weibo_operating" style="float: right">'+
                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][1].retweeted+'）</span>'+
                    '                            <span>|</span>'+
                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][1].comment+'）</span>'+
                    '                        </p>'+
                    '                    </div>'+
                    '                </div>'+
                    '            </div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
                //数组从第i+a开始取值
            }
        }
    }

    Prp.onclick=function()
    {
        if(currentPage>1)                        //判断当前是否在第一页
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.value==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.value)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage-1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;
            a=PageNo.value*(currentPage-1);
            for(i=0;i<parseInt(PageNo.value);i++)
            {
                oTBody.insertRow(i);
                var name,photo;
                if (dataArray[i+a][1].uname==''||dataArray[i+a][1].uname=='unknown') {
                    name=dataArray[i+a][1].uid;
                }else {
                    name=dataArray[i+a][1].uname;
                };
                if (dataArray[i+a][1].photo_url==''||dataArray[i+a][1].photo_url=='unknown') {
                    photo='/static/images/unknown.png';
                }else {
                    photo=dataArray[i+a][1].photo_url;
                };
                oTBody.rows[i].insertCell(0);
                html_c = '<div class="weibo_explain">'+
                    '                <div class="weibo_detail_left">'+
                    '                    <img class="user_photo" src="'+photo+'">'+
                    '                </div>'+
                    '                <div class="weibo_detail_right">'+
                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][1].mid+'">'+name+'：</a>'+
                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][1].text+
                    '                    </span>'+
                    '                    <div class="weibo_source">'+
                    '                        <span>'+getLocalTime(dataArray[i+a][1].timestamp)+'</span>'+
                    '                        <p class="weibo_operating" style="float: right">'+
                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][1].retweeted+'）</span>'+
                    '                            <span>|</span>'+
                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][1].comment+'）</span>'+
                    '                        </p>'+
                    '                    </div>'+
                    '                </div>'+
                    '            </div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }

    Lp.onclick=function()
    {
        InTb.innerHTML='';
        S1.innerHTML='';
        if(dataArray.length%PageNo.value==0)
        {
            SumPage=parseInt(dataArray.length/PageNo.value);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.value)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        S2.innerHTML='';
        currentPage=SumPage;
        S2.appendChild(document.createTextNode(currentPage));
        var oTBody=document.createElement('tbody');
        oTBody.setAttribute('class','In-table');
        InTb.appendChild(oTBody);
        var a;
        a=PageNo.value*(currentPage-1);
        var c;
        if(dataArray.length-a>=PageNo.value)
        {
            c=PageNo.value;
        }
        else
        {
            c=dataArray.length-a;
        }
        for(i=0;i<c;i++)
        {
            oTBody.insertRow(i);
            var name,photo;
            if (dataArray[i+a][1].uname==''||dataArray[i+a][1].uname=='unknown') {
                name=dataArray[i+a][1].uid;
            }else {
                name=dataArray[i+a][1].uname;
            };
            if (dataArray[i+a][1].photo_url==''||dataArray[i+a][1].photo_url=='unknown') {
                photo='/static/images/unknown.png';
            }else {
                photo=dataArray[i+a][1].photo_url;
            };
            oTBody.rows[i].insertCell(0);
            html_c = '<div class="weibo_explain">'+
                '                <div class="weibo_detail_left">'+
                '                    <img class="user_photo" src="'+photo+'">'+
                '                </div>'+
                '                <div class="weibo_detail_right">'+
                '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][1].mid+'">'+name+'：</a>'+
                '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][1].text+
                '                    </span>'+
                '                    <div class="weibo_source">'+
                '                        <span>'+getLocalTime(dataArray[i+a][1].timestamp)+'</span>'+
                '                        <p class="weibo_operating" style="float: right">'+
                '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][1].retweeted+'）</span>'+
                '                            <span>|</span>'+
                '                            <span class="weibo_comment">评论数（'+dataArray[i+a][1].comment+'）</span>'+
                '                        </p>'+
                '                    </div>'+
                '                </div>'+
                '            </div>';
            oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    }

}
