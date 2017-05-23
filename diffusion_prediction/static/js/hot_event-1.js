var line_url='/social_sensing/get_warning_detail/';
var weibo_url,final_time,text_type=1,order='retweeted';



//---请求--
$.ajax({
    url: line_url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:hot_line
});
function request(weibo_url_txt) {
    console.log(weibo_url_txt);
    $.ajax({
        url: weibo_url_txt,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:weibo
    });
};

//时间戳转换
function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10);
}
//-----画折线图------
function hot_line(data) {
    $('#hot_list').empty();
    var line=eval(data);
    var date=[],num_1=[],num_2=[];
    $.each(line.time_series,function (index,item) {
        date.push(getLocalTime(item));
    });
    final_time=line.time_series[line.time_series.length-1];

    $.each(line.origin_weibo_list,function (index,item) {
        num_1.push(item);
    });
    $.each(line.retweeted_weibo_list,function (index,item) {
        num_2.push(item);
    })
    var myChart = echarts.init(document.getElementById('hot_list'));
    var option = {
        title: {
            // text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['原创','转发']
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
        ]
    };
    myChart.setOption(option);
    myChart.on('click',function (params) {
        if (params.seriesName=='原创'){
            text_type=0;
        }else {
            text_type=1;
        }
        final_time=Date.parse(new Date(params.name))/1000;
        weibo_url='/social_sensing/get_text_detail/?ts='+final_time+'&text_type='+text_type+'&order='+order;
        request(weibo_url);
    })
    //获取微博链接并执行函数
    $('.sorting button').on('click',function () {
        if ($(this).text()=='按转发'){
            order='retweeted';
            weibo_url='/social_sensing/get_text_detail/?ts='+final_time+'&text_type='+text_type+'&order='+order;
            request(weibo_url);
        }else {
            order='comment';
            weibo_url='/social_sensing/get_text_detail/?ts='+final_time+'&text_type='+text_type+'&order='+order;
            request(weibo_url);
        }
    });
    weibo_url='/social_sensing/get_text_detail/?ts='+final_time+'&text_type='+text_type+'&order='+order;
    request(weibo_url);

}
//-----微博---


function weibo(data) {
    var data=eval(data);
    weibo_text(data);
}

