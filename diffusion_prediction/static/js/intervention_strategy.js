/**
 * Created by Administrator on 2017/3/17.
 */

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});


//传播路径
function critical_path_task(data) {
    var data=eval(data);

    var data_uids = data[0];
    var data_info = data[1];
    $('#start_end').bootstrapTable('load',data_uids);
    $('#start_end').bootstrapTable({
        data:data_uids,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        // showRefresh: true,//刷新按钮
        // showColumns: true,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            // {
            //     title: "全选",
            //     field: "select",
            //     checkbox: true,
            //     align: "center",//水平
            //     valign: "middle"//垂直
            // },
            {
                title: "起点用户",//标题
                field: "root_uid",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    // console.log(!(value in data_info));
                    if(!(value in data_info)){
                        photo_img = '../../static/images/photo_unknown.png';
                    }
                    else {
                        user_inf = data_info[value];
                        photo_img = user_inf.photo_url;
                        if(!photo_img){
                            photo_img = '../../static/images/photo_unknown.png';
                        }
                        
                    }
                    
                    return '<img src="'+photo_img+'" height="50" width="50" title="uid:'+value+'">'
                    
                },
            },
            {
                title: "终点用户",//标题
                field: "uid_list",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:650,
                formatter: function (value, row, index) {
                    var html = '';  
                    // console.log(value[0])
                    for (var k=0;k<value.length;k++){
                        uid = value[k];
                       
                       if(!(uid in data_info)){
                            photo_img = '../../static/images/photo_unknown.png';
                       }else {
                            user_inf = data_info[uid];
                            console.log(user_inf);
                            photo_img = user_inf.photo_url;
                            if(!photo_img){
                                photo_img = '../../static/images/photo_unknown.png';
                            }
                       }
                        html += '<img src="'+photo_img+'" height="50" width="50" title="uid:'+uid+'">';
                    }
                    return html
                },
            },

        ],

    });
}

function critical_path_task_new(data){
    // console.log(data);
    var nodes_data = [];
    var links_data = [];
    for(var root_uid in data){
        uid_lists = data[root_uid]
        for(var i=0;i<uid_lists.length;i++ ){
            nodes_data.push({category:0,name:root_uid,symbolSize:20});
            nodes_data.push({category:1,name:uid_lists[i],symbolSize:20});
            links_data.push({source : root_uid, target : uid_lists[i], weight : 5});
        }
    }
   

    var myChart = echarts.init(document.getElementById('start_end'));
    
    require(
        [
            'echarts',
             // 'echarts/chart/force', // 使用柱状图就加载bar模块，按需加载
            // 'echarts/chart/chord' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
                
                var ecConfig = require('echarts/config'); //放进require里的function{}里面
                var zrEvent = require('zrender/tool/event');


                var option = {
                    // title : {
                    //     text: '传播路径图',
                    //     // subtext: '数据来自人立方',
                    //     x:'right',
                    //     y:'top'
                    // },
                    tooltip : {
                        trigger: 'item',
                        formatter: '{a} : {b}'
                    },
                    toolbox: {
                        show : true,
                        feature : {
//                            restore : {show: true},
//                            magicType: {show: true, type: ['force', 'chord']},
                            saveAsImage : {show: true}
                        }
                    },
                    legend: {
                        x: 'left',
                        data:['已参与用户','未参与用户'],
                        itemWidth:30,
                        itemHeight:20

                    },
                    series : [
                        {
                            type:'force',
                            name : "传播",
                            ribbonType: false,
                            categories : [
                                {
                                    name: '已参与用户'
                                },
                                {
                                    name: '未参与用户',
                                    symbol: 'diamond'
                                }
                            ],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#333'
                                        }
                                    },
                                    nodeStyle : {
                                        brushType : 'both',
                                        borderColor : 'rgba(255,215,0,0.4)',
                                        borderWidth : 1
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false,
                                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    nodeStyle : {
                                        //r: 30
                                    },
                                    linkStyle : {}
                                }
                            },
                            minRadius : 10,
                            maxRadius : 55,
                            gravity: 3,
                            scaling: 3,
                            draggable: true,
                            linkSymbol: 'arrow',
                            steps: 10,
                            coolDown: 0.9,
                            
                            //preventOverlap: true,
                            nodes:nodes_data,
                            links : links_data
                        }
                    ]
                };

                myChart.setOption(option);

                 // var ecConfig = require('echarts/config');

                function focus(param) {
                    var data = param.data;
                    var links = option.series[0].links;
                    var nodes = option.series[0].nodes;
                    if (
                        data.source != null
                        && data.target != null
                    ) { //点击的是边
                        var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                        var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
//                        console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
                    } else { // 点击的是点
//                        console.log("选中了" + data.name + '(' + data.value + ')');
                    }
                }
                myChart.on(ecConfig.EVENT.CLICK, focus)

                myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
//                    console.log(myChart.chart.force.getPosition());
                });
        }
    )
    
                        
}


