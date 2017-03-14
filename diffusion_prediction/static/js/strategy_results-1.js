function current_hot_weibo(data){

}

function current_hot_weibo_outter(){
	var current_hot_weibo_url = '/interfere/get_current_hot_weibo/';
	$.ajax({
        url: current_hot_weibo_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:current_hot_weibo
    });
}