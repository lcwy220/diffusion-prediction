//可选任务列表-----

function choose_task(data) {
        var data=eval(data);
        $('#choose_task').bootstrapTable('load',data);
        $('#choose_task').bootstrapTable({
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
                    valign: "middle",//垂直
                    // width:5,
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
                    field: "finish_ts",//键名
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
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    width:100,
                    formatter: function (value, row, index) {
                        return "事件分析";
                    },
                },
                // {
                //     title: "操作",//标题
                //     field: "",//键名
                //     sortable: true,//是否可排序
                //     order: "desc",//默认排序方式
                //     align: "center",//水平
                //     valign: "middle",//垂直
                //     formatter: function (value, row, index) {
                //         var details='<span>提交预测</span>';
                //         return details;
                //     },
                // },
            ],
            onClickRow: function (row, tr) {
                // tr[0].childNodes[5].innerText
            }
        });
    }
    

function choose_task_outter(){
    var choose_list_url='/prediction/show_analysis_task/';
    $.ajax({
        url: choose_list_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:choose_task
    });
}

choose_task_outter()

//可选任务列表-----完--



//---------------任务列表

function task_lists(data) {
        var data=eval(data);
        console.log(data);
        $('#task_lists').bootstrapTable('load',data);
        $('#task_lists').bootstrapTable({
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
                    field: "macro_value_finish",//键名
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
                    title: "详情分析",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    // formatter: function (value, row, index) {
                    //     return '<a class="mod" onclick="go_to_detail()">查看详情</a> ' + '<a class="delete">删除</a>';
                    // },

                    formatter: function (value, row, index) {
                        // go_to_datail(topic_name,en_name,date_from,date_to,compute_status)
                        var e = '<a style="cursor:pointer;" onclick="go_to_detail(\''+ row.task_name +'\',\''+row.macro_value_finish+'\')">点击查看</a>';
                        return e
                        // return '<a onclick="go_to_detail('')">点击查看</a> ' + '<a class="remove" href="javascript:void(0)" >删除</a>';
                    },
                    // events: {
                    //     'click .mod': function(e, value, row, index) {      
                    //           //修改操作
                    //           console.log("修改！");
                    //           console.log(e);
                    //           console.log(value);
                    //           console.log(row);
                    //           console.log(index);
                    //         },
                    //     'click .remove' : function(e, value, row, index) {
                    //           //删除操作 
                    //           console.log("删除！");
                    //           console.log(e);
                    //           console.log(value);
                    //           console.log(row);
                    //           console.log(index);
                    //         }
                    // }
                },
                // {
                //     title: "查看详情",//标题
                //     field: "",//键名
                //     sortable: true,//是否可排序
                //     order: "desc",//默认排序方式
                //     align: "center",//水平
                //     valign: "middle",//垂直
                //     formatter: function (value, row, index) {
                //         var details='<a>查看详情</a>';
                //         return details;
                //     },
                // },
                {
                    title: "删除",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter:function(value,row,index){  
                      var d = '<a style="cursor:pointer;" onclick="delete_task_outter(\''+ row.task_name +'\')">删除</a>';  
                        return d;  
                    }
                },
            ],
            // onClickCell: function (field, value, row, $element) {
            //     console.log($element)
            //     // 'click .mod': function(e, value, row, index) {      
            //     //       //修改操作
            //     //     },
            //     // 'click .delete' : function(e, value, row, index) {
            //     //       //删除操作 
            //     //     }
            //     if ($element[0].innerText=='查看详情') {
            //         console.log(row.finish)
            //         if(!(row.finish=='0')){
            //             alert('暂时不能查看分析结果');
            //         }
            //         else{
            //             window.locationopen('/prediction/forecast_result/');
            //         }
            //     }
            //     if ($element[0].innerText=='删除') {

            //         delete_task_outter(row.task_name);
            //     }
            // }

        });
    }

// function go_to_detail(data){
//     window.open('/prediction/forecast_result/?task_name='+data);
// }

function go_to_detail(task_name,compute_status){

     // alert('zhixingle1111');
    if(compute_status==0){
      alert('尚未计算，请稍后查看。');
    }else if(compute_status==1){
      alert('正在计算，请稍后查看。');
    }else if(compute_status==2){
      window.open('/prediction/forecast_result/?task_name='+task_name);
    }

}

// function go_to_delete(){

//     delete_task_outter(row.task_name);
// }

function task_lists_outter() {
    var task_lists_url='/prediction/show_task/';
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
    
    var create_task_url = '/prediction/create_prediction_task/?task_name='+task_name+
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

    var delete_task_url = '/prediction/delete_task/?task_name='+task_name;

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

 $('.bootstrap-table').eq(0).css({marginLeft:'12%'});