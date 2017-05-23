var sort_item_network = 'timestamp';
var blog_type_network = 'maker';

var no_page_network = 0;
var blog_num_max_global_network = 0;



function show(obj,id) { 
var objDiv = $("#"+id+""); 
$(objDiv).css("display","block"); 
$(objDiv).css("left", event.clientX); 
$(objDiv).css("top", event.clientY + 10); 
} 
function hide(obj,id) { 
var objDiv = $("#"+id+""); 
$(objDiv).css("display", "none"); 
} 

function set_trend_type(val) {

  case_val = val;
  $('#right_col_title_2_network').empty();

  if(case_val == 'maker'){
    Draw_trend_maker_result();
  }

  if(case_val == 'pusher'){
    Draw_trend_pusher_result();
  }
  
  //可以设置默认值（正向），随着页面加载。
 }


function set_order_type_network(type){
  if(type=='time'){
    sort_item_network = 'timestamp';
    Draw_blog_scan_area_network_result();

  }else if(type=='hot'){
    sort_item_network = 'retweeted';
    Draw_blog_scan_area_network_result();
  }
}


function set_blog_type_network(type){
  
    blog_type_network = type;
    Draw_blog_scan_area_network_result();

  
}


function go_to_info(uid){
  window.open('/index/viewinformation/?uid='+uid);
}



function topic_analysis_network(){
 
}

