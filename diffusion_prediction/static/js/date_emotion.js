// var topic = 'aoyunhui';
// var start_ts = 1468166400;
// var end_ts = 1468949400;
var pointInterval=3600;
var case_val = 1;

var sort_item_emotion = 'timestamp';
var sen = 1;

var no_page_emotion = 0;
var blog_num_max_global_emotion = 0;

function get_emotion_type(val) {
 	case_val = val;
 	$('#main_emotion_2').empty();
  	$('#top15_content_emotion').empty();
 	Draw_emotion_map_result();
 	//可以设置默认值（正向），随着页面加载。
 }


function set_order_type_emotion(type){
	if(type=='time'){
		sort_item_emotion = 'timestamp';
		Draw_blog_scan_area_emotion_result();

	}else if(type=='hot'){
		sort_item_emotion = 'retweeted';
		Draw_blog_scan_area_emotion_result();
	}
}

function get_per_time_emotion(val) {
	pointInterval = val;

	Draw_emotion_trend_line_result();
}


function set_emotion_type(type){
	if(type=='0'){
		sen=0;
		Draw_blog_scan_area_emotion_result();

	}else if(type=='1'){
		sen=1;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='2'){
		sen=2;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='3'){
		sen=3;
		Draw_blog_scan_area_emotion_result();

	}else if(type=='4'){
		sen=4;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='5'){
		sen=5;
		Draw_blog_scan_area_emotion_result();
	}else if(type=='6'){
		sen=6;
		Draw_blog_scan_area_emotion_result();
	}
}


function getLocalTime(nS) {
	var timeTrans = new Date(parseInt(nS) * 1000);
	return timeTrans.toLocaleString('chinese',{hour12:false});
}



function topic_analysis_emotion(){
 
}

