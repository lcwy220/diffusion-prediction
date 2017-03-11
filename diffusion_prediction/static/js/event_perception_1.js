//新建任务
var new_task_url;
$('#build').on('click',function () {
    var name=$('#new_task').val();
    var must_val=$('#key-1').val();
    var should_val=$('#key-2').val();
    var start= Date.parse(new Date($('.start').val())).toString().substr(0,10);
    var end= Date.parse(new Date($('.end').val())).toString().substr(0,10);
    if (name==''||must_val==''||should_val==''){
        alert('请检查您的名称，关键。不能为空！');
    }else if (start>end){
        alert('请检查您的时间，开始时间不能大于结束时间。');
    }else {
        st_finish(start,end);
        new_task_url='/manage_event/submit_event_task/?task_name='+name+'&start_ts='+start+'&end_ts=' +
            end+'&must_keywords=['+must_val+']&should_keywords=['+should_val+']&submit_user=admin@qq.com';
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
                formatter: function (value, row, index) {
                    return index+1;
                }
            },
            {
                title: "任务名称",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return row[0];
                },
            },
            {
                title: "提交时间",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return getLocalTime(row[2]);
                },
            },
            {
                title: "任务进度",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    if (row[5]==0){
                        return '尚未计算';
                    }else if (row[5]==2){
                        return '计算完成';
                    }else {
                        return '正在计算';
                    }
                },
            },
            {
                title: "提交人",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return row[1];
                },
            },
            {
                title: "操作",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    var delt='<span>删除</span>';
                    return delt;
                },
            },
        ],
        onClickRow: function (row, tr) {
            if (tr[0].childNodes[5].innerText=='删除') {
                var task_name=tr[0].childNodes[1].innerText;
                var del_url='/manage_event/delete_event_task/?task_name='+task_name;
                $.ajax({
                    url: del_url,
                    type: 'GET',
                    dataType: 'json',
                    async: true,
                    success:del_task
                });
            };
            if (tr[0].childNodes[3].innerText=='计算完成') {
                window.open('/social_sensing/perceived_results/');
            }
        }
    });
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
function del_task(data) {
    if (data=='True'){
        alert('删除成功');
    }else {
        alert('删除失败');
    }
}