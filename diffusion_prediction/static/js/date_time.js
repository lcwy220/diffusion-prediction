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

  Draw_blog_scan_area: function (data){
    $('#group_emotion_loading').css('display', 'none');
    $('#input-table').show();
    var dataArray = data;
    $('#Pagenums').text(dataArray.length);
    var PageNo=document.getElementById('PageNo');                   //设置每页显示行数
    var InTb=document.getElementById('input-table');               //表格
    var Fp=document.getElementById('F-page');                      //首页
    var Nep=document.getElementById('Nex-page');                  //下一页
    var Prp=document.getElementById('Pre-page');                  //上一页
    var Lp=document.getElementById('L-page');                     //尾页
    var S1=document.getElementById('s1');                         //总页数
    var S2=document.getElementById('s2');                         //当前页数
    var currentPage;                                              //定义变量表示当前页数
    var SumPage;

    if(PageNo.innerText!="")                                       //判断每页显示是否为空
    {
        InTb.innerHTML='';                                     //每次进来都清空表格
        S2.innerHTML='';                                        //每次进来清空当前页数
        currentPage=1;                                          //首页为1
        S2.appendChild(document.createTextNode(currentPage));
        S1.innerHTML='';                                        //每次进来清空总页数
        if(dataArray.length%PageNo.innerText==0)                    //判断总的页数
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        var oTBody=document.createElement('tbody');               //创建tbody
        oTBody.setAttribute('class','In-table');                   //定义class
        InTb.appendChild(oTBody);
        //将创建的tbody添加入table
        var html_c = '';
        if(dataArray==''){
            html_c = "<p style='text-align: center'>用户未发布任何微博</p>";
            oTBody.innerHTML = html_c;
        }else{

            for(i=0;i<parseInt(PageNo.innerText);i++)
            {                                                          //循环打印数组值
                oTBody.insertRow(i);
                //--判断内容
               if (dataArray[i][1].photo_url=='unknown'){
				dataArray[i][1].photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i][1].uname=='unknown'){
				dataArray[i][1].uname=dataArray[i][1].uid
			}
                var item_timestamp_datetime = new Date(parseInt(dataArray[i][1].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i][1].uid+'" class="user_name" style="float:left;">'+dataArray[i][1].uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i][1].text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i][1].retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i][1].comment+')</span>'+
			 			'</p>'+
			 			'</div>'+
			 			'</div>';
                oTBody.rows[i].insertCell(0);
                oTBody.rows[i].cells[0].innerHTML = html_c;
            }

        }
    }

    Fp.onclick=function()
    {

        if(PageNo.innerText!="")                                       //判断每页显示是否为空
        {
            InTb.innerHTML='';                                     //每次进来都清空表格
            S2.innerHTML='';                                        //每次进来清空当前页数
            currentPage=1;                                          //首页为1
            S2.appendChild(document.createTextNode(currentPage));
            S1.innerHTML='';                                        //每次进来清空总页数
            if(dataArray.length%PageNo.innerText==0)                    //判断总的页数
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            var oTBody=document.createElement('tbody');               //创建tbody
            oTBody.setAttribute('class','In-table');                   //定义class
            InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
            var html_c = '';

            if(dataArray==''){
                html_c = "<p style='text-align: center'>用户未发布任何微博</p>";
                oTBody.rows[0].cells[0].innerHTML = html_c;
            }else{

                for(i=0;i<parseInt(PageNo.innerText);i++)
                {                                                          //循环打印数组值
                    oTBody.insertRow(i);
                   //--判断内容
               if (dataArray[i][1].photo_url=='unknown'){
				dataArray[i][1].photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i][1].uname=='unknown'){
				dataArray[i][1].uname=dataArray[i][1].uid
			}
                var item_timestamp_datetime = new Date(parseInt(dataArray[i][1].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i][1].uid+'" class="user_name" style="float:left;">'+dataArray[i][1].uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i][1].text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i][1].retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i][1].comment+')</span>'+
			 			'</p>'+
			 			'</div>'+
			 			'</div>';
                        oTBody.rows[i].insertCell(0);
                    oTBody.rows[i].cells[0].innerHTML = html_c;
                }
            }
        }
    }

    Nep.onclick=function()
    {
        if(currentPage<SumPage)                                 //判断当前页数小于总页数
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.innerText==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage+1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;                                                 //定义变量a
            a=PageNo.innerText*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
            var c;                                                  //定义变量c
            if(dataArray.length-a>=PageNo.innerText)                  //判断下一页数组数据是否小于每页显示行数
            {
                c=PageNo.innerText;
            }
            else
            {
                c=dataArray.length-a;
            }
            for(i=0;i<c;i++)
            {
                oTBody.insertRow(i);
                //--判断内容（次数循环是 i+a）
           

                //--判断内容
               if (dataArray[i+a][1].photo_url=='unknown'){
				dataArray[i+a][1].photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i+a][1].uname=='unknown'){
				dataArray[i+a][1].uname=dataArray[i+a][1].uid
			}
			oTBody.rows[i].insertCell(0);
			         var item_timestamp_datetime = new Date(parseInt(dataArray[i+a][1].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i+a][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a][1].uid+'" class="user_name" style="float:left;">'+dataArray[i+a][1].uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a][1].text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i+a][1].retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i+a][1].comment+')</span>'+
			 			'</p>'+
			 			'</div>'+
			 			'</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
                //数组从第i+a开始取值
            }
        }
    }

    Prp.onclick=function()
    {
        if(currentPage>1)                        //判断当前是否在第一页
        {
            InTb.innerHTML='';
            S1.innerHTML='';
            if(dataArray.length%PageNo.innerText==0)
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText);
            }
            else
            {
                SumPage=parseInt(dataArray.length/PageNo.innerText)+1
            }
            S1.appendChild(document.createTextNode(SumPage));
            S2.innerHTML='';
            currentPage=currentPage-1;
            S2.appendChild(document.createTextNode(currentPage));
            var oTBody=document.createElement('tbody');
            oTBody.setAttribute('class','In-table');
            InTb.appendChild(oTBody);
            var a;
            a=PageNo.innerText*(currentPage-1);
            for(i=0;i<parseInt(PageNo.innerText);i++)
            {
                oTBody.insertRow(i);
                //--判断内容（次数循环是 i+a）
                if (dataArray[i+a][1].photo_url=='unknown'){
				dataArray[i+a][1].photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i+a][1].uname=='unknown'){
				dataArray[i+a][1].uname=dataArray[i+a][1].uid
			}
			oTBody.rows[i].insertCell(0);
			         var item_timestamp_datetime = new Date(parseInt(dataArray[i+a][1].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i+a][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a][1].uid+'" class="user_name" style="float:left;">'+dataArray[i+a][1].uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a][1].text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i+a][1].retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i+a][1].comment+')</span>'+
			 			'</p>'+
			 			'</div>'+
			 			'</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
                    oTBody.rows[i].cells[0].innerHTML = html_c;
            }
        }
    }

    Lp.onclick=function()
    {
        InTb.innerHTML='';
        S1.innerHTML='';
        if(dataArray.length%PageNo.innerText==0)
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText);
        }
        else
        {
            SumPage=parseInt(dataArray.length/PageNo.innerText)+1
        }
        S1.appendChild(document.createTextNode(SumPage));
        S2.innerHTML='';
        currentPage=SumPage;
        S2.appendChild(document.createTextNode(currentPage));
        var oTBody=document.createElement('tbody');
        oTBody.setAttribute('class','In-table');
        InTb.appendChild(oTBody);
        var a;
        a=PageNo.innerText*(currentPage-1);
        var c;
        if(dataArray.length-a>=PageNo.innerText)
        {
            c=PageNo.innerText;
        }
        else
        {
            c=dataArray.length-a;
        }
        for(i=0;i<c;i++)
        {
            oTBody.insertRow(i);
             if (dataArray[i+a][1].photo_url=='unknown'){
				dataArray[i+a][1].photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i+a][1].uname=='unknown'){
				dataArray[i+a][1].uname=dataArray[i+a][1].uid
			}
			oTBody.rows[i].insertCell(0);
			         var item_timestamp_datetime = new Date(parseInt(dataArray[i+a][1].timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i+a][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i+a][1].uid+'" class="user_name" style="float:left;">'+dataArray[i+a][1].uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i+a][1].text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i+a][1].retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i+a][1].comment+')</span>'+
			 			'</p>'+
			 			'</div>'+
			 			'</div>';
                oTBody.rows[i].cells[0].innerHTML = html_c;
                oTBody.rows[i].cells[0].innerHTML = html_c;
        }
    }
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




