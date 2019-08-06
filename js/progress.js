(function(window){
	function Progress($footer_in2_down,$footer_in2_down1,$footer_in2_down2){
		return new Progress.prototype.init($footer_in2_down,$footer_in2_down1,$footer_in2_down2);
	}
	 Progress.prototype={
		constructor:Progress,
		init :function($footer_in2_down,$footer_in2_down1,$footer_in2_down2){
			this.$footer_in2_down = $footer_in2_down;
			this.$footer_in2_down1 = $footer_in2_down1;
			this.$footer_in2_down2 = $footer_in2_down2;
			isMove:false;
		},
		progressClick:function(callBack){
			var $this = this;
			var left2 = this.$footer_in2_down.offset().left;
			var width1 = this.$footer_in2_down.width();
			//获取当前位置离窗口的位置
			this.$footer_in2_down.click(function(event){
				//获取点击后的位置与窗口的距离
				var left1 = event.pageX;
				//设置前景的宽度和颜色 ，在这里调用的函数是click的$footer_in2_down,在这里拿不到所以我们可以在一开始将this 设置好
				$this.$footer_in2_down1.css("width",left1-left2);
				//这里的单位px可以省略不写 ，这也就是jquery的好处
				$this.$footer_in2_down2.css("left",left1-left2);
				var value = (left1-left2) / width1;
				callBack(value);
			});
		},
		//歌曲进度条同步事件
		setProgress:function(value){
			if(isMove) return; 
			this.$footer_in2_down1.css({
				width: value+"%"
			});
			this.$footer_in2_down2.css({
				left: value+"%"
			});
		},
		progressMove:function(callBack){
			//1 监听鼠标按下事件
			var width1 = this.$footer_in2_down.width();
			var $this = this;
			var left2 = this.$footer_in2_down.offset().left;
			this.$footer_in2_down.mousedown(function(){
			//2 监听鼠标移动事件
			//首次获得距离只需要进行一次
//			var left = $(this).offset().left;
			isMove = true;
			 $(document).mousemove(function(event){
			    	//持续获得背景的宽度和距离
					//获取点击后的位置与窗口的距离
					var left1 = event.pageX;
					//设置前景的宽度和颜色 ，在这里调用的函数是click的$footer_in2_down,在这里拿不到所以我们可以在一开始将this 设置好
					if(left1-left2>width1){
						$this.$footer_in2_down1.css("width",width1);
						$this.$footer_in2_down2.css("left",width1);
					}else if(left1-left2<0){
						$this.$footer_in2_down1.css("width",0);
						$this.$footer_in2_down2.css("left",0);
					}else{
						$this.$footer_in2_down1.css("width",left1-left2);
						$this.$footer_in2_down2.css("left",left1-left2);
					}
					var value = (left1-left2) / width1;
					callBack(value);
					//这里的单位px可以省略不写 ，这也就是jquery
			    })
			});
			//3 监听鼠标抬起事件
			$(document).mouseup(function(){
				$(document).off("mousemove");
				isMove = false;
			});
		}
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress=Progress;
})(window);
