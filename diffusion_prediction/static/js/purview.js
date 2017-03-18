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
                width:200,
               
            },
            {
                title: "用户uid",//标题
                field: "uid",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:100,
               
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
                width:150,
                
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
            // {
            //     title: "添加",//标题
            //     field: "",//键名
            //     sortable: true,//是否可排序
            //     order: "desc",//默认排序方式
            //     align: "center",//水平
            //     valign: "middle",//垂直
            //     width:100,
            //     formatter: function (value, row, index) {
            //         var add='<a>添加</a>';
                    
            //         return add;
            //     },
            // },
            {
                title: "删除",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:100,
                formatter: function (value, row, index) {
                   
                    var sub='<a class="remove" title="Remove" onclick="delete_sensor_outter(\''+row.uid+'\')" style="cursor:pointer;">删除</a>';
                    return sub;
                },
            },
        ],
        // onClickRow: function (row, $element) {
        //     // if ($element[0].innerText=='添加') {
        //     //     add_sensor_outter(row.id);
        //     // }
        //     text = $element[0].innerText
        //     console.log($element[0].innerText);
        //     console.log(typeof(text));
        //     console.log(text.length);
        //     if (field=='删除') {
        //         delete_sensor_outter(row.id);
        //     }
        // }
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
    var data = eval(data);
    if (data[0] == "1"){
        alert("添加成功！");
        window.location.reload()
    }else{
        alert("添加失败！");
    }

}

function add_sensor_outter(add_users){
    // var users = $('#sensor').bootstrapTable('getSelections', 'none');
    // console.log(users);
    console.log(add_users);
    console.log(typeof(add_users));
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
    var data = eval(data);
    if (data[0] == "1"){
        alert("删除成功！");
        window.location.reload()
    }else{
        alert("删除失败！");
    }

}

function delete_sensor_outter(delete_users){
    var delete_sensor_url = '/manage/delete_social_sensors/?delete_users='+delete_users;
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
    $('#sort_quota').bootstrapTable('load',data_list);
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
                width:300,
                
            },
            {
                title: "等级",//标题
                field: "rank",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:300,
               
            },
            {
                title: "修改",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:300,
                formatter: function (value, row,index) {
                    // var del='<a>删除</a>';
                    var modify='<a style="cursor:pointer;" data-toggle="modal" data-target="#modify_rank" onclick="editInfo(\''+row.topic+'\',\''+row.rank+'\')">修改</a>';
                    return modify;
                },
            }
        ],
        // onClickRow: function (row, $element) {
            
        //     if ($element[0].innerText=='修改') {
        //         $('#myModal').modal('show');
        //         modify_sort_outter(row.topic,row.rank);
        //     }
        // }
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
        sort_outter();
    }
    else{
        alert("修改失败！");
    }
}

function modify_sort_outter(topic,rank){
    console.log("modify!!");
    var modify_sort_url='/manage/revise_order/?topic='+topic+'&rank='+rank;
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
    var data_list = [];
    
    // console.log(data_list);
    
    for(var key in data){
        data_dic = {}
        if(key == "extend_retweet_threshold"){
            data_dic["name"] = "未来参与用户最近被转发的次数阈值";

            data_dic["para_value"] = data[key];
        }else if(key == "in_user_threshold"){
            data_dic["name"] = "重要参与用户至少被转发的次数阈值";
            data_dic["para_value"] = data[key];
        }else if(key == "potential_threshold"){
            data_dic["name"] = "重要潜在用户参与事件后可能被转发的次数阈值";
            data_dic["para_value"] = data[key];
        }
        data_list.push(data_dic);
    }
    console.log(data_list);

    $('#emulation').bootstrapTable('load',data_list);
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
                title: "参数含义",//标题
                field: "name",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:400,
                
            },
            {
                title: "参数值",//标题
                field: "para_value",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:400,

                
            },
            {
                title: "操作",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:200,
                formatter: function (value, row,index) {
                    console.log(row.name);
                    console.log(row.para_value);

                    var modify='<a style="cursor:pointer;" data-toggle="modal" data-target="#modify_para" onclick="editInfo_para(\''+row.name+'\',\''+row.para_value+'\')">修改</a>';
                    
                    return modify;
                },
            },
        ],
        // onClickRow: function (row, tr) {
        //     if ($element[0].innerText=='修改') {
        //         modify_interfer_parameter_outter(row.parameter_name,row.parameter_value);
        //     }
        // }
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

function modify_interfer_parameter(data){
    data = eval(data);
    if(data[0] == "1"){
        alert("修改成功！");
        window.location.reload()
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


interfer_parameter_outter();

//------仿真参数---完