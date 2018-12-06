/**** 
    *   Change Date: 2018.11.08 
    *   Change Date: 2018.11.15    拖曳原理
    *   Change Date: 2018.11.18    九宫格 磁性吸附
    *   Change Date: 2018.11.22    双缓冲绘制
    *   Change Date: 2018.11.23    移动端拖拽封装
    *   Change Date: 2018.11.24    竖向滑屏事件
    *   Change Date: 2018.11.26    读写 transform 
    ****/
/*
 * 移动端 完美 理想视口
 *        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
 * 
 * ocument.documentElement.clientWidth          不包含滚动条
 *    window.innerWidth                            +滚动条
 *    window.outerWidth                            +浏览器边框
 *    window.width                                 屏幕区域
 *    IPhone 6 的 屏幕分辨率 为 750*1334
 *    IPhone 6 的尺寸 为 4.7 英寸
 *    IPhone 6 的 像素比 DPR 为 2                  window.devicePixelRatio;
 *    IPhone 6 的 独立像素 为 375*667              window.innerWidth;
 *    IPhone 6 的布局(视口)像素为 980*1743         document.documentElement.clientWidth
 *
 * https://developer.mozilla.org/zh-CN/
 *    
 * DOMContentLoaded    只要 DOM 加载完成，就触发此事件，而不用等 图片等资源也加载完成
 *    
 * 整张网页的水平的和垂直的滚动距离
 *        document.documentElement.scrollLeft
 *        document.documentElement.scrollTop
 *    
 * 浏览器窗口的高度 = window.innerHeight - 垂直滚动条的高度
 * 
 * 网页的实际高度 = document.body.clientHeight  
 *        一般 document.body.clientHeight 大于 document.documentElement.clientHeight
 *    
 * 当前元素的总宽高（单位像素），包括溢出容器、当前不可见的部分。
 *        包括 padding , 还包括伪元素（::before或::after）的高度
 *        Element.scrollHeight，Element.scrollWidth            不包括滚动条的宽高
 *    
 * 元素节点左边框（left border）的宽度    Element.clientLeft  
 *    
 * Element.dispatchEvent()    // 触发事件
 *    Element.focus()    Element.click()    Element.blur()
 *    
 *    window.scrollBy(0, 0);    // 滚动条滑到最上方
 *    
 *    Element.insertAdjacentText()
 *    
 *    Element.insertAdjacentHTML(position, text);
 *    
 *    Object.keys    返回一个数组 包含对象所有自身属性
 *    
 *    强制连续字符串换行 word-break: break-all;
 *    
 *    强制文本不换行，white-spacing: nowrap;
 *    
 *    overflow-x: auto; 水平方向滚动条
 *    
 *    删除 数组中 索引为index 的元素 arr.splice(index,1);
 *    
 *    模拟 2 的整除运算       5 >> 1    // 相当于 5 / 2 = 2
 * 
 *    任意值 = 任意值 + "";    // 就能转换成字符串
 *    任意值 = +任意值;        // 就能转换成 Number，更简洁
 *    任意值 = !!任意值;       // 即可将 任意值 转换成布尔类型的值
 * 
 *    toString方法 将十进制的数，转为其他进制的字符串
 *    parseInt方法 将其他进制的数，转回十进制
 * 
 *    '\r\nabc \t'.trim() // 'abc'
 *
 *    Math.max.apply(null, [10, 2, 4, 15, 9]);    // 15
 *
 *    Array.apply(null, ['a', ,'b']);    // [ 'a', undefined, 'b' ]
 *    
 *    arr = "abcde".split("");   // ['a','b','c','d','e']
 *    str = arr.join(",");    // "a,b,c,d,e"
 *    
 *    Number.prototype.toPrecision()    保留 n 位有效数字
 *    
 *    Array.prototype.slice.call(类数组对象);    // 将类数组对象转换成真正的数组
 *    
 *    .onclick = null;    // 解绑事件 
 *    
 *    function 事件处理函数(e){    // e 是 MouseEvent 对象
 *                                      // 事件捕获阶段 e.eventPhase = 1 
 *                                      // 事件目标阶段 e.eventPhase = 2 
 *                                      // 事件冒泡阶段 e.eventPhase = 3    IE 只有冒泡阶段，即在冒泡阶段就触发事件
 *    }    // 高级浏览器 e.stopPropagation() 阻止事件冒泡
 *         // e.cancelBubble = true 本为 IE 属性，后所有浏览器可以使用
 */

