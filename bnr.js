/* bnr */
var bnr = (function(){
		return {
		_D: {
			html5 : 'querySelector' in document && 'addEventListener' in window,
			mobile : /Mobi/i.test(window.navigator.userAgent) || window.matchMedia("only screen and (max-width: 760px)").matches,
			ie : (navigator.userAgent.toLowerCase() != -1) ? parseInt(navigator.userAgent.toLowerCase().split('msie')[1]) : 0
		},
		detect : function(val){return this._D[val]},
		ready: function(fn) {
			if (document.readyState === 'complete') {
				return fn();
			}
			document.addEventListener('DOMContentLoaded', fn, false);
			return this;
		},
		$:function(S){
			return document.getElementById(S) || document.getElementsByClassName(S) || document.getElementsByTagName(S) || document.querySelector(S) || document.querySelectorAll(S);
		},
		_PL: {img:{tag:'img',parent:'body',attr:{src:'@URL@'}},css:{tag:'link',parent:'head',attr:{'rel':'stylesheet', 'type':'text-css', 'href':'@URL@'}},js:{tag:'script',parent:'head',attr:{'type':'text/javascript','src':'@URL@'}}},
		politeLoad : function(src, parent){
			var p, e, xts = 'js css png gif jpg'.split(' ');
			for(var i = 0; i < xts.length; i++){
				if(src.indexOf('.' + xts[i]) != -1){
					switch(xts[i]){
						case 'png':
						case 'gif':
						case 'jpg':
						p = this._PL.img;
						break;
						default:
						p = this._PL[xts[i]];
						break;
					}
					break;
				}
			}
			el = document.createElement(p.tag);
			for(var prop in p.attr){
				el.setAttribute(prop, p.attr[prop].replace('@URL@', src));
			}
			if(!parent){
				parent = document.getElementsByTagName(p.parent)[0];
			}
			parent.appendChild(el);
		},
		resetElement: function(el){
			el.parentNode.replaceChild(el.cloneNode(true),el);
		},
		appendClass: function(el, c){
			el.className += ' ' + c;
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
/*BANNER CODE*/
