var pointInterval = 3600;
var sort_item = 'timestamp';

var start_ts,end_ts,pointInterval;

var no_page_time = 0;
var blog_num_max_global_time = 0;


function set_timestamp(){
	var start_time_new = get_timestamp().start_return;
	var end_time_new = get_timestamp().end_return; 
	var start_timestamp = datetime_to_timestamp(start_time_new);
	var end_timestamp = datetime_to_timestamp(end_time_new);
	
	start_ts = start_timestamp;
	end_ts = end_timestamp;

	Draw_time_trend_line_result();
}


function get_timestamp(){
	var start_time = $('#datetimepicker1_input').val(); 
	var end_time = $('#datetimepicker2_input').val();
	return {
		start_return:start_time,
		end_return:end_time
	};
}


function datetime_to_timestamp(datetime) {
 		var date_time_string = datetime;
 		var date_time_array =date_time_string.split(/[/: ]/);
 		var date_array_new = [date_time_array[2],date_time_array[0],date_time_array[1]];
 		if (date_time_array[5] == 'PM'){
 			date_time_array[3] = parseInt(date_time_array[3])+12;  //替换元素，小时数字加12
 		}
 		var time_array_new = [date_time_array[3],date_time_array[4],'00'];
 		var timestamp_date_str = date_array_new.join('/');
 		var timestamp_time_str = time_array_new.join(':');
 		var timestamp_time_array = [timestamp_date_str,timestamp_time_str]
 		var timestamp_str = timestamp_time_array.join(' ');
 		var timestamp = (new Date(timestamp_str)).getTime()/1000;
 		return timestamp;
	}


function get_per_time_time(val) {
	pointInterval = val;
	Draw_time_trend_line_result();
}


function set_order_type_time(type){
	if(type=='time'){
		sort_item = 'timestamp';
		Draw_blog_scan_area_order_result();

	}else if(type=='hot'){
		sort_item = 'retweeted';
		Draw_blog_scan_area_order_result();
	}
}

//上一页
function up_time(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_time==0){
         alert("当前已经是第一页!");
         return false;
     }else{
 		no_page_time--;
 		
 		Draw_blog_scan_area_order_result();
 		
     }
}
//首页
function down_time(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_time==Math.min(9,Math.ceil(blog_num_max_global_time/10)-1)){
         alert("当前已经是最后一页!");
        
         return false;
     }else{
 		no_page_time++;
 		
 		Draw_blog_scan_area_order_result();
 		
     }
}

function first(){
   
     no_page_time=0;
     /*这里在将当前页数赋值到页面做显示标志*/
     Draw_blog_scan_area_order_result();

}
//尾页
function last(){
     
     no_page_time=(Math.ceil(blog_num_max_global_time/10)-1);
    
     /*这里在将当前页数赋值到页面做显示标志*/
     // window.location.href="a.htm?b=123&b=qwe&c="+pageno;
     Draw_blog_scan_area_order_result();
}

function getLocalTime(nS) {
	var timeTrans = new Date(parseInt(nS) * 1000);
    return timeTrans.toLocaleString('chinese',{hour12:false});
}
function topic_analysis_time(){
 
}

topic_analysis_time.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },

