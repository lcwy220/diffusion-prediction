
var province = '北京';
var sort_item = 'timestamp';
var no_page_place = 0;
var blog_num_max_global_place = 0;

//应该直接排序，然后再取前十名，不应该求最大值，然后将其删除再取最大值。



function set_order_type_place(type){
	if(type=='time'){
		sort_item = 'timestamp';
		Draw_blog_scan_area_place_result();

	}else if(type=='hot'){
		sort_item = 'retweeted';
		Draw_blog_scan_area_place_result();
	}
}


//上一页
function up_place(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里
     if(no_page_place==0){
         alert("当前已经是第一页!");
         return false;
     }else{
 		no_page_place--;
 		//console.log(no_page_place);
 		//console.log('执行了上一页操作');
 		Draw_blog_scan_area_place_result();

     }
}
//下一页
function down_place(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里

     if(no_page_place==Math.min(9,Math.ceil(blog_num_max_global_place/10)-1)){
         alert("当前已经是最后一页!");
         //console.log(no_page_place);
         return false;
     }else{
 		no_page_place++;
 		//console.log(no_page_place);
 		//console.log('执行了下一页操作');
 		Draw_blog_scan_area_place_result();

     }
}

function first_place(){

     no_page_place=0;
     /*这里在将当前页数赋值到页面做显示标志*/
     Draw_blog_scan_area_place_result();
}
//下一页
function last_place(){

     no_page_place=(Math.ceil(blog_num_max_global_place/10)-1);

     /*这里在将当前页数赋值到页面做显示标志*/
     // window.location.href="a.htm?b=123&b=qwe&c="+pageno;
     Draw_blog_scan_area_place_result();
}




function set_place_type(type){
	if(type=='北京'){
		province = '北京';
		Draw_blog_scan_area_place_result();
	}else if(type=='天津'){
		province = '天津';
		Draw_blog_scan_area_place_result();
	}else if(type=='上海'){
		province = '上海';
		Draw_blog_scan_area_place_result();
	}else if(type=='重庆'){
		province = '重庆';
		Draw_blog_scan_area_place_result();
	}else if(type=='黑龙江'){
		province = '黑龙江';
		Draw_blog_scan_area_place_result();
	}else if(type=='吉林'){
		province = '吉林';
		Draw_blog_scan_area_place_result();
	}else if(type=='辽宁'){
		province = '辽宁';
		Draw_blog_scan_area_place_result();
	}else if(type=='四川'){
		province = '四川';
		Draw_blog_scan_area_place_result();
	}else if(type=='河北'){
		province = '河北';
		Draw_blog_scan_area_place_result();
	}else if(type=='新疆'){
		province = '新疆';
		Draw_blog_scan_area_place_result();
	}else if(type=='甘肃'){
		province = '甘肃';
		Draw_blog_scan_area_place_result();
	}else if(type=='青海'){
		province = '青海';
		Draw_blog_scan_area_place_result();
	}else if(type=='陕西'){
		province = '陕西';
		Draw_blog_scan_area_place_result();
	}else if(type=='宁夏'){
		province = '宁夏';
		Draw_blog_scan_area_place_result();
	}else if(type=='河南'){
		province = '河南';
		Draw_blog_scan_area_place_result();
	}else if(type=='山东'){
		province = '山东';
		Draw_blog_scan_area_place_result();
	}else if(type=='山西'){
		province = '山西';
		Draw_blog_scan_area_place_result();
	}else if(type=='安徽'){
		province = '安徽';
		Draw_blog_scan_area_place_result();
	}else if(type=='湖北'){
		province = '湖北';
		Draw_blog_scan_area_place_result();
	}else if(type=='湖南'){
		province = '湖南';
		Draw_blog_scan_area_place_result();
	}else if(type=='江苏'){
		province = '江苏';
		Draw_blog_scan_area_place_result();
	}else if(type=='内蒙古'){
		province = '内蒙古';
		Draw_blog_scan_area_place_result();
	}else if(type=='贵州'){
		province = '贵州';
		Draw_blog_scan_area_place_result();
	}else if(type=='云南'){
		province = '云南';
		Draw_blog_scan_area_place_result();
	}else if(type=='广西'){
		province = '广西';
		Draw_blog_scan_area_place_result();
	}else if(type=='西藏'){
		province = '西藏';
		Draw_blog_scan_area_place_result();
	}else if(type=='浙江'){
		province = '浙江';
		Draw_blog_scan_area_place_result();
	}else if(type=='江西'){
		province = '江西';
		Draw_blog_scan_area_place_result();
	}else if(type=='广东'){
		province = '广东';
		Draw_blog_scan_area_place_result();
	}else if(type=='福建'){
		province = '福建';
		Draw_blog_scan_area_place_result();
	}else if(type=='海南'){
		province = '海南';
		Draw_blog_scan_area_place_result();
	}else if(type=='香港'){
		province = '香港';
		Draw_blog_scan_area_place_result();
	}else if(type=='澳门'){
		province = '澳门';
		Draw_blog_scan_area_place_result();
	}else if(type=='台湾'){
		province = '台湾';
		Draw_blog_scan_area_place_result();
	}
}


