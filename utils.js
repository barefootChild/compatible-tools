/**
 * Created by zhaoyongsheng on 16/9/16.
 */

//跨浏览器添加事件处理机制
var EventUtil = {
    addHandler: function(element, type, handler){
        if(element.addEventListener){
            element.addEventListener(type, handler, false);
        }else if(element.attachEvent){
            element.attachEvent("on" + type, handler);
        }else{
            element["on" + type] = handler;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if(event.preventDefault){
           event.preventDefault();
        }else{
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    },
    /**
     * mouseover和mouseout事件发生时会牵涉到更多元素
     * @param event
     */
    getRelatedTarget: function(event){
       if(event.relatedTarget){
           return event.relatedTarget;
       }else if(event.fromElement){
           return event.fromElement;
       }else if(event.toElement){
           return event.toElement;
       }else{
           return null;
       }
    },
    /**
     * 获取鼠标mouseup,mousedown事件event事件对象中的按下或释放的按钮
     * @param event
     */
    getButton: function(event){
        if(document.implementation.hasFeature("mouseEvents", "2.0")){
            return event.button;
        }else{
            //ie8之前的返回键值比较多,但无用
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    /**
     * 获取鼠标滚轮增量值
     * @param event
     */
    getWheelDelta: function(event){
        if(event.wheelDelta){
            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        }else{
            return -event.detail * 40;
        }
    },
    /**
     * keypress事件获取按键ASCII编码
     * @param event
     * @returns {*}
     */
    getCharCode: function(event){
        if(typeof event.charCode === "number"){
            return event.charCode;
        }else{
            return event.keyCode;
        }
    },
    removeHandler: function(element, type, handler){
        if(element.removeEventListener){
            element.removeEventLilstener(type, handler);
        }else if(element.detachEvent){
            element.detachEvent("on" + type, handler);
        }else{
            element["on" + type] = null;
        }
    },
    getClipboardText: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    setClipboardText: function(event, value) {
        if (event.clipboardData) {
            return event.clipboardData.setData('text/plain', value);
        } else if (window.clipboardData) {
            return window.clipboardData.setData('text', value);
        }
    }
};
/**
 * 用户代理字符串检测脚本
 * @returns {{engine: {ie: number, webkit: number, gecko: number, khtml: number, opera: number, ver: null}, browser: {ie: number, firefox: number, safari: number, konq: number, opera: number, chrome: number, ver: null}, system: {win: boolean, mac: boolean, xll: boolean, iphone: boolean, ipod: boolean, ipad: boolean, ios: boolean, android: boolean, nokiaN: boolean, winMobile: boolean, wii: boolean, ps: boolean}}}
 */
var checkClient = function(){
    var engine = {
        ie: 0,
        webkit: 0,
        gecko: 0,
        khtml: 0,
        opera: 0,
        ver: null
    };

    var browser = {
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        ver: null
    };

    var system = {
        win: false,
        mac: false,
        xll: false,

        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,

        wii: false,
        ps: false
    };

    //检测呈现引擎和浏览器
    var ua = navigator.userAgent;
    if(window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    }else if(/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        if(/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        }else if(/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        }else{
            var safariVersion = 1;
            if(engine.webkit < 100){
                safariVersion = 1;
            }else if(engine.webkit < 312){
                safariVersion = 1.2;
            }else if(engine.webkit < 412){
                safariVersion = 1.3;
            }else{
                safariVersion = 2;
            }
            browser.safari = browser.ver = safariVersion;
        }
    }else if(/KHTML\/(S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    }else if(/rv:([^\)]+) Gecko\/\d{8}/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        if(/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    }else if(/MSIE ([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }
    //检测浏览器
    browser.ie = engine.ie;
    browser.opera = engine.opera;

    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.xll = (p == "Xll") || (p.indexOf("Linux") == 0);

    //检测windows操作系统
    if(system.win){
        if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if(RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            }else if(RegExp["$1"] == "9x"){
                system.win = "ME";
            }else{
                system.win = RegExp["$1"];
            }
        }
    }

    //移动设备
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;

    //windows mobile
    if(system.win == "CE"){
        system.winMobile = system.win;
    }else if(system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }

    //检测iOS版本
     if(system.mac && ua.indexOf("Mobile") > -1){
         if(/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
             system.ios = parseFloat(RegExp.$1.replace("_", "."));
         }else{
             system.ios = 2;
         }
     }

    //检测Android版本
    if(/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }

    //游戏系统
    system.wii = ua.indexOf("wii") > -1;
    system.pa = /playstation/i.test(ua);

    return {
        engine: engine,
        browser: browser,
        system: system
    };
};

/**
 * 判断滚动条是否滑到底部
 */
var isAtBottom = function(){
    var marginBot = 0;
    if(document.compatMode === "CSS1Compat"){
        marginBot = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight;
    }else{
        marginBot = document.body.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.body.clientHeight;
    }
    return marginBot <= 0;
};

/*＊
 ＊ 屏蔽字符*/
EventUtil.addHandler(textbox, "keypress", function(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    var charCode = EventUtil.getCharCode(event);

    if (!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 && !event.ctrlKey) {
        EventUtil.preventDefault(event);
    }
})
/**
 * 输入框自动切换焦点
 * @param event
 */
function tabForward(event) {
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);

    if (target.value.length === target.maxLength) {
        var form = target.form;

        for (var i = 0, len = form.elements.length; i < len; i++) {
            if (form.elements[i] == target) {
                if (form.elements[i+1]) {
                    form.elements[i+1].focus();
                }
            }
            return false;
        }
    }
}

//自定义事件
function EventTarget() {
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addHandler: function(type, handler) {
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = []
        }

        this.handlers[type].push(handler);
    },
    fire: function(event) {
        if (!event.target) {
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array) {
            var handlers = this.handlers[event.type];
            for (var i = 0,len = handlers.length; i < len; i++) {
                handlers[i](event);
            }
        }
    },
    removeHandler: function(type, handler) {
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length;i < len; i++) {
                if (handler[i] === handler) {
                    break;
                }
            }
            handlers.splice(i, 1);
        }
    }
};
//拖动功能
var DragDrop = function() {
    var dragdrop = new EventTarget(),
        dragging = null,
        diffX = 0,
        diffY = 0;

    function handleEvent(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        switch(event.type) {
            case 'mousedown':
                if (target.className.indexOf('draggable') > -1) {
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                    dragdrop.fire({type: 'dragstart',target: dragging, x: event.clientX, y: event.clientY});
                }
                break;

            case 'mousemove':
                if (dragging !== null) {
                    dragging.style.left = (event.clientX - diffX) + 'px';
                    dragging.style.top = (event.clientY - diffY) + 'px';
                    dragdrop.fire({type: 'drag', target: dragging, x: event.clientX, y: event.clientY});
                }
                break;

            case 'mouseup':
                dragdrop.fire({type: 'dragend', target: dragging, x: event.clientX, y: event.clientY});
                dragging = null;
                break;
        }
    };
    dragdrop.enable = function() {
        EventUtil.addHandler(document, 'mousedown', handleEvent);
        EventUtil.addHandler(document, 'mousemove', handleEvent);
        EventUtil.addHandler(document, 'mouseup', handleEvent);
    };
    dragdrop.disable = function() {
        EventUtil.removeHandler(document, 'mousedown', handleEvent);
        EventUtil.removeHandler(document, 'mousemove', handleEvent);
        EventUtil.removeHandler(document, 'mouseup', handleEvent);
    };

    return dragdrop;
}();
