//可选任务列表-----

function choose_task(data) {
        var data=eval(data);

        $('#choose_task').bootstrapTable('load',data);
        $('#choose_task').bootstrapTable({
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
            showToggle:false,
            sortName:'bci',
            sortOrder:"desc",
            columns: [
//                {
//                    title: "全选",
//                    field: "select",
//                    checkbox: true,
//                    align: "center",//水平
//                    valign: "middle",//垂直
//                    // width:5,
//                },
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
                     formatter: function (value, row, index) {
                        return '<a style="cursor: pointer;" onclick=infor_2(\''+row.pinyin_task_name+'\')>'+row.task_name+'</a>';
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
                    title: "结束时间",//标题
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
                    title: "备注",//标题
                    field: "remark",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                },
                {
                    title: "任务来源",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return "事件分析";
                    },
                },

            ],

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
            showColumns: false,//列选择按钮
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
                        var e = '<a style="cursor:pointer;" onclick="go_to_detail(\''+ row.task_name +'\',\''+row.macro_value_finish+'\')">查看</a>';
                        return e
                        // return '<a onclick="go_to_detail('')">点击查看</a> ' + '<a class="remove" href="javascript:void(0)" >删除</a>';
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
                      var d = '<a style="cursor:pointer;" onclick="delete_task_outter_prediction(\''+ row.task_name +'\')">删除</a>';  
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
    var mation_url='/prediction/show_task_detail/?task_name='+_id;
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

function infor_2(_id){
    var mation_url='/manage_event/show_task_detail/?task_name='+_id;
    $.ajax({
        url: mation_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:function(data){
            var data=eval(data);
            console.log(data)
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

function go_to_detail(task_name,compute_status){

    if(compute_status==0){
      alert('尚未计算，请稍后查看。');
    }else if(compute_status==1){
      alert('正在计算，请稍后查看。');
    }else if(compute_status==2){
      window.open('/prediction/forecast_result/?task_name='+task_name);
    }

}


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
        $('.prediction_menu input').each(function(){
            $(this).val('');
        })
        choose_task_outter();
        task_lists_outter();
        // window.location.open()
    }
    else{
        alert("创建失败！请检查信息是否填写完整。")
    }

}

$("#build").on('click',function(){
   
    choose_data = $('#choose_task').bootstrapTable('getAllSelections');

    if(choose_data.length){
        for(var i=0;i<choose_data.length;i++){
            var task_name = choose_data[i].task_name;
            var start_time = choose_data[i].start_time;
            var stop_time = choose_data[i].stop_time;
            var remark = choose_data[i].remark;
            var must_keywords = choose_data[i].must_keywords;
            var should_keywords = choose_data[i].should_keywords;
            var interfer_during = $("#inter_time").val();
          
            if ( $("#new_task").val()){
                task_name = $("#new_task").val();

            }
          
            if( Date.parse(new Date($('.start').val())).toString().substr(0,10) != 'NaN'){
                start_time = Date.parse(new Date($('.start').val())).toString().substr(0,10);
            }
            if( Date.parse(new Date($('.end').val())).toString().substr(0,10) != 'NaN'){
                stop_time = Date.parse(new Date($('.end').val())).toString().substr(0,10);
            }

            if( $("#remarks").val() ){
                remark = $("#remarks").val();
            }

            if( $("#key-1").val()){
                must_keywords = $("#key-1").val().replace(/,|，/g,'_');
            }
            if( $(".key-2").val()!=''){
                 var _should=[],s_str=[];
                $("input.key-2").each(function(){
                    _should.push($(this).val());
                });
                for(var s=0;s<_should.length;s++){
                    s_str.push(_should[s].replace(/,|，/g,'|'));
                }
               should_keywords=s_str.join('_');
            }

            var create_task_url = '/prediction/create_prediction_task/?task_name='+task_name+
            '&start_time='+start_time+'&stop_time='+stop_time+'&interfer_during='+interfer_during+
            '&remark='+remark+'&must_keywords='+must_keywords+'&should_keywords='+should_keywords+'&submit_user='+'admin@qq.com';
            $.ajax({
                url: create_task_url,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:create_task
            });
        }
    }
    else{
        var task_name = $("#new_task").val();
        var start_time = Date.parse(new Date($('.start').val())).toString().substr(0,10);
        var stop_time = Date.parse(new Date($('.end').val())).toString().substr(0,10);
        var interfer_during = $("#inter_time").val();
        var remark = $("#remarks").val();
        var must_keywords = $("#key-1").val().replace(/,|，/g,'_');
         var _should=[],s_str=[];
        $("input.key-2").each(function(){
            _should.push($(this).val());
        });
        for(var s=0;s<_should.length;s++){
            s_str.push(_should[s].replace(/,|，/g,'|'));
        }
        var should_keywords=s_str.join('_');
        if (task_name==''||must_keywords==''||should_keywords==''||$('.start').val()==''||$('.end').val()==''){
        alert('请检查您的名称，关键词，时间。不能为空！');
    }else if (start_time>stop_time){
        alert('请检查您的时间，开始时间不能大于结束时间。');
    }else{
        var create_task_url = '/prediction/create_prediction_task/?task_name='+task_name+
        '&start_time='+start_time+'&stop_time='+stop_time+'&interfer_during='+interfer_during+
        '&remark='+remark+'&must_keywords='+must_keywords+'&should_keywords='+should_keywords+'&submit_user='+'admin@qq.com';
        $.ajax({
            url: create_task_url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:create_task
        });
    }



    }
    
})

//新建任务---完----

//删除任务  


function delete_task_prediction(data){
    if(data[0] == "1"){
        alert("删除成功！");
        choose_task_outter();
        task_lists_outter();
    }else{
        alert("删除失败！");
    }
}
function confirm_delete(){
    return confirm("确定要删除吗？")
}

function delete_task_outter_prediction(task_name){

    var delete_task_url = '/prediction/delete_task/?task_name='+task_name;
    confirm_delete();

    $.ajax({
        url: delete_task_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:delete_task_prediction
    });

}



//删除任务  ----完-----

 $('.bootstrap-table').eq(0).css({marginLeft:'12%'});