/*
    function f() {
    console.log(this.v);
    }

    var o = { v: 123 };
    bind(f, o)();    // 123
*/
/* 
    var bindThis = Function.prototype.call.bind(Function.prototype.bind);

    var slice = Function.prototype.call.bind(Array.prototype.slice);
    var push = Function.prototype.call.bind(Array.prototype.push);
    var pop = Function.prototype.call.bind(Array.prototype.pop);
    
    slice([1, 2, 3], 0, 1);    // [1]
    push(a, 4)
    pop(a)
*/

// 最优冒泡排序
function bubbleSort(arr){
    var i = 0;
    var j = 0;
    var temp = 0;
    var isOkay = true;
    
    for(i=0; i<arr.length; i++){
        isOkay = true;
        for(j=0; j<arr.length-1-i; j++){
            if(arr[j+1] > arr[j]){
                temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
                isOkay = false;
            };
        };
        if(isOkay == true){
            break;
        };
    };
};

// 自定义反转数组
function revArr(arr){
    var i=0,temp=0;
    for(i=0; i<(arr.length>>1); i++){
        temp = arr[i];
        arr[i] = arr[arr.length-1-i];
        arr[arr.length-1-i] = temp;
    };
};

function $ById(objStr){
    return getElementById(objStr);
};

function $ByTag(objStr){
    return getElementsByTagName(objStr);
};

// 自定义 转为32位整数（不管是整数或小数）
function toInt32(x) {
    return x | 0;
};


/************************************** 兼容性封装 *****************************************/
// 侦测当前浏览器是否支持某属性    Test Already.
function isPropertySupported(cssPropStr) {
    if (cssPropStr in document.body.style){
        return true;
    };
    var prefixes = ['Moz', 'Webkit', 'O', 'ms', 'Khtml'];
    var prefProperty = cssPropStr.charAt(0).toUpperCase() + cssPropStr.substr(1);
    
    for(var i = 0; i < prefixes.length; i++){
        if((prefixes[i] + prefProperty) in document.body.style){
            return true;
        };
    };
    
    return false;
};

// 使用 css 选择器获取元素对象    Test Already.
function getElementsByCss(cssStr){
    if(document.querySelectorAll){
        return document.querySelectorAll(cssStr);
    }else{
        var style = document.createElement('style');
        var elements = [];
        var ele;
        
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = cssStr + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);    // 滚动条滑到最上方
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
            ele = document._qsa.shift();
            ele.style.removeAttribute('x-qsa');
            elements.push(ele);
        };
        document._qsa = null;
        return elements;
    };
};

// 鼠标事件参数    Test Already.
var kjfMouse = {
    getEvent : function(e){
        return e || window.event;
    },
    
    getTarget : function(e){
        return this.getEvent(e).target || this.getEvent(e).srcElement;
    },
    
    getClientX : function(e){
        return this.getEvent(e).clientX;
    },
    
    getClientY : function(e){
        return this.getEvent(e).clientY;
    },
    
    // 水平滚动条偏移
    getScrollLeft : function(){
        return  document.documentElement.scrollLeft ||    // 火狐 IE9及以下滚动条是HTML的
                window.pageXOffset ||                     // IE10及以上 window.pageXOffset
                document.body.scrollLeft;                 // chrome 滚动条是body的
    },
    
    // 垂直滚动条偏移
    getScrollTop : function(){
        return  document.documentElement.scrollTop ||    // 火狐 IE9 及以下滚动条是 HTML 的
                window.pageYOffset ||                    // IE10 及以上 window.pageXOffset
                document.body.scrollTop;                 // chrome 滚动条是body的
    },
    
    getPageX : function(e){
        return (this.getEvent(e).pageX)?( this.getEvent(e).pageX ):( this.getClientX(e)+this.getScrollLeft() );
    },
    
    getPageY : function(e){
        return (this.getEvent(e).pageY)?( this.getEvent(e).pageY ):( this.getClientY(e)+this.getScrollTop() );
    }
};

