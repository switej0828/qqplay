(function(window){
	function Lrc(path){
		return new Lrc.prototype.init(path);
	}
	Lrc.prototype= {
		constructor:Lrc,
		times:[],//存储时间和歌词变量
		lyrics:[],
		init:function(path){
			this.path = path;
		},
		index:-1,
		//加载歌词信息
		loadLrc:function(callBack){
			$this = this;
			$.ajax({
		  		url : $this.path,
		  		dataType:"text",
		  		success:function(data){
		  			$this.parseLrc(data);
		  			callBack();//设置一个回调函数在歌词加载分析完毕后返回给函数调用者进行后续相应操作
		  		},
		  		error:function(e){
		  			console.log(e);
		  		}
		  });
		},
		parseLrc:function(data){
			//因为时间数组和歌词数组会继续保存上一首的数据，所以必须要清理上次的两个数组 在执行解析函数之后
			this.times=[];//清空两个数组
			this.lyrics=[];
			var $this = this;
//			console.log(data);
			//定义一个正则表达式,圆括号相当与分组元素
			var timeExp = /\[(\d*:\d*\.\d*)\]/;
			var array1 = data.split("\n");
			//遍历取出所有元素
			$.each(array1, function(index,ele) {
				var res = timeExp.exec(ele);
				
				//在遍历元素中return true相当于continue;
				if(res==null) return true;
				//取出res中第二个元素
				var timeRes = res[1];
				//格式为00：00 有分钟也有秒钟
				var time2 = timeRes.split(":");
				var min = parseInt(time2[0]);
				var sec = parseFloat(time2[1]);
				var time = parseFloat((min*60+sec).toFixed(2));
				
				console.log($this.times);
				var lrc= ele.split("]");//使用这个中括号进行切割
				var lrc1 = lrc[1];
				if(lrc1.length==1) 	return;
					//删除对应的时间，其实没有必要，只要在判断之后进行时间数组的写入就OK了
				$this.times.push(time);//$this 为了访问外部变量，使用push将时间数据存在times数组中
				$this.lyrics.push(lrc1);//$this 为了访问外部变量，使用push将歌词数据存在lyrics数组中
				console.log($this.lyrics);
				
			});
//			console.log($this.lyrics);//无论怎么样访问times和lyrics数据都得在$this中进行访问
		},
		currentIndex:function(musicCurrent){
			//这个算法很值得研究 在这里先进行保存一下 ，今后修改时进行分析
			if(musicCurrent>=this.times[0]) {
				this.index++;
				this.times.shift();//删除数组最前面的元素
			}
			return this.index;
		}
	}
	
	Lrc.prototype.init.prototype = Lrc.prototype;
	window.Lrc = Lrc;
})(window);
