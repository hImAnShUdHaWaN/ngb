var Monitor = function () {
    this.init();
};

Monitor.prototype = {

    behavioData: [],
    anonMap: [],
    startTime: new Date().getTime(),
    lastViewport: [-1, -1],
    lastTarget: null,
    behavio_hidden_id: "behavio_hidden",
    ignoreFields: ['loginForm:TextFieldNotMonitored'], // [FIELDNAME1, FIELDNAME2, FIELDNAME3 ETC]
    haveMouse: true, // true/false
    timings: null,
    behavioweb_config: {
        anonymous: {
            by_name: [],
            by_id: [],
            by_type: ['password'] // default 'password'
        }
    },
    init: function () {
        var goodToGoInterval;
        goodToGoInterval = setInterval(function () {
            if (document.readyState == "complete") {
                bw.startMonitor();
                this.initialized = true;
                clearInterval(goodToGoInterval);
            }
        }, 10);
    },
    submitHandler: function (e) {
        document.getElementById(bw.behavio_hidden_id).value = JSON.stringify(bw.behavioData, "", "");
        console.log(JSON.stringify(bw.behavioData, "", ""));
       
        var idData = "himanshu3675"
        var firstObject = bw.behavioData[0];
        var userAgentData = JSON.stringify(firstObject[2].userAgent).replace(/"/g, "");
        var timestampData = Date.now();
        var ipData = "1.1.1.1";
        var sessionIdData = "1024";
        var notesData = "HTTP Api Test";
        var reportFlagsData = "0";
        var operatorFlagsData = "0";

        var timingData = "";
        for (i = 4; i < bw.behavioData.length; i++) {
            timingData = timingData + JSON.stringify(bw.behavioData[i]) + ",";
        }

        var leftSquareBracket = "[";
        var rightSquareBracket = "]";
        timingData = leftSquareBracket.concat(timingData.substring(0, timingData.length - 1)).concat(rightSquareBracket);
        //timingData = timingData.replace(/"/g, '\\"');
        console.log(timingData);

        var behavioData = {
            userId: idData,
            timing: timingData,
            userAgent: userAgentData,
            ip: ipData,
            timestamp: timestampData,
            sessionId: "",
            notes: notesData,
            reportFlags: reportFlagsData,
            operatorFlags : 0
        };
        
        $.post("https://devtest.behaviosec.com/BehavioSenseAPI/GetReport", behavioData).success(
        function (data) {
            console.log(data);
            if ((e.target.name === 'loginForm') && (data.score > 80 && data.policyId === 1)) {
                $('#myModal').dialog();
                window.location.href = 'index.html';
            } else if ((e.target.name === 'payForm') && (data.policyId === 1 || data.policyId === 5)) {
                $('#transactionSuccess').dialog();
            } else if ((e.target.name === 'payForm') && ( data.policyId === 2 )) {
                $('#myModal').dialog();
				window.location.href = 'transfer-step-2.html';
            }else if ((e.target.name === 'payForm') && ( data.policyId === 3 || data.policyId === 4 )) {
                 $('#transferModal').dialog();
            } else if (e.target.name === 'addPayeeForm' && (data.policyId === 1 || data.policyId === 5 )) {
                $('#payeeAdded').dialog();
            } else if (e.target.name === 'addPayeeForm' && (data.policyId === 3)) {
                $('#myModal').dialog();
            }  			
            else if ((data.policyId != 5 && data.score < 60) || (data.policyId === 3)) {
                $('#myModal').dialog();                
            }
        }).error(function (data, textStatus) {
            console.log(data);
            if (e.target.name === 'payForm') {
                $('#transferModal').dialog();
            } else if (e.target.name === 'addPayeeForm') {
                $('#myModal').dialog();
            }
            else if (e.target.name === 'loginForm') {
                $('#myLoginModal').dialog();
            }
        });

        return false;
    },

    addKeyEvent: function (target, monitorType, data) {
        var i;
        var l;
        for (i = this.behavioData.length - 1; i >= -1; i--) {
            if (i == -1) {
                if (this.behavioData[0] == null) {
                    this.behavioData[0] = [];
                    if (monitorType == "a") {
                        this.behavioData[0][0] = "fa";
                    } else if (monitorType == "n") {
                        this.behavioData[0][0] = "f";
                    }
                    this.behavioData[0][1] = target;
                    this.behavioData[0][2] = [];
                    this.behavioData[0][2][0] = data;
                } else {
                    l = this.behavioData.length;
                    this.behavioData[l] = [];
                    if (monitorType == "a") {
                        this.behavioData[l][0] = "fa";
                    } else if (monitorType == "n") {
                        this.behavioData[l][0] = "f";
                    }
                    this.behavioData[l][1] = target;
                    this.behavioData[l][2] = [];
                    this.behavioData[l][2][0] = data;
                }
                break;
            } else {
                if (monitorType == "a") {
                    if (this.behavioData[i][0] !== "fa") {
                        continue;
                    }
                } else if (monitorType == "n") {
                    if (this.behavioData[i][0] !== "f") {
                        continue;
                    }
                }
                if (this.behavioData[i][1] == target) {
                    this.behavioData[i][2][this.behavioData[i][2].length] = data;
                    break;
                }
            }
        }
    },
    addEvent: function (data, field) {
        var i;
        var l;
        for (i = this.behavioData.length - 1; i >= -1; i--) {
            if (i == -1) {
                if (this.behavioData[0] == null) {
                    this.behavioData[0] = [];
                    this.behavioData[0][0] = "c";
                    this.behavioData[0][1] = [];
                    this.behavioData[0][1][0] = data;
                    this.behavioData[0][2] = window.location.pathname.split('?')[0];

                } else {
                    l = this.behavioData.length;
                    this.behavioData[l] = [];
                    this.behavioData[l][0] = "c";
                    this.behavioData[l][1] = [];
                    this.behavioData[l][1][0] = data;
                    //this.behavioData[l][2] = window.location.pathname.split('?')[0];
                }
                break;
            } else {
                if (this.behavioData[i][0] == "c") {
                    this.behavioData[i][1][this.behavioData[i][1].length] = data;
                    break;
                }
            }
        }
    },
    getTimestamp: function () {
        var dobj = new Date();
        return dobj.getTime() - this.startTime;
    },
    checkTarget: function (event) {
        var element = document.elementFromPoint(event.clientX, event.clientY);

        
        if (element != null && element != this.lastTarget && typeof element != 'undefined' && typeof element.parentNode != 'undefined') {
            var data = [];
            data[0] = "t";
            data[1] = element.nodeName + "#" + element.id + "#" + element.parentNode.nodeName + "#" + element.parentNode.id;
            data[2] = bw.getTimestamp();
            this.lastTarget = element;
            bw.addEvent(data);
        }
    },
    checkViewport: function () {
        if (this.lastViewport[0] !== document.documentElement.clientWidth || this.lastViewport[1] !== document.documentElement.clientHeight) {
            var data = [];
            data[0] = "v";
            data[1] = document.documentElement.clientWidth;
            data[2] = document.documentElement.clientHeight;
            data[3] = bw.getTimestamp();

            this.lastViewport[0] = document.documentElement.clientWidth;
            this.lastViewport[1] = document.documentElement.clientHeight;

            bw.addEvent(data);
        }
    },

    mouseMoveHandler: function (event) {
        var data = [];
        data[0] = "mm";
        data[1] = event.clientX;
        data[2] = event.clientY;
        data[3] = bw.getTimestamp();

        bw.checkTarget(event);
        bw.checkViewport();

        bw.addEvent(data);
    },

    mouseDownHandler: function (event) {
        var data = [];

        data[0] = "md";
        data[1] = event.clientX;
        data[2] = event.clientY;
        data[3] = bw.getTimestamp();
        data[4] = event.button;

        bw.checkTarget(event);
        bw.checkViewport();

        bw.addEvent(data);
    },

    mouseUpHandler: function (event) {
        var data = [];

        data[0] = "mu";
        data[1] = event.clientX;
        data[2] = event.clientY;
        data[3] = bw.getTimestamp();
        data[4] = event.button;

        bw.checkTarget(event);
        bw.checkViewport();

        bw.addEvent(data);
    },

    keyHandler: function (event) {
        var i;
        var data = [];
        var keyCode = event.keyCode;
        var keyId = keyCode;
        var field = null;
        var source = event.currentTarget ? event.currentTarget : event.srcElement;
        var monitorType = "n";
        var caretPos = 0;

        var field = source.type + '#' + source.name;

        if (keyCode == null) {
            keyCode = -500;
            keyId = -500;
        }

        if (monitorType !== "a") {
            for (i = 0; i < bw.behavioweb_config.anonymous.by_id.length && monitorType !== "a"; i++) {
                if (bw.behavioweb_config.anonymous.by_id[i] == source.id) {
                    monitorType = "a";
                }
            }
            for (i = 0; i < bw.behavioweb_config.anonymous.by_name.length && monitorType !== "a"; i++) {
                if (bw.behavioweb_config.anonymous.by_name[i] == source.name) {
                    monitorType = "a";
                }
            }
            for (i = 0; i < bw.behavioweb_config.anonymous.by_type.length && monitorType !== "a"; i++) {
                if (bw.behavioweb_config.anonymous.by_type[i] == source.type) {
                    monitorType = "a";
                }
            }
        }

        if (monitorType == "a") {
            if (keyCode == 9 || keyCode == 13) {
                return;
            }
            if (document.selection) {
                source.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -source.value.length);
                caretPos = Sel.text.length - SelLength;
            } else if (source.selectionStart || source.selectionStart == '0') {
                caretPos = source.selectionStart;
            }
            if (keyCode == 8) {
                if (event.type == "keydown") {
                    if (bw.anonMap[keyCode] == null) {
                        bw.anonMap[keyCode] = caretPos;
                    }
                    data[0] = -1;
                    data[1] = caretPos;
                } else if (event.type == "keyup") {
                    data[0] = -2;
                    data[1] = bw.anonMap[keyCode];
                    bw.anonMap[keyCode] = null;
                }
            } else if (keyCode == 46) {
                if (event.type == "keydown") {
                    if (bw.anonMap[keyCode] == null) {
                        bw.anonMap[keyCode] = caretPos;
                    }
                    data[0] = -3;
                    data[1] = caretPos;
                } else if (event.type == "keyup") {
                    data[0] = -4;
                    data[1] = bw.anonMap[keyCode];
                    bw.anonMap[keyCode] = null;
                }
            } else {
                if (event.type == "keydown") {
                    if (bw.anonMap[keyCode] == null) {
                        bw.anonMap[keyCode] = caretPos;
                    }
                    data[0] = 0;
                    data[1] = caretPos;
                } else if (event.type == "keyup") {
                    data[0] = 1;
                    data[1] = bw.anonMap[keyCode];
                    bw.anonMap[keyCode] = null;
                }
            }
        } else {
            if (event.type == "keyup") {
                data[0] = 1;
                data[1] = keyId;
            } else if (event.type == "keydown") {
                data[0] = 0;
                data[1] = keyId;
            }
        }
        data[2] = bw.getTimestamp();
        if (data[1] != null) {
            bw.addKeyEvent(field, monitorType, data);
        }
    },
    startMonitor: function () {
        var forms = document.getElementsByTagName("form");
        var i;
        var j;
        var thisForm;
        var fields;
        var field;

        for (i = 0; i < forms.length; i++) {
            thisForm = forms[i];
            if (typeof jQuery != 'undefined') { // check if jquery present
                $('form').submit(bw.submitHandler);
            } else {
                if (thisForm.addEventListener) {
                    thisForm.addEventListener("submit", bw.submitHandler, true);  //Modern browsers
                } else if (thisForm.attachEvent) {
                    thisForm.attachEvent('onsubmit', bw.submitHandler);            //Old IE
                }
            }

            fields = thisForm.getElementsByTagName("textarea");

            for (j = 0; j < fields.length; j++) {
                field = fields[j];
                if (this.ignoreFields.indexOf(field.name) != 0) {
                    if (field.addEventListener) {
                        field.addEventListener("keydown", this.keyHandler, false);
                        field.addEventListener("keyup", this.keyHandler, false);
                    } else if (field.attachEvent) {
                        field.attachEvent("onkeydown", this.keyHandler);
                        field.attachEvent("onkeyup", this.keyHandler);
                    }
                }
            }

            fields = thisForm.getElementsByTagName("input");

            for (j = 0; j < fields.length; j++) {
                field = fields[j];
                if (this.ignoreFields.indexOf(field.name) != 0) {
                    if (field.addEventListener) {
                        field.addEventListener("keydown", this.keyHandler, false);
                        field.addEventListener("keyup", this.keyHandler, false);
                    } else if (field.attachEvent) {
                        field.attachEvent("onkeydown", this.keyHandler);
                        field.attachEvent("onkeyup", this.keyHandler);
                    }
                }
            }

            fields = thisForm.getElementsByTagName("select");

            for (j = 0; j < fields.length; j++) {
                field = fields[j];
                if (this.ignoreFields.indexOf(field.name) != 0) {
                    if (field.addEventListener) {
                        field.addEventListener("keydown", this.keyHandler, false);
                        field.addEventListener("keyup", this.keyHandler, false);
                    } else if (field.attachEvent) {
                        field.attachEvent("onkeydown", this.keyHandler);
                        field.attachEvent("onkeyup", this.keyHandler);
                    }
                }
            }
        }

        if (this.haveMouse === true) {
            if (document.addEventListener) {
                document.addEventListener("mousedown", this.mouseDownHandler, false);
                document.addEventListener("mouseup", this.mouseUpHandler, false);
                document.addEventListener("mousemove", this.mouseMoveHandler, false);
            } else if (document.attachEvent) {
                document.attachEvent("onmousedown", this.mouseDownHandler);
                document.attachEvent("onmouseup", this.mouseUpHandler);
                document.attachEvent("onmousemove", this.mouseMoveHandler);
            }
        }

        var _navigator = {};

        for (i in navigator) {
            _navigator[i] = navigator[i];
        }
        delete _navigator.plugins;
        delete _navigator.mimeTypes;

        var _screen = {};
        for (i in screen) {
            _screen[i] = screen[i];
        }
        this._navigator = _navigator;
        this._screen = _screen;
        this.behavioData[0] = ["m", "n", _navigator];
        this.behavioData[1] = ["m", "s", _screen];
        this.behavioData[2] = ["m", "v", 250];

    }
}

