$(function(){
	//监听事件
	var $audio = $("audio");
	var player = new Player($audio);
	var lyric;
	//获取进度条的事件
	var progress;
	var musicprogress;
	jindutiao();
	function jindutiao(){
		//歌曲的进度条事件
		var $footer_in2_down = $(".footer_in2_down");
		var $footer_in2_down1 = $(".footer_in2_down1");
		var $footer_in2_down2 = $(".footer_in2_down2");
		progress =new Progress($footer_in2_down,$footer_in2_down1,$footer_in2_down2);
		progress.progressClick(function(value){
			player.musicTo(value);
		});
		progress.progressMove(function(value){
			player.musicTo(value);
		});
		//音乐按钮的进度条事件
		var $footer4_1 = $(".footer4_1");
		var $footer4_2 = $(".footer4_2");
		var $footer4_3 = $(".footer4_3");
		musicprogress = new Progress($footer4_1,$footer4_2,$footer4_3); 
		musicprogress.progressClick(function(value){
			player.voiceTo(value);
		});
		musicprogress.progressMove(function(value){
			player.voiceTo(value);
		});
	}
	jianting();
	function jianting(){
		 $(".content_in_left").delegate(".content_ul3","mouseenter",function(){
        	$(this).find(".box2").stop().fadeIn(100);
			$(this).find(".a1").stop().fadeIn(10);
			$(this).find("span").stop().fadeOut(10);
        })
        $(".content_in_left").delegate(".content_ul3","mouseleave",function(){
        	 $(this).find(".box2").stop().fadeOut(100);
			  $(this).find(".a1").stop().fadeOut(10);
			  $(this).find("span").stop().fadeIn(10);
        })
        //选框的勾中过程
        $(".content_in_left").delegate(".box1","click",function(){
        	$(this).toggleClass("box1_1");
        })
        //删除按钮的监听以及委托过程
        $(".content_in_left").delegate(".a1","click",function(){
        	var $item = $(this).parents(".content_ul3");
        	//判断当前删除的是否曾在播放
        	if($item.get(0).index==player.currentIndex){
        		$(".footernext").trigger("click");
        	}
        	$item.remove();
			player.delMusic($item.get(0).index);
			//重新排序
			$(".content_ul3").each(function(index,music){
				music.index = index;
				$(this).find(".li2").text(index+1);
			})
        })
        //委托函数进行播放事件的实现
        var $footerli =$(".footerli1");
         $(".content_in_left").delegate(".musicplay","click",function(){
         	var $item = $(this).parents(".content_ul3");
         	$(this).toggleClass("musicplay2");
         	//图标切换键，去掉上级的高亮图标
         	$item.find(".li2").toggleClass("li2_1");
         	$item.siblings().find(".li2").removeClass("li2_1");
         	//改变播放键状态
         	$item.siblings().find(".musicplay").removeClass("musicplay2");
         	if($(this).attr("class").indexOf("musicplay2")!=-1){
         		//检查当前节点的播放键是否被按下
         		$footerli.addClass("footerli2");
         		//改变文字状态
				$item.find("li").css("color","#fff");
				$item.siblings().find("li").css("color","#ccc");
         	}else{
         		$footerli.removeClass("footerli2");
         		$item.find("li").css("color","#ccc");
         	}
         	//调用播放函数中播放键执行的功能
         	player.playMusic($item.get(0).index,$item.get(0).music);
         	//播放时进行歌曲信息的初始化
         	initMusicInfo($item.get(0).music);
         	//播放时进行歌词信息的初始化
         	initLrcInfo($item.get(0).music);
         	
         });
         //监听事件获取对音量的相应操作
         $(".footera").click(function(){
         	$(this).toggleClass("footera1")
         	if($(this).attr("class").indexOf("footera1")!=-1){
         		//含有footera1属性代表变成没有声音
         		player.voiceTo(0);
         	}else{
         		player.voiceTo(1);
         	}
         });
         //监听底部按钮底部三个播放按键的同步
         $(".footerli1").click(function(){
         	//判断有么有播放过音乐
         	$(this).toggleClass("footerli2");
         	if(player.currentIndex == -1){
         		$(".content_ul3").eq(0).find(".musicplay").trigger("click");
         	}else{
         		$(".content_ul3").eq(player.currentIndex).find(".musicplay").trigger("click");
         	}
         });
         $(".footerpre").click(function(){
         	$(".content_ul3").eq(player.preIndex()).find(".musicplay").trigger("click");
         });
         $(".footernext").click(function(){
         	$(".content_ul3").eq(player.nextIndex()).find(".musicplay").trigger("click");
         });
	}
	//获取列表事件,这是一个回调函数
	player.getTimeDate(function(musicDuration,musicCurrent,timeStr){
         	 $(".footer_in2_top2").text(timeStr);
         	 var value = musicCurrent / musicDuration * 100;
         	 progress.setProgress(value);
         	 //实现根据歌曲时间显示相应的歌词信息
         	 var index1 = lyric.currentIndex(musicCurrent);
         	 var $h32 =  $(".content_in_right3 h3").eq(index1)
         	 //添加相关的属性的类，并且遍历其他元素消除存在的元素
         	  $h32.addClass("h31");
         	  $h32.siblings().removeClass("h31");
//       	  console.log($h32);
         	  //通过控制h3的margin的top值设置为负值则为上面平移
//            if(index1<=0) return; 第一行滚动
              //如果要设置在中间部位高亮的话 只要控制.content_in_right3让其在第三个序列的时候滚动就行
              if(index1<=2) return;
         			$(".content_in_right3").css({
        	    	marginTop : -30 * (index1-2)
//        	    	注意这里的margin-top的模式要改变成marginTop
         	  });
         	  if(timeStr==1){
         	  	$(".content_ul3").eq(player.currentIndex).find(".musicplay").trigger("click");
         	  }
         	   
        });
	getPlayList();
	
	function getPlayList(){
	  	$.ajax({
	  		url:"./source/musiclist.json",
	  		dataType:"json",
	  		success:function(data){
			player.playerlist=data;
	  			var $musicList=$(".content_in_left_info1");
	  			$.each(data, function(index,music) {
	  				var $item = createMusicItem(index,music);
	  				$musicList.append($item);
	  			});
	  			//初始化第一首歌曲信息
	  			initMusicInfo(data[0]);
	  			//初始化歌词信息
	  			initLrcInfo(data[0]);
	  		},
	  		error:function(e){
	  			console.log(e);
	  		}
	  	})
	}
	function initMusicInfo(music){
		//获取相应元素
		var $song_img = $(".song_img img");
		var $song_name = $(".song_name a");
		var $song_singer = $(".song_singer a");
		var $song_album = $(".song_album a");
		var $footer_in2_top1 = $(".footer_in2_top1");
		var $footer_in2_top2 = $(".footer_in2_top2");
		var $bcg = $(".bcg");
		$song_img.attr("src",music.cover);
		$song_name.text(music.name);
		$song_singer.text(music.singer);
		$song_album.text(music.album);
		$footer_in2_top1.text(music.name +"/"+ music.singer);
		$footer_in2_top2.text("00:00 /"+music.time);
		//这句的格式不是特别懂
		$bcg.css("background","url('"+music.cover+"')");
	}
	//ajax动态获取列表
	function initLrcInfo(music){
		lyric =new Lrc(music.link_lrc);//为了在全局中可以调用Lrc里面的函数，必须将改行自全局中定义,这里不能在用var 
		var $lrc1 = $(".content_in_right3");
		//也要清空上一首的歌词 则要清空父元素所有的元素
		$lrc1.html("");
		lyric.loadLrc(function(){//调用lrc.js对象中的loadLrc函数
			//遍历函数，因为歌词返回的是数组类型或者类数组类型，故要遍历才能得到所有元素，
			//前面的参数表示函数中返回的需要遍历的数组或者对象，后面的fun函数格式较为固定，，ele表示里面的各个元素
			$.each(lyric.lyrics, function(index,ele){
//				$lrc1.text(ele);//该方法只会得到一个元素,不行 
				var $it = $("<h3>"+ele+"</h3>");
				$lrc1.append($it);
			});
			
		});//此处的function函数对应callBack函数，注意不能直接用callBack函数代替function函数
	}
	function createMusicItem(index,music){
		var $item = $(""+
		    "<ul class=\"content_ul3\">\n"+
			"<li>\n"+
				"<div class=\"box1\">\n"+	
				"</div>\n"+
			"</li>\n"+
			"<li class=\"li2\" >"+(index+1)+"</li>\n"+			
			"<li>"+music.name+""+
				"<div class=\"box2\">\n"+
					"<a href=\"javascript:;\" title=\"播放\" class=\"musicplay\"></a>\n"+
					"<a href=\"javascript:;\" title=\"添加\"></a>\n"+
					"<a href=\"javascript:;\" title=\"下载\"></a>\n"+
					"<a href=\"javascript:;\" title=\"分享\"></a>\n"+
				"</div>\n"+
			"</li>\n"+
			"<li>"+music.singer+"</li>\n"+
			"<li><span>"+music.time+""+"</span>\n"+
				"<a class=\"a1\" href=\"javascript:;\" title=\"删除\"></a>\n"+				
			"</li>\n"+
			"</ul>");
			$item.get(0).index=index;
			$item.get(0).music=music;
			return $item;
		}
})
