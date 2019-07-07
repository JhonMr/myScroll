/* 
	Date: 2019/7/6
	Author: LJH
	Description: js模拟滑动库
 */

var throttle = function(fn, delay=50) {
	var timeout = null;
	return function() {
		if(!timeout) {
			setTimeout(()=>{
				fn.apply(this, arguments);
				timeout = null;
			},delay)
		}
	}
}
class Dom {
	/* dom: null
	x: 0
	y: 0 
	cbDefault: [0.23 1  0.32 1]*/
	constructor(dom) {
		this.x = 0;
		this.y = 0;
		this.cbDefault = [0.23, 1, 0.32, 1]; 
		this.duration = 2.5
		this.dom = typeof dom == 'object' ? dom : document.querySelector(dom);
	}
	moveTo({x, y}) {
		if(x==0 && y==0) return false;
		this.x += x;
		this.y += y;
		let style = [
			`transition-timing-function: cubic-bezier(${this.cbDefault.join(',')})`,
			`transition-duration: ${this.duration}s`,
			`transform: translate(${this.x}px, ${this.y}px)  scale(1) translateZ(0px)`
		]
		this.dom.style.cssText = style.join(';');
		
		
		/* this.dom.style.transitionTimingFunction = cube-bezier(${this.cbDefault.join(',')});
		this.dom.style.transitionDuration = this.duration;
		this.dom.style.transform = `translate(${this.x}px, ${this.y}px)`; */
	}
}
class MyScroll {
	/* dom: null
	direction: 'y'
	startX:0
	startY:0
	startTime: 0
	throttle: null */
	constructor(options) {
		this.direction = 'y'
		this.startX = 0
		this.startY = 0
		this.startTime =  0
		this.throttle = throttle(this.touchmove);
	    this.dom = new Dom(options.el);
		this.direction = (options.direction || this.direction).toLocaleLowerCase();
		
		this.bind()
	}
	bind() {
		let dom = this.dom.dom,
			that = this;
		dom.addEventListener('touchstart', this.touchstart.bind(that), false);
		dom.addEventListener('touchmove', this.throttle.bind(that), false);
	}
	setPosition(e) { 
		let touchEvent = e.changedTouches[0];
		this.startX = touchEvent.pageX;
		this.startY = touchEvent.pageY;
		this.startTime = +new Date();
	}
	touchstart(e) {
		this.setPosition(e);
	}
	touchmove(e){
		let touchEvent = e.changedTouches[0];
		let mX = touchEvent.pageX;
		let mY = touchEvent.pageY;
		let mTime = +new Date();
		let distance = {
			x: mX - this.startX,
			y: mY - this.startY,
			time: mTime - this.startTime
		}
		let params = {x:0, y:0}
		if(this.direction.indexOf('y')!=-1)
			params.y = distance.y
		if(this.direction.indexOf('x')!=-1)
			params.x = distance.x
		this.dom.moveTo(params);
		this.setPosition(e);
	}
}