// ele.style.getPropertyPriority()
// ele.style.getPropertyValue()
// ele.style.removeProperty()
// 自定义 获取元素当前样式    Test Already.
function getCurrentStyle(obj, name){
    if(window.getComputedStyle){
        // 大多浏览器支持, IE8 不支持
        return window.getComputedStyle(obj, null)[name];    // .getComputedStyle(ele, ':before')["background"];
    }else{
        // 只有 IE 浏览器支持
        return obj.currentStyle[name];    // 当获取 left 这样的属性时，可能返回 auto
    };
};

// 自定义 绑定响应函数    Test Already.
function bindEventFunc(obj, eventStr, func){
    // console.log(!!obj.addEventListener == true);    // true
    // console.log(!!obj.attachEvent == true );    // false
    if(obj.addEventListener){
        // 大多数浏览器支持, IE8 及以下不支持
        obj.addEventListener(eventStr, func, false);    // false 指定在捕获的阶段的时候不触发事件
    }else{
        // IE5 - IE10 支持
        obj.attachEvent("on"+eventStr, function(){
            func().call(obj);
        });
    };
};

// 自定义 解除响应函数    Test Already.
function removeEventFunc(obj, eventStr, func){
    // console.log(!!obj.removeEventListener == true);    // true
    // console.log(!!obj.detachEvent == true );    // false
    if(obj.removeEventListener){
        // 大多数浏览器支持, IE8 及以下不支持
        obj.removeEventListener(eventStr, func);
    }else if(obj.detachEvent){
        // IE5 - IE10 支持
        obj.detachEvent("on"+eventStr, func);
    };
};

/***************************************** 自定义函数 *****************************************/
// 判断变量是否为对象的函数
function isObject(value) {
    return value === Object(value);
};

// 获取 n - m 的随机浮点数数，包含n，m
function getRandomInt(n, m){
    return Math.random()*(m-n)+n;
};

// 获取 n - m 的随机整数，包含n，m
function getRandomInt(n, m){
    return Math.round(Math.random()*(m-n)+n);
};

// 获取指定长度的字符串
function getRandomInt(n, m){
    var allChar = "-_0123456789"+"abcdefghijklmnopqrstuvwxyz"+"ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var str = "";
    var i = "";
    var x;
    
    for(i=0; i<allChar.length ; i++){
        x = Math.round(Math.random()*allChar.length);
        str += allChar.substr(x,1);
    };
    
    return str;
};

// 将颜色的 RGB 值转为 HEX 值
function rgb2hex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b)    // (1 << 24)的作用为保证结果是6位数
        .toString(16)    // 先转成十六进制，然后返回字符串
        .substr(1);    // 去除字符串的最高位，返回后面六个字符串
};

// 获取鼠标 在目标元素中的 坐标
function posInElement(obj,e){
    var mouseX = e.clientX;
               
    var mouseY = e.clientY;
    
    var objX = obj.getBoundingClientRect().left - document.documentElement.clientLeft;
    var objY = obj.getBoundingClientRect().top - document.documentElement.clientTop;
    
    return {
        top: mouseY - objY,    // 鼠标在页面中的坐标 - 元素在页面中的坐标 = 鼠标在元素内的坐标
        left: mouseX - objX,
        
        bottom: obj.offsetHeight - (mouseY - objY),
        right: obj.offsetWidth - (mouseX - objX)
    };
};