function weibo_text(data){
    console.log(data)
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

                if (dataArray[i].length==1){
                    if (dataArray[i][0][1]==''||dataArray[i][0][1]=='unknown') {
                        name=dataArray[i][0][1];
                    }else {
                        name=dataArray[i][0][1];
                    };
                    if (dataArray[i][0][2]==''||dataArray[i][0][2]=='unknown') {
                        photo='/static/images/unknown.png';
                    }else {
                        photo=dataArray[i][0][2];
                    };
                    html_c = '<div class="weibo_explain">'+
                        '                <div class="weibo_detail_left">'+
                        '                    <img class="user_photo" src="'+photo+'">'+
                        '                </div>'+
                        '                <div class="weibo_detail_right">'+
                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][0][0]+'">'+name+'：</a>'+
                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][0][3]+
                        '                    </span>'+
                        '                    <div class="weibo_source">'+
                        '                        <span>'+dataArray[i][0][5]+'</span>'+
                        '                        <span>'+dataArray[i][0][6].replace(/&/g,' ')+'</span>'+
                        '                        <p class="weibo_operating" style="float: right">'+
                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i][0][8]+'）</span>'+
                        '                            <span>|</span>'+
                        '                            <span class="weibo_comment">评论数（'+dataArray[i][0][9]+'）</span>'+
                        '                        </p>'+
                        '                    </div>'+
                        '                </div>'+
                        '            </div>';
                }else {
                    var same_weibo=[];
                    for (var k=0;k<dataArray[i].length;k++){
                        if (dataArray[i][k][1]==''||dataArray[i][k][1]=='unknown') {
                            name=dataArray[i][k][1];
                        }else {
                            name=dataArray[i][k][1];
                        };
                        if (dataArray[i][k][2]==''||dataArray[i][k][2]=='unknown') {
                            photo='/static/images/unknown.png';
                        }else {
                            photo=dataArray[i][k][2];
                        };
                        if (k==0){
                            same_weibo.push(
                                html_c = '<div class="weibo_explain">'+
                                    '                <div class="weibo_detail_left">'+
                                    '                    <img class="user_photo" src="'+photo+'">'+
                                    '                </div>'+
                                    '                <div class="weibo_detail_right">'+
                                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][k][0]+'">'+name+'：</a>'+
                                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][k][3]+
                                    '                    </span>'+
                                    '                    <div class="weibo_source">'+
                                    '                        <span>'+dataArray[i][k][5]+'</span>'+
                                    '                        <span>'+dataArray[i][k][6].replace(/&/g,' ')+'</span>'+
                                    '                        <p class="weibo_operating" style="float: right">'+
                                    '                            <a class="same">相似微博'+(dataArray[i].length-1)+'条</a>'+
                                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i][k][8]+'）</span>'+
                                    '                            <span>|</span>'+
                                    '                            <span class="weibo_comment">评论数（'+dataArray[i][k][9]+'）</span>'+
                                    '                        </p>'+
                                    '                    </div>'+
                                    '                </div>'+
                                    '            </div>'
                            );
                        }else {
                            same_weibo.push(
                                html_c = '<div class="weibo_explain similar">'+
                                    '                <div class="weibo_detail_left">'+
                                    '                    <img class="user_photo" src="'+photo+'">'+
                                    '                </div>'+
                                    '                <div class="weibo_detail_right">'+
                                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][k][0]+'">'+name+'：</a>'+
                                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][k][3]+
                                    '                    </span>'+
                                    '                    <div class="weibo_source">'+
                                    '                        <span>'+dataArray[i][k][5]+'</span>'+
                                    '                        <span>'+dataArray[i][k][6].replace(/&/g,' ')+'</span>'+
                                    '                        <p class="weibo_operating" style="float: right">'+
                                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i][k][8]+'）</span>'+
                                    '                            <span>|</span>'+
                                    '                            <span class="weibo_comment">评论数（'+dataArray[i][k][9]+'）</span>'+
                                    '                        </p>'+
                                    '                    </div>'+
                                    '                </div>'+
                                    '            </div>'
                            );
                        }

                    }
                    html_c =same_weibo[0];
                }
                var s=1;
                $('.same').on('click',function () {
                    if (s==1){
                        $(this).parents('.weibo_explain').after(same_weibo.slice(1));
                        s=2;
                    }else {
                        $('.similar').slideUp(80);
                        s=1;
                    }

                });

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

                    if (dataArray[i].length==1){
                        if (dataArray[i][0][1]==''||dataArray[i][0][1]=='unknown') {
                            name=dataArray[i][0][1];
                        }else {
                            name=dataArray[i][0][1];
                        };
                        if (dataArray[i][0][2]==''||dataArray[i][0][2]=='unknown') {
                            photo='/static/images/unknown.png';
                        }else {
                            photo=dataArray[i][0][2];
                        };
                        html_c = '<div class="weibo_explain">'+
                            '                <div class="weibo_detail_left">'+
                            '                    <img class="user_photo" src="'+photo+'">'+
                            '                </div>'+
                            '                <div class="weibo_detail_right">'+
                            '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][0][0]+'">'+name+'：</a>'+
                            '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][0][3]+
                            '                    </span>'+
                            '                    <div class="weibo_source">'+
                            '                        <span>'+dataArray[i][0][5]+'</span>'+
                            '                        <span>'+dataArray[i][0][6].replace(/&/g,' ')+'</span>'+
                            '                        <p class="weibo_operating" style="float: right">'+
                            '                            <span class="weibo_forwarding">转发数（'+dataArray[i][0][8]+'）</span>'+
                            '                            <span>|</span>'+
                            '                            <span class="weibo_comment">评论数（'+dataArray[i][0][9]+'）</span>'+
                            '                        </p>'+
                            '                    </div>'+
                            '                </div>'+
                            '            </div>';
                    }else {
                        var same_weibo=[];
                        for (var k=0;k<dataArray[i].length;k++){
                            if (dataArray[i][k][1]==''||dataArray[i][k][1]=='unknown') {
                                name=dataArray[i][k][1];
                            }else {
                                name=dataArray[i][k][1];
                            };
                            if (dataArray[i][k][2]==''||dataArray[i][k][2]=='unknown') {
                                photo='/static/images/unknown.png';
                            }else {
                                photo=dataArray[i][k][2];
                            };
                            if (k==0){
                                same_weibo.push(
                                    html_c = '<div class="weibo_explain">'+
                                        '                <div class="weibo_detail_left">'+
                                        '                    <img class="user_photo" src="'+photo+'">'+
                                        '                </div>'+
                                        '                <div class="weibo_detail_right">'+
                                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][k][0]+'">'+name+'：</a>'+
                                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][k][3]+
                                        '                    </span>'+
                                        '                    <div class="weibo_source">'+
                                        '                        <span>'+dataArray[i][k][5]+'</span>'+
                                        '                        <span>'+dataArray[i][k][6].replace(/&/g,' ')+'</span>'+
                                        '                        <p class="weibo_operating" style="float: right">'+
                                        '                            <a class="same">相似微博'+(dataArray[i].length-1)+'条</a>'+
                                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i][k][8]+'）</span>'+
                                        '                            <span>|</span>'+
                                        '                            <span class="weibo_comment">评论数（'+dataArray[i][k][9]+'）</span>'+
                                        '                        </p>'+
                                        '                    </div>'+
                                        '                </div>'+
                                        '            </div>'
                                );
                            }else {
                                same_weibo.push(
                                    html_c = '<div class="weibo_explain similar">'+
                                        '                <div class="weibo_detail_left">'+
                                        '                    <img class="user_photo" src="'+photo+'">'+
                                        '                </div>'+
                                        '                <div class="weibo_detail_right">'+
                                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i][k][0]+'">'+name+'：</a>'+
                                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][k][3]+
                                        '                    </span>'+
                                        '                    <div class="weibo_source">'+
                                        '                        <span>'+dataArray[i][k][5]+'</span>'+
                                        '                        <span>'+dataArray[i][k][6].replace(/&/g,' ')+'</span>'+
                                        '                        <p class="weibo_operating" style="float: right">'+
                                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i][k][8]+'）</span>'+
                                        '                            <span>|</span>'+
                                        '                            <span class="weibo_comment">评论数（'+dataArray[i][k][9]+'）</span>'+
                                        '                        </p>'+
                                        '                    </div>'+
                                        '                </div>'+
                                        '            </div>'
                                );
                            }

                        }
                        html_c =same_weibo[0];
                    }
                    var s=1;
                    $('.same').on('click',function () {
                        if (s==1){
                            $(this).parents('.weibo_explain').after(same_weibo.slice(1));
                            s=2;
                        }else {
                            $('.similar').slideUp(80);
                            s=1;
                        }

                    });

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
                oTBody.rows[i].insertCell(0);
                var name,photo;

                if (dataArray[i+a].length==1){
                    if (dataArray[i+a][0][1]==''||dataArray[i+a][0][1]=='unknown') {
                        name=dataArray[i+a][0][1];
                    }else {
                        name=dataArray[i+a][0][1];
                    };
                    if (dataArray[i+a][0][2]==''||dataArray[i+a][0][2]=='unknown') {
                        photo='/static/images/unknown.png';
                    }else {
                        photo=dataArray[i+a][0][2];
                    };
                    html_c = '<div class="weibo_explain">'+
                        '                <div class="weibo_detail_left">'+
                        '                    <img class="user_photo" src="'+photo+'">'+
                        '                </div>'+
                        '                <div class="weibo_detail_right">'+
                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][0][0]+'">'+name+'：</a>'+
                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][0][3]+
                        '                    </span>'+
                        '                    <div class="weibo_source">'+
                        '                        <span>'+dataArray[i+a][0][5]+'</span>'+
                        '                        <span>'+dataArray[i+a][0][6].replace(/&/g,' ')+'</span>'+
                        '                        <p class="weibo_operating" style="float: right">'+
                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][0][8]+'）</span>'+
                        '                            <span>|</span>'+
                        '                            <span class="weibo_comment">评论数（'+dataArray[i+a][0][9]+'）</span>'+
                        '                        </p>'+
                        '                    </div>'+
                        '                </div>'+
                        '            </div>';
                }else {
                    var same_weibo=[];
                    for (var k=0;k<dataArray[i+a].length;k++){
                        if (dataArray[i+a][k][1]==''||dataArray[i+a][k][1]=='unknown') {
                            name=dataArray[i+a][k][1];
                        }else {
                            name=dataArray[i+a][k][1];
                        };
                        if (dataArray[i+a][k][2]==''||dataArray[i+a][k][2]=='unknown') {
                            photo='/static/images/unknown.png';
                        }else {
                            photo=dataArray[i+a][k][2];
                        };
                        if (k==0){
                            same_weibo.push(
                                html_c = '<div class="weibo_explain">'+
                                    '                <div class="weibo_detail_left">'+
                                    '                    <img class="user_photo" src="'+photo+'">'+
                                    '                </div>'+
                                    '                <div class="weibo_detail_right">'+
                                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][k][0]+'">'+name+'：</a>'+
                                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][k][3]+
                                    '                    </span>'+
                                    '                    <div class="weibo_source">'+
                                    '                        <span>'+dataArray[i+a][k][5]+'</span>'+
                                    '                        <span>'+dataArray[i+a][k][6].replace(/&/g,' ')+'</span>'+
                                    '                        <p class="weibo_operating" style="float: right">'+
                                    '                            <a class="same">相似微博'+(dataArray[i+a].length-1)+'条</a>'+
                                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][k][8]+'）</span>'+
                                    '                            <span>|</span>'+
                                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][k][9]+'）</span>'+
                                    '                        </p>'+
                                    '                    </div>'+
                                    '                </div>'+
                                    '            </div>'
                            );
                        }else {
                            same_weibo.push(
                                html_c = '<div class="weibo_explain similar">'+
                                    '                <div class="weibo_detail_left">'+
                                    '                    <img class="user_photo" src="'+photo+'">'+
                                    '                </div>'+
                                    '                <div class="weibo_detail_right">'+
                                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][k][0]+'">'+name+'：</a>'+
                                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][k][3]+
                                    '                    </span>'+
                                    '                    <div class="weibo_source">'+
                                    '                        <span>'+dataArray[i+a][k][5]+'</span>'+
                                    '                        <span>'+dataArray[i+a][k][6].replace(/&/g,' ')+'</span>'+
                                    '                        <p class="weibo_operating" style="float: right">'+
                                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][k][8]+'）</span>'+
                                    '                            <span>|</span>'+
                                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][k][9]+'）</span>'+
                                    '                        </p>'+
                                    '                    </div>'+
                                    '                </div>'+
                                    '            </div>'
                            );
                        }

                    }
                    html_c =same_weibo[0];
                }
                var s=1;
                $('.same').on('click',function () {
                    if (s==1){
                        $(this).parents('.weibo_explain').after(same_weibo.slice(1));
                        s=2;
                    }else {
                        $('.similar').slideUp(80);
                        s=1;
                    }

                });

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
                oTBody.rows[i].insertCell(0);
                var name,photo;

                if (dataArray[i+a].length==1){
                    if (dataArray[i+a][0][1]==''||dataArray[i+a][0][1]=='unknown') {
                        name=dataArray[i+a][0][1];
                    }else {
                        name=dataArray[i+a][0][1];
                    };
                    if (dataArray[i+a][0][2]==''||dataArray[i+a][0][2]=='unknown') {
                        photo='/static/images/unknown.png';
                    }else {
                        photo=dataArray[i+a][0][2];
                    };
                    html_c = '<div class="weibo_explain">'+
                        '                <div class="weibo_detail_left">'+
                        '                    <img class="user_photo" src="'+photo+'">'+
                        '                </div>'+
                        '                <div class="weibo_detail_right">'+
                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][0][0]+'">'+name+'：</a>'+
                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][0][3]+
                        '                    </span>'+
                        '                    <div class="weibo_source">'+
                        '                        <span>'+dataArray[i+a][0][5]+'</span>'+
                        '                        <span>'+dataArray[i+a][0][6].replace(/&/g,' ')+'</span>'+
                        '                        <p class="weibo_operating" style="float: right">'+
                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][0][8]+'）</span>'+
                        '                            <span>|</span>'+
                        '                            <span class="weibo_comment">评论数（'+dataArray[i+a][0][9]+'）</span>'+
                        '                        </p>'+
                        '                    </div>'+
                        '                </div>'+
                        '            </div>';
                }else {
                    var same_weibo=[];
                    for (var k=0;k<dataArray[i+a].length;k++){
                        if (dataArray[i+a][k][1]==''||dataArray[i+a][k][1]=='unknown') {
                            name=dataArray[i+a][k][1];
                        }else {
                            name=dataArray[i+a][k][1];
                        };
                        if (dataArray[i+a][k][2]==''||dataArray[i+a][k][2]=='unknown') {
                            photo='/static/images/unknown.png';
                        }else {
                            photo=dataArray[i+a][k][2];
                        };
                        if (k==0){
                            same_weibo.push(
                                html_c = '<div class="weibo_explain">'+
                                    '                <div class="weibo_detail_left">'+
                                    '                    <img class="user_photo" src="'+photo+'">'+
                                    '                </div>'+
                                    '                <div class="weibo_detail_right">'+
                                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][k][0]+'">'+name+'：</a>'+
                                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][k][3]+
                                    '                    </span>'+
                                    '                    <div class="weibo_source">'+
                                    '                        <span>'+dataArray[i+a][k][5]+'</span>'+
                                    '                        <span>'+dataArray[i+a][k][6].replace(/&/g,' ')+'</span>'+
                                    '                        <p class="weibo_operating" style="float: right">'+
                                    '                            <a class="same">相似微博'+(dataArray[i+a].length-1)+'条</a>'+
                                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][k][8]+'）</span>'+
                                    '                            <span>|</span>'+
                                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][k][9]+'）</span>'+
                                    '                        </p>'+
                                    '                    </div>'+
                                    '                </div>'+
                                    '            </div>'
                            );
                        }else {
                            same_weibo.push(
                                html_c = '<div class="weibo_explain similar">'+
                                    '                <div class="weibo_detail_left">'+
                                    '                    <img class="user_photo" src="'+photo+'">'+
                                    '                </div>'+
                                    '                <div class="weibo_detail_right">'+
                                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][k][0]+'">'+name+'：</a>'+
                                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][k][3]+
                                    '                    </span>'+
                                    '                    <div class="weibo_source">'+
                                    '                        <span>'+dataArray[i+a][k][5]+'</span>'+
                                    '                        <span>'+dataArray[i+a][k][6].replace(/&/g,' ')+'</span>'+
                                    '                        <p class="weibo_operating" style="float: right">'+
                                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][k][8]+'）</span>'+
                                    '                            <span>|</span>'+
                                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][k][9]+'）</span>'+
                                    '                        </p>'+
                                    '                    </div>'+
                                    '                </div>'+
                                    '            </div>'
                            );
                        }

                    }
                    html_c =same_weibo[0];
                }
                var s=1;
                $('.same').on('click',function () {
                    if (s==1){
                        $(this).parents('.weibo_explain').after(same_weibo.slice(1));
                        s=2;
                    }else {
                        $('.similar').slideUp(80);
                        s=1;
                    }

                });
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
            oTBody.rows[i].insertCell(0);
            var name,photo;

            if (dataArray[i+a].length==1){
                if (dataArray[i+a][0][1]==''||dataArray[i+a][0][1]=='unknown') {
                    name=dataArray[i+a][0][1];
                }else {
                    name=dataArray[i+a][0][1];
                };
                if (dataArray[i+a][0][2]==''||dataArray[i+a][0][2]=='unknown') {
                    photo='/static/images/unknown.png';
                }else {
                    photo=dataArray[i+a][0][2];
                };
                html_c = '<div class="weibo_explain">'+
                    '                <div class="weibo_detail_left">'+
                    '                    <img class="user_photo" src="'+photo+'">'+
                    '                </div>'+
                    '                <div class="weibo_detail_right">'+
                    '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][0][0]+'">'+name+'：</a>'+
                    '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][0][3]+
                    '                    </span>'+
                    '                    <div class="weibo_source">'+
                    '                        <span>'+dataArray[i+a][0][5]+'</span>'+
                    '                        <span>'+dataArray[i+a][0][6].replace(/&/g,' ')+'</span>'+
                    '                        <p class="weibo_operating" style="float: right">'+
                    '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][0][8]+'）</span>'+
                    '                            <span>|</span>'+
                    '                            <span class="weibo_comment">评论数（'+dataArray[i+a][0][9]+'）</span>'+
                    '                        </p>'+
                    '                    </div>'+
                    '                </div>'+
                    '            </div>';
            }else {
                var same_weibo=[];
                for (var k=0;k<dataArray[i+a].length;k++){
                    if (dataArray[i+a][k][1]==''||dataArray[i+a][k][1]=='unknown') {
                        name=dataArray[i+a][k][1];
                    }else {
                        name=dataArray[i+a][k][1];
                    };
                    if (dataArray[i+a][k][2]==''||dataArray[i+a][k][2]=='unknown') {
                        photo='/static/images/unknown.png';
                    }else {
                        photo=dataArray[i+a][k][2];
                    };
                    if (k==0){
                        same_weibo.push(
                            html_c = '<div class="weibo_explain">'+
                                '                <div class="weibo_detail_left">'+
                                '                    <img class="user_photo" src="'+photo+'">'+
                                '                </div>'+
                                '                <div class="weibo_detail_right">'+
                                '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][k][0]+'">'+name+'：</a>'+
                                '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][k][3]+
                                '                    </span>'+
                                '                    <div class="weibo_source">'+
                                '                        <span>'+dataArray[i+a][k][5]+'</span>'+
                                '                        <span>'+dataArray[i+a][k][6].replace(/&/g,' ')+'</span>'+
                                '                        <p class="weibo_operating" style="float: right">'+
                                '                            <a class="same">相似微博'+(dataArray[i+a].length-1)+'条</a>'+
                                '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][k][8]+'）</span>'+
                                '                            <span>|</span>'+
                                '                            <span class="weibo_comment">评论数（'+dataArray[i+a][k][9]+'）</span>'+
                                '                        </p>'+
                                '                    </div>'+
                                '                </div>'+
                                '            </div>'
                        );
                    }else {
                        same_weibo.push(
                            html_c = '<div class="weibo_explain similar">'+
                                '                <div class="weibo_detail_left">'+
                                '                    <img class="user_photo" src="'+photo+'">'+
                                '                </div>'+
                                '                <div class="weibo_detail_right">'+
                                '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i+a][k][0]+'">'+name+'：</a>'+
                                '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i+a][k][3]+
                                '                    </span>'+
                                '                    <div class="weibo_source">'+
                                '                        <span>'+dataArray[i+a][k][5]+'</span>'+
                                '                        <span>'+dataArray[i+a][k][6].replace(/&/g,' ')+'</span>'+
                                '                        <p class="weibo_operating" style="float: right">'+
                                '                            <span class="weibo_forwarding">转发数（'+dataArray[i+a][k][8]+'）</span>'+
                                '                            <span>|</span>'+
                                '                            <span class="weibo_comment">评论数（'+dataArray[i+a][k][9]+'）</span>'+
                                '                        </p>'+
                                '                    </div>'+
                                '                </div>'+
                                '            </div>'
                        );
                    }

                }
                html_c =same_weibo[0];
            }
            var s=1;
            $('.same').on('click',function () {
                if (s==1){
                    $(this).parents('.weibo_explain').after(same_weibo.slice(1));
                    s=2;
                }else {
                    $('.similar').slideUp(80);
                    s=1;
                }

            });
            oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    }

}


