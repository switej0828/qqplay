(function(window){
	function Player($audio){
		return new Player.prototype.init($audio);
	}
	Player.prototype={
		constructor:Player,
		playlist: [],
		init:function($audio){
			this.$audio = $audio;
			this.audio = $audio.get(0);
		},
		//为什么赋值为:-1 而不是=完全不知道啊
		currentIndex:-1,
		playMusic:function(index,music){
			//判断是否为同一首歌曲
			if(this.currentIndex==index){
				if(this.audio.paused){
					this.audio.play();
				}else{
					this.audio.pause();
				}
			}else {
				this.$audio.attr("src",music.link_url);
				this.audio.play();
				this.currentIndex=index;
			}
		},
		preIndex :function(){
			var index = this.currentIndex-1;
			if(index<0){
				index = this.playlist.length-1;
			};
			return index;
		},
		nextIndex: function () {
            var index = this.currentIndex + 1;
            //这里的bug无法解决
//          if(index >this.playlist.length){
//              index = 0;
//          };
            return index;
     },
		delMusic:function(index){
			this.playlist.splice(index,1);
			if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
		},
		getTimeDate:function(callBack){
			//上面的this指player中的函数
			var $this = this;
			this.$audio.on("timeupdate",function(){
					//而在这个函数中this为audio的this，因此要获得player，则需要保存上一个this
	         	var  musicDuration = $this.audio.duration;
	            var musicCurrent = $this.audio.currentTime;
	            var timeStr = $this.formatTime(musicCurrent,musicDuration);
	            callBack(musicDuration,musicCurrent,timeStr);
			});
		},
		//时间格式函数
		formatTime:function (musicCurrent,musicDuration){
			var endMin = parseInt(musicDuration/60);
			if(endMin<10){
				endMin = "0"+endMin;
			}
			var endSec = parseInt(musicDuration%60);
			if(endSec<10){
				endSec = "0"+endSec;
			}
			var startMin = parseInt(musicCurrent/60);
			if(startMin<10){
				startMin = "0"+startMin;
			}
			var startSec = parseInt(musicCurrent%60);
			if(startSec<10){
				startSec = "0"+startSec;
			}
			return  startMin+":"+startSec+" / "+endMin+":"+endSec;
		},
		musicTo:function(value){
			if(isNaN(value)) return;
			this.audio.currentTime = this.audio.duration * value;
		},
		voiceTo:function(value){
			//取值范围为0到1
			if(isNaN(value)) return;
			if(value<0 || value>1) return;
			this.audio.volume = value;
		}
	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player=Player;
})(window);