// 获取元素 在 浏览器窗口 中的 坐标     Test Already.
function posInClient(obj){
    var theClient = obj.getBoundingClientRect();    // 获取元素的左，上，右和下分别相对 浏览器视窗 的位置
    
    // 在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，需要做以下兼容
    var top2px = document.documentElement.clientTop;
    var left2px = document.documentElement.clientLeft;
    
    return {
        top: theClient.top - top2px,
        left: theClient.left - left2px,
        
        bottom: theClient.bottom + top2px,
        right: theClient.right + left2px
    };
};

// 获取 网页真实内容 高度
function getScrollHeight(){  
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);  
};

// 获取 网页真实内容 宽度
function getScrollWidth(){  
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);  
};

// 反转一个指定节点的所有子节点的顺序    Test Already.
function reverse(ele) {
    var docFrag = document.createDocumentFragment();
    
    while(ele.lastChild){
        docFrag.appendChild(ele.lastChild);
    };
    ele.appendChild(docFrag);
};

// 获取元素 在 网页 中的 坐标    Test Already.
function getElementPosition(ele) {
    var left = 0;
    var top = 0;
    var p = ele;
    while (p !== null)  {
        left += p.offsetLeft;
        top += p.offsetTop;
        p = p.offsetParent;   // 遍历相对元素的坐标
    };
    
    var pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    var pageWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    
    return {
        left: left,
        top: top,
        
        right: pageWidth - left - ele.offsetWidth,
        bottom: pageHeight - top - ele.offsetHeight
    };
};

// 获取元素 在 网页 中的 坐标    Test Already.
function posInPage(obj){
    var theXOffset = document.documentElement.scrollLeft ||    // 火狐 IE9及以下滚动条是HTML的
                     window.pageXOffset ||                     // IE10及以上 window.pageXOffset
                     document.body.scrollLeft;                 // chrome滚动条是body的
    
    var theYOffset = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    
    var theClient = obj.getBoundingClientRect();
    
    // 在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，需要做以下兼容
    var top2px = document.documentElement.clientTop;
    var left2px = document.documentElement.clientLeft;
    
    var pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    var pageWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    
    return {
        top: theClient.top - top2px + theYOffset,
        left: theClient.left - left2px + theXOffset,
        
        bottom: pageHeight - (theClient.top - top2px + theYOffset) - obj.offsetHeight,
        right: pageWidth - (theClient.left - left2px + theXOffset) - obj.offsetWidth
    };
};

// 为元素 绑定拖动事件
function bindDragEvent(obj){
    obj.onmousedown = function(e){
        e = e || window.event;
        
        // IE8 及以下 设置全局捕获 禁止浏览器拖曳
        obj.setCapture && obj.setCapture();    // IE8 及以下 独有函数 强制捕获下一次单击事件
        
        // 鼠标在元素内的坐标 = 鼠标在视窗中的坐标 - 元素在视窗中的坐标
        obj.fixedX = e.clientX - (obj.getBoundingClientRect().left - document.documentElement.clientLeft);
        obj.fixedY = e.clientY - (obj.getBoundingClientRect().top - document.documentElement.clientTop);
        
        // 绑定到 DOM 顶级对象，解决快速移动跟随问题
        document.onmousemove = function(e){
            e = e || window.event;
            
            // 鼠标在页面中的坐标 = 鼠标在视窗中的坐标 + 滚动条滚动距离
            var x = e.clientX + (document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft);
            var y = e.clientY + (document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop);
            
            // 元素在页面中的坐标 = 鼠标在页面中的坐标 - 鼠标在元素内的坐标
            obj.style.left = x - obj.fixedX + "px";
            obj.style.top = y - obj.fixedY + "px";
        };
        
        // DOM 顶级对象是 window
        // 绑定到 document，解决重叠问题
        document.onmouseup = function(){
            document.onmousemove = null;    // 解除 鼠标移动 div 跟随 事件
            document.onmouseup = null;    // 解除鼠标松开事件    解除不必要的内存影响
            obj.releaseCapture && obj.releaseCapture();    // IE8 及以下 解除强制捕获单击事件
        };
        
        // 解决 ctrl+A 拖曳问题（IE8 支持 return false; 只是不包括禁止浏览器拖曳）
        return false;    // DOM0 级事件取消浏览器默认行为
                         // DOM2 级事件取消浏览器默认行为： event.preventDefault();
    };
};

