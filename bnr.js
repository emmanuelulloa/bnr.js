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
		resetElement: function(el){
			el.parentNode.replaceChild(el.cloneNode(true),el);
		},
		addClass: function(el, c){
			if (el.classList) el.classList.add(c);
			else el.className += ' ' + c;
			return this;
		},
		appendClass : function(el, c){
			return this.addClass(el, c);
		},
		removeClass: function(el, c){
			if (el.classList) el.classList.remove(c);
			else el.className = el.className.replace(new RegExp('(^|\\b)' + c.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			return this;
		},
		setClass: function(el, c){
			el.className = c;
			return this;
		},
		wait: function(fn, d){
			d = d || 1;
			return setTimeout(fn, Math.round(d*1000));
		},
		on: function(el,evt,f){
			el.addEventListener(evt,f,false);
			return this;
		},
		off: function(el,evt,f){
			el.removeEventListener(evt,f,false);
			return this;
		},
		_T : {
			F: 2000,
			L: 0,
			T: [],
			D: 0,
			M: null,
			O: []
		},
		timeline: function(val,fd){
			if(fd){
				this._T.F = fd;
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
		      }
		      if(val === 'halt'){
			    for (var i = 0; i < this._T.T.length; i++) {
			      clearTimeout(this._T.T[i]);
			    }
			    return false;
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
				var f = val[i][1], ff = (val[i][0] < 100) ? val[i][0] * me._T.F : (!val[i][0])? me._T.F : val[i][0];
				this._T.T.push(setTimeout(f, me._T.D += Math.abs(ff)));
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
