exports.id = 874;
exports.ids = [874];
exports.modules = {

/***/ 82258:
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";return function(e,t){var r=t.prototype,n=r.format;r.format=function(e){var t=this,r=this.$locale();if(!this.isValid())return n.bind(this)(e);var s=this.$utils(),a=(e||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(e){switch(e){case"Q":return Math.ceil((t.$M+1)/3);case"Do":return r.ordinal(t.$D);case"gggg":return t.weekYear();case"GGGG":return t.isoWeekYear();case"wo":return r.ordinal(t.week(),"W");case"w":case"ww":return s.s(t.week(),"w"===e?1:2,"0");case"W":case"WW":return s.s(t.isoWeek(),"W"===e?1:2,"0");case"k":case"kk":return s.s(String(0===t.$H?24:t.$H),"k"===e?1:2,"0");case"X":return Math.floor(t.$d.getTime()/1e3);case"x":return t.$d.getTime();case"z":return"["+t.offsetName()+"]";case"zzz":return"["+t.offsetName("long")+"]";default:return e}}));return n.bind(this)(a)}}}));

/***/ }),

/***/ 11630:
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";var e={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},t=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,n=/\d\d/,r=/\d\d?/,i=/\d*[^-_:/,()\s\d]+/,o={},s=function(e){return(e=+e)+(e>68?1900:2e3)};var a=function(e){return function(t){this[e]=+t}},f=[/[+-]\d\d:?(\d\d)?|Z/,function(e){(this.zone||(this.zone={})).offset=function(e){if(!e)return 0;if("Z"===e)return 0;var t=e.match(/([+-]|\d\d)/g),n=60*t[1]+(+t[2]||0);return 0===n?0:"+"===t[0]?-n:n}(e)}],h=function(e){var t=o[e];return t&&(t.indexOf?t:t.s.concat(t.f))},u=function(e,t){var n,r=o.meridiem;if(r){for(var i=1;i<=24;i+=1)if(e.indexOf(r(i,0,t))>-1){n=i>12;break}}else n=e===(t?"pm":"PM");return n},d={A:[i,function(e){this.afternoon=u(e,!1)}],a:[i,function(e){this.afternoon=u(e,!0)}],S:[/\d/,function(e){this.milliseconds=100*+e}],SS:[n,function(e){this.milliseconds=10*+e}],SSS:[/\d{3}/,function(e){this.milliseconds=+e}],s:[r,a("seconds")],ss:[r,a("seconds")],m:[r,a("minutes")],mm:[r,a("minutes")],H:[r,a("hours")],h:[r,a("hours")],HH:[r,a("hours")],hh:[r,a("hours")],D:[r,a("day")],DD:[n,a("day")],Do:[i,function(e){var t=o.ordinal,n=e.match(/\d+/);if(this.day=n[0],t)for(var r=1;r<=31;r+=1)t(r).replace(/\[|\]/g,"")===e&&(this.day=r)}],M:[r,a("month")],MM:[n,a("month")],MMM:[i,function(e){var t=h("months"),n=(h("monthsShort")||t.map((function(e){return e.slice(0,3)}))).indexOf(e)+1;if(n<1)throw new Error;this.month=n%12||n}],MMMM:[i,function(e){var t=h("months").indexOf(e)+1;if(t<1)throw new Error;this.month=t%12||t}],Y:[/[+-]?\d+/,a("year")],YY:[n,function(e){this.year=s(e)}],YYYY:[/\d{4}/,a("year")],Z:f,ZZ:f};function c(n){var r,i;r=n,i=o&&o.formats;for(var s=(n=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(t,n,r){var o=r&&r.toUpperCase();return n||i[r]||e[r]||i[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(e,t,n){return t||n.slice(1)}))}))).match(t),a=s.length,f=0;f<a;f+=1){var h=s[f],u=d[h],c=u&&u[0],l=u&&u[1];s[f]=l?{regex:c,parser:l}:h.replace(/^\[|\]$/g,"")}return function(e){for(var t={},n=0,r=0;n<a;n+=1){var i=s[n];if("string"==typeof i)r+=i.length;else{var o=i.regex,f=i.parser,h=e.slice(r),u=o.exec(h)[0];f.call(t,u),e=e.replace(u,"")}}return function(e){var t=e.afternoon;if(void 0!==t){var n=e.hours;t?n<12&&(e.hours+=12):12===n&&(e.hours=0),delete e.afternoon}}(t),t}}return function(e,t,n){n.p.customParseFormat=!0,e&&e.parseTwoDigitYear&&(s=e.parseTwoDigitYear);var r=t.prototype,i=r.parse;r.parse=function(e){var t=e.date,r=e.utc,s=e.args;this.$u=r;var a=s[1];if("string"==typeof a){var f=!0===s[2],h=!0===s[3],u=f||h,d=s[2];h&&(d=s[2]),o=this.$locale(),!f&&d&&(o=n.Ls[d]),this.$d=function(e,t,n){try{if(["x","X"].indexOf(t)>-1)return new Date(("X"===t?1e3:1)*e);var r=c(t)(e),i=r.year,o=r.month,s=r.day,a=r.hours,f=r.minutes,h=r.seconds,u=r.milliseconds,d=r.zone,l=new Date,m=s||(i||o?1:l.getDate()),M=i||l.getFullYear(),Y=0;i&&!o||(Y=o>0?o-1:l.getMonth());var p=a||0,v=f||0,D=h||0,g=u||0;return d?new Date(Date.UTC(M,Y,m,p,v,D,g+60*d.offset*1e3)):n?new Date(Date.UTC(M,Y,m,p,v,D,g)):new Date(M,Y,m,p,v,D,g)}catch(e){return new Date("")}}(t,a,r),this.init(),d&&!0!==d&&(this.$L=this.locale(d).$L),u&&t!=this.format(a)&&(this.$d=new Date("")),o={}}else if(a instanceof Array)for(var l=a.length,m=1;m<=l;m+=1){s[1]=a[m-1];var M=n.apply(this,s);if(M.isValid()){this.$d=M.$d,this.$L=M.$L,this.init();break}m===l&&(this.$d=new Date(""))}else i.call(this,e)}}}));

/***/ }),

/***/ 58390:
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";var e="day";return function(t,i,s){var a=function(t){return t.add(4-t.isoWeekday(),e)},d=i.prototype;d.isoWeekYear=function(){return a(this).year()},d.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),e);var i,d,n,o,r=a(this),u=(i=this.isoWeekYear(),d=this.$u,n=(d?s.utc:s)().year(i).startOf("year"),o=4-n.isoWeekday(),n.isoWeekday()>4&&(o+=7),n.add(o,e));return r.diff(u,"week")+1},d.isoWeekday=function(e){return this.$utils().u(e)?this.day()||7:this.day(this.day()%7?e:e-7)};var n=d.startOf;d.startOf=function(e,t){var i=this.$utils(),s=!!i.u(t)||t;return"isoweek"===i.p(e)?s?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):n.bind(this)(e,t)}}}));

/***/ }),

/***/ 9874:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   diagram: () => (/* binding */ diagram)
/* harmony export */ });
/* harmony import */ var _braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8041);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23464);
/* harmony import */ var dayjs_plugin_isoWeek_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(58390);
/* harmony import */ var dayjs_plugin_customParseFormat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11630);
/* harmony import */ var dayjs_plugin_advancedFormat_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(82258);
/* harmony import */ var _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(33232);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(25085);
/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(97519);