/****   拖曳原理：       2018/11/15
    元素的初始位置 + 鼠标距离差 = 元素最终位置
    
        设置全局捕获：       ele.setCapture();
            在处理 mousedown 时间过程中，强制捕获全部鼠标事件到该元素中
                
        释放全局捕获：       document.releaseCapture();
****/
function dragElement(obj){
    obj.onmousedown = function(e){
        e = e || window.event;
        
        obj.setCapture && obj.setCapture();    // 只有 IE 支持，处理 IE8 ctrl+A
        
        var mouseX = e.clientX;
        var mouseY = e.clientY;
        
        var eleX = obj.offsetLeft;
        var eleY = obj.offsetTop;
        
        document.onmousemove = function(e){
            e = e || window.event;
            
            var newMouseX = e.clientX;
            var newMouseY = e.clientY;
            
            obj.style.left = eleX + newMouseX - mouseX +"px";
            obj.style.top = eleY + newMouseY - mouseY + "px";
        };
        
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
            
            obj.releaseCapture && obj.releaseCapture();
        };
        
        e.preventDefault && e.preventDefault();
        return false;    // 处理高级浏览器 ctrl+A
    };
};

/**** 拖曳： 范围限定    2018/11/15
    超出临界值，令其等于临界值
        上侧临界值 = 0;
        右侧临界值 = 视窗 width - ele.offsetWidth;
        下侧临界值 = 视窗 height - ele.offsetHeight;
        左侧临界值 = 0;
    
    九宫格检测碰撞    2018/11/18
    ele.offsetLeft / ele.offsetTop  获取元素在 包含块 中的坐标
    ele.getBoundingClientRect();    获取元素在视窗中的坐标（由该 元素.getClientRects() 返回的一组矩形集合）
****/
function dragRangeAround(obj, borderRange, badObj){
    borderRange = borderRange || 0;
    obj.onmousedown = function(e){
        e = e || window.event;
        
        obj.setCapture && obj.setCapture();    // 只有 IE 支持，处理 IE8 ctrl+A
        
        var mouseX = e.clientX;
        var mouseY = e.clientY;
        
        var eleX = obj.offsetLeft;
        var eleY = obj.offsetTop;
        
        var cDir = "noCollision";
        document.onmousemove = function(e){
            e = e || window.event;
            
            var newMouseX = e.clientX;
            var newMouseY = e.clientY;
            
            fixedX = eleX + newMouseX - mouseX;
            fixedY = eleY + newMouseY - mouseY;
            
            var objBorder = obj.style.border && parseInt(obj.style.border);
            if(fixedX < borderRange){
                fixedX = 0;
            }else if(fixedX > (document.documentElement.clientWidth-obj.offsetWidth-borderRange)){
                fixedX = document.documentElement.clientWidth-obj.offsetWidth-objBorder*2;
            };
            
            if(fixedY < borderRange){
                fixedY = 0;
            }else if(fixedY > (document.documentElement.clientHeight-obj.offsetHeight-borderRange)){
                fixedY = document.documentElement.clientHeight-obj.offsetHeight-objBorder*2;
            };
            obj.style.left = fixedX + "px";
            obj.style.top = fixedY + "px";
            
            /**** start 碰撞检测 ****/
            if(badObj){
                var isCollision = false;
                
                var badTop = badObj.getBoundingClientRect().top;
                var badRight = badObj.getBoundingClientRect().right;
                var badBottom = badObj.getBoundingClientRect().bottom;
                var badLeft = badObj.getBoundingClientRect().left;
                
                var objRight = obj.getBoundingClientRect().right;
                var objLeft = obj.getBoundingClientRect().left;
                var objBottom = obj.getBoundingClientRect().bottom;
                var objTop = obj.getBoundingClientRect().top;
                
                if( objRight < badLeft){
                    cDir = "left";
                    if( objRight > (badLeft-borderRange) &&
                        objBottom > badTop && objTop < badBottom){
                        obj.style.left = badLeft - obj.offsetWidth + "px";
                    };
                }else if( objLeft > badRight ){
                    cDir = "right";
                    if( objLeft < (badRight+borderRange) &&
                        objBottom > badTop && objTop < badBottom){
                        obj.style.left = badRight + "px";
                    };
                }else if( objBottom < badTop){
                    cDir = "top";
                    if( objBottom > (badTop-borderRange) &&
                        objRight > badLeft && objLeft < badRight){
                        obj.style.top = badTop - obj.offsetHeight + "px";
                    };
                }else if( objTop > badBottom ){
                    cDir = "bottom";
                    if( objTop < (badBottom+borderRange) &&
                        objRight > badLeft && objLeft < badRight){
                        obj.style.top = badBottom + "px";
                    };
                }else{
                    isCollision = true;
                };
            
                if(isCollision){
                    badObj.innerHTML = cDir+"in's business";
                }else{
                    badObj.innerHTML = cDir+"out's business";
                };
            };
            /**** over ****/
        };
        
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
            
            obj.releaseCapture && obj.releaseCapture();
        };
        
        e.preventDefault && e.preventDefault();
        return false;    // 处理高级浏览器 ctrl+A
    };
    return obj;
};

