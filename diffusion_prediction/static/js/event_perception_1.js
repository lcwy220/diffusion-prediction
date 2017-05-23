//新建任务

var name='',must_val='',_should=[],s_str=[],should_val='',start='',end='',remark='';
$('#build').on('click',function () {
     name=$('#new_task').val();
     must_val=$('#key-1').val().replace(/,|，/g,'_');
//    var should_val=$('#key-2').val();
      _should=[],s_str=[];
    $("input.key-2").each(function(){
    if ($(this).val()!=''){
        _should.push($(this).val());
    }
    });
    for(var s=0;s<_should.length;s++){
        s_str.push(_should[s].replace(/,|，/g,'|'));
    }
     should_val=s_str.join('_');
     start= Date.parse(new Date($('.start').val())).toString().substr(0,10);
     end= Date.parse(new Date($('.end').val())).toString().substr(0,10);
     remark = $("#remarks").val();
    if (name==''||$('.start').val()==''||$('.end').val()==''){
        alert('请检查您的名称，时间。不能为空！');
    }else if (!((must_val)||(should_val))){
        alert('请检查您的关键词。不能为空！');
    }else if (start>end){
        alert('请检查您的时间，开始时间不能大于结束时间。');
    }else {
        st_finish(start,end);
        var check_same_task_url='/manage_event/check_same_task/?task_name='+name;
        $.ajax({
            url: check_same_task_url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:function(data){
                var data=eval(data);
                var check=[];
                var one='';
                for (var key in data){
                    check.push(data[key]);
                }         
                if(check[0]==0&&check[1]==0&&check[2]==0){
                    _creat();
                }else {
                    if(check[0]==1) {
                        one+=' 干预决策任务';
                    }
                    if(check[1]==1) {
                        one+=' 态势预测任务';
                    }
                    if(check[2]==1) {
                        one+=' 事件分析任务';
                    }
                    $('#_same_task #_word').html('<b style="color:red;">'+one+'</b>中与您的任务名称<b style="color:red;">重复</b>，您确定还要创建吗？')
                    $('#_same_task').modal('show'); 
     
                }

                
            }
        });
        
    }
});
function _creat(){
    
         var new_task_url='/manage_event/submit_event_task/?task_name='+name+'&start_time='+start+'&stop_time=' +
            end+'&submit_user='+submit_user;
         if(remark!=''){
            new_task_url+='&remark='+remark;
        }
        if(must_val!=''){
            new_task_url+='&must_keywords='+must_val;
        }
        if (should_val!=''){
            new_task_url+='&should_keywords='+should_val;
        }
        $.ajax({
            url: new_task_url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:build_task
        });
}
function build_task(data) {
    if (data[0]==1){
        alert('创建成功。');
        taskList();
        $('.new_task_menu input').each(function(){
            $(this).val('');
        })
        $('.task_words ._div').remove();
    }else {
        alert('创建失败！本模块已有相同任务。');
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
        showColumns: false,//列选择按钮
        buttonsAlign: "right",//按钮对齐方式
        locale: "zh-CN",//中文支持
        detailView: false,
        showToggle:false,
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
                formatter: function (value, row, index) {
                    return '<a style="cursor: pointer;" onclick=infor(\''+row.pinyin_task_name+'\')>'+row.task_name+'</a>';
                },
            },
            {
                title: "开始时间",//标题
                field: "start_time",//键名
                sortable: true,//是否可排序
                order: "desc",//默认排序方式
                align: "center",//水平
                valign: "middle",//垂直
                formatter: function (value, row, index) {
                    return getLocalTime(value);
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
                    return getLocalTime(value);
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
                    return getLocalTime(value);
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

function getLocalTime(nS) {
	var timeTrans = new Date(parseInt(nS) * 1000);
    return timeTrans.toLocaleString('chinese',{hour12:false});
}
function infor(_id){
    var mation_url='/manage_event/show_task_detail/?task_name='+_id;
    $.ajax({
        url: mation_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:function(data){
            var data=eval(data);
            $('#ba_name').text(data.task_name);
             $('#ba_user').text(data.submit_user);
              $('#ba_submit').text(getLocalTime(data.submit_time));
              var remark;
              if(data.remark==''||data.remark=='null'||data.remark=='undefined'||data.remark==null){
                remark='无';
              }else{
                remark=data.remark;
              }
              $('#ba_remark').text(remark);
              var keywords;
              var m=[];
              var sh=[];
              for (var s=0;s<data.must_keywords.length;s++){
                m.push(data.must_keywords[s]);
             }
             for (var s=0;s<data.should_keywords.length;s++){
             var a,b=[],c;
                 for (var h=0;h<data.should_keywords[s].length;h++){
                    if(h==0){
                        a=data.should_keywords[s][h].toString();
                    }else {
                        b.push(data.should_keywords[s][h]);
                    }

                 }

                 if(b.length==0){
                    c='';
                 }else{
                  c='('+b.join('，')+')';
                 }

                    sh.push(a+c);
             }
              keywords=m.concat(sh).join('，');
              $('#ba_keywords').text(keywords);

              $('#ba_start').text(getLocalTime(data.start_time));
              $('#ba_end').text(getLocalTime(data.stop_time));

                $('#basic_infor').modal('show');

        }
    });
}

function go_to_detail_event(task_name,start_time,stop_time,compute_status){

    if(compute_status==0){
      alert('尚未计算，请稍后查看。');
    }else if(compute_status==1){
      alert('正在计算，请稍后查看。');
    }else if(compute_status==2){
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


function confirm_delete(){
    return confirm("确定要删除吗？")
}

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
    confirm_delete();

    $.ajax({
        url: delete_task_event_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:delete_task_event
    });

}