topic_analysis_emotion.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },

  Draw_emotion_trend_line:function(data){
  		// $('#main_emotion_1').empty();
  		var x_item = [];
	 	var y_item_pos = [];
		var y_item_neu = [];
		var y_item_angry = [];
		var y_item_anxiety = [];
		var y_item_sad = [];
		var y_item_hate = [];
		var y_item_otherneg = [];
	 	for (var key in data){
	 		
			//key_datetime = new Date(parseInt(key)*1000).format('yyyy/MM/dd hh:mm');
			key_datetime = getLocalTime(key);
			x_item.push(key_datetime);
			y_item_pos.push(data[key][1]);
			y_item_neu.push(data[key][0]);
			y_item_angry.push(data[key][2]);
			y_item_anxiety.push(data[key][3]);
			y_item_sad.push(data[key][4]);
			y_item_hate.push(data[key][5]);
			y_item_otherneg.push(data[key][6]);
		}
		
  		var myChart = echarts.init(document.getElementById('main_emotion_1'));
 		var option = {
	    	tooltip : {
	        	trigger: 'axis'
	   		},
	    	legend: {
	        	data:['积极','中立','生气','焦虑','悲伤','厌恶','消极其他']
	    	},
	    	toolbox: {
		        show : true,
		        feature : {
		            saveAsImage : {show: true}
		        }
		    },
	   		calculable : true,
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
	                formatter: '{value}'
	            }
	        }
	    	],
	    	series : [
		        {
		            name:'积极',
		            type:'line',
		            data:y_item_pos,

		        },
		        {
		            name:'中立',
		            type:'line',
		            data:y_item_neu,

		        },
		        {
		            name:'生气',
		            type:'line',
		            data:y_item_angry,

		        },
		        {
		            name:'焦虑',
		            type:'line',
		            data:y_item_anxiety,

		        },
		      	{
		            name:'悲伤',
		            type:'line',
		            data:y_item_sad,

		        },
		        {
		            name:'厌恶',
		            type:'line',
		            data:y_item_hate,

		        },
		      	{
		            name:'消极其他',
		            type:'line',
		            data:y_item_otherneg,

		        }
	        ]
	    };
		myChart.setOption(option);

  },

  Draw_emotion_map:function(data){
  		$('#main_emotion_2').empty();
  		$('#top15_content_emotion').empty();
		var item = data;
	 	var item_json = [];
	 	var item_province_json_pos = [];
	 	var item_province_json_neu = [];
	 	var item_province_json_otherneg = [];
	 	var item_province_json_angry = [];
	 	var item_province_json_anxiety = [];
	 	var item_province_json_sad = [];
	 	var item_province_json_hate = [];

	 	var item_city_json_pos = [];
	 	var item_city_json_neu = [];
	 	var item_city_json_otherneg = [];
	 	var item_city_json_angry = [];
	 	var item_city_json_anxiety = [];
	 	var item_city_json_sad = [];
	 	var item_city_json_hate = [];

	 	var item_city_json_pos_new=[];
	 	var item_city_json_neu_new=[];
	 	var item_city_json_otherneg_new = [];
	 	var item_city_json_angry_new = [];
	 	var item_city_json_anxiety_new = [];
	 	var item_city_json_sad_new = [];
	 	var item_city_json_hate_new = [];

	 	var item_json_pos = [];
	 	var item_json_neu = [];
	 	var item_json_otherneg = [];
	 	var item_json_angry = [];
	 	var item_json_anxiety = [];
	 	var item_json_sad = [];
	 	var item_json_hate = [];
	 	var html = '';
	 	


		//正向情绪
		for(key in item[0]){
			for(i=0;i<item[0][key].length;i++){
				item_province_json_pos.push({name:item[0][key][i][0],value:item[0][key][i][1].total});

				for(key_val in item[0][key][i][1]){
		 			if(key_val=='total'){
		 				continue;
		 			}
		 			item_city_json_pos.push({name:key_val,value:item[0][key][i][1][key_val]});
		 			
		 		}
			}

		}
		for(k=0;k<item_city_json_pos.length;k++){
			if(item_city_json_pos[k].name=='unknown'){
			item_city_json_pos[k].name='未知';
			}
			item_city_json_pos_new.push({name:item_city_json_pos[k].name+'市',value:item_city_json_pos[k].value});
			
	 	}
	 			
		item_json_pos = item_province_json_pos.concat(item_city_json_pos_new);
		

		//中立情绪
		for(key in item[1]){
			for(i=0;i<item[1][key].length;i++){
				item_province_json_neu.push({name:item[1][key][i][0],value:item[1][key][i][1].total});

				for(key_val in item[1][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_neu.push({name:key_val,value:item[1][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_neu.length;k++){
			if(item_city_json_neu[k].name=='unknown'){
			item_city_json_neu[k].name='未知';
			}
			item_city_json_neu_new.push({name:item_city_json_neu[k].name+'市',value:item_city_json_neu[k].value});
		
	 	}
	 			
		item_json_neu = item_province_json_neu.concat(item_city_json_neu_new);
		

		//焦虑情绪
		for(key in item[2]){
			for(i=0;i<item[2][key].length;i++){
				item_province_json_anxiety.push({name:item[2][key][i][0],value:item[2][key][i][1].total});

				for(key_val in item[2][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_anxiety.push({name:key_val,value:item[2][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_anxiety.length;k++){
			if(item_city_json_anxiety[k].name=='unknown'){
			item_city_json_anxiety[k].name='未知';
			}
			item_city_json_anxiety_new.push({name:item_city_json_anxiety[k].name+'市',value:item_city_json_anxiety[k].value});
			
	 	}
	 			
		item_json_anxiety = item_province_json_anxiety.concat(item_city_json_anxiety_new);
		

		//生气情绪
		for(key in item[3]){
			for(i=0;i<item[3][key].length;i++){
				item_province_json_angry.push({name:item[3][key][i][0],value:item[3][key][i][1].total});

				for(key_val in item[3][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_angry.push({name:key_val,value:item[3][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_angry.length;k++){
			if(item_city_json_angry[k].name=='unknown'){
			item_city_json_angry[k].name='未知';
			}
			item_city_json_angry_new.push({name:item_city_json_angry[k].name+'市',value:item_city_json_angry[k].value});
		
	 	}
	 			
		item_json_angry = item_province_json_angry.concat(item_city_json_angry_new);
		

		//厌恶情绪
		for(key in item[4]){
			for(i=0;i<item[4][key].length;i++){
				item_province_json_hate.push({name:item[4][key][i][0],value:item[4][key][i][1].total});

				for(key_val in item[4][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_hate.push({name:key_val,value:item[4][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_hate.length;k++){
			if(item_city_json_hate[k].name=='unknown'){
			item_city_json_hate[k].name='未知';
			}
			item_city_json_hate_new.push({name:item_city_json_hate[k].name+'市',value:item_city_json_hate[k].value});
			
	 	}
	 			
		item_json_hate = item_province_json_hate.concat(item_city_json_hate_new);
		
		//悲伤情绪
		for(key in item[5]){
			for(i=0;i<item[5][key].length;i++){
				item_province_json_sad.push({name:item[5][key][i][0],value:item[5][key][i][1].total});

				for(key_val in item[5][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_sad.push({name:key_val,value:item[5][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_sad.length;k++){
			if(item_city_json_sad[k].name=='unknown'){
			item_city_json_sad[k].name='未知';
			}
			item_city_json_sad_new.push({name:item_city_json_sad[k].name+'市',value:item_city_json_sad[k].value});
			
	 	}
	 			
		item_json_sad = item_province_json_sad.concat(item_city_json_sad_new);
		

		//消极其他情绪
		for(key in item[6]){
			for(i=0;i<item[6][key].length;i++){
				item_province_json_otherneg.push({name:item[6][key][i][0],value:item[6][key][i][1].total});

				for(key_val in item[6][key][i][1]){
			 			if(key_val=='total'){
			 				continue;
			 			}
			 			item_city_json_otherneg.push({name:key_val,value:item[6][key][i][1][key_val]});
			 			
		 		}
			}
		}
		for(k=0;k<item_city_json_otherneg.length;k++){
			if(item_city_json_otherneg[k].name=='unknown'){
			item_city_json_otherneg[k].name='未知';
			}
			item_city_json_otherneg_new.push({name:item_city_json_otherneg[k].name+'市',value:item_city_json_otherneg[k].value});
			
	 	}
	 			
		item_json_otherneg = item_province_json_otherneg.concat(item_city_json_otherneg_new);
		


		//选择各种情绪
		if(case_val == 1){
			item_legend = '正向';
			item_item = item_json_pos;
			item_item_rank = item_province_json_pos;

		}else if (case_val == 0){
			item_legend = '中立';
			item_item = item_json_neu;
			item_item_rank = item_province_json_neu;

		}else if(case_val == 2){
			item_legend = '生气';
			item_item = item_json_angry;
			item_item_rank = item_province_json_angry;

		}else if (case_val == 3){
			item_legend = '焦虑';
			item_item = item_json_anxiety;
			item_item_rank = item_province_json_anxiety;

		}else if(case_val == 4){
			item_legend = '悲伤';
			item_item = item_json_sad;
			item_item_rank = item_province_json_sad;

		}else if (case_val == 5){
			item_legend = '厌恶';
			item_item = item_json_hate;
			item_item_rank = item_province_json_hate;

		}else if(case_val == 6){
			item_legend = '消极其他';
			item_item = item_json_otherneg;
			item_item_rank = item_province_json_otherneg;

		}

        item_item_rank.sort(function(a,b){
            return b.value-a.value});

	 	var myChart = echarts.init(document.getElementById('main_emotion_2'));
 
		require(
				[
					'echarts',
					'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					var ecConfig = require('echarts/config'); //放进require里的function{}里面
					var zrEvent = require('zrender/tool/event');
							
					// 基于准备好的dom，初始化echarts图表
					var myChart = echarts.init(document.getElementById('main_emotion_2'));
					var curIndx = 0;
					var mapType = [
						    'china',
						    // 23个省
						    '广东', '青海', '四川', '海南', '陕西', 
						    '甘肃', '云南', '湖南', '湖北', '黑龙江',
						    '贵州', '山东', '江西', '河南', '河北',
						    '山西', '安徽', '福建', '浙江', '江苏', 
						    '吉林', '辽宁', '台湾',
						    // 5个自治区
						    '新疆', '广西', '宁夏', '内蒙古', '西藏', 
						    // 4个直辖市
						    '北京', '天津', '上海', '重庆',
						    // 2个特别行政区
						    '香港', '澳门'
						];
					document.getElementById('main_emotion_2').onmousewheel = function (e){
					    var event = e || window.event;
					    curIndx += zrEvent.getDelta(event) > 0 ? (-1) : 1;
					    if (curIndx < 0) {
					        curIndx = mapType.length - 1;
					    }
					    var mt = mapType[curIndx % mapType.length];
					    if (mt == 'china') {
					        option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}';
					    }
					    else{
					        option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}';
					    }
					    option.series[0].mapType = mt;
					    option.title.subtext = mt + ' （滚轮或点击切换）';
					    myChart.setOption(option, true);
					    
					    zrEvent.stop(event);
					};
					myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
					    var len = mapType.length;
					    var mt = mapType[curIndx % len];
					    if (mt == 'china') {
					        // 全国选择时指定到选中的省份
					        var selected = param.selected;
					        for (var i in selected) {
					            if (selected[i]) {
					                mt = i;
					                while (len--) {
					                    if (mapType[len] == mt) {
					                        curIndx = len;
					                    }
					                }
					                break;
					            }
					        }
					        option.tooltip.formatter = '滚轮切换省份或点击返回全国<br/>{b}';
					    }
					    else {
					        curIndx = 0;
					        mt = 'china';
					        option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}';
					    }
					    option.series[0].mapType = mt;
					    option.title.subtext = mt + ' （滚轮或点击切换）';
					    myChart.setOption(option, true);
					});
					var option = {
					    title: {
					        text : '全国34个省市自治区',
					        subtext : '中国 （滚轮或点击切换）'
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: '滚轮切换或点击进入该省<br/>{b}'
					    },
					    dataRange: {
					        min: 0,
					        //max: 1000,
					        max:item_item_rank[0].value,
							y:'400px',
							color:['#0270dd','white'],
					        text:['高','低'],           // 文本，默认为数值文本
					        calculable : true
					    },
					    series : [
					        {
					            // name: '随机数据',
					            type: 'map',
					            mapType: 'china',
					            selectedMode : 'single',
					            itemStyle:{
									normal: {
										show: true,
										borderColor:"#252422",
										borderWidth:"1",
										label: {
											show: true,
										},
									},
					                emphasis:{label:{show:true}}
					            },
					            data:item_item
					
					        }
					    ]
					};
			 		
			 		
			                myChart.setOption(option);     
						
		}
		)
		var rank_html = '';
		rank_html += '<table id="table" style="table-layout:fixed">';
        for(var k=0;k<Math.min(15,item_item_rank.length);k++){

			rank_html += '<tr>';	
			rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
			rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_item_rank[k].name+'</td>';
			rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_item_rank[k].value+'</td>';			
			rank_html += '</tr>';		
        }
        $('#top15_content_emotion').append(rank_html);

  },

  Draw_blog_scan_area_emotion:function (data){
    $('#group_emotion_loading4').css('display', 'none');
    $('#input-table4').show();
    var dataArray = data;
    $('#Pagenums4').text(dataArray.length);
    var PageNo=document.getElementById('PageNo4');                   //设置每页显示行数
    var InTb=document.getElementById('input-table4');               //表格
    var Fp=document.getElementById('F-page4');                      //首页
    var Nep=document.getElementById('Nex-page4');                  //下一页
    var Prp=document.getElementById('Pre-page4');                  //上一页
    var Lp=document.getElementById('L-page4');                     //尾页
    var S1=document.getElementById('s14');                         //总页数
    var S2=document.getElementById('s24');                         //当前页数
    var currentPage;                                              //定义变量表示当前页数
    var SumPage;

    if(PageNo.innerText!='')                                       //判断每页显示是否为空
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

var topic_analysis_emotion = new topic_analysis_emotion();

function Draw_emotion_trend_line_result(){
	// start_ts = 1468166400;
 // 	end_ts = 1468949400;

 	// topic = topic_name_on_detail;
  //   start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
  //   end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

 //    var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
	// var start_ts = 1482681600;
	// var end_ts = 1483113600;

	url = "/topic_sen_analyze/sen_time_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&pointInterval='+pointInterval;
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_trend_line);
}

function Draw_emotion_map_result(){

	// start_ts=1468944000;
	// end_ts=1471622400;

	// topic = topic_name_on_detail;
 //  	start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
 //  	end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

 // 	var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
	// var start_ts = 1482681600;
	// var end_ts = 1483113600;

    url = "/topic_sen_analyze/sen_province_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_emotion_map);
}

function Draw_blog_scan_area_emotion_result(){
	// start_ts = 1468166400;
 // 	end_ts = 1468949400;
    // topic = topic_name_on_detail;
    // start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
    // end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

 //    var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
	// var start_ts = 1482681600;
	// var end_ts = 1483113600;


    url = "/topic_sen_analyze/sen_weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&sort_item='+sort_item_emotion+'&sen='+sen;
 	topic_analysis_emotion.call_sync_ajax_request(url,topic_analysis_emotion.Draw_blog_scan_area_emotion);
}		

function emotion_load(){
	Draw_emotion_trend_line_result();
	Draw_emotion_map_result();
	Draw_blog_scan_area_emotion_result();
}
