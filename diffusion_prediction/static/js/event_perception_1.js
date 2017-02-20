function task(data) {
    var data=eval(data);
    // $('#tasks_lists_every').bootstrapTable('load',data);
    $('#tasks_lists_every').bootstrapTable({
        // data:data,
        search: true,//是否搜索
        pagination: true,//是否分页
        pageSize: 5,//单页记录数
        pageList: [5, 10, 20],//分页步进值
        sidePagination: "client",//服务端分页
        searchAlign: "left",
        searchOnEnterKey: false,//回车搜索
        showRefresh: true,//刷新按钮
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
                title: "人物名称",//标题
                field: "",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return '中国女排';
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
                    return '2017-1-2';
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
                    var str='<div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">'+
                        '<span class="sr-only">40% Complete (success)</span><span>40</span></div> </div>';
                    return str;
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
                    return 'admin';
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
                    var look='<span style="cursor: pointer;text-decoration: underline">感知结果</span>';
                    var delt='<span>删除</span>';
                    return look,delt;
                },
            },
        ],
        onClickRow: function (row, tr) {

        }
    });
}
var task_list_url='';
$.ajax({
    url: task_list_url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:task
});