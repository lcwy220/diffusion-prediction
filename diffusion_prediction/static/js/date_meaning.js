var opinion=[];
var sort_item = 'timestamp';
var no_page_meaning = 0;
var blog_num_max_global_meaning = 0;


var now = new Date();
var year = now.getFullYear();
var month_num = now.getMonth()+1;
var month = '';
switch (month_num)
{
case 1:
  month="Jan";
  break;
case 2:
  month="Feb";
  break;
case 3:
  month="Mar";
  break;
case 4:
  month="Apr";
  break;
case 5:
  month="May";
  break;
case 6:
  month="Jun";
  break;
case 7:
  month="Jul";
  break;
case 8:
  month="Aug";
  break;
case 9:
  month="Sep";
  break;
case 10:
  month="Oct";
  break;
case 11:
  month="Nov";
  break;
case 12:
  month="Dec";
  break;
}
var date = month+' '+year



function set_order_type_meaning(type){
  if(type=='time'){
    sort_item = 'timestamp';
    Draw_blog_scan_area_meaning_result();

  }else if(type=='hot'){
    sort_item = 'retweeted';
    Draw_blog_scan_area_meaning_result();

  }
}


function set_opinion_type(type){
    opinion=type;
    Draw_blog_scan_area_meaning_result();

}


//上一页
function up_meaning(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里减去1 再放进链接里  
     if(no_page_meaning==0){
         alert("当前已经是第一页!");
         return false;
     }else{
    no_page_meaning--;

    Draw_blog_scan_area_meaning_result();
    
     }
}
//下一页
function down_meaning(){
     //首先 你页面上要有一个标志  标志当前是第几页
     //然后在这里加上1 再放进链接里  
     
     if(no_page_meaning==Math.min(9,Math.ceil(blog_num_max_global_meaning/10)-1)){
         alert("当前已经是最后一页!");
         
         return false;
     }else{
    no_page_meaning++;
    Draw_blog_scan_area_meaning_result();
    
     }
}

function first_meaning(){
   
     no_page_meaning=0;
     /*这里在将当前页数赋值到页面做显示标志*/
     Draw_blog_scan_area_meaning_result();
}
//下一页
function last_meaning(){
     
     no_page_meaning=(Math.ceil(blog_num_max_global_meaning/10)-1);
    
     /*这里在将当前页数赋值到页面做显示标志*/
     // window.location.href="a.htm?b=123&b=qwe&c="+pageno;
     Draw_blog_scan_area_meaning_result();
}



function topic_analysis_meaning(){
 
}

topic_analysis_meaning.prototype = {   //获取数据，重新画表
  call_sync_ajax_request:function(url,callback){
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      async: true,
      success:callback
    });
  },


Draw_keywords_cloud:function(data){
    $('#main_meaning_1').empty();
    var item = data;
    // var item_data = [];
    var item_json = [];
    var html = '';
    for (i=0;i<item.length;i++){    
      // item_data.push(item[i][0].replace('\\"',''))
      item_json.push({name:item[i][0],value:item[i][1]*10000,itemStyle: createRandomItemStyle()});
    }

  function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}
var myChart = echarts.init(document.getElementById('main_meaning_1'));

var option = {
   
    tooltip: {
        show: true
    },
    series: [{
        // name: 'Google Trends',
        type: 'wordCloud',
        size: ['160%', '100%'],
        textRotation : [0, 45, 90, -45],
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 14
        },
        data: item_json
    }]
};
          myChart.setOption(option);        
  },

Draw_event_river:function(data){
    $('#main_meaning_2').empty();
    var item_data = data;
    var name_item = [];
    var series_json = [];
    var html = '';

    for (var key in item_data){
        var data_json = [];
        var evolution_json = [];

        for (i=0;i<item_data[key].length;i++){    
          evolution_json.push({"time":item_data[key][i][0],"value":item_data[key][i][1],});
          
        }
        
        data_json.push({"name":'',"evolution":evolution_json});
        series_json.push({"name":key,"type":"eventRiver","weight":123,"data":data_json})
        name_item.push(key);
      }
      
    
    var myChart = echarts.init(document.getElementById('main_meaning_2'));
    var option = {
       
        legend: {
            data:name_item
        },
        toolbox: {
            show : true,
            feature : {
                saveAsImage : {show: true}
            }
        },
        xAxis : [
            {
                type : 'time',
                boundaryGap: [0.05,0.1]
            }
        ],
        series : series_json
        
};
    myChart.setOption(option);     

},