//                创建 画布的width  画布的height  背景颜色 父元素
function createCanvasTo(canvasWidth, canvasHeight, bgColor, parentObj){
    var myCanvas = document.createElement("canvas");
    myCanvas.width = canvasWidth;
    myCanvas.height = canvasHeight;
    myCanvas.innerText = " 您的浏览器不支持 canvas，建议更新或者更换浏览器。";
    if(bgColor){
        myCanvas.style.backgroundColor = bgColor;
    };
    if(parentObj){
        parentObj.appendChild(myCanvas);
    };
    
    return myCanvas;
};

/**** 操作 ImageData ****/
// 根据 ImageData 获取某个点的 rgba 数组
function getColorPos(pxObj, x, y){
    var rgba = [];
    rgba[0] = pxObj.data[(pxObj.width*y+x)*4+0];
    rgba[1] = pxObj.data[(pxObj.width*y+x)*4+1];
    rgba[2] = pxObj.data[(pxObj.width*y+x)*4+2];
    rgba[3] = pxObj.data[(pxObj.width*y+x)*4+3];
    
    return rgba;
};

// 更改某个点在 ImageData 中的 rgba 值
function setColorPos(pxObj, x, y, rgba){
    pxObj.data[(pxObj.width*y+x)*4+0] = rgba[0];
    pxObj.data[(pxObj.width*y+x)*4+1] = rgba[1];
    pxObj.data[(pxObj.width*y+x)*4+2] = rgba[2];
    pxObj.data[(pxObj.width*y+x)*4+3] = rgba[3];
};

// 反相处理 ImageData 的每个点
function setColorInversion(pxObj){
    var i = 0;
    var j = 0;
    for(i=0; i<pxObj.width; i++){
        for(j=0; j<pxObj.height; j++){
            pxObj.data[(pxObj.width*j+i)*4+0] = 255 - pxObj.data[(pxObj.width*j+i)*4+0];
            pxObj.data[(pxObj.width*j+i)*4+1] = 255 - pxObj.data[(pxObj.width*j+i)*4+1];
            pxObj.data[(pxObj.width*j+i)*4+2] = 255 - pxObj.data[(pxObj.width*j+i)*4+2];
            pxObj.data[(pxObj.width*j+i)*4+3] = 150;
        };
    };
};