var parser = function() {
  var o = function(k, v, o2, l) {
    for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v)
      ;
    return o2;
  }, $V0 = [6, 8, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 33, 35, 37], $V1 = [1, 25], $V2 = [1, 26], $V3 = [1, 27], $V4 = [1, 28], $V5 = [1, 29], $V6 = [1, 30], $V7 = [1, 31], $V8 = [1, 9], $V9 = [1, 10], $Va = [1, 11], $Vb = [1, 12], $Vc = [1, 13], $Vd = [1, 14], $Ve = [1, 15], $Vf = [1, 16], $Vg = [1, 18], $Vh = [1, 19], $Vi = [1, 20], $Vj = [1, 21], $Vk = [1, 22], $Vl = [1, 24], $Vm = [1, 32];
  var parser2 = {
    trace: function trace() {
    },
    yy: {},
    symbols_: { "error": 2, "start": 3, "gantt": 4, "document": 5, "EOF": 6, "line": 7, "SPACE": 8, "statement": 9, "NL": 10, "weekday": 11, "weekday_monday": 12, "weekday_tuesday": 13, "weekday_wednesday": 14, "weekday_thursday": 15, "weekday_friday": 16, "weekday_saturday": 17, "weekday_sunday": 18, "dateFormat": 19, "inclusiveEndDates": 20, "topAxis": 21, "axisFormat": 22, "tickInterval": 23, "excludes": 24, "includes": 25, "todayMarker": 26, "title": 27, "acc_title": 28, "acc_title_value": 29, "acc_descr": 30, "acc_descr_value": 31, "acc_descr_multiline_value": 32, "section": 33, "clickStatement": 34, "taskTxt": 35, "taskData": 36, "click": 37, "callbackname": 38, "callbackargs": 39, "href": 40, "clickStatementDebug": 41, "$accept": 0, "$end": 1 },
    terminals_: { 2: "error", 4: "gantt", 6: "EOF", 8: "SPACE", 10: "NL", 12: "weekday_monday", 13: "weekday_tuesday", 14: "weekday_wednesday", 15: "weekday_thursday", 16: "weekday_friday", 17: "weekday_saturday", 18: "weekday_sunday", 19: "dateFormat", 20: "inclusiveEndDates", 21: "topAxis", 22: "axisFormat", 23: "tickInterval", 24: "excludes", 25: "includes", 26: "todayMarker", 27: "title", 28: "acc_title", 29: "acc_title_value", 30: "acc_descr", 31: "acc_descr_value", 32: "acc_descr_multiline_value", 33: "section", 35: "taskTxt", 36: "taskData", 37: "click", 38: "callbackname", 39: "callbackargs", 40: "href" },
    productions_: [0, [3, 3], [5, 0], [5, 2], [7, 2], [7, 1], [7, 1], [7, 1], [11, 1], [11, 1], [11, 1], [11, 1], [11, 1], [11, 1], [11, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 1], [9, 2], [9, 2], [9, 1], [9, 1], [9, 1], [9, 2], [34, 2], [34, 3], [34, 3], [34, 4], [34, 3], [34, 4], [34, 2], [41, 2], [41, 3], [41, 3], [41, 4], [41, 3], [41, 4], [41, 2]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
      var $0 = $$.length - 1;
      switch (yystate) {
        case 1:
          return $$[$0 - 1];
        case 2:
          this.$ = [];
          break;
        case 3:
          $$[$0 - 1].push($$[$0]);
          this.$ = $$[$0 - 1];
          break;
        case 4:
        case 5:
          this.$ = $$[$0];
          break;
        case 6:
        case 7:
          this.$ = [];
          break;
        case 8:
          yy.setWeekday("monday");
          break;
        case 9:
          yy.setWeekday("tuesday");
          break;
        case 10:
          yy.setWeekday("wednesday");
          break;
        case 11:
          yy.setWeekday("thursday");
          break;
        case 12:
          yy.setWeekday("friday");
          break;
        case 13:
          yy.setWeekday("saturday");
          break;
        case 14:
          yy.setWeekday("sunday");
          break;
        case 15:
          yy.setDateFormat($$[$0].substr(11));
          this.$ = $$[$0].substr(11);
          break;
        case 16:
          yy.enableInclusiveEndDates();
          this.$ = $$[$0].substr(18);
          break;
        case 17:
          yy.TopAxis();
          this.$ = $$[$0].substr(8);
          break;
        case 18:
          yy.setAxisFormat($$[$0].substr(11));
          this.$ = $$[$0].substr(11);
          break;
        case 19:
          yy.setTickInterval($$[$0].substr(13));
          this.$ = $$[$0].substr(13);
          break;
        case 20:
          yy.setExcludes($$[$0].substr(9));
          this.$ = $$[$0].substr(9);
          break;
        case 21:
          yy.setIncludes($$[$0].substr(9));
          this.$ = $$[$0].substr(9);
          break;
        case 22:
          yy.setTodayMarker($$[$0].substr(12));
          this.$ = $$[$0].substr(12);
          break;
        case 24:
          yy.setDiagramTitle($$[$0].substr(6));
          this.$ = $$[$0].substr(6);
          break;
        case 25:
          this.$ = $$[$0].trim();
          yy.setAccTitle(this.$);
          break;
        case 26:
        case 27:
          this.$ = $$[$0].trim();
          yy.setAccDescription(this.$);
          break;
        case 28:
          yy.addSection($$[$0].substr(8));
          this.$ = $$[$0].substr(8);
          break;
        case 30:
          yy.addTask($$[$0 - 1], $$[$0]);
          this.$ = "task";
          break;
        case 31:
          this.$ = $$[$0 - 1];
          yy.setClickEvent($$[$0 - 1], $$[$0], null);
          break;
        case 32:
          this.$ = $$[$0 - 2];
          yy.setClickEvent($$[$0 - 2], $$[$0 - 1], $$[$0]);
          break;
        case 33:
          this.$ = $$[$0 - 2];
          yy.setClickEvent($$[$0 - 2], $$[$0 - 1], null);
          yy.setLink($$[$0 - 2], $$[$0]);
          break;
        case 34:
          this.$ = $$[$0 - 3];
          yy.setClickEvent($$[$0 - 3], $$[$0 - 2], $$[$0 - 1]);
          yy.setLink($$[$0 - 3], $$[$0]);
          break;
        case 35:
          this.$ = $$[$0 - 2];
          yy.setClickEvent($$[$0 - 2], $$[$0], null);
          yy.setLink($$[$0 - 2], $$[$0 - 1]);
          break;
        case 36:
          this.$ = $$[$0 - 3];
          yy.setClickEvent($$[$0 - 3], $$[$0 - 1], $$[$0]);
          yy.setLink($$[$0 - 3], $$[$0 - 2]);
          break;
        case 37:
          this.$ = $$[$0 - 1];
          yy.setLink($$[$0 - 1], $$[$0]);
          break;
        case 38:
        case 44:
          this.$ = $$[$0 - 1] + " " + $$[$0];
          break;
        case 39:
        case 40:
        case 42:
          this.$ = $$[$0 - 2] + " " + $$[$0 - 1] + " " + $$[$0];
          break;
        case 41:
        case 43:
          this.$ = $$[$0 - 3] + " " + $$[$0 - 2] + " " + $$[$0 - 1] + " " + $$[$0];
          break;
      }
    },
    table: [{ 3: 1, 4: [1, 2] }, { 1: [3] }, o($V0, [2, 2], { 5: 3 }), { 6: [1, 4], 7: 5, 8: [1, 6], 9: 7, 10: [1, 8], 11: 17, 12: $V1, 13: $V2, 14: $V3, 15: $V4, 16: $V5, 17: $V6, 18: $V7, 19: $V8, 20: $V9, 21: $Va, 22: $Vb, 23: $Vc, 24: $Vd, 25: $Ve, 26: $Vf, 27: $Vg, 28: $Vh, 30: $Vi, 32: $Vj, 33: $Vk, 34: 23, 35: $Vl, 37: $Vm }, o($V0, [2, 7], { 1: [2, 1] }), o($V0, [2, 3]), { 9: 33, 11: 17, 12: $V1, 13: $V2, 14: $V3, 15: $V4, 16: $V5, 17: $V6, 18: $V7, 19: $V8, 20: $V9, 21: $Va, 22: $Vb, 23: $Vc, 24: $Vd, 25: $Ve, 26: $Vf, 27: $Vg, 28: $Vh, 30: $Vi, 32: $Vj, 33: $Vk, 34: 23, 35: $Vl, 37: $Vm }, o($V0, [2, 5]), o($V0, [2, 6]), o($V0, [2, 15]), o($V0, [2, 16]), o($V0, [2, 17]), o($V0, [2, 18]), o($V0, [2, 19]), o($V0, [2, 20]), o($V0, [2, 21]), o($V0, [2, 22]), o($V0, [2, 23]), o($V0, [2, 24]), { 29: [1, 34] }, { 31: [1, 35] }, o($V0, [2, 27]), o($V0, [2, 28]), o($V0, [2, 29]), { 36: [1, 36] }, o($V0, [2, 8]), o($V0, [2, 9]), o($V0, [2, 10]), o($V0, [2, 11]), o($V0, [2, 12]), o($V0, [2, 13]), o($V0, [2, 14]), { 38: [1, 37], 40: [1, 38] }, o($V0, [2, 4]), o($V0, [2, 25]), o($V0, [2, 26]), o($V0, [2, 30]), o($V0, [2, 31], { 39: [1, 39], 40: [1, 40] }), o($V0, [2, 37], { 38: [1, 41] }), o($V0, [2, 32], { 40: [1, 42] }), o($V0, [2, 33]), o($V0, [2, 35], { 39: [1, 43] }), o($V0, [2, 34]), o($V0, [2, 36])],
    defaultActions: {},
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer2 = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer2.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer2;
      sharedState.yy.parser = this;
      if (typeof lexer2.yylloc == "undefined") {
        lexer2.yylloc = {};
      }
      var yyloc = lexer2.yylloc;
      lstack.push(yyloc);
      var ranges = lexer2.options && lexer2.options.ranges;
      if (typeof sharedState.yy.parseError === "function") {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      function lex() {
        var token;
        token = tstack.pop() || lexer2.lex() || EOF;
        if (typeof token !== "number") {
          if (token instanceof Array) {
            tstack = token;
            token = tstack.pop();
          }
          token = self.symbols_[token] || token;
        }
        return token;
      }
      var symbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == "undefined") {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
          var errStr = "";
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push("'" + this.terminals_[p] + "'");
            }
          }
          if (lexer2.showPosition) {
            errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
          } else {
            errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
          }
          this.parseError(errStr, {
            text: lexer2.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer2.yylineno,
            loc: yyloc,
            expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer2.yytext);
            lstack.push(lexer2.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer2.yyleng;
              yytext = lexer2.yytext;
              yylineno = lexer2.yylineno;
              yyloc = lexer2.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [
                lstack[lstack.length - (len || 1)].range[0],
                lstack[lstack.length - 1].range[1]
              ];
            }
            r = this.performAction.apply(yyval, [
              yytext,
              yyleng,
              yylineno,
              sharedState.yy,
              action[1],
              vstack,
              lstack
            ].concat(args));
            if (typeof r !== "undefined") {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  var lexer = function() {
    var lexer2 = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      // resets the lexer, sets new input
      setInput: function(input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = "";
        this.conditionStack = ["INITIAL"];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function() {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      // unshifts one char (or a string) into the input
      unput: function(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function() {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function() {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      // retain first n characters of the match
      less: function(n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function() {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function() {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function() {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function(match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false;
        }
        return false;
      },
      // return next match in input
      next: function() {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = "";
          this.match = "";
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue;
              } else {
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      // return next match that has a token
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      // pop the previously active lexer condition state off the condition stack
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      // alias for begin(condition)
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      // return the number of states currently on the stack
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: { "case-insensitive": true },
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        switch ($avoiding_name_collisions) {
          case 0:
            this.begin("open_directive");
            return "open_directive";
          case 1:
            this.begin("acc_title");
            return 28;
          case 2:
            this.popState();
            return "acc_title_value";
          case 3:
            this.begin("acc_descr");
            return 30;
          case 4:
            this.popState();
            return "acc_descr_value";
          case 5:
            this.begin("acc_descr_multiline");
            break;
          case 6:
            this.popState();
            break;
          case 7:
            return "acc_descr_multiline_value";
          case 8:
            break;
          case 9:
            break;
          case 10:
            break;
          case 11:
            return 10;
          case 12:
            break;
          case 13:
            break;
          case 14:
            this.begin("href");
            break;
          case 15:
            this.popState();
            break;
          case 16:
            return 40;
          case 17:
            this.begin("callbackname");
            break;
          case 18:
            this.popState();
            break;
          case 19:
            this.popState();
            this.begin("callbackargs");
            break;
          case 20:
            return 38;
          case 21:
            this.popState();
            break;
          case 22:
            return 39;
          case 23:
            this.begin("click");
            break;
          case 24:
            this.popState();
            break;
          case 25:
            return 37;
          case 26:
            return 4;
          case 27:
            return 19;
          case 28:
            return 20;
          case 29:
            return 21;
          case 30:
            return 22;
          case 31:
            return 23;
          case 32:
            return 25;
          case 33:
            return 24;
          case 34:
            return 26;
          case 35:
            return 12;
          case 36:
            return 13;
          case 37:
            return 14;
          case 38:
            return 15;
          case 39:
            return 16;
          case 40:
            return 17;
          case 41:
            return 18;
          case 42:
            return "date";
          case 43:
            return 27;
          case 44:
            return "accDescription";
          case 45:
            return 33;
          case 46:
            return 35;
          case 47:
            return 36;
          case 48:
            return ":";
          case 49:
            return 6;
          case 50:
            return "INVALID";
        }
      },
      rules: [/^(?:%%\{)/i, /^(?:accTitle\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*:\s*)/i, /^(?:(?!\n||)*[^\n]*)/i, /^(?:accDescr\s*\{\s*)/i, /^(?:[\}])/i, /^(?:[^\}]*)/i, /^(?:%%(?!\{)*[^\n]*)/i, /^(?:[^\}]%%*[^\n]*)/i, /^(?:%%*[^\n]*[\n]*)/i, /^(?:[\n]+)/i, /^(?:\s+)/i, /^(?:%[^\n]*)/i, /^(?:href[\s]+["])/i, /^(?:["])/i, /^(?:[^"]*)/i, /^(?:call[\s]+)/i, /^(?:\([\s]*\))/i, /^(?:\()/i, /^(?:[^(]*)/i, /^(?:\))/i, /^(?:[^)]*)/i, /^(?:click[\s]+)/i, /^(?:[\s\n])/i, /^(?:[^\s\n]*)/i, /^(?:gantt\b)/i, /^(?:dateFormat\s[^#\n;]+)/i, /^(?:inclusiveEndDates\b)/i, /^(?:topAxis\b)/i, /^(?:axisFormat\s[^#\n;]+)/i, /^(?:tickInterval\s[^#\n;]+)/i, /^(?:includes\s[^#\n;]+)/i, /^(?:excludes\s[^#\n;]+)/i, /^(?:todayMarker\s[^\n;]+)/i, /^(?:weekday\s+monday\b)/i, /^(?:weekday\s+tuesday\b)/i, /^(?:weekday\s+wednesday\b)/i, /^(?:weekday\s+thursday\b)/i, /^(?:weekday\s+friday\b)/i, /^(?:weekday\s+saturday\b)/i, /^(?:weekday\s+sunday\b)/i, /^(?:\d\d\d\d-\d\d-\d\d\b)/i, /^(?:title\s[^\n]+)/i, /^(?:accDescription\s[^#\n;]+)/i, /^(?:section\s[^\n]+)/i, /^(?:[^:\n]+)/i, /^(?::[^#\n;]+)/i, /^(?::)/i, /^(?:$)/i, /^(?:.)/i],
      conditions: { "acc_descr_multiline": { "rules": [6, 7], "inclusive": false }, "acc_descr": { "rules": [4], "inclusive": false }, "acc_title": { "rules": [2], "inclusive": false }, "callbackargs": { "rules": [21, 22], "inclusive": false }, "callbackname": { "rules": [18, 19, 20], "inclusive": false }, "href": { "rules": [15, 16], "inclusive": false }, "click": { "rules": [24, 25], "inclusive": false }, "INITIAL": { "rules": [0, 1, 3, 5, 8, 9, 10, 11, 12, 13, 14, 17, 23, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], "inclusive": true } }
    };
    return lexer2;
  }();
  parser2.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser2;
  parser2.Parser = Parser;
  return new Parser();
}();
parser.parser = parser;
const ganttParser = parser;
dayjs__WEBPACK_IMPORTED_MODULE_1__.extend(dayjs_plugin_isoWeek_js__WEBPACK_IMPORTED_MODULE_2__);
dayjs__WEBPACK_IMPORTED_MODULE_1__.extend(dayjs_plugin_customParseFormat_js__WEBPACK_IMPORTED_MODULE_3__);
dayjs__WEBPACK_IMPORTED_MODULE_1__.extend(dayjs_plugin_advancedFormat_js__WEBPACK_IMPORTED_MODULE_4__);
let dateFormat = "";
let axisFormat = "";
let tickInterval = void 0;
let todayMarker = "";
let includes = [];
let excludes = [];
let links = {};
let sections = [];
let tasks = [];
let currentSection = "";
let displayMode = "";
const tags = ["active", "done", "crit", "milestone"];
let funs = [];
let inclusiveEndDates = false;
let topAxis = false;
let weekday = "sunday";
let lastOrder = 0;
const clear = function() {
  sections = [];
  tasks = [];
  currentSection = "";
  funs = [];
  taskCnt = 0;
  lastTask = void 0;
  lastTaskID = void 0;
  rawTasks = [];
  dateFormat = "";
  axisFormat = "";
  displayMode = "";
  tickInterval = void 0;
  todayMarker = "";
  includes = [];
  excludes = [];
  inclusiveEndDates = false;
  topAxis = false;
  lastOrder = 0;
  links = {};
  (0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.v)();
  weekday = "sunday";
};
const setAxisFormat = function(txt) {
  axisFormat = txt;
};
const getAxisFormat = function() {
  return axisFormat;
};
const setTickInterval = function(txt) {
  tickInterval = txt;
};
const getTickInterval = function() {
  return tickInterval;
};
const setTodayMarker = function(txt) {
  todayMarker = txt;
};
const getTodayMarker = function() {
  return todayMarker;
};
const setDateFormat = function(txt) {
  dateFormat = txt;
};
const enableInclusiveEndDates = function() {
  inclusiveEndDates = true;
};
const endDatesAreInclusive = function() {
  return inclusiveEndDates;
};
const enableTopAxis = function() {
  topAxis = true;
};
const topAxisEnabled = function() {
  return topAxis;
};
const setDisplayMode = function(txt) {
  displayMode = txt;
};
const getDisplayMode = function() {
  return displayMode;
};
const getDateFormat = function() {
  return dateFormat;
};
const setIncludes = function(txt) {
  includes = txt.toLowerCase().split(/[\s,]+/);
};
const getIncludes = function() {
  return includes;
};
const setExcludes = function(txt) {
  excludes = txt.toLowerCase().split(/[\s,]+/);
};
const getExcludes = function() {
  return excludes;
};
const getLinks = function() {
  return links;
};
const addSection = function(txt) {
  currentSection = txt;
  sections.push(txt);
};
const getSections = function() {
  return sections;
};
const getTasks = function() {
  let allItemsProcessed = compileTasks();
  const maxDepth = 10;
  let iterationCount = 0;
  while (!allItemsProcessed && iterationCount < maxDepth) {
    allItemsProcessed = compileTasks();
    iterationCount++;
  }
  tasks = rawTasks;
  return tasks;
};
const isInvalidDate = function(date, dateFormat2, excludes2, includes2) {
  if (includes2.includes(date.format(dateFormat2.trim()))) {
    return false;
  }
  if (date.isoWeekday() >= 6 && excludes2.includes("weekends")) {
    return true;
  }
  if (excludes2.includes(date.format("dddd").toLowerCase())) {
    return true;
  }
  return excludes2.includes(date.format(dateFormat2.trim()));
};
const setWeekday = function(txt) {
  weekday = txt;
};
const getWeekday = function() {
  return weekday;
};
const checkTaskDates = function(task, dateFormat2, excludes2, includes2) {
  if (!excludes2.length || task.manualEndTime) {
    return;
  }
  let startTime;
  if (task.startTime instanceof Date) {
    startTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(task.startTime);
  } else {
    startTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(task.startTime, dateFormat2, true);
  }
  startTime = startTime.add(1, "d");
  let originalEndTime;
  if (task.endTime instanceof Date) {
    originalEndTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(task.endTime);
  } else {
    originalEndTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(task.endTime, dateFormat2, true);
  }
  const [fixedEndTime, renderEndTime] = fixTaskDates(
    startTime,
    originalEndTime,
    dateFormat2,
    excludes2,
    includes2
  );
  task.endTime = fixedEndTime.toDate();
  task.renderEndTime = renderEndTime;
};
const fixTaskDates = function(startTime, endTime, dateFormat2, excludes2, includes2) {
  let invalid = false;
  let renderEndTime = null;
  while (startTime <= endTime) {
    if (!invalid) {
      renderEndTime = endTime.toDate();
    }
    invalid = isInvalidDate(startTime, dateFormat2, excludes2, includes2);
    if (invalid) {
      endTime = endTime.add(1, "d");
    }
    startTime = startTime.add(1, "d");
  }
  return [endTime, renderEndTime];
};
const getStartDate = function(prevTime, dateFormat2, str) {
  str = str.trim();
  const afterRePattern = /^after\s+(?<ids>[\d\w- ]+)/;
  const afterStatement = afterRePattern.exec(str);
  if (afterStatement !== null) {
    let latestTask = null;
    for (const id of afterStatement.groups.ids.split(" ")) {
      let task = findTaskById(id);
      if (task !== void 0 && (!latestTask || task.endTime > latestTask.endTime)) {
        latestTask = task;
      }
    }
    if (latestTask) {
      return latestTask.endTime;
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  let mDate = dayjs__WEBPACK_IMPORTED_MODULE_1__(str, dateFormat2.trim(), true);
  if (mDate.isValid()) {
    return mDate.toDate();
  } else {
    _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.l.debug("Invalid date:" + str);
    _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.l.debug("With date format:" + dateFormat2.trim());
    const d = new Date(str);
    if (d === void 0 || isNaN(d.getTime()) || // WebKit browsers can mis-parse invalid dates to be ridiculously
    // huge numbers, e.g. new Date('202304') gets parsed as January 1, 202304.
    // This can cause virtually infinite loops while rendering, so for the
    // purposes of Gantt charts we'll just treat any date beyond 10,000 AD/BC as
    // invalid.
    d.getFullYear() < -1e4 || d.getFullYear() > 1e4) {
      throw new Error("Invalid date:" + str);
    }
    return d;
  }
};
const parseDuration = function(str) {
  const statement = /^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(str.trim());
  if (statement !== null) {
    return [Number.parseFloat(statement[1]), statement[2]];
  }
  return [NaN, "ms"];
};
const getEndDate = function(prevTime, dateFormat2, str, inclusive = false) {
  str = str.trim();
  const untilRePattern = /^until\s+(?<ids>[\d\w- ]+)/;
  const untilStatement = untilRePattern.exec(str);
  if (untilStatement !== null) {
    let earliestTask = null;
    for (const id of untilStatement.groups.ids.split(" ")) {
      let task = findTaskById(id);
      if (task !== void 0 && (!earliestTask || task.startTime < earliestTask.startTime)) {
        earliestTask = task;
      }
    }
    if (earliestTask) {
      return earliestTask.startTime;
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
  let parsedDate = dayjs__WEBPACK_IMPORTED_MODULE_1__(str, dateFormat2.trim(), true);
  if (parsedDate.isValid()) {
    if (inclusive) {
      parsedDate = parsedDate.add(1, "d");
    }
    return parsedDate.toDate();
  }
  let endTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(prevTime);
  const [durationValue, durationUnit] = parseDuration(str);
  if (!Number.isNaN(durationValue)) {
    const newEndTime = endTime.add(durationValue, durationUnit);
    if (newEndTime.isValid()) {
      endTime = newEndTime;
    }
  }
  return endTime.toDate();
};
let taskCnt = 0;
const parseId = function(idStr) {
  if (idStr === void 0) {
    taskCnt = taskCnt + 1;
    return "task" + taskCnt;
  }
  return idStr;
};
const compileData = function(prevTask, dataStr) {
  let ds;
  if (dataStr.substr(0, 1) === ":") {
    ds = dataStr.substr(1, dataStr.length);
  } else {
    ds = dataStr;
  }
  const data = ds.split(",");
  const task = {};
  getTaskTags(data, task, tags);
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].trim();
  }
  let endTimeData = "";
  switch (data.length) {
    case 1:
      task.id = parseId();
      task.startTime = prevTask.endTime;
      endTimeData = data[0];
      break;
    case 2:
      task.id = parseId();
      task.startTime = getStartDate(void 0, dateFormat, data[0]);
      endTimeData = data[1];
      break;
    case 3:
      task.id = parseId(data[0]);
      task.startTime = getStartDate(void 0, dateFormat, data[1]);
      endTimeData = data[2];
      break;
  }
  if (endTimeData) {
    task.endTime = getEndDate(task.startTime, dateFormat, endTimeData, inclusiveEndDates);
    task.manualEndTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(endTimeData, "YYYY-MM-DD", true).isValid();
    checkTaskDates(task, dateFormat, excludes, includes);
  }
  return task;
};
const parseData = function(prevTaskId, dataStr) {
  let ds;
  if (dataStr.substr(0, 1) === ":") {
    ds = dataStr.substr(1, dataStr.length);
  } else {
    ds = dataStr;
  }
  const data = ds.split(",");
  const task = {};
  getTaskTags(data, task, tags);
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].trim();
  }
  switch (data.length) {
    case 1:
      task.id = parseId();
      task.startTime = {
        type: "prevTaskEnd",
        id: prevTaskId
      };
      task.endTime = {
        data: data[0]
      };
      break;
    case 2:
      task.id = parseId();
      task.startTime = {
        type: "getStartDate",
        startData: data[0]
      };
      task.endTime = {
        data: data[1]
      };
      break;
    case 3:
      task.id = parseId(data[0]);
      task.startTime = {
        type: "getStartDate",
        startData: data[1]
      };
      task.endTime = {
        data: data[2]
      };
      break;
  }
  return task;
};
let lastTask;
let lastTaskID;
let rawTasks = [];
const taskDb = {};
const addTask = function(descr, data) {
  const rawTask = {
    section: currentSection,
    type: currentSection,
    processed: false,
    manualEndTime: false,
    renderEndTime: null,
    raw: { data },
    task: descr,
    classes: []
  };
  const taskInfo = parseData(lastTaskID, data);
  rawTask.raw.startTime = taskInfo.startTime;
  rawTask.raw.endTime = taskInfo.endTime;
  rawTask.id = taskInfo.id;
  rawTask.prevTaskId = lastTaskID;
  rawTask.active = taskInfo.active;
  rawTask.done = taskInfo.done;
  rawTask.crit = taskInfo.crit;
  rawTask.milestone = taskInfo.milestone;
  rawTask.order = lastOrder;
  lastOrder++;
  const pos = rawTasks.push(rawTask);
  lastTaskID = rawTask.id;
  taskDb[rawTask.id] = pos - 1;
};
const findTaskById = function(id) {
  const pos = taskDb[id];
  return rawTasks[pos];
};
const addTaskOrg = function(descr, data) {
  const newTask = {
    section: currentSection,
    type: currentSection,
    description: descr,
    task: descr,
    classes: []
  };
  const taskInfo = compileData(lastTask, data);
  newTask.startTime = taskInfo.startTime;
  newTask.endTime = taskInfo.endTime;
  newTask.id = taskInfo.id;
  newTask.active = taskInfo.active;
  newTask.done = taskInfo.done;
  newTask.crit = taskInfo.crit;
  newTask.milestone = taskInfo.milestone;
  lastTask = newTask;
  tasks.push(newTask);
};
const compileTasks = function() {
  const compileTask = function(pos) {
    const task = rawTasks[pos];
    let startTime = "";
    switch (rawTasks[pos].raw.startTime.type) {
      case "prevTaskEnd": {
        const prevTask = findTaskById(task.prevTaskId);
        task.startTime = prevTask.endTime;
        break;
      }
      case "getStartDate":
        startTime = getStartDate(void 0, dateFormat, rawTasks[pos].raw.startTime.startData);
        if (startTime) {
          rawTasks[pos].startTime = startTime;
        }
        break;
    }
    if (rawTasks[pos].startTime) {
      rawTasks[pos].endTime = getEndDate(
        rawTasks[pos].startTime,
        dateFormat,
        rawTasks[pos].raw.endTime.data,
        inclusiveEndDates
      );
      if (rawTasks[pos].endTime) {
        rawTasks[pos].processed = true;
        rawTasks[pos].manualEndTime = dayjs__WEBPACK_IMPORTED_MODULE_1__(
          rawTasks[pos].raw.endTime.data,
          "YYYY-MM-DD",
          true
        ).isValid();
        checkTaskDates(rawTasks[pos], dateFormat, excludes, includes);
      }
    }
    return rawTasks[pos].processed;
  };
  let allProcessed = true;
  for (const [i, rawTask] of rawTasks.entries()) {
    compileTask(i);
    allProcessed = allProcessed && rawTask.processed;
  }
  return allProcessed;
};
const setLink = function(ids, _linkStr) {
  let linkStr = _linkStr;
  if ((0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.c)().securityLevel !== "loose") {
    linkStr = (0,_braintree_sanitize_url__WEBPACK_IMPORTED_MODULE_0__/* .sanitizeUrl */ .Jf)(_linkStr);
  }
  ids.split(",").forEach(function(id) {
    let rawTask = findTaskById(id);
    if (rawTask !== void 0) {
      pushFun(id, () => {
        window.open(linkStr, "_self");
      });
      links[id] = linkStr;
    }
  });
  setClass(ids, "clickable");
};
const setClass = function(ids, className) {
  ids.split(",").forEach(function(id) {
    let rawTask = findTaskById(id);
    if (rawTask !== void 0) {
      rawTask.classes.push(className);
    }
  });
};
const setClickFun = function(id, functionName, functionArgs) {
  if ((0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.c)().securityLevel !== "loose") {
    return;
  }
  if (functionName === void 0) {
    return;
  }
  let argList = [];
  if (typeof functionArgs === "string") {
    argList = functionArgs.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    for (let i = 0; i < argList.length; i++) {
      let item = argList[i].trim();
      if (item.charAt(0) === '"' && item.charAt(item.length - 1) === '"') {
        item = item.substr(1, item.length - 2);
      }
      argList[i] = item;
    }
  }
  if (argList.length === 0) {
    argList.push(id);
  }
  let rawTask = findTaskById(id);
  if (rawTask !== void 0) {
    pushFun(id, () => {
      _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.u.runFunc(functionName, ...argList);
    });
  }
};
const pushFun = function(id, callbackFunction) {
  funs.push(
    function() {
      const elem = document.querySelector(`[id="${id}"]`);
      if (elem !== null) {
        elem.addEventListener("click", function() {
          callbackFunction();
        });
      }
    },
    function() {
      const elem = document.querySelector(`[id="${id}-text"]`);
      if (elem !== null) {
        elem.addEventListener("click", function() {
          callbackFunction();
        });
      }
    }
  );
};
const setClickEvent = function(ids, functionName, functionArgs) {
  ids.split(",").forEach(function(id) {
    setClickFun(id, functionName, functionArgs);
  });
  setClass(ids, "clickable");
};
const bindFunctions = function(element) {
  funs.forEach(function(fun) {
    fun(element);
  });
};
const ganttDb = {
  getConfig: () => (0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.c)().gantt,
  clear,
  setDateFormat,
  getDateFormat,
  enableInclusiveEndDates,
  endDatesAreInclusive,
  enableTopAxis,
  topAxisEnabled,
  setAxisFormat,
  getAxisFormat,
  setTickInterval,
  getTickInterval,
  setTodayMarker,
  getTodayMarker,
  setAccTitle: _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.s,
  getAccTitle: _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.g,
  setDiagramTitle: _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.q,
  getDiagramTitle: _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.t,
  setDisplayMode,
  getDisplayMode,
  setAccDescription: _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.b,
  getAccDescription: _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.a,
  addSection,
  getSections,
  getTasks,
  addTask,
  findTaskById,
  addTaskOrg,
  setIncludes,
  getIncludes,
  setExcludes,
  getExcludes,
  setClickEvent,
  setLink,
  getLinks,
  bindFunctions,
  parseDuration,
  isInvalidDate,
  setWeekday,
  getWeekday
};
function getTaskTags(data, task, tags2) {
  let matchFound = true;
  while (matchFound) {
    matchFound = false;
    tags2.forEach(function(t) {
      const pattern = "^\\s*" + t + "\\s*$";
      const regex = new RegExp(pattern);
      if (data[0].match(regex)) {
        task[t] = true;
        data.shift(1);
        matchFound = true;
      }
    });
  }
}
const setConf = function() {
  _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.l.debug("Something is calling, setConf, remove the call");
};
const mapWeekdayToTimeFunction = {
  monday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMonday */ .ABi,
  tuesday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeTuesday */ .PGu,
  wednesday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeWednesday */ .GuW,
  thursday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeThursday */ .Mol,
  friday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeFriday */ .TUC,
  saturday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeSaturday */ .rGn,
  sunday: d3__WEBPACK_IMPORTED_MODULE_5__/* .timeSunday */ .YPH
};
const getMaxIntersections = (tasks2, orderOffset) => {
  let timeline = [...tasks2].map(() => -Infinity);
  let sorted = [...tasks2].sort((a, b) => a.startTime - b.startTime || a.order - b.order);
  let maxIntersections = 0;
  for (const element of sorted) {
    for (let j = 0; j < timeline.length; j++) {
      if (element.startTime >= timeline[j]) {
        timeline[j] = element.endTime;
        element.order = j + orderOffset;
        if (j > maxIntersections) {
          maxIntersections = j;
        }
        break;
      }
    }
  }
  return maxIntersections;
};
let w;
const draw = function(text, id, version, diagObj) {
  const conf = (0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.c)().gantt;
  const securityLevel = (0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.c)().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .select */ .Ltv)("#i" + id);
  }
  const root = securityLevel === "sandbox" ? (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .select */ .Ltv)(sandboxElement.nodes()[0].contentDocument.body) : (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .select */ .Ltv)("body");
  const doc = securityLevel === "sandbox" ? sandboxElement.nodes()[0].contentDocument : document;
  const elem = doc.getElementById(id);
  w = elem.parentElement.offsetWidth;
  if (w === void 0) {
    w = 1200;
  }
  if (conf.useWidth !== void 0) {
    w = conf.useWidth;
  }
  const taskArray = diagObj.db.getTasks();
  let categories = [];
  for (const element of taskArray) {
    categories.push(element.type);
  }
  categories = checkUnique(categories);
  const categoryHeights = {};
  let h = 2 * conf.topPadding;
  if (diagObj.db.getDisplayMode() === "compact" || conf.displayMode === "compact") {
    const categoryElements = {};
    for (const element of taskArray) {
      if (categoryElements[element.section] === void 0) {
        categoryElements[element.section] = [element];
      } else {
        categoryElements[element.section].push(element);
      }
    }
    let intersections = 0;
    for (const category of Object.keys(categoryElements)) {
      const categoryHeight = getMaxIntersections(categoryElements[category], intersections) + 1;
      intersections += categoryHeight;
      h += categoryHeight * (conf.barHeight + conf.barGap);
      categoryHeights[category] = categoryHeight;
    }
  } else {
    h += taskArray.length * (conf.barHeight + conf.barGap);
    for (const category of categories) {
      categoryHeights[category] = taskArray.filter((task) => task.type === category).length;
    }
  }
  elem.setAttribute("viewBox", "0 0 " + w + " " + h);
  const svg = root.select(`[id="${id}"]`);
  const timeScale = (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .scaleTime */ .w7C)().domain([
    (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .min */ .jkA)(taskArray, function(d) {
      return d.startTime;
    }),
    (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .max */ .T9B)(taskArray, function(d) {
      return d.endTime;
    })
  ]).rangeRound([0, w - conf.leftPadding - conf.rightPadding]);
  function taskCompare(a, b) {
    const taskA = a.startTime;
    const taskB = b.startTime;
    let result = 0;
    if (taskA > taskB) {
      result = 1;
    } else if (taskA < taskB) {
      result = -1;
    }
    return result;
  }
  taskArray.sort(taskCompare);
  makeGantt(taskArray, w, h);
  (0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.i)(svg, h, w, conf.useMaxWidth);
  svg.append("text").text(diagObj.db.getDiagramTitle()).attr("x", w / 2).attr("y", conf.titleTopMargin).attr("class", "titleText");
  function makeGantt(tasks2, pageWidth, pageHeight) {
    const barHeight = conf.barHeight;
    const gap = barHeight + conf.barGap;
    const topPadding = conf.topPadding;
    const leftPadding = conf.leftPadding;
    const colorScale = (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .scaleLinear */ .m4Y)().domain([0, categories.length]).range(["#00B9FA", "#F95002"]).interpolate(d3__WEBPACK_IMPORTED_MODULE_5__/* .interpolateHcl */ .bEH);
    drawExcludeDays(
      gap,
      topPadding,
      leftPadding,
      pageWidth,
      pageHeight,
      tasks2,
      diagObj.db.getExcludes(),
      diagObj.db.getIncludes()
    );
    makeGrid(leftPadding, topPadding, pageWidth, pageHeight);
    drawRects(tasks2, gap, topPadding, leftPadding, barHeight, colorScale, pageWidth);
    vertLabels(gap, topPadding);
    drawToday(leftPadding, topPadding, pageWidth, pageHeight);
  }
  function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w2) {
    const uniqueTaskOrderIds = [...new Set(theArray.map((item) => item.order))];
    const uniqueTasks = uniqueTaskOrderIds.map((id2) => theArray.find((item) => item.order === id2));
    svg.append("g").selectAll("rect").data(uniqueTasks).enter().append("rect").attr("x", 0).attr("y", function(d, i) {
      i = d.order;
      return i * theGap + theTopPad - 2;
    }).attr("width", function() {
      return w2 - conf.rightPadding / 2;
    }).attr("height", theGap).attr("class", function(d) {
      for (const [i, category] of categories.entries()) {
        if (d.type === category) {
          return "section section" + i % conf.numberSectionStyles;
        }
      }
      return "section section0";
    });
    const rectangles = svg.append("g").selectAll("rect").data(theArray).enter();
    const links2 = diagObj.db.getLinks();
    rectangles.append("rect").attr("id", function(d) {
      return d.id;
    }).attr("rx", 3).attr("ry", 3).attr("x", function(d) {
      if (d.milestone) {
        return timeScale(d.startTime) + theSidePad + 0.5 * (timeScale(d.endTime) - timeScale(d.startTime)) - 0.5 * theBarHeight;
      }
      return timeScale(d.startTime) + theSidePad;
    }).attr("y", function(d, i) {
      i = d.order;
      return i * theGap + theTopPad;
    }).attr("width", function(d) {
      if (d.milestone) {
        return theBarHeight;
      }
      return timeScale(d.renderEndTime || d.endTime) - timeScale(d.startTime);
    }).attr("height", theBarHeight).attr("transform-origin", function(d, i) {
      i = d.order;
      return (timeScale(d.startTime) + theSidePad + 0.5 * (timeScale(d.endTime) - timeScale(d.startTime))).toString() + "px " + (i * theGap + theTopPad + 0.5 * theBarHeight).toString() + "px";
    }).attr("class", function(d) {
      const res = "task";
      let classStr = "";
      if (d.classes.length > 0) {
        classStr = d.classes.join(" ");
      }
      let secNum = 0;
      for (const [i, category] of categories.entries()) {
        if (d.type === category) {
          secNum = i % conf.numberSectionStyles;
        }
      }
      let taskClass = "";
      if (d.active) {
        if (d.crit) {
          taskClass += " activeCrit";
        } else {
          taskClass = " active";
        }
      } else if (d.done) {
        if (d.crit) {
          taskClass = " doneCrit";
        } else {
          taskClass = " done";
        }
      } else {
        if (d.crit) {
          taskClass += " crit";
        }
      }
      if (taskClass.length === 0) {
        taskClass = " task";
      }
      if (d.milestone) {
        taskClass = " milestone " + taskClass;
      }
      taskClass += secNum;
      taskClass += " " + classStr;
      return res + taskClass;
    });
    rectangles.append("text").attr("id", function(d) {
      return d.id + "-text";
    }).text(function(d) {
      return d.task;
    }).attr("font-size", conf.fontSize).attr("x", function(d) {
      let startX = timeScale(d.startTime);
      let endX = timeScale(d.renderEndTime || d.endTime);
      if (d.milestone) {
        startX += 0.5 * (timeScale(d.endTime) - timeScale(d.startTime)) - 0.5 * theBarHeight;
      }
      if (d.milestone) {
        endX = startX + theBarHeight;
      }
      const textWidth = this.getBBox().width;
      if (textWidth > endX - startX) {
        if (endX + textWidth + 1.5 * conf.leftPadding > w2) {
          return startX + theSidePad - 5;
        } else {
          return endX + theSidePad + 5;
        }
      } else {
        return (endX - startX) / 2 + startX + theSidePad;
      }
    }).attr("y", function(d, i) {
      i = d.order;
      return i * theGap + conf.barHeight / 2 + (conf.fontSize / 2 - 2) + theTopPad;
    }).attr("text-height", theBarHeight).attr("class", function(d) {
      const startX = timeScale(d.startTime);
      let endX = timeScale(d.endTime);
      if (d.milestone) {
        endX = startX + theBarHeight;
      }
      const textWidth = this.getBBox().width;
      let classStr = "";
      if (d.classes.length > 0) {
        classStr = d.classes.join(" ");
      }
      let secNum = 0;
      for (const [i, category] of categories.entries()) {
        if (d.type === category) {
          secNum = i % conf.numberSectionStyles;
        }
      }
      let taskType = "";
      if (d.active) {
        if (d.crit) {
          taskType = "activeCritText" + secNum;
        } else {
          taskType = "activeText" + secNum;
        }
      }
      if (d.done) {
        if (d.crit) {
          taskType = taskType + " doneCritText" + secNum;
        } else {
          taskType = taskType + " doneText" + secNum;
        }
      } else {
        if (d.crit) {
          taskType = taskType + " critText" + secNum;
        }
      }
      if (d.milestone) {
        taskType += " milestoneText";
      }
      if (textWidth > endX - startX) {
        if (endX + textWidth + 1.5 * conf.leftPadding > w2) {
          return classStr + " taskTextOutsideLeft taskTextOutside" + secNum + " " + taskType;
        } else {
          return classStr + " taskTextOutsideRight taskTextOutside" + secNum + " " + taskType + " width-" + textWidth;
        }
      } else {
        return classStr + " taskText taskText" + secNum + " " + taskType + " width-" + textWidth;
      }
    });
    const securityLevel2 = (0,_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.c)().securityLevel;
    if (securityLevel2 === "sandbox") {
      let sandboxElement2;
      sandboxElement2 = (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .select */ .Ltv)("#i" + id);
      const doc2 = sandboxElement2.nodes()[0].contentDocument;
      rectangles.filter(function(d) {
        return links2[d.id] !== void 0;
      }).each(function(o) {
        var taskRect = doc2.querySelector("#" + o.id);
        var taskText = doc2.querySelector("#" + o.id + "-text");
        const oldParent = taskRect.parentNode;
        var Link = doc2.createElement("a");
        Link.setAttribute("xlink:href", links2[o.id]);
        Link.setAttribute("target", "_top");
        oldParent.appendChild(Link);
        Link.appendChild(taskRect);
        Link.appendChild(taskText);
      });
    }
  }
  function drawExcludeDays(theGap, theTopPad, theSidePad, w2, h2, tasks2, excludes2, includes2) {
    if (excludes2.length === 0 && includes2.length === 0) {
      return;
    }
    let minTime;
    let maxTime;
    for (const { startTime, endTime } of tasks2) {
      if (minTime === void 0 || startTime < minTime) {
        minTime = startTime;
      }
      if (maxTime === void 0 || endTime > maxTime) {
        maxTime = endTime;
      }
    }
    if (!minTime || !maxTime) {
      return;
    }
    if (dayjs__WEBPACK_IMPORTED_MODULE_1__(maxTime).diff(dayjs__WEBPACK_IMPORTED_MODULE_1__(minTime), "year") > 5) {
      _mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.l.warn(
        "The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days."
      );
      return;
    }
    const dateFormat2 = diagObj.db.getDateFormat();
    const excludeRanges = [];
    let range = null;
    let d = dayjs__WEBPACK_IMPORTED_MODULE_1__(minTime);
    while (d.valueOf() <= maxTime) {
      if (diagObj.db.isInvalidDate(d, dateFormat2, excludes2, includes2)) {
        if (!range) {
          range = {
            start: d,
            end: d
          };
        } else {
          range.end = d;
        }
      } else {
        if (range) {
          excludeRanges.push(range);
          range = null;
        }
      }
      d = d.add(1, "d");
    }
    const rectangles = svg.append("g").selectAll("rect").data(excludeRanges).enter();
    rectangles.append("rect").attr("id", function(d2) {
      return "exclude-" + d2.start.format("YYYY-MM-DD");
    }).attr("x", function(d2) {
      return timeScale(d2.start) + theSidePad;
    }).attr("y", conf.gridLineStartPadding).attr("width", function(d2) {
      const renderEnd = d2.end.add(1, "day");
      return timeScale(renderEnd) - timeScale(d2.start);
    }).attr("height", h2 - theTopPad - conf.gridLineStartPadding).attr("transform-origin", function(d2, i) {
      return (timeScale(d2.start) + theSidePad + 0.5 * (timeScale(d2.end) - timeScale(d2.start))).toString() + "px " + (i * theGap + 0.5 * h2).toString() + "px";
    }).attr("class", "exclude-range");
  }
  function makeGrid(theSidePad, theTopPad, w2, h2) {
    let bottomXAxis = (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .axisBottom */ .l78)(timeScale).tickSize(-h2 + theTopPad + conf.gridLineStartPadding).tickFormat((0,d3__WEBPACK_IMPORTED_MODULE_5__/* .timeFormat */ .DCK)(diagObj.db.getAxisFormat() || conf.axisFormat || "%Y-%m-%d"));
    const reTickInterval = /^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/;
    const resultTickInterval = reTickInterval.exec(
      diagObj.db.getTickInterval() || conf.tickInterval
    );
    if (resultTickInterval !== null) {
      const every = resultTickInterval[1];
      const interval = resultTickInterval[2];
      const weekday2 = diagObj.db.getWeekday() || conf.weekday;
      switch (interval) {
        case "millisecond":
          bottomXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMillisecond */ .t6C.every(every));
          break;
        case "second":
          bottomXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeSecond */ .ucG.every(every));
          break;
        case "minute":
          bottomXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMinute */ .wXd.every(every));
          break;
        case "hour":
          bottomXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeHour */ .Agd.every(every));
          break;
        case "day":
          bottomXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeDay */ .UAC.every(every));
          break;
        case "week":
          bottomXAxis.ticks(mapWeekdayToTimeFunction[weekday2].every(every));
          break;
        case "month":
          bottomXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMonth */ .Ui6.every(every));
          break;
      }
    }
    svg.append("g").attr("class", "grid").attr("transform", "translate(" + theSidePad + ", " + (h2 - 50) + ")").call(bottomXAxis).selectAll("text").style("text-anchor", "middle").attr("fill", "#000").attr("stroke", "none").attr("font-size", 10).attr("dy", "1em");
    if (diagObj.db.topAxisEnabled() || conf.topAxis) {
      let topXAxis = (0,d3__WEBPACK_IMPORTED_MODULE_5__/* .axisTop */ .tlR)(timeScale).tickSize(-h2 + theTopPad + conf.gridLineStartPadding).tickFormat((0,d3__WEBPACK_IMPORTED_MODULE_5__/* .timeFormat */ .DCK)(diagObj.db.getAxisFormat() || conf.axisFormat || "%Y-%m-%d"));
      if (resultTickInterval !== null) {
        const every = resultTickInterval[1];
        const interval = resultTickInterval[2];
        const weekday2 = diagObj.db.getWeekday() || conf.weekday;
        switch (interval) {
          case "millisecond":
            topXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMillisecond */ .t6C.every(every));
            break;
          case "second":
            topXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeSecond */ .ucG.every(every));
            break;
          case "minute":
            topXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMinute */ .wXd.every(every));
            break;
          case "hour":
            topXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeHour */ .Agd.every(every));
            break;
          case "day":
            topXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeDay */ .UAC.every(every));
            break;
          case "week":
            topXAxis.ticks(mapWeekdayToTimeFunction[weekday2].every(every));
            break;
          case "month":
            topXAxis.ticks(d3__WEBPACK_IMPORTED_MODULE_5__/* .timeMonth */ .Ui6.every(every));
            break;
        }
      }
      svg.append("g").attr("class", "grid").attr("transform", "translate(" + theSidePad + ", " + theTopPad + ")").call(topXAxis).selectAll("text").style("text-anchor", "middle").attr("fill", "#000").attr("stroke", "none").attr("font-size", 10);
    }
  }
  function vertLabels(theGap, theTopPad) {
    let prevGap = 0;
    const numOccurrences = Object.keys(categoryHeights).map((d) => [d, categoryHeights[d]]);
    svg.append("g").selectAll("text").data(numOccurrences).enter().append(function(d) {
      const rows = d[0].split(_mermaid_b5860b54_js__WEBPACK_IMPORTED_MODULE_7__.e.lineBreakRegex);
      const dy = -(rows.length - 1) / 2;
      const svgLabel = doc.createElementNS("http://www.w3.org/2000/svg", "text");
      svgLabel.setAttribute("dy", dy + "em");
      for (const [j, row] of rows.entries()) {
        const tspan = doc.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("alignment-baseline", "central");
        tspan.setAttribute("x", "10");
        if (j > 0) {
          tspan.setAttribute("dy", "1em");
        }
        tspan.textContent = row;
        svgLabel.appendChild(tspan);
      }
      return svgLabel;
    }).attr("x", 10).attr("y", function(d, i) {
      if (i > 0) {
        for (let j = 0; j < i; j++) {
          prevGap += numOccurrences[i - 1][1];
          return d[1] * theGap / 2 + prevGap * theGap + theTopPad;
        }
      } else {
        return d[1] * theGap / 2 + theTopPad;
      }
    }).attr("font-size", conf.sectionFontSize).attr("class", function(d) {
      for (const [i, category] of categories.entries()) {
        if (d[0] === category) {
          return "sectionTitle sectionTitle" + i % conf.numberSectionStyles;
        }
      }
      return "sectionTitle";
    });
  }
  function drawToday(theSidePad, theTopPad, w2, h2) {
    const todayMarker2 = diagObj.db.getTodayMarker();
    if (todayMarker2 === "off") {
      return;
    }
    const todayG = svg.append("g").attr("class", "today");
    const today = /* @__PURE__ */ new Date();
    const todayLine = todayG.append("line");
    todayLine.attr("x1", timeScale(today) + theSidePad).attr("x2", timeScale(today) + theSidePad).attr("y1", conf.titleTopMargin).attr("y2", h2 - conf.titleTopMargin).attr("class", "today");
    if (todayMarker2 !== "") {
      todayLine.attr("style", todayMarker2.replace(/,/g, ";"));
    }
  }
  function checkUnique(arr) {
    const hash = {};
    const result = [];
    for (let i = 0, l = arr.length; i < l; ++i) {
      if (!Object.prototype.hasOwnProperty.call(hash, arr[i])) {
        hash[arr[i]] = true;
        result.push(arr[i]);
      }
    }
    return result;
  }
};
const ganttRenderer = {
  setConf,
  draw
};
const getStyles = (options) => `
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .exclude-range {
    fill: ${options.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${options.sectionBkgColor};
  }

  .section2 {
    fill: ${options.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${options.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${options.titleColor};
  }

  .sectionTitle1 {
    fill: ${options.titleColor};
  }

  .sectionTitle2 {
    fill: ${options.titleColor};
  }

  .sectionTitle3 {
    fill: ${options.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${options.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${options.fontFamily};
    fill: ${options.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${options.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${options.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideLeft {
    fill: ${options.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${options.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${options.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${options.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${options.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${options.taskBkgColor};
    stroke: ${options.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${options.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${options.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${options.activeTaskBkgColor};
    stroke: ${options.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${options.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${options.doneTaskBorderColor};
    fill: ${options.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${options.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${options.critBorderColor};
    fill: ${options.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${options.critBorderColor};
    fill: ${options.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${options.critBorderColor};
    fill: ${options.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${options.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${options.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${options.titleColor || options.textColor};
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`;
const ganttStyles = getStyles;
const diagram = {
  parser: ganttParser,
  db: ganttDb,
  renderer: ganttRenderer,
  styles: ganttStyles
};



/***/ })

};
;