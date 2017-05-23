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
                            gravity: 1,
                            scaling: 1.4,
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

//传播路径表格
function critical_path_table(){
    var critical_table_url='/interfere/key_user/?task_name='+task_name+'&update_time='+update_time;
    $.ajax({
        url: critical_table_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:critical_path_task_table
    });
}
var uname_uid={};
function critical_path_task_table(data) {
    var data_table=[];
    for (var d=0;d<data.length;d++){
        data_table.push(
            {'name1':data[d][1],'uid1':data[d][0],'fansnum':data[d][2],
             'influe':data[d][3],'weibo':data[d][4]}
        );
        uname_uid[data[d][0]]=data[d][5];
    }
    $('#start_end_table').bootstrapTable('load',data_table);
    $('#start_end_table').bootstrapTable({
        data:data_table,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        // showRefresh: true,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "昵称",//标题
                field: "name1",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if(row.name1==''||row.name1=='null'||row.name1=='unknown'){
                        return row.uid1;
                    }else {
                        return row.name1;
                    }
                }
            },
            {
                title: "UID",//标题
                field: "uid1",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "粉丝数",//标题
                field: "fansnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                  formatter: function (value, row, index) {
                   if(row.fansnum==''||row.fansnum=='null'||row.fansnum=='unknown'){
                        return 0;
                    }else {
                        return row.fansnum;
                    }
                  },


            },
            {
                title: "影响力人数",//标题
                field: "influe",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                if(row.influe==''||row.influe=='null'||row.influe=='unknown'){
                        return 0;
                    }else {
                         return '<a style="cursor: pointer;" onclick="user_list(\''+row.uid1+'\',\''+row.name1+'\')">'+value+'</a>';
                    }

                },
            },
            {
                title: "微博数量",//标题
                field: "weibo",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                 formatter: function (value, row, index) {
                     if(row.weibo==''||row.weibo=='null'||row.weibo=='unknown'){
                        return 0;
                    }else {
                        return row.weibo;
                    }
                 },

            },

        ],

    });

}
critical_path_table();
function user_list(id,name) {
    var person=[];
    var user1=uname_uid[id];
    for (var a=0;a<user1.length;a++){
        person.push(
            {'name1':name,'uid1':id,'fansnum':user1[a].fansnum,'name2':user1[a].nick_name,
             'uid2':user1[a].uid,'weibo':user1[a].retweeted}
        )
    }
    $('#user_list').bootstrapTable('load',person);
    $('#user_list').bootstrapTable({
        data:person,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        // showRefresh: true,//刷新按钮
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "昵称",//标题
                field: "name1",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if(row.name1==''||row.name1=='null'||row.name1=='unknown'){
                        return row.uid1;
                    }else {
                        return row.name1;
                    }
                }
            },
            {
                title: "UID",//标题
                field: "uid1",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "",//标题
                field: "",//键名
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return '<img src="/static/images/arrow_geo.png" style="width:40px;height:40px;"/>';
                },
            },
            {
                title: "昵称",//标题
                field: "name2",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if(row.name2==''||row.name2=='null'||row.name2=='unknown'){
                        return row.uid2;
                    }else {
                        return row.name2;
                    }
                }
            },
            {
                title: "UID",//标题
                field: "uid2",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            },
            {
                title: "粉丝数",//标题
                field: "fansnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if(row.fansnum==''||row.fansnum=='null'||row.fansnum=='unknown'){
                        return 0;
                    }else {
                        return row.fansnum;
                    }
                }
            },
            {
                title: "微博转发数",//标题
                field: "weibo",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if(row.weibo==''||row.weibo=='null'||row.weibo=='unknown'){
                        return 0;
                    }else {
                        return Math.ceil(row.weibo);
                    }
                }
            },

        ],

    });
    $('#people').modal('show');
}