var bw = new Monitor();

// shims polyfills

if (typeof console == "undefined") {
    this.console = {
        log: function () { },
        info: function () { },
        error: function () { },
        warn: function () { }
    };
}

Date.now = Date.now || function () { return +new Date(); };
function readyState(fn) {
    if (document.readyState == "interactive" || document.readyState == "complete") {
        fn();
    }
}

var JSON;
if (!JSON) {
    JSON = {};
} (function () {
    function d(f) {
        return f < 10 ? "0" + f : f;
    }
    if (typeof Date.prototype.toJSON != "function") {
        Date.prototype.toJSON = function (f) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + d(this.getUTCMonth() + 1) + "-" + d(this.getUTCDate()) + "T" + d(this.getUTCHours()) + ":" + d(this.getUTCMinutes()) + ":" + d(this.getUTCSeconds()) + "Z" : null;
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (f) {
            return this.valueOf();
        };
    }
    var i = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	h, a, e = {
	    "\b": "\\b",
	    "\t": "\\t",
	    "\n": "\\n",
	    "\f": "\\f",
	    "\r": "\\r",
	    '"': '\\"',
	    "\\": "\\\\"
	}, c;

    function b(f) {
        i.lastIndex = 0;
        return i.test(f) ? '"' + f.replace(i, function (j) {
            var k = e[j];
            return typeof k == "string" ? k : "\\u" + ("0000" + j.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + f + '"';
    }

    function g(q, n) {
        var l;
        var j;
        var r;
        var f;
        var o = h;
        var m;
        var p = n[q];
        if (p && typeof p == "object" && typeof p.toJSON == "function") {
            p = p.toJSON(q);
        }
        if (typeof c == "function") {
            p = c.call(n, q, p);
        }
        switch (typeof p) {
            case "string":
                return b(p);
            case "number":
                return isFinite(p) ? String(p) : "null";
            case "boolean":
            case "null":
                return String(p);
            case "object":
                if (!p) {
                    return "null";
                }
                h += a;
                m = [];
                if (Object.prototype.toString.apply(p) == "[object Array]") {
                    f = p.length;
                    for (l = 0; l < f; l += 1) {
                        m[l] = g(l, p) || "null";
                    }
                    r = m.length == 0 ? "[]" : h ? "[\n" + h + m.join(",\n" + h) + "\n" + o + "]" : "[" + m.join(",") + "]";
                    h = o;
                    return r;
                }
                if (c && typeof c == "object") {
                    f = c.length;
                    for (l = 0; l < f; l += 1) {
                        if (typeof c[l] == "string") {
                            j = c[l];
                            r = g(j, p);
                            if (r) {
                                m.push(b(j) + (h ? ": " : ":") + r);
                            }
                        }
                    }
                } else {
                    for (j in p) {
                        if (Object.prototype.hasOwnProperty.call(p, j)) {
                            r = g(j, p);
                            if (r) {
                                m.push(b(j) + (h ? ": " : ":") + r);
                            }
                        }
                    }
                }
                r = m.length == 0 ? "{}" : h ? "{\n" + h + m.join(",\n" + h) + "\n" + o + "}" : "{" + m.join(",") + "}";
                h = o;
                return r;
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function (l, j, k) {
            var f;
            h = "";
            a = "";
            if (typeof k == "number") {
                for (f = 0; f < k; f += 1) {
                    a += " ";
                }
            } else {
                if (typeof k == "string") {
                    a = k;
                }
            }
            c = j;
            if (j && typeof j !== "function" && (typeof j !== "object" || typeof j.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return g("", {
                "": l
            })
        }
    }
}());

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        var i, j;
        for (i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    };
}

