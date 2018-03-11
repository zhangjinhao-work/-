navShow();
scrollPic();
navSwipe();
scroll();
document.addEventListener("touchstart",
	function(e) {
		e.preventDefault();
	}
);
function scroll() {
	var wrap  = document.querySelector(".wrap");
	var scroll = wrap.children[0];
	var bar = document.querySelector('#scrollBar');
	var callBack = {};
	var scale = wrap.clientHeight/scroll.offsetHeight;
	var search = document.querySelector(".search");
	var searchBtn = document.querySelector(".searchBtn");
	bar.style.height = wrap.clientHeight*scale + "px";
	searchBtn.addEventListener("touchend", 
		function() {
			var top =-cssTransform(scroll,"translateY")
			if(search.style.display == "block") {
				if(top) {
		 			search.style.display = "none"; 
				}
			} else {
				search.style.display = "block"
			}
		}
	);
	callBack.start = function() {
		
	};
	callBack.in = function() {
		bar.style.opacity = 1;
		var top = -cssTransform(scroll,"translateY")*scale;
		cssTransform(bar,"translateY",top);
		if(top) {
 			search.style.display = "none"; 
		}
	};
	callBack.over = function() {
		bar.style.opacity = 0;
		var top =-cssTransform(scroll,"translateY");
		cssTransform(bar,"translateY",top);
		if(top == 0) {
 			search.style.display = "block"; 
		}
		
	};
	mscroll(wrap,callBack);
}
function navShow(){
	var btn = document.querySelector("#menuBtn");
	var nav = document.querySelector('#nav');
	btn.addEventListener(
		"touchstart",
		function(e){
			if(btn.className == "menuBtnClos"){
				btn.className = "menuBtnShow";
				nav.style.display = "block";
			}else{
				btn.className = "menuBtnClos";
				nav.style.display = "none";
			}
			e.stopPropagation();
		}
	)
	nav.addEventListener(
		"touchstart",
		function(e){
			e.stopPropagation();
		}
	)
	document.addEventListener(
		"touchstart",
		function(e){
			if(btn.className == "menuBtnShow"){
				btn.className = "menuBtnClos";
				nav.style.display = "none";
			}
		}
	)
}

function navSwipe(){
	var navScroll = document.querySelector(".navscroll");
	var navs = document.querySelector(".navs");
	var startPoint = 0;
	var startX = 0;
	var minX = navScroll.clientWidth - navs.offsetWidth;
	var step = 1;
	var lastTime = 0;
	var lastX = 0;
	var lastDis = 0;
	var lastTimeDis = 0;
	cssTransform(navScroll,"translateZ",0.01);	
	navScroll.addEventListener(
		"touchstart",
		function(e){
			startPoint = e.changedTouches[0].pageX;
			startX = cssTransform(navs,"translateX");
			lastX = startX;
			lastTime = new Date().getTime();
			lastDis = 0;
			lastTimeDis = 0;
		}
	);
	navScroll.addEventListener(
		"touchmove",
		function(e){
			var nowPoint = e.changedTouches[0].pageX;
			var dis = nowPoint - startPoint;
			var left = startX + dis;
			var nowTime = new Date().getTime();
			if(left > 0){
				step = 1- left/navScroll.clientWidth;
				left = parseInt(step*left);
			}
			if(left < minX){
				var over = minX - left;
				step = 1- over/navScroll.clientWidth;
				over = parseInt(step*over);
				left = minX - over;
			}
			lastDis = left - lastX;
			lastTimeDis = nowTime - lastTime;
			lastX = left;
			lastTime = nowTime;
			cssTransform(navs,"translateX",left)
		}
	);
	navScroll.addEventListener(
		"touchend",
		function(e){
			var speed = (lastDis/lastTimeDis)*300;
			var left = cssTransform(navs,"translateX");
			var target = left + speed;
			var type = "cubic-bezier(.34,.92,.58,.9)";
			var time = Math.abs(speed*.9);
			time = time<300?300:time;
			if(target > 0){
				target = 0
				type = "cubic-bezier(.08,1.44,.6,1.46)";
			}
			if(target < minX){
				target = minX
				type = "cubic-bezier(.08,1.44,.6,1.46)";				
			}
			navs.style.transition = time + "ms "+ type;
			cssTransform(navs,"translateX",target);
		}
	)
}

