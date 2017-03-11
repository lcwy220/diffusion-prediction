

function prediction_task(){
 
}

prediction_task.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success:callback
    });
  },

  function Submit_task_result(){
  var topic = $("#create_topic").val();
  var start_ts=datetime_to_timestamp($("#input_date_from_create").val());
  var end_ts=datetime_to_timestamp($("#input_date_to_create").val());
  var submit_user = user_glo;
  url = "/prediction/create_prediction_task/?task_name=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&submit_user='+submit_user;
  //console.log(url);
  topic_analysis_index.call_sync_ajax_request(url,topic_analysis_index.Submit_task);
  
} 

}