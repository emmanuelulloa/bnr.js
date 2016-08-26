/*
  _                _     
 | |__  _ __  _ __(_)___ 
 | '_ \| '_ \| '__| / __|
 | |_) | | | | |_ | \__ \
 |_.__/|_| |_|_(_)/ |___/
                |__/     
*/
var bnr = (function(){
	"use strict";
	return {
		_io: function(s,i){
			return s.indexOf(i);
		},
		detect : function(val){
			var val = val.toLowerCase(),
				_n = window.navigator.userAgent.toLowerCase(),
				obj = {
					touch : ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0),
					html5 : 'querySelector' in document && 'addEventListener' in window,
					ios : /ip(ad|od|hone)/.test(_n),
					android : this._io(_n,'android') > -1,
					mobile: /mobi/i.test(_n),
					ie : (this._io(_n,'msie') != -1) ? parseInt(_n.split('msie')[1]) : 0,
					edge : this._io(_n,'edge'),
					svg : (document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect),
					orientation : (function(){
						var r = 'landscape';
						if(window.matchMedia){
						 r = (window.matchMedia('(orientation: portrait)').matches)?'portrait':'landscape';
						}
						return r;
					})()
				};
			return obj[val];
		},
		ready: function(fn) {
			if (document.readyState === 'complete') {
				return fn();
			}
			document.addEventListener('DOMContentLoaded', fn, false);
			return this;
		},
		$:function(S, i){
			var r = document.getElementById(S) || document.getElementsByClassName(S) || document.getElementsByTagName(S) || document.querySelector(S) || document.querySelectorAll(S);
			if(r.length && i != undefined){
				return r[i];
			}
			return r;
		},
		_PL: {
			img:{
				tag:'img',
				parent:'body',
				attr:{
					src:'@URL@'
				}
			},
			css:{
				tag:'link',
				parent:'head',
				attr:{
					'rel':'stylesheet', 
					'type':'text/css', 
					'href':'@URL@'
				}
			},
			js:{
				tag:'script',
				parent:'head',
				attr:{
					'type':'text/javascript',
					'src':'@URL@'
				}
			},
			svg:{
				tag: 'object',
				parent: 'body',
				attr:{
					'type':'image/svg+xml',
					'data':'@URL@'
				}
			}
		},
		politeLoad : function(src, parent, fn){
			var p, el, img = false, xts = 'js css png gif jpg svg'.split(' ');
			for(var i = 0; i < xts.length; i++){
				if(src.indexOf('.' + xts[i]) != -1){
					switch(xts[i]){
						case 'png':
						case 'gif':
						case 'jpg':
						img = true;
						p = this._PL.img;
						break;
						case 'svg':
						img = true;
						p = this._PL.svg;
						break;
						default:
						p = this._PL[xts[i]];
						break;
					}
					break;
				}
			}
			el = document.createElement(p.tag);
			if(fn){
				el.onload = fn;
			}
			for(var prop in p.attr){
				el.setAttribute(prop, p.attr[prop].replace('@URL@', src));
			}
			if(!parent){
				if(img){
					return el;
				}
				parent = document.getElementsByTagName(p.parent)[0];
			}
			return parent.appendChild(el);
		},
		preload: function(images, fn){
			var a = images.split(','), l = a.length, r = [];
			for(var i = 0; i < l; i++){
				r.push(this.politeLoad(a[i],null,fn));
			}
			return r;
		},
		getElement: function(el){
			if(typeof el === 'string'){
				return this.$(el, 0);
			}
			return el;
		},
		getTime: function(t){
			if(typeof t === 'string'){
				if(t.indexOf('ms') != -1){
					return parseInt(t);
				}else if(t.indexOf('s') != -1){
					return Math.round(parseFloat(t) * 1000);
				}
				return parseInt(t);
			}
			return t;
		},
		resetElement: function(elem){
			var el = this.getElement(elem);
			el.parentNode.replaceChild(el.cloneNode(true),el);
			return this;
		},
		addClass: function(elem, c){
			var el = this.getElement(elem);
			if (el.classList) el.classList.add(c);
			else el.className += ' ' + c;
			return this;
		},
		appendClass : function(elem, c){
			return this.addClass(this.getElement(elem), c);
		},
		removeClass: function(elem, c){
			var el = this.getElement(elem);
			if (el.classList) el.classList.remove(c);
			else el.className = el.className.replace(new RegExp('(^|\\b)' + c.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			return this;
		},
		setClass: function(elem, c){
			this.getElement(elem).className = c;
			return this;
		},
		hasClass: function(elem, c){
			return new RegExp(' ' + c + ' ').test(' ' + this.getElement(elem).className + ' ');
		},
		toggleClass: function(elem, c){
			var el = this.getElement(elem);
			if(this.hasClass(el, c)){
				this.removeClass(el, c);
			}else{
				this.addClass(el, c);
			}
			return this;
		},
		switchClass: function(elem, c1, c2){
			var el = this.getElement(elem);
			if(this.hasClass(el, c1)){
				this.removeClass(el, c1);
			}
			this.addClass(el, c2);
			return this;
		},
		wait: function(fn, d){
			d = d || 1;
			return setTimeout(fn, Math.round(d*1000));
		},
		onComplete: function(elem, name, fn, time){
			var el = this.getElement(elem),
			t = time || 500,
			evtTran = el.style['transition'] !== undefined ? 'transitionend' : el.style['WebkitTransition'] !== undefined ? 'webkitTransitionComplete' : null,
			evtAnim = el.style['animation'] !== undefined ? 'animationend' : el.style['WebkitAnimation'] !== undefined ? 'webkitAnimationComplete' : null,
			fnTran = function(evt){
				if(evt.propertyName == name){
					fn(evt);
				}
			},
			fnAnim = function(evt){
				if(evt.animationName == name){
					fn(evt);
				}
			};
			if(evtTran == null && evtAnim == null){
				this.wait(fn, t / 1000);
			}else{
				this.on(el, evtTran, fnTran);
				this.on(el, evtAnim, fn);
			}
			return this;
		},
		on: function(elem,evt,f){
			var el = this.getElement(elem);
			el.addEventListener(evt,f,false);
			return this;
		},
		off: function(elem,evt,f){
			var el = this.getElement(elem);
			el.removeEventListener(evt,f,false);
			return this;
		},
		_T : {
			F: 2000,
			L: 0,
			T: [],
			D: 0,
			M: null,
			O: [],
			P: true,
			TKR: (function(){
				var raf = null, caf = null, cncl = 'cancel' + 'AnimationFrame', req = 'request' + 'AnimationFrame';
				if(!window[req]){
					req = 'Request' + 'AnimationFrame';
					cncl = 'Cancel' + 'AnimationFrame';
					raf = window['webkit' + req] || window['moz' + req] || window['ms' + req] || window['o' + req] || function(callback){ return window.setTimeout(callback,16);};
					caf = window['webkit' + cncl] || window['moz' + cncl] || window['ms' + cncl] || window['o' + cncl] || window.clearTimeout;
				}else{
					raf = window[req];
					caf = window[cncl];
				}
				return {RAF: raf, CAF: caf};
			})()
		},
		_ip: function(){
			return this._T.P;
		},
		clearDelay : function(obj){
			this._T.TKR.CAF(obj.id);
			return this;
		},
		delay : function(fn, d){
			var obj = {
				id : 0,
				_fn : fn,
				_f : Math.round(d / 16.666),
				_raf : this._T.TKR.RAF,
				_ip : this._ip,
				getId : function(){
					var o = this;
					return this._raf.call(window, function(){
						o.tick();
					});
				},
				tick : function(){
					if(this._ip()){
						if(this._f){
							--this._f;
							this.id = this.getId();
						}else{
							this._fn();
						}						
					}
				}
			};
			obj.id = obj.getId();
			return obj;
		},
		timeline: function(val,fd){
			if(fd){
				this._T.F = this.getTime(fd);
			}
			if (typeof val === 'string') {
		      var map = {
		        'loops': this._T.L,
		        'duration': this._T.D,
		        'timeline': this._T.M,
		        'now': ((!this._T.N)?0:new Date().getTime() - this._T.N)
		      };
		      if(val === 'restart'){
		      	this.timeline(this._T.O, this._T.F);
		      	return true;
		      }else if(val === 'halt'){
			    for (var i = 0; i < this._T.T.length; i++) {
			      this.clearDelay(this._T.T[i]);
			    }
			    return false;
		      }else if(val === 'play'){
		      	this._T.P = true;
		      	return true;
		      }else if(val === 'stop'){
		      	this._T.P = false;
		      	return false;
		      }else if(val === 'pause'){
		      	this._T.P = !this._T.P;
		      	return this._T.P;
		      }
		      return map[val];
		    }
			this._T.T = [];
			this._T.D = 0;
			this._T.M = val;
			this._T.L++;
			if(!this._T.N){
				this._T.N = new Date().getTime();
			}
			this._T.O = val;
			var me = this;
			for(var i = 0; i < val.length; i++){
				var dur = val[i][0], time = this.getTime(dur), f = val[i][1], ff = (time < 100) ? time * me._T.F : (!dur)? me._T.F : time;
				this._T.T.push(this.delay(f, me._T.D += Math.abs(ff)));
			}
			return this;
		}
	};
})();
/*
     _    _   _ ___ __  __    _  _____ ___ ___  _   _ 
    / \  | \ | |_ _|  \/  |  / \|_   _|_ _/ _ \| \ | |
   / _ \ |  \| || || |\/| | / _ \ | |  | | | | |  \| |
  / ___ \| |\  || || |  | |/ ___ \| |  | | |_| | |\  |
 /_/   \_\_| \_|___|_|  |_/_/   \_\_| |___\___/|_| \_|

*/
