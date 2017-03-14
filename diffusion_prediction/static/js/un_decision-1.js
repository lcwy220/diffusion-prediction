//可选任务列表-----
function optional_task(data) {
    var data=eval(data);
    var data_new = [];
    for (var key in data){
        if (key == "event_analysis_task"){
            for (var i=0;i<data[key].length;i++) {
                data[key][i]["source"] = "事件分析";
                data_new.push(data[key][i]);
            } 
        }else {
            for (var i=0;i<data[key].length;i++) {
                data[key][i]["source"] = "态势预测";
                data_new.push(data[key][i]);
            } 
        }
    }
    console.log(data_new);
    $('#optional_task').bootstrapTable('load',data_new);
    $('#optional_task').bootstrapTable({
        data:data_new,
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
            // {
            //     title: "",//标题
            //     field: "",//键名
            //     sortable: true,//是否可排序
            //     order: "desc",//默认排序方式
            //     align: "center",//水平
            //     valign: "middle",//垂直
            //     formatter: function (value, row, index) {
            //         return index+1;
            //     }
            // },
            {
                title: "任务名称",//标题
                field: "task_name",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:300,
                
            },
            {
                title: "提交用户",//标题
                field: "submit_user",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:100,
                
            },
            {
                title: "提交时间",//标题
                field: "submit_time",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:200,
                formatter: function (value, row, index) {
                    return new Date(parseInt(value) * 1000).toLocaleString();
                },
            },
            {
                title: "结束时间",//标题
                field: "stop_time",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:200,
                formatter: function (value, row, index) {
                    return new Date(parseInt(value) * 1000).toLocaleString();
                },
            },
            {
                title: "备注",//标题
                field: "remark",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:100,
            },
            {
                    title: "任务来源",//标题
                    field: "source",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    width:100,
                    
                },
            // {
            //     title: "操作",//标题
            //     field: "",//键名
            //     sortable: true,//是否可排序
            //     order: "desc",//默认排序方式
            //     align: "center",//水平
            //     valign: "middle",//垂直
            //     formatter: function (value, row, index) {
            //         var details='<span>提交</span>';
            //         return details;
            //     },
            // },
        ],
        onClickRow: function (row, tr) {
            // tr[0].childNodes[5].innerText
        }
    });
}

function optional_task_outter(){
    var optional_list_url='/interfere/show_former_task/';
    $.ajax({
        url: optional_list_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:optional_task
    });
}

optional_task_outter();

//可选任务列表-----完--


//---------------任务列表

function task_lists(data) {
        var data=eval(data);
        console.log(data);
        $('#role_lists').bootstrapTable('load',data);
        $('#role_lists').bootstrapTable({
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
                // {
                //     title: "全选",
                //     field: "select",
                //     checkbox: true,
                //     align: "center",//水平
                //     valign: "middle"//垂直
                // },
                {
                    title: "任务名称",//标题
                    field: "task_name",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    
                },
                {
                    title: "任务开始时间",//标题
                    field: "start_time",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return new Date(parseInt(value) * 1000).toLocaleString();
                    },
                    
                },
                {
                    title: "任务终止时间",//标题
                    field: "stop_time",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return new Date(parseInt(value) * 1000).toLocaleString();
                    },
                    
                },
                {
                    title: "提交时间",//标题
                    field: "submit_time",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return new Date(parseInt(value) * 1000).toLocaleString();
                    },
                    
                },
                {
                    title: "创建人",//标题
                    field: "submit_user",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                },
                {
                    title: "计算状态",//标题
                    field: "finish",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if(value == 0){
                            return '尚未计算'
                        }
                        else if(value == 2){
                            return '计算完成'
                        }
                        else{
                            return '正在计算'
                        }

                    },
                },
                {
                    title: "备注",//标题
                    field: "remark",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                },
                {
                    title: "查看详情",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        var details='查看详情';
                        return details;
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
                        var delete_op ='删除';
                        return delete_op;
                    },
                },
            ],
            onClickCell: function (field, value, row, $element) {
                console.log($element)
                if ($element[0].innerText=='查看详情') {
                    console.log(row.finish)
                    if(!(row.finish=='2')){
                        alert('暂时不能查看分析结果');
                    }
                }
                if ($element[0].innerText=='删除') {

                    delete_task_outter(row.task_name);
                }
            }

        });
    }

function task_lists_outter() {
    var task_lists_url='/interfere/show_all_task/';
    $.ajax({
        url: task_lists_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:task_lists
    });
}


task_lists_outter()

//------任务列表---完





//新建任务
function create_task(data){
    var data=eval(data);
    if (data[0] = 1) {
        alert("创建成功！");
        choose_task_outter();
        task_lists_outter();
    }
    else{
        alert("创建失败！请检查后重新提交。")
    }

}

$("#build").on('click',function(){
    console.log('123');
    var task_name = $("#new_task").val();
    var start_time = Date.parse(new Date($('.start').val())).toString().substr(0,10);
    var stop_time = Date.parse(new Date($('.end').val())).toString().substr(0,10);
    var interfer_during = $("#inter_time").val();
    var remark = $("#remarks").val();
    var must_keywords = $("#key-1").val();
    var should_keywords = $("#key-2").val();
    console.log(interfer_during);
    
    var create_task_url = '/interfere/create_interfere_task/?task_name='+task_name+
    '&start_time='+start_time+'&stop_time='+stop_time+'&interfer_during='+interfer_during+
    '&remark='+remark+'&must_keywords='+must_keywords+'&should_keywords='+should_keywords+'&submit_user='+'admin@qq.com';
    
    console.log(create_task_url);
    $.ajax({
        url: create_task_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:create_task
    });
})

//新建任务---完----

//删除任务  


function delete_task(data){
    if(data == 'True'){
        alert("删除成功！");
        choose_task_outter();
        task_lists_outter();
    }else{
        alert("删除失败！");
    }
}

function delete_task_outter(task_name){

    var delete_task_url = '/interfere/delete_task/?task_name='+task_name;

    console.log(delete_task_url);
    $.ajax({
        url: delete_task_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:delete_task
    });

}



//删除任务  ----完-----