topic_analysis_network.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },

  Draw_network_pic:function(data){
    $('#main_network').empty();
    var item = data;
    var nodes_new = [];
    var nodes_label = [];
    item_links=[];
    for (k=0;k<Math.min(item['links'].length,2000);k++){
      item_links.push(item['links'][k]);
    }

    for(i=0;i<Math.min(item['nodes'].length,2000);i++){
      nodes_new.push({name:item['nodes'][i]['label'],symbolSize:item['nodes'][i]['symbolSize'],label:''});
      
    }
   
         require(  
                [  
                    'echarts',  
                    // 'echarts/chart/force'  
                ],  
    function (ec) {  
        // 基于准备好的dom，初始化echarts图表  
        // myScatter = ec.init(document.getElementById('mainScatter'));   
    
      var myChart = echarts.init(document.getElementById('main_network'));
      var ecConfig = require('echarts/config'); //放进require里的function{}里面
      var zrEvent = require('zrender/tool/event');
      var option = {
          title : {
              // text: '人物关系：乔布斯',
              // subtext: '数据来自人立方',
              x:'right',
              y:'bottom'
          },
          tooltip : {
              trigger: 'item',
              formatter: '{b}', 
              
          },
          toolbox: {
              show : true,
              feature : {
                  saveAsImage : {show: true}
              }
          },
          // legend: {
          //     x: 'left',
          //     data:['家人','朋友']
          // },
          series : [
              {
                  type:'force',
                  name : "人物关系",
                  ribbonType: false,
                  // categories : [
                  //     {
                  //         name: '人物'
                  //     },
                  //     {
                  //         name: '家人'
                  //     },
                  //     {
                  //         name:'朋友'
                  //     }
                  // ],
                  itemStyle: {
                      normal: {
                          label: {
                              show: true,
                              textStyle: {
                                  color: '#333'
                              }
                          },
                          nodeStyle : {
                              brushType : 'both',
                              borderColor : 'rgba(255,215,0,0.4)',
                              borderWidth : 1
                          },
                          linkStyle: {
                              type: 'curve'
                          }
                      },
                      emphasis: {
                          label: {
                              show: false
                              // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                          },
                          nodeStyle : {
                              //r: 30
                          },
                          linkStyle : {}
                      }
                  },
                  useWorker: false,
                
                  gravity: 1.1,
                  scaling: 1.1,
                  roam: 'move',
                  //nodes:item['nodes'],
                  nodes:nodes_new,
		              // links:item['links']
                  links:item_links
                  
              }
          ]
      };
      var ecConfig = require('echarts/config');
      function focus(param) {
          var data = param.data;
          var links = option.series[0].links;
          var nodes = option.series[0].nodes;
          if (
              data.source !== undefined
              && data.target !== undefined
          ) { //点击的是边
              var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
              var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
              //console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
          } else { // 点击的是点
              //console.log("选中了" + data.name + '(' + data.value + ')');
              
              for(i=0;i<item['nodes'].length;i++){
                if(item['nodes'][i]['label'] == data.name){
                  nodes_uid = item['nodes'][i]['uid'];
                  window.open('/index/viewinformation/?uid='+nodes_uid);
                }
                
              }
              //console.log(nodes_uid);
          }
      }
      myChart.on(ecConfig.EVENT.CLICK, focus)
       myChart.setOption(option);           
          
    }  
);  
  },

  Draw_trend_maker:function(data){
    $('#right_col_title_2_network').empty();
    var item = data;
    var html = '';
    item_len = 0
    for (var k in item){
      item_len++;

    }
    if (item_len == 0){
      html += '<div style="text-align:center;padding:30px 0;"><p style="color: #FF9900;font-size: 16px;">呀，暂时还没有数据喔~</p></div>'
    }else{
      html += '<table id="table_photo">';
      for(i=0;i<Math.min(7,item.length);i=i+1){
        html += '<tr>';
          if (item[i].photo=='no'){
            item[i].photo='/static/images/photo_unknown.png';
          }
          var item_timestamp_datetime = new Date(parseInt(item[i].timestamp) * 1000).toLocaleString();
          // html += '<td><img title=用户昵称：' +item[k].name+'<br/>粉丝数：'+item[k].fans+'<br/>发布时间：'+item[k].+'style="width:40px;height:40px" class="photo_user" src='+item[k].photo+'/><td>';
          html += '<td><img onclick="go_to_info('+item[i].uid+')" style="width:40px;height:40px;position:relative;left:-12px;top:-2px;" class="photo_user" src='+item[i].photo+'/><td>';
          html += '<td><p style="font-size: 12px;">用户昵称：'+item[i].name+'<br>用户ID：'+item[i].uid+'<br>粉丝数：'+item[i].fans+'<br>发布时间：'+item_timestamp_datetime+'<p><td>';
          
        html += '</tr>'; 
        // html += ''
      }
      html += '</table>';
    }
    
    
    
    $("table td").mouseover(function(){
            $("#divInfo").css("z-index",999999);//让层浮动

            $("#divInfo").css("top",this.top+行高);//设置提示div的位置

            $("#divInfo").css("left",11);

            $("#divInfo").css("visibility","visible");        
    })

    $('#right_col_title_2_network').append(html);
   
  },

  Draw_trend_pusher:function(data){
    $('#right_col_title_2_network').empty();
    var data = eval(data);
    var item = [];

    var html = '';
    for(var uid_data in data){
      item.push(data[uid_data]);
    }
    html += '<table id="table_photo">';
    for(i=0;i<Math.min(7,item.length);i=i+1){
      
      html += '<tr>';

        if (item[i].user_info.profile_image_url=='unknown'){
          var photo_img = '../../static/images/photo_unknown.png';
        }else{
          var photo_img = item[i].user_info.profile_image_url;
        }
        if (item[i].user_info.name=='unknown'){
          var nick_name='未知';
        }else{
          var nick_name = item[i].user_info.name;
        }

        if (item[i].user_info.followers_count=='unknown'){
          var fans ='未知';
        }else{
          var fans = item[i].user_info.followers_count
        }
        // var item_timestamp_datetime = new Date(parseInt(item[i].timestamp) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
        var item_timestamp_datetime = new Date(parseInt(item[i].timestamp) * 1000).toLocaleString();
        html += '<td><img onclick="go_to_info('+item[i].uid+')" style="width:40px;height:40px;position:relative;left:-10px;" class="photo_user" src='+photo_img+'/><td>';
        html += '<td><p style="font-size: 12px;">用户昵称：'+nick_name+'<br>用户ID：'+item[i].uid+'<br>粉丝数：'+fans+'<br>发布时间：'+item_timestamp_datetime+'<p><td>';
        
      
      html += '</tr>'; 
      // html += '<div id="id" style="display:none; width:250px; height:150px; background-color:#D1EEEE;position:absolute;"></div>'
    }
    html += '</table>';
    
    $('#right_col_title_2_network').append(html);
  },

  Draw_blog_scan_area_network: function (data){
    $('#group_emotion_loading3').css('display', 'none');
    $('#input-table3').show();
    var dataArray = data;
    $('#Pagenums3').text(dataArray.length);
    var PageNo=document.getElementById('PageNo3');                   //设置每页显示行数
    var InTb=document.getElementById('input-table3');               //表格
    var Fp=document.getElementById('F-page3');                      //首页
    var Nep=document.getElementById('Nex-page3');                  //下一页
    var Prp=document.getElementById('Pre-page3');                  //上一页
    var Lp=document.getElementById('L-page3');                     //尾页
    var S1=document.getElementById('s13');                         //总页数
    var S2=document.getElementById('s23');                         //当前页数
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
               if (dataArray[i]._source.photo_url=='unknown'){
				dataArray[i]._source.photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i]._source.uname=='unknown'){
				dataArray[i]._source.uname=dataArray[i]._source.uid
			}
                var item_timestamp_datetime = new Date(parseInt(dataArray[i]._source.timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i]._source.photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i]._source.uid+'" class="user_name" style="float:left;">'+dataArray[i]._source.uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i]._source.text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i]._source.retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i]._source.comment+')</span>'+
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
               if (dataArray[i]._source.photo_url=='unknown'){
				dataArray[i]._source.photo_url='../../static/images/photo_unknown.png'
			}
			if (dataArray[i]._source.uname=='unknown'){
				dataArray[i]._source.uname=dataArray[i]._source.uid
			}
                var item_timestamp_datetime = new Date(parseInt(dataArray[i]._source.timestamp) * 1000).toLocaleString();
                html_c = '<div class="blog_time" id="blog_time">'+
						 '<div><img class="img-circle" src="'+dataArray[i]._source.photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>'+
						'<div>'+
						 '<a target="_blank" href="/index/viewinformation/?uid='+dataArray[i]._source.uid+'" class="user_name" style="float:left;">'+dataArray[i]._source.uname+'</a>'+
			 			'</div>'+
			 			 '<div class="blog_text">'+
			 			'<p style="position: relative;margin:60px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+dataArray[i]._source.text+'</font></p>'+
			 			'<p style="float: left;width: 100%;position: relative;margin:30px 0 20px 30px;font-family: Microsoft YaHei;">'+
			 			'<span style="display: inline-block;margin:0 0 0 20px;">'+item_timestamp_datetime+'</span>'+
			 			'<span style="display: inline-block;margin-left:500px;">转发数('+dataArray[i]._source.retweeted+')&nbsp;|&nbsp;</span>'+
			 			'<span >评论数('+dataArray[i]._source.comment+')</span>'+
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