// 帧动画          画布对象 图片路径 图片类型 起始x 起始y 图片width 图片height
function movingPic(theCanvas, imgPath, imgType, posX, posY, imgWidth, imgHeight){
    var cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = theCanvas.width;
    cacheCanvas.height = theCanvas.height;
    var cachePen = cacheCanvas.getContext("2d");
    
    var num = 1;
    var pos = 0;
    window.setInterval(function(){
        pen = theCanvas.getContext("2d");    // 坑1: 一定要放在循环里面
        pen.clearRect(0, 0, theCanvas.width, theCanvas.height);
        
        // 图形位移变换
        num++;
        if(num > 8){
            num = 1;
        };
        
        pos += 15;
        if(posX+pos > theCanvas.width){
            pos = -130;
        };
        
        // 双缓冲绘制    先画到临时 canvas
        cachePen.save();
        cachePen.beginPath();
        var imgObj = new Image();
        imgObj.src = imgPath+num+"."+imgType;
        imgObj.onload = function(){
            cachePen.drawImage(imgObj, posX+pos, posY, imgWidth,imgHeight);
        };
        cachePen.restore();
        
        // 再转到正式 canvas
        pen.save();
        pen.drawImage(cacheCanvas, 0, 0, cacheCanvas.width, cacheCanvas.height);
        pen.restore();
        
        // 坑2: 一定要在 取走缓冲内容后 再清除缓冲
        cachePen.clearRect(0, 0, cacheCanvas.width, cacheCanvas.height);
    }, 100);
};

/**** 操作 className ****/
function addClass(ele, className){
    var reg = new RegExp("\\b"+className+"\\b");
    if(!reg.test(ele.className)){
        /* 如果元素 ele 不包含 className */
        ele.className += " "+className;
    };
};

function removeClass(ele, className){
    if(ele.className){
        var reg = new RegExp("\\b"+className+"\\b");
        var classes = ele.className;
        ele.className = classes.replace(reg, "");
        if(/^\s*$/g.test(ele.className)){
            ele.removeAttribute("class");
        };
    }else{
        ele.removeAttribute("class");
    }
};

function toggleClass(ele, className){
    if(ele.className){
        var reg = new RegExp("\\b"+className+"\\b");
        if(!reg.test(ele.className)){
            /* 如果元素 ele 不包含 className */
            ele.className += " "+className;
        }else{
            var classes = ele.className;
            ele.className = classes.replace(reg, "");
            
            if(/^\s*$/g.test(ele.className)){
                /* 如果元素的 class 为空, 则清除 class 属性 */
                ele.removeAttribute("class");
            };
        };
    }else{
        /* 如果元素的 className 属性不存在, 则清除 class 属性 */
        ele.removeAttribute("class");
    };
};

/**** 时间 操作 格式化 ****/
funtion str2HMS(seconds){
    seconds = parseInt(seconds);

    var s = toZero( Math.floor(seconds%60) );
    var m = toZero( Math.floor(seconds%3600/60) );
    var h = toZero( Math.floor(seconds/3600) );

    return h+":"+m+":"+s;
};

function toZero(num){
    if(num<10){
        num = "0"+num;
    }else{
        num = ""+num;
    };
};

// 移动端 拖拽封装 2018/11/23
function touchDragElement(ele, callBack){
    var oldFingerX = 0;
    var oldFingerY = 0;
    var oldEleX = 0;
    var oldEleY = 0;
    
    ele.addEventListener("touchstart", function(e){
        oldFingerX = e.changedTouches[0].clientX;
        oldFingerY = e.changedTouches[0].clientY;
        
        oldEleX = ele.offsetLeft;
        oldEleY = ele.offsetTop;
        
        document.addEventListener("touchmove", outerMove, false);
        
        document.addEventListener("touchend", outerEnd,false);
    }, false);

    function outerMove(e){
        var newFingerX = e.changedTouches[0].clientX;
        var newFingerY = e.changedTouches[0].clientY;
        
        var newEleX = oldEleX + newFingerX - oldFingerX;
        var newEleY = oldEleY + newFingerY - oldFingerY;
        
        ele.style.left = newEleX+"px";
        ele.style.top = newEleY+"px";
        callBack && callBack();
    };
    
    function outerEnd(e){
        document.removeEventListener("touchmove", outerMove);
        document.removeEventListener("touchend", outerEnd);
    };
};

