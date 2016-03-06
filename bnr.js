var bnr = (function(){
		return {
		_D: {
			html5 : 'querySelector' in document && 'addEventListener' in window,
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
		appendClass: function(el, c){
			el.className += ' ' + c;
		},
		setClass: function(el, c){
			el.className = c;
		},
		on: function(el,evt,f){
			el.addEventListener(evt,f,false);
		},
		off: function(el,evt,f){
			el.removeEventListener(evt,f,false);
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
		}
	};
})();