//-------完



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
                formatter: function (value, row, index) {
                    if(value==''||value=='unknown'||value=='null'){
                       return row.uid;
                    }else{
                        return row.uname;
                    }
                },
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
                formatter: function (value, row, index) {
                    if(value==''||value=='unknown'||value=='null'){
                       return 0;
                    }else{
                        return row.fans;
                    }
                },
            },
            {
                title: "关注数",//标题
                field: "atten_num",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                 formatter: function (value, row, index) {
                    if(value==''||value=='unknown'||value=='null'){
                       return 0;
                    }else{
                        return row.atten_num;
                    }
                },
            
            },
            {
                title: "预计被转发次数",//标题
                field: "weibo_num",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                 formatter: function (value, row, index) {
                    if(value==''||value=='unknown'||value=='null'){
                       return 0;
                    }else{
                        return row.weibo_num;
                    }
                },
              
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

//排序

function set_order_type_poten(type){
    sort_item = type;
    potential_weibo_outter();

}

function potential_weibo_new(data){
    var hot_array=data;
//    var hot_array=[];
//    for (var key in data){
//        var user={};
//        for (var u in data[key]){
//            if (u=='user_profile'){
//                for (var a=0;a<data[key][u].length;a++){
//                    user['uid']=key;
//                    user['uname']=data[key][u][a][0];
//                    user['photo_url']=data[key][u][a][1];
//                }
//            }else {
//                user['timestamp']=data[key][u].timestamp;
//                user['text']=data[key][u].text;
//                user['comment']=data[key][u].comment;
//                user['retweeted']=data[key][u].retweeted;
//                user['current_count']=data[key][u].current_count;
//                user['prediction_count']=data[key][u].prediction_count;
//            }
//        }
//        hot_array.push(user);
//    }
    $('#group_emotion_loading2').css('display', 'none');
    $('#input-table2').show();
    var dataArray = hot_array;
    $('#Pagenums2').text(dataArray.length);
    var PageNo=document.getElementById('PageNo2');                   //设置每页显示行数
    var InTb=document.getElementById('input-table2');               //表格
    var Fp=document.getElementById('F-page2');                      //首页
    var Nep=document.getElementById('Nex-page2');                  //下一页
    var Prp=document.getElementById('Pre-page2');                  //上一页
    var Lp=document.getElementById('L-page2');                     //尾页
    var S1=document.getElementById('s12');                         //总页数
    var S2=document.getElementById('s22');                         //当前页数
    var currentPage;                                              //定义变量表示当前页数
    var SumPage;

    if(PageNo.innerText!="")                                       //判断每页显示是否为空
    {
        InTb.innerHTML='';                                     //每次进来都清空表格
        S2.innerHTML='';                                        //每次进来清空当前页数
        currentPage=1;                                          //首页为1
        S2.appendChild(document.createTextNode(currentPage));
        S1.innerHTML='';                                        //每次进来清空总页数
        if(dataArray.length%PageNo.innerText==0)                    //判断总的页数
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        var oTBody=document.createElement('tbody');               //创建tbody
        oTBody.setAttribute('class','In-table');                   //定义class
        InTb.appendChild(oTBody);
        //将创建的tbody添加入table
        var html_c = '';
        if(dataArray==''){
            html_c = "<p style='width:1000px;text-align: center'>用户未发布任何微博</p>";
            oTBody.innerHTML = html_c;
        }else{

            for(i=0;i<parseInt(PageNo.innerText);i++)
            {                                                          //循环打印数组值
                oTBody.insertRow(i);
                //--判断内容
                if (dataArray[i].photo_url=='unknown' || !dataArray[i].photo_url){
                    dataArray[i].photo_url='../../static/images/photo_unknown.png';
                }
                if (dataArray[i].uname=='unknown' || !dataArray[i].uname){
                    dataArray[i].uname=dataArray[i].uid;
                }
                var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
                    '<div><img class="img-circle" src="'+dataArray[i].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                    '<div>'+
                    '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i].uname+'</a>'+
                    '</div>'+
                    '<div class="blog_text">'+
                    '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i].text+'</font></p>'+
                    '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                    '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                    '<span style="display:inline-block;margin-left:410px;">评论数('+dataArray[i].comment+')&nbsp;|&nbsp;</span>'+
                    '<span>转发数('+dataArray[i].retweeted+')&nbsp;|&nbsp;</span>'+
                    '<span>当前参与量('+dataArray[i].current_count+')&nbsp;|&nbsp;</span>'+
                    '<span>&nbsp;未来参与量('+dataArray[i].prediction_count+')</span>'+
                    '</p>'+
                    '</div>'+
                    '</div>';
                oTBody.rows[i].insertCell(0);
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }

        }
    };

    Fp.onclick=function()
    {

        if(PageNo.innerText!="")                                       //判断每页显示是否为空
        {
            InTb.innerHTML='';                                     //每次进来都清空表格
            S2.innerHTML='';                                        //每次进来清空当前页数
            currentPage=1;                                          //首页为1
            S2.appendChild(document.createTextNode(currentPage));
            S1.innerHTML='';                                        //每次进来清空总页数
            if(dataArray.length%PageNo.innerText==0)                    //判断总的页数
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            var oTBody=document.createElement('tbody');               //创建tbody
            oTBody.setAttribute('class','In-table');                   //定义class
            InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
            var html_c = '';

            if(dataArray==''){
                html_c = "<p style='width:1000px;text-align: center'>用户未发布任何微博</p>";
                oTBody.rows[0].cells[0].innerHTML = html_c;
            }else{

                for(i=0;i<parseInt(PageNo.innerText);i++)
                {                                                          //循环打印数组值
                    oTBody.insertRow(i);
                    //---判断内容
                    if (dataArray[i].photo_url=='unknown' || !dataArray[i].photo_url){
                        dataArray[i].photo_url='../../static/images/photo_unknown.png';
                    }
                    if (dataArray[i].uname=='unknown' || !dataArray[i].uname){
                        dataArray[i].uname=dataArray[i].uid;
                    }
                    var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i].timestamp) * 1000).toLocaleString();
                    html_c = '<div class="blog_time" id="blog_time">'+
                        '<div><img class="img-circle" src="'+dataArray[i].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                        '<div>'+
                        '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i].uname+'</a>'+
                        '</div>'+
                        '<div class="blog_text">'+
                        '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i].text+'</font></p>'+
                        '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                        '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                        '<span style="display:inline-block;margin-left:410px;">评论数('+dataArray[i].comment+')&nbsp;|&nbsp;</span>'+
                        '<span>转发数('+dataArray[i].retweeted+')&nbsp;|&nbsp;</span>'+
                        '<span>当前参与量('+dataArray[i].current_count+')&nbsp;|&nbsp;</span>'+
                        '<span>&nbsp;未来参与量('+dataArray[i].prediction_count+')</span>'+
                        '</p>'+
                        '</div>'+
                        '</div>';
                    oTBody.rows[i].insertCell(0);
                    oTBody.rows[i].cells[0].innerHTML = html_c;
                }
            }
        }
    };

    Nep.onclick=function()
    {
        if(currentPage<SumPage)                                 //判断当前页数小于总页数
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.innerText==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage+1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;                                                 //定义变量a
            a=PageNo.innerText*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
            var c;                                                  //定义变量c
            if(dataArray.length-a>=PageNo.innerText)                  //判断下一页数组数据是否小于每页显示行数
            {
                c=PageNo.innerText;
            }
            else
            {
                c=dataArray.length-a;
            }
            for(i=0;i<c;i++)
            {
                oTBody.insertRow(i);
                //--判断内容（次数循环是 i+a）
                if (dataArray[i+a].photo_url=='unknown' || !dataArray[i+a].photo_url){
                    dataArray[i].photo_url='../../static/images/photo_unknown.png';
                }
                if (dataArray[i+a].uname=='unknown' || !dataArray[i+a].uname){
                    dataArray[i+a].uname=dataArray[i+a].uid;
                }
                //---判断结束
                oTBody.rows[i].insertCell(0);

                var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i+a].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
                    '<div><img class="img-circle" src="'+dataArray[i+a].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                    '<div>'+
                    '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i+a].uname+'</a>'+
                    '</div>'+
                    '<div class="blog_text">'+
                    '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a].text+'</font></p>'+
                    '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                    '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                    '<span style="display:inline-block;margin-left:410px;">评论数('+dataArray[i+a].comment+')&nbsp;|&nbsp;</span>'+
                    '<span>转发数('+dataArray[i+a].retweeted+')&nbsp;|&nbsp;</span>'+
                    '<span>当前参与量('+dataArray[i+a].current_count+')&nbsp;|&nbsp;</span>'+
                    '<span>&nbsp;未来参与量('+dataArray[i+a].prediction_count+')</span>'+
                    '</p>'+
                    '</div>'+
                    '</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
                //数组从第i+a开始取值
            }
        }
    };

    Prp.onclick=function()
    {
        if(currentPage>1)                        //判断当前是否在第一页
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.innerText==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage-1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;
            a=PageNo.innerText*(currentPage-1);
            for(i=0;i<parseInt(PageNo.innerText);i++)
            {
                oTBody.insertRow(i);
                //--判断内容（次数循环是 i+a）
                if (dataArray[i+a].photo_url=='unknown' || !dataArray[i+a].photo_url){
                    dataArray[i+a].photo_url='../../static/images/photo_unknown.png';
                }
                if (dataArray[i+a].uname=='unknown' || !dataArray[i+a].uname){
                    dataArray[i+a].uname=dataArray[i+a].uid;
                }
                //---判断结束
                oTBody.rows[i].insertCell(0);
                var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i+a].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
                    '<div><img class="img-circle" src="'+dataArray[i+a].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                    '<div>'+
                    '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i+a].uname+'</a>'+
                    '</div>'+
                    '<div class="blog_text">'+
                '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a].text+'</font></p>'+
                '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                '<span style="display:inline-block;margin-left:410px;">评论数('+dataArray[i+a].comment+')&nbsp;|&nbsp;</span>'+
                '<span>转发数('+dataArray[i+a].retweeted+')&nbsp;|&nbsp;</span>'+
                '<span>当前参与量('+dataArray[i+a].current_count+')&nbsp;|&nbsp;</span>'+
                '<span>&nbsp;未来参与量('+dataArray[i+a].prediction_count+')</span>'+
                '</p>'+
                '</div>'+
                '</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    };

    Lp.onclick=function()
    {
        InTb.innerHTML='';
        S1.innerHTML='';
        if(dataArray.length%PageNo.innerText==0)
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        S2.innerHTML='';
        currentPage=SumPage;
        S2.appendChild(document.createTextNode(currentPage));
        var oTBody=document.createElement('tbody');
        oTBody.setAttribute('class','In-table');
        InTb.appendChild(oTBody);
        var a;
        a=PageNo.innerText*(currentPage-1);
        var c;
        if(dataArray.length-a>=PageNo.innerText)
        {
            c=PageNo.innerText;
        }
        else
        {
            c=dataArray.length-a;
        }
        for(i=0;i<c;i++)
        {
            oTBody.insertRow(i);
            //--判断内容（次数循环是 i+a）
            if (dataArray[i+a].photo_url=='unknown' || !dataArray[i+a].photo_url){
                dataArray[i+a].photo_url='../../static/images/photo_unknown.png';
            }
            if (dataArray[i+a].uname=='unknown' || !dataArray[i+a].uname){
                dataArray[i+a].uname=dataArray[i+a].uid;
            }
            //---判断结束
            oTBody.rows[i].insertCell(0);
            var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i+a].timestamp) * 1000).toLocaleString();
            html_c = '<div class="blog_time" id="blog_time">'+
                '<div><img class="img-circle" src="'+dataArray[i+a].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                '<div>'+
                '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i+a].uname+'</a>'+
                '</div>'+
                '<div class="blog_text">'+
            '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a].text+'</font></p>'+
            '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
            '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
            '<span style="display:inline-block;margin-left:410px;">评论数('+dataArray[i+a].comment+')&nbsp;|&nbsp;</span>'+
            '<span>转发数('+dataArray[i+a].retweeted+')&nbsp;|&nbsp;</span>'+
            '<span>当前参与量('+dataArray[i+a].current_count+')&nbsp;|&nbsp;</span>'+
            '<span>&nbsp;未来参与量('+dataArray[i+a].prediction_count+')</span>'+
            '</p>'+
            '</div>'+
            '</div>';
            oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    };

};
//---完