function topic_analysis_place(){
 
}

topic_analysis_place.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },
	Draw_geo_map:function(data){
		var data1=[],data2=[],data3=[];
		for (var key in data){
			if (key==1){  //原创
				for (var key_1 in data[key]) {
					data1.push([key_1,data[key][key_1]])
				}
			}else if (key==2){ //转发
				for (var key_2 in data[key]) {
					data2.push([key_2,data[key][key_2]])
				}
			}else {  //评论
				for (var key_3 in data[key]) {
					data3.push([key_3,data[key][key_3]])
				}
			}
		}
	 	$('#main_place').empty();
	 	$('#top15_content_place').empty();
		label_1(data1);
	},

	// Draw_geo_map{}


	Draw_blog_scan_area_place:  function (data){
    $('#group_emotion_loading2').css('display', 'none');
    $('#input-table2').show();
    var dataArray = data;
    $('#Pagenums2').text(dataArray.length);
    var PageNo=document.getElementById('PageNo2');                   //设置每页显示行数
    var InTb=document.getElementById('input-table2');               //表格
    var Fp=document.getElementById('F-page2');                      //首页
    var Nep=document.getElementById('Nex-page2');                  //下一页
    var Prp=document.getElementById('Pre-page2');                  //上一页
    var Lp=document.getElementById('L-page2');                     //尾页
    var S1=document.getElementById('s12');                         //总页数
    var S2=document.getElementById('s22');                         //当前页数
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



var topic_analysis_place = new topic_analysis_place();
 
function Draw_geo_map_result(){
	
	//topic = topic_name_on_detail;
	//start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
	//end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

	// var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
	// var start_ts = 1482681600;
	// var end_ts = 1483113600;

    url = "/topic_geo_analyze/geo_weibo_count/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
 	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_geo_map);
}	

function Draw_blog_scan_area_place_result(){

    url = "/topic_geo_analyze/geo_weibo_content/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&province='+province+'&sort_item='+sort_item;
 	topic_analysis_place.call_sync_ajax_request(url,topic_analysis_place.Draw_blog_scan_area_place);
}

function place_load(){
	Draw_geo_map_result();
	Draw_blog_scan_area_place_result();
}

