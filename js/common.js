var DmClass = {  
    "Dm_H":0, //弹幕区域高度  
    "Dm_W":0,//弹幕区域宽度  
    "DmObj":"",//弹幕区对象  
  
    //初始化方法  
    init : function(){  
        var _this  = this;  
        _this.DmObj = $(".dmArea");  
        _this.Dm_H = _this.DmObj.height();  
        _this.Dm_W = _this.DmObj.width();  
        _this.sendToDmFunc();  
    },  
    sendToDmFunc:function(){  
        var _this = this;  
        $(".sendToDm").click(function(){  
            var sendCon = $('input[name="dm_con"]').val();  
            if($.trim(sendCon) == "") {  
                var testList = ["hello world!","你好","视频真好看","吹牛我就服你！！","哈哈哈"];  
                var _s = Math.floor(Math.random()*5);  
                sendCon = testList[_s];  
                //return false;  
            }  
            var sData = sendCon;  
            SocketClass.websocket.send(sData);
            
        });  
    },  
  
    //往弹幕区域添加弹幕数据  
    addToDm : function(rdata){  
        var _this = this; 
        var newObj = eval('(' + rdata+ ')');  
        var newDom = $("<span></span>"); 
        var newDom = $("<div><img src="+newObj.photoUrl+"><p><b>"+newObj.name+"：</b><span>"+newObj.msg+"</span></p><div>");
        newDom.css("font-size",Math.round(Math.random()*16)+14+"px");
  		newDom.css("color","rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")"); 
        var p = _this.randPosition();   
        _this.DmObj.append(newDom);  
        newDom.css({"left":_this.Dm_W+"px","top":p+"px"});  
    	newDom.animate({ 
		     left:-_this.Dm_W
	    },Math.round(Math.random()*40000)+1000,"linear", function(){ 
	     newDom.remove(); 
	     //当运动结束时，删除弹幕 
	    }); 
    
    },  
  
    //随机获取位置  
    randPosition:function(){  
        var _this = this;  
        var rn = Math.floor(Math.random()*(_this.Dm_H - 20));  
        return rn;  
    },  
  
}  
  
var SocketClass = {  
    "wsServer":"ws://10.0.1.7:8080/springmvc/yckj",  
    "websocket":"", //socket 对象  
    init:function(){  
        var _this = this;  
        _this.socketServerInit();  
    },  
    socketServerInit:function(){  
        var _this = this;  
        _this.websocket = new WebSocket(_this.wsServer);  
        _this.websocket.onopen = function (evt) {  
            console.log("连接成功");  
        };  
        //socket 服务器关闭  
        _this.websocket.onclose = function (evt) {  
            console.log("已关闭");  
        };  
        //接收socket服务器的广播数据  
        _this.websocket.onmessage = function (evt) {
        	var datas = JSON.parse(evt.data);
        	if(datas.type==2){
        		startBonnus.kongFun(2);
        	}else if(datas.type==3){
        		startBonnus.kongFun(3);
        	}else if(datas.type==4){
        		lucky.kongRun(4,datas.msg);
        	}else if(datas.type==5){
        		lucky.kongRun(5,datas.msg);
        	}else if(datas.type==1){
        		DmClass.addToDm(evt.data);
        	} else{
        		lucky.kongRun(6,datas.msg);
        	}
        };  
  
        //连接错误  
        _this.websocket.onerror = function (evt, e) {  
            console.log('Error occured: ' + evt.data);  
        };  
    },  
}  
  
//开启抽奖
var startBonnus = {
	init : function(){
		var _this = this;
	},
	kongFun:function(kData){
		if (kData==2) {
			$('.box').hide()
			$('.jiang').fadeIn();
		} else{
			$('.jiang').hide()
			$('.box').fadeIn();
		}
	}
	
}
  
//开始抽奖

var lucky = {
	"g_Interval":1,
	"g_PersonCount":99,
	init : function(){
		var _this = this;
		_this.runNum();
	},
	runNum:function(){
		var _this = this;
		var running = false;
		var g_Timer;
		$('#btn').click(function(){
			if(running){
				running = false;
				clearTimeout(g_Timer);		
				$(this).val("开始");
				$('#ResultNum').css('color','red');
			}else{
				running = true;
				$('#ResultNum').css('color','black');
				$(this).val("停止");
				g_Timer = setTimeout(beat, _this.g_Interval);
			}	
			function beat(){
				g_Timer = setTimeout(beat,_this.g_Interval);
				var num = Math.floor(Math.random()*_this.g_PersonCount+1);
				$('#ResultNum').html(num);
			}
			
		})
	},
	kongRun : function(runData,msg){
		var _this = this;
		var g_Timer;
		if ($('.jiang').fadeIn()) {
			if(runData==4){
				$('#ResultNum1').hide();
				$('#ResultNum').show();
				$('#ResultNum').css('color','black');
				g_Timer = setTimeout(beat, _this.g_Interval);
			}else if(runData==5){
				clearTimeout(g_Timer);
				$('#ResultNum').hide();
				$('#ResultNum1').css('display','block');
				$('#ResultNum1').html(msg);
				
			}else{
				clearTimeout(g_Timer);
				$('#ResultNum').hide();
				$('#ResultNum1').css('display','block');
				$('#ResultNum1').css('fontSize','14px');
				$('#ResultNum1').html(msg);
			}
		} else{
			return false;
		}
		function beat(){
			g_Timer = setTimeout(beat,_this.g_Interval);
			var num = Math.floor(Math.random()*_this.g_PersonCount+1);
			$('#ResultNum').html(num);
		}
	}
	
}

function bottom(data){
	$('.person').highcharts({
        chart: {
        	type:'bar',
            backgroundColor:'rgba(0,0,0,0)'
        },
        title: {
            text: '参会人员弹幕发送量统计图' ,
            align:"center",
            style:{
				color: '#F6B866',
			    fontFamily: 'PingFangSC-Medium',
			    fontSize: '28px',
				letterSpacing: '-0.12px',
				fontWeight:'bold'
			}
        },
        xAxis: {
        	title: {
                style:{
					color: '#F6B866',
				}
           },
            lineColor: "#F6B866",
            tickWidth:1,
            tickColor: "#F6B866",
            categories: data.nameList,
            labels: {
                style:{
					color: '#F6B866',
				}
				
            },
        },
        yAxis: [{ 
            labels: {
                format: '{value}',
                style: {
                    color: 'rgba(0,0,0,0)',
                }
            },
            
            title: {
                text: null
            },
            gridLineColor :'rgba(0,0,0,0)',
        }],
        series: [
        	{	
	        	name:'发言数',
	            data: data.countList,
	            color:'#F6B866',
	        }
	        
        ],
        
        plotOptions: {
	        bar: {
	        	 borderColor: "#F6B866",
	            dataLabels: {
	                enabled: true,
	                style : {
		                color: '#F6B866',
		            }
	            }
	        }
	    },
        legend: {
			enabled: false
		},
		credits: {  
            enabled: false  
        } 
    });
}

  
//初始执行方法  
$(function(){
    DmClass.init();  
    SocketClass.init();
    $.getJSON("http://10.0.1.7:8080/springmvc/annual/countMsg", function(data){
			bottom(data);
	})
    setInterval(function(){
    	$.getJSON("http://10.0.1.7:8080/springmvc/annual/countMsg", function(data){
			bottom(data);
		})
    },1000*60)
});  