Draw_time_line:function(data){
    console.log(data);
    $('#main_meaning_3 .fish_box').empty();
    var finshdata = '';
    var index=0;
    for (var key in data){
        if (index%2 == 0){
            finshdata+=
                '<div class="fish_item">'+
                '   <ul class="top">'+
                '       <li class="weibo" title="'+key+'" style="border-left: 1px solid rgb(248, 151, 130);">人物：'+key+'</li>'+
                '       <li class="weibo" title="'+data[key][0].content+'" style="height: 86px;white-space: normal;border-left: 1px solid rgb(248, 151, 130);">微博内容：'+data[key][0].content+'</li>'+
                '       <li class="weibo" title="'+data[key][0].datetime+'" style="border-left: 1px solid rgb(248, 151, 130);">时间：'+data[key][0].datetime+'</li>'+
                '       <li class="line-last line-point" style="background-position: 0px 0px;"></li>'+
                '   </ul>'+
                '</div>';
        }else {
            finshdata+=
                '<div class="fish_item" style="top:147px;">'+
                '   <ul class="bottom">'+
                '       <li class="weibo" title="'+key+'" style="border-left: 1px solid rgb(26, 132, 206);">人物：'+key+'</li>'+
                '       <li class="weibo" title="'+data[key][0].content+'" style="height: 86px;white-space: normal;border-left: 1px solid rgb(26, 132, 206);">微博内容：'+data[key][0].content+'</li>'+
                '       <li class="weibo" title="'+data[key][0].datetime+'" style="border-left: 1px solid rgb(26, 132, 206);">时间：'+data[key][0].datetime+'</li>'+
                '       <li class="line-last line-point" style="background-position: 0px -20px;"></li>'+
                '   </ul>'+
                '</div>';
        }
        index++;
    }
    $("#main_meaning_3 .fish_box").append(finshdata);
    var _p=0;
    var fish_length=index;
    $('#main_meaning_3 .fish_box').width(fish_length*180);
    var fish_width=fish_length*180;
    $('#main_meaning_3 .prev').on('click',function () {
        _p+=180;
        if (index<=4){
            alert('没有其他卡片内容了。');
        }else {
            var fishbone=$(".fishBone .fish_box");
            var step1=_p;
            if (step1 > 0 ){
                alert('没有其他内容了。');
                _p=0;
            }else {
                $(fishbone).css({
                    "-webkit-transform":"translateX("+step1+"px)",
                    "-moz-transform":"translateX("+step1+"px)",
                    "-ms-transform":"translateX("+step1+"px)",
                    "-o-transform":"translateX("+step1+"px)",
                    "transform":"translateX("+step1+"px)",
                });
            }
        }
    });
    $('#main_meaning_3 .next').on('click',function () {
        _p-=180;
        if (index<=4){
            alert('没有其他卡片内容了。');
        }else {
            var step2=_p;
            var fishbone=$(".fishBone .fish_box");
            if (step2 <= (-fish_width+500)){
                alert('没有其他内容了');
                _p=180;
            }else {
                $(fishbone).css({
                    "-webkit-transform":"translateX("+step2+"px)",
                    "-moz-transform":"translateX("+step2+"px)",
                    "-ms-transform":"translateX("+step2+"px)",
                    "-o-transform":"translateX("+step2+"px)",
                    "transform":"translateX("+step2+"px)",
                });

            };
        }
    });

},


Draw_blog_opinion:function(data){
    $('#opinions').empty();
    var item = data;
    var html = '';
    if (item.length == 0){
        html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 40%;">呀，暂时还没有数据喔~</p></div>'
    
    }else{
      opinion=item[0];
      for (i=0;i < item.length;i++){
        html += '<span class="label place_label" style="color: #272424;font-size:16px;" onclick="set_opinion_type(\''+ item[i] +'\')">'+item[i].join(",")+'</span>';
      }

    }
    opinion = item[0];
    Draw_blog_scan_area_meaning_result();
    $('#opinions').append(html);
},

