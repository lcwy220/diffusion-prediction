/**
 * Created by Administrator on 2017/3/17.
 */

//传播路径
function critical_path_task(data) {
    var data=eval(data);
    $('#start_end').bootstrapTable('load',data);
    $('#start_end').bootstrapTable({
        data:data,
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
        showToggle:true,
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
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {

                }
            },
            {
                title: "终点用户",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {

                },
            },

        ],

    });
}
var critical_path_url='';
$.ajax({
    url: critical_path_url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:critical_path_task
});
//---------完

//--潜在关键用户
function potential_users_task(data) {
    var data=eval(data);
    console.log(data);
    data_list = new Array();
    for(var k=0;k<data.length;k++){
        var data_dic = new Object();
        data_dic.uid = data[k][0];
        data_dic.uname = data[k][1];
        data_dic.photo_url = data[k][2];
        data_dic.fans = data[k][3];
        data_dic.atten_num = data[k][4];
        data_dic.weibo_num = data[k][5];
        console.log(data_dic);
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
        showToggle:true,
        sortName:'bci',
        sortOrder:"desc",
        columns: [
            {
                title: "全选",
                field: "select",
                checkbox: true,
                align: "center",//水平
                valign: "middle"//垂直
            },
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
                width:100,
               
            },
            {
                title: "关注数",//标题
                field: "atten_num",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:100,

            
            },
            {
                title: "微博数",//标题
                field: "weibo_num",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:100,

              
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

//--潜在热门微博
var potential_weibo_url='';
$.ajax({
    url: potential_weibo_url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:potential_weibo
});

function potential_weibo(data) {
    var data=eval(data);
    potential_weibo_text(data);
}
function potential_weibo_text(data){
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
//---完

//--当前热门微博
function current_weibo_outter(){
    // task_name = '毛泽东诞辰纪念日';
    var current_weibo_url='/interfere/get_current_hot_weibo/?task_name='+task_name+'&update_time='+update_time;
    $.ajax({
        url: current_weibo_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:current_weibo
    });

}


function current_weibo(data) {
    var data=eval(data);
    console.log(data);
    current_weibo_text(data);
}
function current_weibo_text(data){
    $('#group_emotion_loading2').css('display', 'none');
    $('#input-table2').css('display', 'block');
    var dataArray = data;
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
    var dataArray_len = 0;
    for (var dataArray_item in dataArray){
        dataArray_len++ ;
    }

    if(PageNo.value!="")                                       //判断每页显示是否为空
    {
        InTb.innerHTML='';                                     //每次进来都清空表格
        S2.innerHTML='';                                        //每次进来清空当前页数
        currentPage=1;                                          //首页为1
        S2.appendChild(document.createTextNode(currentPage));
        S1.innerHTML='';                                        //每次进来清空总页数
        if(dataArray_len%PageNo.value==0)                    //判断总的页数
        {
            SumPage=parseInt(dataArray_len/PageNo.value);
        }
        else
        {
            SumPage=parseInt(dataArray_len/PageNo.value)+1
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
                console.log(dataArray[i]);
                if (dataArray[i].length==1){
                    if (dataArray[i]["uname"]==''||dataArray[i]["uname"]=='unknown') {
                        name="未知";
                    }else {
                        name=dataArray[i]["uname"];
                    };
                    if (dataArray[i]["photo_url"]==''||dataArray[i]["photo_url"]=='unknown') {
                        photo='../../static/images/unknown.png';
                    }else {
                        photo=dataArray[i]["photo_url"];
                    };
                    html_c = '<div class="weibo_explain">'+
                        '                <div class="weibo_detail_left">'+
                        '                    <img class="user_photo" src="'+photo+'">'+
                        '                </div>'+
                        '                <div class="weibo_detail_right">'+
                        '                    <a class="weibo_name" href="http://www.weibo.com/u/'+dataArray[i]["uid"]+'">'+name+'：</a>'+
                        '  &nbsp;&nbsp;&nbsp;<span class="weibo_words">'+dataArray[i][0][3]+
                        '                    </span>'+
                        '                    <div class="weibo_source">'+
                        '                        <span>'+dataArray[i][0][5]+'</span>'+
                        '                        <span>'+dataArray[i][0][6].replace(/&/g,' ')+'</span>'+
                        '                        <p class="weibo_operating" style="float: right">'+
                        '                            <span class="weibo_forwarding">转发数（'+dataArray[i]["retweet"]+'）</span>'+
                        '                            <span>|</span>'+
                        '                            <span class="weibo_comment">评论数（'+dataArray[i]["comment"]+'）</span>'+
                        '                        </p>'+
                        '                    </div>'+
                        '                </div>'+
                        '            </div>';
                }
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
            if(dataArray_len%PageNo.value==0)                    //判断总的页数
            {
                SumPage=parseInt(dataArray_len/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray_len/PageNo.value)+1
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
                    }

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
            if(dataArray_len%PageNo.value==0)
            {
                SumPage=parseInt(dataArray_len/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray_len/PageNo.value)+1
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
            if(dataArray_len-a>=PageNo.value)                  //判断下一页数组数据是否小于每页显示行数
            {
                c=PageNo.value;
            }
            else
            {
                c=dataArray_len-a;
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
                }
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
            if(dataArray_len%PageNo.value==0)
            {
                SumPage=parseInt(dataArray_len/PageNo.value);
            }
            else
            {
                SumPage=parseInt(dataArray_len/PageNo.value)+1
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
                }
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }

    Lp.onclick=function()
    {
        InTb.innerHTML='';
        S1.innerHTML='';
        if(dataArray_len%PageNo.value==0)
        {
            SumPage=parseInt(dataArray_len/PageNo.value);
        }
        else
        {
            SumPage=parseInt(dataArray_len/PageNo.value)+1
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
        if(dataArray_len-a>=PageNo.value)
        {
            c=PageNo.value;
        }
        else
        {
            c=dataArray_len-a;
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
                    }
                }
                html_c =same_weibo[0];
            }
            
            oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    }

}
//---完


current_weibo_outter();

