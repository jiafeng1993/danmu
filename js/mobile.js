var runTime = {
	init:function(){
		var _this = this;
		_this.start();
		_this.end();
		_this.run();
	},
	ajaxFun:function(url, type, param, sucCallBack, async){
		$.ajax({
			url: url,
			type: type,
			data: param,
			async: async ? true : false,
			success: sucCallBack
		});
	},
	//开启抽奖页面
	start:function(){
		var _this = this;
		$('#startBtn').click(function(){
			_this.ajaxFun("http://10.0.1.7:8080/springmvc/annual/openDrawPage",'post','',function(data){})
		})
	},
	//关闭抽奖页面
	end:function(){
		var _this = this;
		$('#endBtn').click(function(){
			_this.ajaxFun("http://10.0.1.7:8080/springmvc/annual/closeDrawPage",'post','',function(data){})
		})
	},
	//开始or暂停 抽奖
	run:function(){
		var _this = this;
		var flag = true;
		$('.run').click(function(){
			if (flag) {
				_this.ajaxFun("http://10.0.1.7:8080/springmvc/annual/startDraw",'post','',function(data){
					$('.run').text('结束')
					flag=false;
				})
			} else{
				_this.ajaxFun("http://10.0.1.7:8080/springmvc/annual/endDraw",'post','',function(data){
					$('.run').text('开始')
					flag=true;
				})
			}
		})
	}
}
$(function(){
	runTime.init();
})