function label_1(la_1) {
	$('#main_place').empty();
	$('#top15_content_place').empty();
	var item=la_1;
	var item_json = [];
	var item_province_json = [];
	var item_city_json = [];
	var item_city_json_new=[];
	var html = '';
	var city_dict = {};


	for (i=0;i<item.length;i++){
		item_province_json.push({name:item[i][0],value:item[i][1].total});
		for(key in item[i][1]){
			if(key=='total'){
				continue;
			}
			item_city_json.push({name:key,value:item[i][1][key]});

		}
	}
	for(k=0;k<item_city_json.length;k++){
		if(item_city_json[k].name=='unknown'){
			item_city_json[k].name='未知';
		}
		item_city_json_new.push({name:item_city_json[k].name+'市',value:item_city_json[k].value});
	}

	item_json = item_province_json.concat(item_city_json_new);
	item_province_json.sort(function(a,b){
		return b.value-a.value});

	var myChart = echarts.init(document.getElementById('main_place'));

	require(
		[
			'echarts',
			'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
		],
		function (ec) {

			var ecConfig = require('echarts/config'); //放进require里的function{}里面
			//var ecConfig = echarts.config;
			var zrEvent = require('zrender/tool/event');
			//var zrEvent = zrender.src.core.event;

			// 基于准备好的dom，初始化echarts图表
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
			document.getElementById('main_place').onmousewheel = function (e){
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
					option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}:{c}';
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
				// legend: {
				// 	orient: 'vertical',
				// 	x:'right',
				// 	data:['微博数据']
				// }
				dataRange: {
					min: 0,
					//max: 100,
					max:item_province_json[0].value,
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
						data:item_json

					}
				]
			};

			myChart.setOption(option);

		}
	)
	var rank_html = '';
	rank_html += '<table id="table">';
	for(var k=0;k<Math.min(15,item_province_json.length);k++){

		//         if (item_province_json[k].name=='unknown'){
		// 	item_province_json[k].name='未知'
		// }


		rank_html += '<tr>';
		rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
		rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_province_json[k].name+'</td>';
		rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_province_json[k].value+'</td>';
		rank_html += '</tr>';

	}
	$('#top15_content_place').append(rank_html);
}

function label_2(la_2) {
	$('#main_place').empty();
	$('#top15_content_place').empty();
	var item=la_2;
	var item_json = [];
	var item_province_json = [];
	var item_city_json = [];
	var item_city_json_new=[];
	var html = '';
	var city_dict = {};


	for (i=0;i<item.length;i++){
		item_province_json.push({name:item[i][0],value:item[i][1].total});
		for(key in item[i][1]){
			if(key=='total'){
				continue;
			}
			item_city_json.push({name:key,value:item[i][1][key]});

		}
	}
	for(k=0;k<item_city_json.length;k++){
		if(item_city_json[k].name=='unknown'){
			item_city_json[k].name='未知';
		}
		item_city_json_new.push({name:item_city_json[k].name+'市',value:item_city_json[k].value});
	}

	item_json = item_province_json.concat(item_city_json_new);
	item_province_json.sort(function(a,b){
		return b.value-a.value});

	var myChart = echarts.init(document.getElementById('main_place'));

	require(
		[
			'echarts',
			'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
		],
		function (ec) {

			var ecConfig = require('echarts/config'); //放进require里的function{}里面
			//var ecConfig = echarts.config;
			var zrEvent = require('zrender/tool/event');
			//var zrEvent = zrender.src.core.event;

			// 基于准备好的dom，初始化echarts图表
			//var myChart = ec.init(document.getElementById('main'));
			//var myChart = echarts.init(document.getElementById('main_place'));
			// 过渡---------------------
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
			document.getElementById('main_place').onmousewheel = function (e){
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
					option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}:{c}';
				}
				option.series[0].mapType = mt;
				option.title.subtext = mt + ' （滚轮或点击切换）';
				myChart.setOption(option, true);
			});
			var option = {
				title: {
					text : '全国34个省市自治区',
					subtext : 'china （滚轮或点击切换）'
				},
				tooltip : {
					trigger: 'item',
					formatter: '滚轮切换或点击进入该省<br/>{b}'
				},
				legend: {
					orient: 'vertical',
					x:'right',
					data:['微博数据']
				},
				dataRange: {
					min: 0,
					//max: 100,
					max:item_province_json[0].value,
					color:['orange','white'],
					text:['高','低'],           // 文本，默认为数值文本
					calculable : true
				},
				series : [
					{
						name: '随机数据',
						type: 'map',
						mapType: 'china',
						selectedMode : 'single',
						itemStyle:{
							normal:{label:{show:true}},
							emphasis:{label:{show:true}}
						},
						data:item_json

					}
				]
			};

			myChart.setOption(option);

		}
	)

	var rank_html = '';
	rank_html += '<table id="table">';
	for(var k=0;k<Math.min(15,item_province_json.length);k++){

		//         if (item_province_json[k].name=='unknown'){
		// 	item_province_json[k].name='未知'
		// }


		rank_html += '<tr>';
		rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
		rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_province_json[k].name+'</td>';
		rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_province_json[k].value+'</td>';
		rank_html += '</tr>';

	}
	$('#top15_content_place').append(rank_html);
}