function scrollPic(){
	var wrap = document.querySelector('.picTab');
	var list = document.querySelector('.picList');
	list.innerHTML += list.innerHTML;
	var lis = document.querySelectorAll('.picList li');
	var spans = document.querySelectorAll('#picNav span');
	var startPoint = 0;
	var startX = 0;
	var now = 0;
	var timer = null;
	var isMove = true;
	var isFirst = true;
	cssTransform(wrap,"translateZ",0.01);
	cssTransform(wrap,"translateX",0);
	auto();
	wrap.addEventListener(
		"touchstart",
		function(e) {
			clearInterval(timer);
			list.style.transition = "none";
			var translateX = cssTransform(list,"translateX");
			now = Math.round(-translateX / wrap.offsetWidth);
			if(now == 0) {
				now = spans.length;
			}
			if(now == lis.length-1) {
				now = spans.length-1;
			}
			cssTransform(list,"translateX",-now * wrap.offsetWidth);
			startPoint = {pageX:e.changedTouches[0].pageX,pageY:e.changedTouches[0].pageY};
			startX = cssTransform(list,"translateX");
			isMove = true;
			isFirst = true;
		}
	);
	wrap.addEventListener(
		"touchmove",
		function(e) {
			if(!isMove) {
				return;
			}
			var nowPoint = e.changedTouches[0];
			var disX = nowPoint.pageX - startPoint.pageX;
			var disY = nowPoint.pageY - startPoint.pageY;
			if(isFirst) {
				isFirst = false;
				if(Math.abs(disY) > Math.abs(disX)) {
					isMove = false;
				}
			}
			if(isMove) {
				cssTransform(list,"translateX",startX + disX);
			}
		}
	);
	wrap.addEventListener(
		"touchend",
		function(e) {
			var translateX = cssTransform(list,"translateX");
			now = Math.round(-translateX / wrap.offsetWidth);
			tab();
			auto();
		}
	);
	function auto() {
		clearInterval(timer);
		timer = setInterval(
			function() {
				if(now == 0) {
					now = spans.length;
				}
				if(now == lis.length-1) {
					now = spans.length-1;
				}
				list.style.transition = "none";
				cssTransform(list,"translateX",-now * wrap.offsetWidth);
				setTimeout(
					function () {
						now++;
						tab();	
					},30
				);
			},2000
		);
	}
	function tab() {
		list.style.transition = ".5s";
		cssTransform(list,"translateX",-now * wrap.offsetWidth);
		for(var i = 0 ; i < spans.length; i++) {
			spans[i].className = "";
		}
		spans[now%spans.length].className = "active";
	}

}
tab()
function tab(){
	var tabList = document.querySelectorAll(".tabList");
	var tabNav = document.querySelectorAll(".tabNav");
	var width = tabNav[0].offsetWidth;	
	for(var i = 0;i<tabNav.length;i++){
		swipe(tabNav[i],tabList[i]);
	}
	function swipe(nav,list){
		cssTransform(list,"translateZ",0.01);
		cssTransform(list,"translateX",-width);
		var startPoint = 0;
		var startX = 0;
		var now = 0;
		var isMove = true;
		var isFirst = true;
		var isLoad = false;
		var next = document.querySelectorAll(".tabNext");
		var navA = nav.getElementsByTagName("a");
		var navActive = nav.getElementsByTagName('span')[0];
		list.addEventListener(
			"touchstart",
			function(e){
				if(isLoad){
					return;
				}
				list.style.transition = "none";
				startPoint = {pageX:e.changedTouches[0].pageX,pageY:e.changedTouches[0].pageY};
				startX = cssTransform(list,"translateX");
				isMove = true;
				isFirst = true;
			}
		);
		list.addEventListener(
			"touchmove",
			function(e){
				if(isLoad){
					return
				}
				if(!isMove){
					return;
				}
				var nowPoint = e.changedTouches[0];
				var disX = nowPoint.pageX - startPoint.pageX;
				var disY = nowPoint.pageY - startPoint.pageY;
				if(isFirst){
					isFirst = false;
					if(Math.abs(disY) > Math.abs(disX)){
						isMove = false;
					}
				}
				if(isMove){
					cssTransform(list,"translateX",startX + disX)
				}
				if(Math.abs(disX) > width/2){
					end(disX)
				}
			}
		);
		list.addEventListener(
			"touchend",
			function(){
				if(isLoad){
					return
				}
				list.style.transition = ".5s";
				cssTransform(list,"translateX",-width);
			}
		)
		function end(disX){
			isLoad = true;
			var dir = disX/Math.abs(disX);
			now -= dir;
			if(now<0){
				now = navA.length -1
			}
			if(now >=navA.length ){
				now = 0
			}
			var target = dir > 0?0:-2*width;
			list.style.transition = "300ms";
			cssTransform(list,"translateX",target);
			list.addEventListener(
				"webkitTransitionEnd",
				tranEnd			
			);
			list.addEventListener(
				"transitionend",
				tranEnd			
			)
		};
		function tranEnd(){
			var left = navA[now].offsetLeft;
			cssTransform(navActive,"translateX",left)
			for(var i = 0;i<next.length; i++){
				next[i].style.opacity = 1;
			}
			setTimeout(
				function(){
					list.style.transition = "none";
					cssTransform(list,"translateX",-width);
					isLoad = false;
					for( var i=0;i<next.length;i++){
						next[i].style.opacity = 0;
					}
				},1000
			)
		}
	}
}