function critical_path_task_outter(){
    var critical_path_url='/interfere/get_diffusion_path/?task_name='+task_name+'&update_time='+update_time;
    $.ajax({
        url: critical_path_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:critical_path_task_new
    });
}

critical_path_task_outter();

//---------完

//--潜在关键用户
function potential_users_task(data) {
    var data=eval(data);
    // console.log(data);
    data_list = new Array();
    for(var k=0;k<data.length;k++){
        var data_dic = new Object();
        data_dic.uid = data[k][0];
        data_dic.uname = data[k][1];
        data_dic.photo_url = data[k][2];
        data_dic.fans = data[k][3];
        data_dic.atten_num = data[k][4];
        data_dic.weibo_num = data[k][5];
        // console.log(data_dic);
        data_list.push(data_dic);
    }
    $('#user').bootstrapTable('load',data_list);
    $('#user').bootstrapTable({
        data:data_list,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        // showRefresh: true,//刷新按钮
        // showColumns: true,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
//            {
//                title: "全选",
//                field: "select",
//                checkbox: true,
//                align: "center",//水平
//                valign: "middle"//垂直
//            },
            {
                title: "头像",//标题
                field: "photo_url",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if(!value){
                        value = '../../static/images/photo_unknown.png'
                    }
                    return '<img src="'+value+'" height="50" width="50">'
                    
                },
            },
            {
                title: "用户昵称",//标题
                field: "uname",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width: 200,
            },
            {
                title: "用户uid",//标题
                field: "uid",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                
            },
           
            {
                title: "粉丝数",//标题
                field: "fans",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:150,
               
            },
            {
                title: "关注数",//标题
                field: "atten_num",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:150,

            
            },
            {
                title: "微博数",//标题
                field: "weibo_num",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:150,

              
            },
           

        ],
    });
}

function potential_users_task_outter(){
    var potential_users_url='/interfere/get_future_user_info/?task_name='+task_name+'&update_time='+update_time;
    $.ajax({
        url: potential_users_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:potential_users_task
    });
}

potential_users_task_outter();

//-----完

var sort_item = 'poten';

//--潜在热门微博
function potential_weibo_outter(){
    var potential_weibo_url='/interfere/get_potential_hot_weibo/?task_name='+task_name+'&update_time='+update_time+'&sort_item='+sort_item;
    $.ajax({
        url: potential_weibo_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:potential_weibo_new
    });

}

var no_page_poten = 0;
var blog_num_max_local_poten = 0;

//排序

function set_order_type_poten(type){
    sort_item = type;
    potential_weibo_outter();

}


//上一页
function up_poten(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_poten==0){
         alert("当前已经是第一页!");
         return false;
     }else{
        no_page_poten--;
        
        potential_weibo_outter();
        
     }
}


//下一页
function down_poten(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_poten==Math.min(9,Math.ceil(blog_num_max_local_poten/10)-1)){
         alert("当前已经是最后一页!");
        
         return false;
     }else{
        no_page_poten++;
        
        potential_weibo_outter();
        
     }
}


function potential_weibo_new(data){
    console.log(data);
    data=eval(data);
    
    $('#blog_scan_area_poten').empty();
    // document.getElementById("blog_time").parentNode.removeChild(document.getElementById("blog_time"));
    // console.log(data_sort);
    var item = data;
    var html = '';
        //var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
        //key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        //console.log(data.length);
        

    if (!item){
        html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 40%;">呀，暂时还没有数据喔~</p></div>'
    }else{
        var blog_num_max_local_poten = Math.min(100,item.length);

        blog_num_max_global_poten = blog_num_max_local_poten;

        var num_page = Math.ceil(blog_num_max_local_poten/10);  //num_page表示微博数据共有多少页
        var item_i_time = no_page_poten*10;
        
        var max_i_time = item_i_time+Math.min(10,blog_num_max_local_poten-item_i_time);
        
        for (i=item_i_time; i<max_i_time; i++){

            if (item[i].photo_url=='unknown' || !item[i].photo_url){
                item[i].photo_url='../../static/images/photo_unknown.png'
            }
            if (item[i].uname=='unknown' || !item[i].uname){
                item[i].uname=item[i].uid
                //console.log(item[i].uname);
            }
            var item_timestamp_datetime = new Date(parseInt(item[i].timestamp) * 1000).toLocaleString();
            // var item_timestamp_datetime = format(parseInt(item[i].timestamp).formate_data_time);
            
            html += '<div class="blog_time" id="blog_time">';
            //html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
            html += '<div><img class="img-circle" src="'+item[i].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>';
            html += '<div>';
            //html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
            html += '<a target="_blank" href="/index/viewinformation/?uid='+item[i].uid+'" class="user_name" style="top:5px;left:10px;">'+item[i].uname+'</a>';
            //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
            //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
            html += '</div>';
            html += '<div class="blog_text">'
            //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
            html += '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+item[i].text+'</font></p>';
            html += '<p style="margin:20px 0;font-family: Microsoft YaHei;">';
            //html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
            //html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
            html += '<span style="display: inline-block;">'+item_timestamp_datetime+'</span>';
            html += '<span style="display:inline-block;margin-left:400px;">评论数('+item[i].comment+')&nbsp;|&nbsp;</span>';
            html += '<span>转发数('+item[i].retweeted+')&nbsp;|&nbsp;</span>';
            html += '<span>当前参与量('+item[i].current_count+')&nbsp;|&nbsp;</span>';
            //html += '<span id="oule" style="margin-top: -3%;display: inline-block;margin-left: 54%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;&nbsp;&nbsp;|</span>';
            html += '<span>&nbsp;未来参与量('+item[i].prediction_count+')</span>';
            //html += '<span style="margin-top: -3%;display: inline-block;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
            //html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
            html += '</p>';
            html += '</div>';                       
            html += '</div>';
        // }
        }
           html += '<div id="PageTurn" class="pager">'
           html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
           html += '</div>'


    }
    
    $('#blog_scan_area_poten').append(html);
}
//---完