//--当前热门微博
function current_weibo_outter(){
    var current_weibo_url='/interfere/get_current_hot_weibo/?task_name='+task_name+'&update_time='+update_time+'&sort_item='+sort_item_curren;
    $.ajax({
        url: current_weibo_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:Draw_weibo_table//current_weibo_new
    });

};

var sort_item_curren = 'time';
//排序
function set_order_type_time(type){
    
    sort_item_curren = type;
    current_weibo_outter();
};

function Draw_weibo_table(data){
    $('#group_emotion_loading').css('display', 'none');
    $('#input-table').show();
    var dataArray = data;
    $('#Pagenums').text(dataArray.length);
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

    if(PageNo.innerText!="")                                       //判断每页显示是否为空
    {
        InTb.innerHTML='';                                     //每次进来都清空表格
        S2.innerHTML='';                                        //每次进来清空当前页数
        currentPage=1;                                          //首页为1
        S2.appendChild(document.createTextNode(currentPage));
        S1.innerHTML='';                                        //每次进来清空总页数
        if(dataArray.length%PageNo.innerText==0)                    //判断总的页数
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        var oTBody=document.createElement('tbody');               //创建tbody
        oTBody.setAttribute('class','In-table');                   //定义class
        InTb.appendChild(oTBody);
        //将创建的tbody添加入table
        var html_c = '';
        if(dataArray==''){
            html_c = "<p style='width:1000px;text-align: center'>用户未发布任何微博</p>";
            oTBody.innerHTML = html_c;
        }else{

            for(i=0;i<parseInt(PageNo.innerText);i++)
            {                                                          //循环打印数组值
                oTBody.insertRow(i);
                //--判断内容
                if (dataArray[i].photo_url=='unknown' || !dataArray[i].photo_url){
                    dataArray[i].photo_url='../../static/images/photo_unknown.png';
                }
                if (dataArray[i].uname=='unknown' || !dataArray[i].uname){
                    dataArray[i].uname=dataArray[i].uid;
                }
                var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
                    '<div><img class="img-circle" src="'+dataArray[i].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                    '<div>'+
                    '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i].uname+'</a>'+
                    '</div>'+
                    '<div class="blog_text">'+
                    '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i].text+'</font></p>'+
                    '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                    '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                    '<span style="display:inline-block;margin-left:570px;">转发数('+dataArray[i].retweet+')&nbsp;|&nbsp;</span>'+
                    '<span">评论数('+dataArray[i].comment+')</span>'+
                    '</p>'+
                    '</div>'+
                    '</div>';
                oTBody.rows[i].insertCell(0);
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }

        }
    }

    Fp.onclick=function()
    {

        if(PageNo.innerText!="")                                       //判断每页显示是否为空
        {
            InTb.innerHTML='';                                     //每次进来都清空表格
            S2.innerHTML='';                                        //每次进来清空当前页数
            currentPage=1;                                          //首页为1
            S2.appendChild(document.createTextNode(currentPage));
            S1.innerHTML='';                                        //每次进来清空总页数
            if(dataArray.length%PageNo.innerText==0)                    //判断总的页数
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            var oTBody=document.createElement('tbody');               //创建tbody
            oTBody.setAttribute('class','In-table');                   //定义class
            InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
            var html_c = '';

            if(dataArray==''){
                html_c = "<p style='width:1000px;text-align: center'>用户未发布任何微博</p>";
                oTBody.rows[0].cells[0].innerHTML = html_c;
            }else{

                for(i=0;i<parseInt(PageNo.innerText);i++)
                {                                                          //循环打印数组值
                    oTBody.insertRow(i);
                    //---判断内容
                    if (dataArray[i].photo_url=='unknown' || !dataArray[i].photo_url){
                        dataArray[i].photo_url='../../static/images/photo_unknown.png';
                    }
                    if (dataArray[i].uname=='unknown' || !dataArray[i].uname){
                        dataArray[i].uname=dataArray[i].uid;
                    }
                    var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i].timestamp) * 1000).toLocaleString();
                    html_c = '<div class="blog_time" id="blog_time">'+
                        '<div><img class="img-circle" src="'+dataArray[i].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                        '<div>'+
                        '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i].uname+'</a>'+
                        '</div>'+
                        '<div class="blog_text">'+
                        '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i].text+'</font></p>'+
                        '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                        '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                        '<span style="display:inline-block;margin-left:570px;">转发数('+dataArray[i].retweet+')&nbsp;|&nbsp;</span>'+
                        '<span">评论数('+dataArray[i].comment+')</span>'+
                        '</p>'+
                        '</div>'+
                        '</div>';
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
            if(dataArray.length%PageNo.innerText==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage+1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;                                                 //定义变量a
            a=PageNo.innerText*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
            var c;                                                  //定义变量c
            if(dataArray.length-a>=PageNo.innerText)                  //判断下一页数组数据是否小于每页显示行数
            {
                c=PageNo.innerText;
            }
            else
            {
                c=dataArray.length-a;
            }
            for(i=0;i<c;i++)
            {
                oTBody.insertRow(i);
                //--判断内容（次数循环是 i+a）
                if (dataArray[i+a].photo_url=='unknown' || !dataArray[i+a].photo_url){
                    dataArray[i+a].photo_url='../../static/images/photo_unknown.png';
                }
                if (dataArray[i+a].uname=='unknown' || !dataArray[i+a].uname){
                    dataArray[i+a].uname=dataArray[i+a].uid;
                }
                //---判断结束
                oTBody.rows[i].insertCell(0);

                var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i+a].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
                    '<div><img class="img-circle" src="'+dataArray[i+a].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                    '<div>'+
                    '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i+a].uname+'</a>'+
                    '</div>'+
                    '<div class="blog_text">'+
                    '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a].text+'</font></p>'+
                    '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                    '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                    '<span style="display:inline-block;margin-left:570px;">转发数('+dataArray[i+a].retweet+')&nbsp;|&nbsp;</span>'+
                    '<span">评论数('+dataArray[i+a].comment+')</span>'+
                    '</p>'+
                    '</div>'+
                    '</div>';
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
            if(dataArray.length%PageNo.innerText==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage-1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;
            a=PageNo.innerText*(currentPage-1);
            for(i=0;i<parseInt(PageNo.innerText);i++)
            {
                oTBody.insertRow(i);
                //--判断内容（次数循环是 i+a）
                if (dataArray[i+a].photo_url=='unknown' || !dataArray[i+a].photo_url){
                    dataArray[i+a].photo_url='../../static/images/photo_unknown.png';
                }
                if (dataArray[i+a].uname=='unknown' || !dataArray[i+a].uname){
                    dataArray[i+a].uname=dataArray[i+a].uid;
                }
                //---判断结束
                oTBody.rows[i].insertCell(0);
                var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i+a].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
                    '<div><img class="img-circle" src="'+dataArray[i+a].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                    '<div>'+
                    '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i+a].uname+'</a>'+
                    '</div>'+
                    '<div class="blog_text">'+
                    '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a].text+'</font></p>'+
                    '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                    '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                    '<span style="display:inline-block;margin-left:570px;">转发数('+dataArray[i+a].retweet+')&nbsp;|&nbsp;</span>'+
                    '<span">评论数('+dataArray[i+a].comment+')</span>'+
                    '</p>'+
                    '</div>'+
                    '</div>';
                    oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }

    Lp.onclick=function()
    {
        InTb.innerHTML='';
        S1.innerHTML='';
        if(dataArray.length%PageNo.innerText==0)
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        S2.innerHTML='';
        currentPage=SumPage;
        S2.appendChild(document.createTextNode(currentPage));
        var oTBody=document.createElement('tbody');
        oTBody.setAttribute('class','In-table');
        InTb.appendChild(oTBody);
        var a;
        a=PageNo.innerText*(currentPage-1);
        var c;
        if(dataArray.length-a>=PageNo.innerText)
        {
            c=PageNo.innerText;
        }
        else
        {
            c=dataArray.length-a;
        }
        for(i=0;i<c;i++)
        {
            oTBody.insertRow(i);
            //--判断内容（次数循环是 i+a）
            if (dataArray[i+a].photo_url=='unknown' || !dataArray[i+a].photo_url){
                dataArray[i+a].photo_url='../../static/images/photo_unknown.png';
            }
            if (dataArray[i+a].uname=='unknown' || !dataArray[i+a].uname){
                dataArray[i+a].uname=dataArray[i+a].uid;
            }
            //---判断结束
            oTBody.rows[i].insertCell(0);
            var dataArray_timestamp_datetime = new Date(parseInt(dataArray[i+a].timestamp) * 1000).toLocaleString();
            html_c = '<div class="blog_time" id="blog_time">'+
                '<div><img class="img-circle" src="'+dataArray[i+a].photo_url+'" style="width: 30px;height: 30px;position: relative;float:left;"></div>'+
                '<div>'+
                '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a].uid+'" class="user_name" style="top:5px;left:10px;">'+dataArray[i+a].uname+'</a>'+
                '</div>'+
                '<div class="blog_text">'+
                '<p style="position: relative;margin:20px 0;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a].text+'</font></p>'+
                '<p style="margin:20px 0;font-family: Microsoft YaHei;">'+
                '<span style="display: inline-block;">'+dataArray_timestamp_datetime+'</span>'+
                '<span style="display:inline-block;margin-left:570px;">转发数('+dataArray[i+a].retweet+')&nbsp;|&nbsp;</span>'+
                '<span">评论数('+dataArray[i+a].comment+')</span>'+
                '</p>'+
                '</div>'+
                '</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    }
};

//---完


current_weibo_outter();
potential_weibo_outter();