// 移动端 竖向滑屏事件      滑动元素  父元素     回调函数 2018/11/24
function bindEleSlide(slideEle, parentEle, callBack){
    var oldFingerY = 0;
    var oldEleY = 0;
    
    parentEle.addEventListener("touchstart", function(e){
        finger = e.changedTouches;
        
        oldFingerY = finger[0].clientY;
        oldEleY = slideEle.offsetTop;
    }, false);
    
    parentEle.addEventListener("touchmove", function(e){
        finger = e.changedTouches;
        
        var newFingerY =  finger[0].clientY;
        var newEleY = oldEleY + (newFingerY - oldFingerY);
        if(newEleY > 0){
            newEleY = 0;
        }else if(newEleY < document.documentElement.clientHeight - slideEle.clientHeight){
            newEleY = document.documentElement.clientHeight - slideEle.clientHeight;
        }
        
        slideEle.style.top = newEleY+"px";
        
        callBack && callBack();
    }, false);
};

// 读写 transform    2018.11.26
function transformEle(ele, attr, val){
    if(!ele.transform){
        ele.transform = {};
    };
    
    var result = "";
    if(arguments.length > 2){
        // 写入操作
        ele.transform[attr] = val;
        
        for( var attrStr in ele.transform){
            switch(attrStr){
                case "translate":
                case "translateX":
                case "translateY":
                case "translateZ":{
                    result += attrStr+"("+ele.transform[attrStr]+"px) ";
                    break;
                };
                
                case "rotate":
                case "rotateX":
                case "rotateY":
                case "rotateZ":
                case "skew":
                case "skewX":
                case "skewY":{
                    result += attrStr+"("+ele.transform[attrStr]+"deg) ";
                    break;
                };
                
                case "scale":
                case "scaleX":
                case "scaleY":{
                    result += attrStr+"("+ele.transform[attrStr]+") ";
                    break;
                };
            };
        };
        
        ele.style.transform = result;
    }else{
        // 读取操作
        if(ele.transform[attr]){
            result = ele.transform[attr];
        }else{
            if(attr == 'scale' || attr == 'scaleX' || attr == 'scaleY'){
                result = 1;
            }else{
                result = 0;
            };
        }
    };
    
    return result;
};

// 1 物理像素
function onePixel(){
    var width = document.documentElement.clientWidth;    // 屏幕宽度 375
    
    var dpr = window.devicePixelRatio;    // 获取 dpr
    var scale = 1/dpr;    // 获取实现 1 像素的比例    0.5
    
    // 通过系统缩放  initial-scale=0.5
    var metaNode = document.querySelector('meta[name="viewport"]');
    metaNode.setAttribute('content','width=device-width,initial-scale='+ scale +',user-scalable=no')
    
    // 此时获取布局视口为 750px
    // var width = document.documentElement.clientWidth;
    
    // 页面中布局元素 * 2  
    var styleNode = document.createElement('style');
    styleNode.innerHTML = 'html{font-size: '+ width/16 +'px !important;}';
    document.head.appendChild(styleNode);
};

// rem 适配
// 适配 (手写 面试题)
function remAdjust(){
    var width = document.documentElement.clientWidth;
    var styleNode = document.createElement("style");

    /* 给 style 标签添加内容 (屏幕分份, 大多数公司 16 份) */
    styleNode.innerHTML = "html {"+
                               "font-size:"+width/16+"px !important"+
                          "}";    /* IPhone 6 的 font-size: 23.4375px */

    /* 把 style 标签追加到 head 标签里 */
    document.head.appendChild(styleNode);
};

// viewport 适配
function viewportAdjust(){
    var clientWidth = document.documentElement.clientWidth;

    var targetWidth = 320;

    var scale = clientWidth/targetWidth;

    var metaNode = 
    document.querySelector("meta[name='viewport']");

    metaNode.content = "initial-scale="+scale+", user-scalable=no";
};

//点透（传透）
function touchOne(){
    var aNodes = document.querySelectorAll('a');
    for (var i=0;i<aNodes.length;i++) {
        aNodes[i].addEventListener('touchstart',function(){
            window.location = this.href;
        })
    }
};