//--当前热门微博
function current_weibo_outter(){
    // task_name = '毛泽东诞辰纪念日';
    var current_weibo_url='/interfere/get_current_hot_weibo/?task_name='+task_name+'&update_time='+update_time+'&sort_item='+sort_item_curren;
    $.ajax({
        url: current_weibo_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:current_weibo_new
    });

}

var no_page_time = 0;
var blog_num_max_global_time = 0;

var sort_item_curren = 'time';
//排序
function set_order_type_time(type){
    
    sort_item_curren = type;
    current_weibo_outter();
}


//上一页
function up_time(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_time==0){
         alert("当前已经是第一页!");
         return false;
     }else{
        no_page_time--;
        
        current_weibo_outter();
        
     }
}


//下一页
function down_time(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_time==Math.min(9,Math.ceil(blog_num_max_global_time/10)-1)){
         alert("当前已经是最后一页!");
        
         return false;
     }else{
        no_page_time++;
        
        current_weibo_outter();
        
     }
}


function current_weibo_new(data){
    console.log(data);
    $('#blog_scan_area_time').empty();
    // document.getElementById("blog_time").parentNode.removeChild(document.getElementById("blog_time"));
    // if(sort_item == 'time'){
    //     data_sort = sorted(data_new, key = lambda x:x["timestamp"],reverse=false)
    // }else if(sort_item == 'hot'){
    //     data_sort = sorted(data_new, key = lambda x:x["retweeted"],reverse=false)    
    // }
    var item = data;
    var html = '';
        //var key_datetime = new Date(key*1000).format('yyyy/MM/dd hh:mm');
        //key_datetime = new Date(parseInt(key) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        //console.log(data.length);
        

    if (!item){
        html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 40%;">呀，暂时还没有数据喔~</p></div>'
    }else{
        var blog_num_max_local_time = Math.min(100,item.length);

        blog_num_max_global_time = blog_num_max_local_time;

        var num_page = Math.ceil(blog_num_max_local_time/10);  //num_page表示微博数据共有多少页
        var item_i_time = no_page_time*10;
        
        var max_i_time = item_i_time+Math.min(10,blog_num_max_local_time-item_i_time);
        
        for (i=item_i_time; i<max_i_time; i++){

            if (item[i].photo_url=='unknown' || !item[i].photo_url){
                item[i].photo_url='../../static/images/photo_unknown.png'
            }
            if (item[i].uname=='unknown' || !item[i].uname){
                item[i].uname=item[i].uid
                //console.log(item[i].uname);
            }
            var item_timestamp_datetime = new Date(parseInt(item[i].timestamp) * 1000).toLocaleString();
            // var item_timestamp_datetime = format(parseInt(item[i].timestamp).formate_data_time);
            
            html += '<div class="blog_time" id="blog_time">';
            //html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
            html += '<div><img class="img-circle" src="'+item[i].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>';
            html += '<div>';
            //html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
            html += '<a target="_blank" href="/index/viewinformation/?uid='+item[i].uid+'" class="user_name" style="top:5px;left:10px;">'+item[i].uname+'</a>';
            //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
            //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
            html += '</div>';
            html += '<div class="blog_text">'
            //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
            html += '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+item[i].text+'</font></p>';
            html += '<p style="margin:20px 0;font-family: Microsoft YaHei;">';
            //html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
            //html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
            html += '<span style="display: inline-block;">'+item_timestamp_datetime+'</span>';
            html += '<span style="display:inline-block;margin-left:500px;">转发数('+item[i].retweet+')&nbsp;|&nbsp;</span>';
            //html += '<span id="oule" style="margin-top: -3%;display: inline-block;margin-left: 54%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;&nbsp;&nbsp;|</span>';
            html += '<span">评论数('+item[i].comment+')</span>';
            //html += '<span style="margin-top: -3%;display: inline-block;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
            //html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
            html += '</p>';
            html += '</div>';                       
            html += '</div>';
        // }
        }
           html += '<div id="PageTurn" class="pager">'
           html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
           html += '</div>'


    }
    
    $('#blog_scan_area_time').append(html);
}




//---完


current_weibo_outter();
potential_weibo_outter();