topic_analysis_network = new topic_analysis_network();

function Draw_network_pic_result(){
  // start_ts = 1467648000;
  // end_ts = 1470844800;
  //topic = topic_name_on_detail;
  //start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
  //end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());
  // var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
  // var start_ts = 1482681600;
  // var end_ts = 1483113600;

  url = "/topic_network_analyze/get_gexf/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;

  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_network_pic);

}

function Draw_trend_maker_result(){
  // start_ts = 1467648000;
  // end_ts = 1470844800;

  //topic = topic_name_on_detail;
  //start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
  //end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

  // var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
  // var start_ts = 1482681600;
  // var end_ts = 1483113600;

  url = "/topic_network_analyze/get_trend_maker/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_trend_maker);
}

function Draw_trend_pusher_result(){
  // start_ts = 1467648000;
  // end_ts = 1470844800;
  //topic = topic_name_on_detail;
  //start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
  //end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());

  // var topic = 'mao_ze_dong_dan_chen_ji_nian_ri';
  // var start_ts = 1482681600;
  // var end_ts = 1483113600;

  url = "/topic_network_analyze/get_trend_pusher/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_trend_pusher);
}
 
function Draw_blog_scan_area_network_result(){
  // start_ts = 1467648000;
  // end_ts = 1470844800;
  //topic = topic_name_on_detail;
  //start_ts = datetime_to_timestamp($("#datetimepicker9_input").val());
  //end_ts = datetime_to_timestamp($("#datetimepicker10_input").val());


  if(blog_type_network == 'maker'){

    url = "/topic_network_analyze/maker_weibos_sort/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&sort_item'+sort_item_network; 

  }else if(blog_type_network == 'pusher'){

    url = "/topic_network_analyze/pusher_weibos_sort/?topic=" + topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&sort_item'+sort_item_network;

  }
  
  topic_analysis_network.call_sync_ajax_request(url,topic_analysis_network.Draw_blog_scan_area_network);
}   


function network_load(){
  Draw_network_pic_result();
  Draw_trend_maker_result();
  Draw_blog_scan_area_network_result();
}

// Draw_network_pic_result();
// //Draw_trend_maker_result();
// Draw_trend_pusher_result()
// Draw_blog_scan_area_network_result();




