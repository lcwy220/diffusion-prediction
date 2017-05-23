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

Draw_blog_scan_area_meaning:function (data){
    $('#group_emotion_loading5').css('display', 'none');
    $('#input-table5').show();
    var dataArray = data;
    console.log(dataArray)
    $('#Pagenums5').text(dataArray.length);
    var PageNo=document.getElementById('PageNo5');                   //设置每页显示行数
    var InTb=document.getElementById('input-table5');               //表格
    var Fp=document.getElementById('F-page5');                      //首页
    var Nep=document.getElementById('Nex-page5');                  //下一页
    var Prp=document.getElementById('Pre-page5');                  //上一页
    var Lp=document.getElementById('L-page5');                     //尾页
    var S1=document.getElementById('s15');                         //总页数
    var S2=document.getElementById('s25');                         //当前页数
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
               if (dataArray[i][1].photo.url=='unknown'){
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