function label_3(la_3) {
	$('#main_place').empty();
	$('#top15_content_place').empty();
	var item=la_3;
	var item_json = [];
	var item_province_json = [];
	var item_city_json = [];
	var item_city_json_new=[];
	var html = '';
	var city_dict = {};


	for (i=0;i<item.length;i++){
		item_province_json.push({name:item[i][0],value:item[i][1].total});
		for(key in item[i][1]){
			if(key=='total'){
				continue;
			}
			item_city_json.push({name:key,value:item[i][1][key]});

		}
	}
	for(k=0;k<item_city_json.length;k++){
		if(item_city_json[k].name=='unknown'){
			item_city_json[k].name='未知';
		}
		item_city_json_new.push({name:item_city_json[k].name+'市',value:item_city_json[k].value});
	}

	item_json = item_province_json.concat(item_city_json_new);
	item_province_json.sort(function(a,b){
		return b.value-a.value});

	var myChart = echarts.init(document.getElementById('main_place'));

	require(
		[
			'echarts',
			'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
		],
		function (ec) {

			var ecConfig = require('echarts/config'); //放进require里的function{}里面
			//var ecConfig = echarts.config;
			var zrEvent = require('zrender/tool/event');
			//var zrEvent = zrender.src.core.event;

			// 基于准备好的dom，初始化echarts图表
			//var myChart = ec.init(document.getElementById('main'));
			//var myChart = echarts.init(document.getElementById('main_place'));
			// 过渡---------------------
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
			document.getElementById('main_place').onmousewheel = function (e){
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
					option.tooltip.formatter = '滚轮切换或点击进入该省<br/>{b}:{c}';
				}
				option.series[0].mapType = mt;
				option.title.subtext = mt + ' （滚轮或点击切换）';
				myChart.setOption(option, true);
			});
			var option = {
				title: {
					text : '全国34个省市自治区',
					subtext : 'china （滚轮或点击切换）'
				},
				tooltip : {
					trigger: 'item',
					formatter: '滚轮切换或点击进入该省<br/>{b}'
				},
				legend: {
					orient: 'vertical',
					x:'right',
					data:['微博数据']
				},
				dataRange: {
					min: 0,
					//max: 100,
					max:item_province_json[0].value,
					color:['orange','white'],
					text:['高','低'],           // 文本，默认为数值文本
					calculable : true
				},
				series : [
					{
						name: '随机数据',
						type: 'map',
						mapType: 'china',
						selectedMode : 'single',
						itemStyle:{
							normal:{label:{show:true}},
							emphasis:{label:{show:true}}
						},
						data:item_json

					}
				]
			};

			myChart.setOption(option);

		}
	)

	var rank_html = '';
	rank_html += '<table id="table">';
	for(var k=0;k<Math.min(15,item_province_json.length);k++){

		//         if (item_province_json[k].name=='unknown'){
		// 	item_province_json[k].name='未知'
		// }


		rank_html += '<tr>';
		rank_html += '<td class="td" align="center" style="width:80px;height:32px;">'+(k+1)+'</td>';
		rank_html += '<td class="autocut" align="center" style="width:80px;height:32px;overflow:hidden;text-overflow:ellipsis;word-break:keep-all">'+item_province_json[k].name+'</td>';
		rank_html += '<td class="td" align="right" style="width:60px;height:32px;">'+item_province_json[k].value+'</td>';
		rank_html += '</tr>';

	}
	$('#top15_content_place').append(rank_html);
}