Draw_blog_scan_area_meaning:function(data){
    $('#blog_scan_area_meaning').empty();
    var item = data;
    var html = '';
    var blog_num_max_local_meaning = Math.min(100,item.length);
    
    blog_num_max_global_meaning = blog_num_max_local_meaning;
    if (item == 'no results'){
    html += '<div style="background-color: #FFFFFF;width: 96%;height: 100px;position: relative;margin-left: 2%;margin-top: 2%;float: left;"><p style="color: #FF9900;font-size: 16px;font-family: Microsoft YaHei;margin-top: 5%;margin-left: 5%;">呀，暂时还没有数据喔~</p></div>'
    }else{
      var num_page = Math.ceil(blog_num_max_local_meaning/10);  //num_page表示微博数据共有多少页
      var item_i_meaning = no_page_meaning*10;
      
      var max_i_meaning = item_i_meaning+Math.min(10,blog_num_max_local_meaning-item_i_meaning);
      
      for (i=item_i_meaning; i<max_i_meaning; i++){
  
        if (item[i][1].photo_url=='unknown'){
          item[i][1].photo_url='../../static/images/photo_unknown.png'
        }
        if (item[i][1].uname=='unknown'){
          item[i][1].uname=item[i][1].uid;
        }
        var item_timestamp_datetime = new Date(parseInt(item[i][1].timestamp) * 1000).toLocaleString();
        html += '<div class="blog_time">';
        //html += '<div><img class="img-circle" src="../../static/info_consume/image/cctv_news.jpg" style="width: 40px;height: 40px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
        html += '<div><img class="img-circle" src="'+item[i][1].photo_url+'" style="width: 30px;height: 30px;position: relative;margin-left: 2%;margin-top: 2%;float:left;"></div>';
        html += '<div>';
        //html += '<a target="_blank" href=" " class="user_name" style="float:left;">央视新闻</a>';
        html += '<a target="_blank" href="/index/viewinformation/?uid='+item[i][1].uid+'" class="user_name" style="float:left;">'+item[i][1].uname+'</a>';
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: -4%;margin-left: 13%;font-family: Microsoft YaHei;float:left;">(中国&nbsp;北京)</p>';
        html += '</div>';
        html += '<div class="blog_text">'
        //html += '<p style="text-align:left;width: 92%;position: relative;margin-top: 15%;margin-left: 3%;font-family: Microsoft YaHei;"><font color="black">【投票：奥运闭幕式 你期待谁当中国旗手？】里约奥运明日闭幕，闭幕式中国代表团旗手是谁？有报道说乒乓球双料冠军丁宁是一个可能，女排夺冠，女排姑娘也是一个可能。你期待闭幕式中国代表团旗手是谁？</font></p>';
          html += '<p style="text-align:left;position: relative;margin:50px 0 0 50px;font-family: Microsoft YaHei;"><font color="black">'+item[i][1].text+'</font></p>';
          html += '<p style="text-align:left;position: relative;margin:20px 0;padding-left:50px;font-family: Microsoft YaHei;">';
          //html += '<span class="time_info" style="padding-right: 10px;color:#858585">';
          //html += '<span style="float:left">2016-08-19 21:11:46&nbsp;&nbsp;</span>';
          html += '<span>'+item_timestamp_datetime+'</span>';
          html += '<span style="display:inline-block;margin-left:500px;">转发数('+item[i][1].retweeted+')&nbsp;|&nbsp;</span>';
          //html += '<span id="oule" style="margin-top: -3%;display: inline-block;margin-left: 54%;">转发数('+Math.round(Math.random()*1000)+')&nbsp;&nbsp;&nbsp;|</span>';
          html += '<span>评论数('+item[i][1].comment+')</span>';
          //html += '<span style="margin-top: -3%;display:inline-block;" >&nbsp;&nbsp;&nbsp;&nbsp;评论数('+Math.round(Math.random()*1000)+')</span>';
          //html += '&nbsp;&nbsp;&nbsp;&nbsp;</span>';
        html += '</p>';
        html += '</div>';               
        html += '</div>';
      // }
      }
       html += '<div id="PageTurn" class="pager">'
       html += '<p style="font-size: 20px;">共<font id="P_RecordCount" style="color:#FF9900;font-size: 20px;">'+num_page+'</font>页&nbsp;&nbsp;&nbsp;&nbsp;</p>'
       html += '</div>'

      
    
    }
    
    $('#blog_scan_area_meaning').append(html);
},


}

var topic_analysis_meaning = new topic_analysis_meaning();

function Draw_keywords_cloud_result(){
    url = "/topic_language_analyze/during_keywords/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
    topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_keywords_cloud);
}
function Draw_event_river_result(){
    url = "/topic_language_analyze/topics_river/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
    topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_event_river);
}
function Draw_time_line_result(){
    url = "/topic_language_analyze/symbol_weibos/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts;
    topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_time_line);
}
function Draw_blog_opinion_result(){
    url = "/topic_language_analyze/subopinion/?topic="+topic;
    topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_blog_opinion);
}
function Draw_blog_scan_area_meaning_result(){
    url = "/topic_language_analyze/weibo_content/?topic="+topic+'&start_ts='+start_ts+'&end_ts='+end_ts+'&opinion='+opinion+'&sort_item='+sort_item;
    topic_analysis_meaning.call_sync_ajax_request(url,topic_analysis_meaning.Draw_blog_scan_area_meaning);
}
function meaning_load(){
  Draw_keywords_cloud_result();
  Draw_event_river_result();
  Draw_time_line_result();
  Draw_blog_opinion_result();
  Draw_blog_scan_area_meaning_result();
}

