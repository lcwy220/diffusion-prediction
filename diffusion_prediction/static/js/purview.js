//人物传感器列表-----
function sensor(data) {
    var data=eval(data);
    console.log(data);
    // for(var i=0;i<data.length;i++){
    //     if(typeof data[i] == string){
    //         new_data = {""}
    //     }
    // }
    $('#sensor').bootstrapTable('load',data);
    $('#sensor').bootstrapTable({
        data:data,
        // search: true,//是否搜索
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
                field: "nick_name",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
               
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
                title: "性别",//标题
                field: "sex",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                     if(value == 1){
                        return '男';
                     }
                     else if(value == 2) {
                        return '女';
                     } 
                     else{
                        return ''
                     }
                },
            },
            {
                title: "粉丝数",//标题
                field: "fansnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                
            },
            {
                title: "好友数",//标题
                field: "friendsnum",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                
            },
            {
                title: "所在地",//标题
                field: "user_location",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                
            },
            {
                title: "注册时间",//标题
                field: "create_at",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                        if(value){
                            return new Date(parseInt(value) * 1000).toLocaleString();
                        }
                        else{
                            return '';
                        }
                },
            },
            {
                title: "添加",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var add='<a>添加</a>';
                    
                    return "添加";
                },
            },
            {
                title: "删除",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                   
                    var sub='<a>删除</a>';
                    return "删除";
                },
            },
        ],
        onClickRow: function (row, $element) {
            //console.log(row);
            // console.log($element[8].innerText);
            // console.log(element);
            if ($element[0].innerText=='添加') {
                    add_sensor_outter(row.id);
                }
                if ($element[0].innerText=='删除') {

                    delete_sensor_outter(row.id);
                }
        }
    });
}

function sensor_outter(){
    var sensor_url='/manage/show_social_sensors/';
    $.ajax({
        url: sensor_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:sensor
    });
}

function add_sensor(data){
    console.log(data);
    var data = eval(data);
    if (data[0] == "1"){
        alert("添加敏感人物库成功！");
    }else{
        alert("添加敏感人物库失败！");
    }

}

function add_sensor_outter(add_users){
    var add_sensor_url = '/manage/add_social_sensors/?add_users='+add_users;
    $.ajax({
        url: add_sensor_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:add_sensor
    });

}


function delete_sensor(data){
    console.log(data);
    var data = eval(data);
    if (data[0] == "1"){
        alert("从敏感人物库删除成功！");
    }else{
        alert("从敏感人物库删除失败！");
    }

}

function delete_sensor_outter(delete_users){
    var delete_sensor_url = '/manage/add_social_sensors/?delete_users='+delete_users;
    $.ajax({
        url: delete_sensor_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:delete_sensor
    });

}


sensor_outter();

//可选任务列表-----完--


//---------------推荐排序指标-
function sort(data) {
    var data=eval(data);
    var data_list = [];
    
    for(key in data){
        var data_json = {};
        data_json['topic'] = key;
        data_json['rank'] = data[key];
        data_list.push(data_json);
    }
    console.log(data_json);
    $('#sort_quota').bootstrapTable('load',data);
    $('#sort_quota').bootstrapTable({
        data:data_list,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        // showRefresh: true,//刷新按钮
        showColumns: true,//列选择按钮
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
                title: "领域",//标题
                field: "topic",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                
            },
            {
                title: "等级",//标题
                field: "rank",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
               
            },
            {
                title: "修改",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row,index) {
                    // var del='<a>删除</a>';
                    var modify='<a>修改</a>';
                    return modify;
                },
            }
        ],
        onClickRow: function (row, $element) {
            
            if ($element[0].innerText=='修改') {
                    modify_sort_outter(row.topic,row.rank);
            }
        }
    });
}

function sort_outter(){
    var sort_url='/manage/topic_order/';
    $.ajax({
        url: sort_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:sort
    });
}

function modify_sort(data){
    if (data[0] = "1") {
        alert("修改成功!");
    }
    else{
        alert("修改失败！");
    }
}

function modify_sort_outter(topic,rank){
    var modify_sort_url='/manage/topic_order/?topic='+topic+'&rank='+rank;
    $.ajax({
        url: modify_sort_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:modify_sort
    });
}



sort_outter();
//------任务列表---完



//---------------仿真参数-
function interfer_parameter(data) {
    var data=eval(data);
    var data_list = [data];

    $('#emulation').bootstrapTable('load',data);
    $('#emulation').bootstrapTable({
        data:data_list,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        // showRefresh: true,//刷新按钮
        showColumns: true,//列选择按钮
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
                title: "未来参与用户最近被转发的次数阈值",//标题
                field: "extend_retweet_threshold",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                }
            },
            {
                title: "重要参与用户至少被转发的次数阈值",//标题
                field: "in_user_threshold",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {

                },
            },
            {
                title: "重要潜在用户参与事件后可能被转发的次数阈值",//标题
                field: "potential_threshold",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {

                },
            },
            {
                title: "操作",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row,index) {
                    var modify='<a>修改</a>';
                    return modify;
                },
            },
        ],
        onClickRow: function (row, tr) {
            if ($element[0].innerText=='修改') {
                    modify_interfer_parameter_outter(row.parameter_name,row.parameter_value);
            }
        }
    });
}

function modify_interfer_parameter(data){
    data = eval(data);
    if(data[0] == "1"){
        alert("修改成功！");
    }
    else{
        alert("修改失败！");
    }
}

function modify_interfer_parameter_outter(parameter_name,parameter_value){
    var modify_interfer_parameter_url='/manage/revise_interfer_parameter/?parameter_name='+
                                        parameter_name+'&parameter_value='+parameter_value;
    $.ajax({
        url: modify_interfer_parameter_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:modify_interfer_parameter
    });

}

function interfer_parameter_outter(){
    var interfer_parameter_url='/manage/get_interfer_parameter/';
    $.ajax({
        url: interfer_parameter_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:interfer_parameter
    });

}




interfer_parameter_outter();

//------仿真参数---完