// //设置ajax访问后台填充折线图

  Draw_time_trend_line: function(data){
 	var item = data;
 	var x_item = [];
 	var y_item_origin = [];
	var y_item_forwarding = [];
	var y_item_comment = [];
	
 	for (var key in item){
		key_datetime = getLocalTime(key);
		x_item.push(key_datetime);	
		y_item_origin.push(item[key]['1']);
		y_item_forwarding.push(item[key]['2']);
		y_item_comment.push(item[key]['3']);
	}

	
 	var myChart = echarts.init(document.getElementById('main_time'));
	//Chart.showLoading({text: '正在努力的读取数据中...'  });
	var option = {
		tooltip : {
		    trigger: 'axis'
		},
		legend: {
		    data:['原创','评论','转发']
		},
		toolbox: {
			show : true,
			feature : {
			    saveAsImage : {show: true}
		    }
		},
		calculable : true,
		grid:{
		    x:'11%',
		    y:'11%',
		    x2:'11%',
		    y2:'11%',
		  },
		xAxis : [
		    {
			    type : 'category',
			    boundaryGap : false,
			    data : x_item
			  
		    }
		],
		yAxis : [
		    {
		    type : 'value',
		    axisLabel : {
		        formatter: '{value} '
		        }
		    }
		],
		series : [
		    {
		    name:'原创',
		    type:'line',
		    data:y_item_origin,
		   
		    },
		    {
		    name:'评论',
		    type:'line',
		    data:y_item_comment,
		 
		    },
		    {
		    name:'转发',
		    type:'line',
		    data:y_item_forwarding,
		    
		    }
		]
    };
		myChart.setOption(option) ;   		
	
  },

  Draw_blog_scan_area: function(data){
  	$('#blog_scan_area_time').empty();    
    var item = data;
	var html = '';
	if (!item){
		html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 40%;">呀，暂时还没有数据喔~</p></div>'
	}else{
		var blog_num_max_local_time = Math.min(100,item.length);

	    blog_num_max_global_time = blog_num_max_local_time;

		var num_page = Math.ceil(blog_num_max_local_time/10);  //num_page表示微博数据共有多少页
		var item_i_time = no_page_time*10;
		
		var max_i_time = item_i_time+Math.min(10,blog_num_max_local_time-item_i_time);
		
		for (i=item_i_time; i<max_i_time; i++){

			if (item[i][1].photo_url=='unknown'){
				item[i][1].photo_url='../../static/images/photo_unknown.png'
			}
			if (item[i][1].uname=='unknown'){
				item[i][1].uname=item[i][1].uid
			}
			var item_timestamp_datetime = new Date(parseInt(item[i][1].timestamp) * 1000).toLocaleString();
			// var item_timestamp_datetime = format(parseInt(item[i][1].timestamp).formate_data_time);
			
			html += '<div class="blog_time" id="blog_time">';
			//html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
			html += '<div><img class="img-circle" src="'+item[i][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
			html +=	'<div>';
			//html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
			html += '<a target="_blank" href="/index/viewinformation/?uid='+item[i][1].uid+'" class="user_name" style="float:left;">'+item[i][1].uname+'</a>';
			//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
			//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
			html += '</div>';
			html += '<div class="blog_text">'
			//html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
			html += '<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+item[i][1].text+'</font></p>';
			html += '<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">';
			//html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
			//html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
			html += '<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>';
			html += '<span style="display: inline-block;margin-left:500px;">转发数('+item[i][1].retweeted+')&nbsp;|&nbsp;</span>';
			//html += '<span id="oule" style="margin-top: -3%;display: inline-block;margin-left: 54%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;&nbsp;&nbsp;|</span>';
			html += '<span style="" >评论数('+item[i][1].comment+')</span>';
			//html += '<span style="margin-top: -3%;display: inline-block;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
			//html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
			html += '</p>';
			html += '</div>';					 	
			html += '</div>';
		// }
		}
		   html += '<div id="PageTurn" class="pager" style="height: 40px;z-index: 99;">'
	       html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
	       html += '</div>'


	}
	
	$('#blog_scan_area_time').append(html);
  },
				                    				
}


var topic_analysis_time = new topic_analysis_time();
 
function Draw_time_trend_line_result(){
    url = "/topic_time_analyze/mtype_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	topic_analysis_time.call_sync_ajax_request(url,topic_analysis_time.Draw_time_trend_line);
}		

function Draw_blog_scan_area_order_result(){
    url_order = "/topic_time_analyze/time_order_weibos/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&sort_item='+sort_item;
 	topic_analysis_time.call_sync_ajax_request(url_order,topic_analysis_time.Draw_blog_scan_area);
}
function time_load(){
	Draw_time_trend_line_result();
	Draw_blog_scan_area_order_result();
}

Draw_time_trend_line_result();
Draw_blog_scan_area_order_result();




