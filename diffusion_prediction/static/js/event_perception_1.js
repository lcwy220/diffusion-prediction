//新建任务

$('#build').on('click',function () {
    var name=$('#new_task').val();
    var must_val=$('#key-1').val();
    var should_val=$('#key-2').val();
    var start= Date.parse(new Date($('.start').val())).toString().substr(0,10);
    var end= Date.parse(new Date($('.end').val())).toString().substr(0,10);
    var remark = $("#remarks").val();
    if (name==''||must_val==''||should_val==''){
        alert('请检查您的名称，关键。不能为空！');
    }else if (start>end){
        alert('请检查您的时间，开始时间不能大于结束时间。');
    }else {
        st_finish(start,end);

        var new_task_url='/manage_event/submit_event_task/?task_name='+name+'&start_time='+start+'&stop_time=' +
            end+'&must_keywords=['+must_val+']&should_keywords=['+should_val+']&submit_user=admin@qq.com';
        console.log(new_task_url);
        $.ajax({
            url: new_task_url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:build_task
        });
    }
});
function build_task(data) {
    if (data[0]==1){
        alert('创建成功。');
        taskList();
    }else {
        alert('创建失败。');
    }
};


//时间戳转换
function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,8);
}

//展示所有任务


function task(data) {
    var data=eval(data);
    console.log(data);
    $('#tasks_lists_every').bootstrapTable('load',data);
    $('#tasks_lists_every').bootstrapTable({
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
                title: "序号",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                width:50,
                formatter: function (value, row, index) {
                    return index+1;
                }
            },
            {
                title: "任务名称",//标题
                field: "task_name",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                
            },
            {
                title: "开始时间",//标题
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
                title: "终止时间",//标题
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
                title: "提交用户",//标题
                field: "submit_user",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
            
            },
            {
                title: "任务进度",//标题
                field: "event_value_finish",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (value ==0){
                        return '尚未计算';
                    }else if (value==2){
                        return '计算完成';
                    }else {
                        return '正在计算';
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
                formatter: function (value, row, index) {
                       
                       var e = '<a style="cursor:pointer;" onclick="go_to_detail_event(\''+ row.task_name 
                       +'\',\''+row.start_time
                       +'\',\''+row.stop_time
                       +'\',\''+row.event_value_finish+'\')">点击查看</a>';

                       console.log(e);
                        return e
                },
            },
            {
                title: "删除",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter:function(value,row,index){  
                  var d = '<a style="cursor:pointer;" onclick="delete_task_outter_event(\''+ row.task_name +'\')">删除</a>';  
                    return d;  
                }
            },
        ],

    });
}


function go_to_detail_event(task_name,start_time,stop_time,compute_status){

    if(compute_status==0){
      alert('尚未计算，请稍后查看。');
    }else if(compute_status==1){
      alert('正在计算，请稍后查看。');
    }else if(compute_status==2){
        console.log(task_name,start_time,stop_time,compute_status);
      window.open('/manage_event/event_analysis/?task_name='+task_name
                +'&start_ts='+start_time+'&end_ts='+stop_time);
    }

}

function taskList() {
    var task_list_url='/manage_event/show_event_task/';
    $.ajax({
        url: task_list_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:task
    });
}
taskList();



//删除
function delete_task_event(data){
    
    if(data[0] == "1"){
        alert("删除成功！");
        
        taskList();
    }else{
        alert("删除失败！");
    }
}

function delete_task_outter_event(task_name){

    var delete_task_event_url = '/manage_event/delete_event_task/?task_name='+task_name;

    console.log(delete_task_event_url);

    $.ajax({
        url: delete_task_event_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:delete_task_event
    });

}

