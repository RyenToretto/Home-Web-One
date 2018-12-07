function addClass(ele, className){
    var reg = new RegExp("\\b"+className+"\\b");
    if(!reg.test(ele.className)){
        /* 如果元素 ele 不包含 className */
        ele.className += " "+className;
    };
};

function removeClass(ele, className){
    if (ele.className) {
        var reg = new RegExp("\\b" + className + "\\b");
        var classes = ele.className;
        ele.className = classes.replace(reg, "");
        
        if (/^\s*$/g.test(ele.className)) {
            ele.removeAttribute("class");
        };
    }else{
        ele.removeAttribute("class");
    };
};

/**** 滚轮切事件绑定 ****/
function bindScrollEvent(callBack){
    var timeId = 0;

    function func(event){
        event = event || window.event;

        clearTimeout(timeId);
        timeId = window.setTimeout(function(){
            scrollMove(event);
        }, 200);
    };

    document.onmousewheel = func;    // ie/chrome    DOM0 绑定滚轮事件

    if(document.addEventListener){
        document.addEventListener('DOMMouseScroll',func);    // firefox DOM2绑定滚轮事件
    };

    function scrollMove(event) {
        event = event || window.event;

        var flag = '';
        if(event.wheelDelta){    // ie/chrome
            if(event.wheelDelta > 0){
                flag = 'up';    // 上
            }else {
                flag = 'down';    // 下
            };
        }else if(event.detail){    // firefox
            if(event.detail < 0){
                flag = 'up';    // 上
            }else {
                flag = 'down';    // 下
            };
        };

        switch (flag){    // 值的结果能够预测到
            case 'up':{
                if(callBack){    // 封装，执行 callBack 对象中的所有 wheelup 方法
                    for(var funcName in callBack){
                        if( /wheelup/.test(funcName) &&
                            typeof callBack[funcName] === "function"){
                            callBack[funcName]();
                        };
                    };
                };
                break;
            };

            case 'down':{
                if(callBack){    // 封装，执行 callBack 对象中的所有 wheeldown 方法
                    for(var funcName in callBack){
                        if( /wheeldown/.test(funcName) &&
                            typeof callBack[funcName] === "function"){
                            callBack[funcName]();
                        };
                    };
                };
                break;
            };
        };

        // 取消默认行为
        event.preventDefault && event.preventDefault();
        return false;
    };
};

/**** 创建 画布的width  画布的height  背景颜色 父元素 ****/
function createCanvasTo(canvasWidth, canvasHeight, parentObj, bgColor){
    var myCanvas = document.createElement("canvas");
    myCanvas.width = canvasWidth;
    myCanvas.height = canvasHeight;
    myCanvas.innerText = " 您的浏览器不支持 canvas，建议更新或者更换浏览器。";
    if(parentObj){
        parentObj.appendChild(myCanvas);
    };
    if(bgColor){
        myCanvas.style.backgroundColor = bgColor;
    };
    
    return myCanvas;
};

function MyBubble(myCanvas) {
    var num = [];
    var makeTimer = 0;
    var showTimer = 0;
    var raiseTimer = 0;
    
    var pen = myCanvas.getContext("2d");    // 获取画笔
    var canvasWidth = myCanvas.width;
    var canvasHeight = myCanvas.height;
    
    MyBubble.prototype.clearArr = function(){
        num = [];
    };
    
    MyBubble.prototype.clearTimers = function(){
        window.clearInterval(makeTimer);
        window.clearInterval(showTimer);
        window.clearInterval(raiseTimer);
    };
    
    MyBubble.prototype.createBubble = function(biggest, times){
        if(!biggest){
            biggest = 10;
        };
        if(!times){
            times = 16;
        };
        
        window.setInterval(makeTimer);
        makeTimer = window.setInterval(function(){
            var newBubble = {};
            newBubble.r = Math.floor(Math.random()*biggest+2);
            newBubble.x = Math.floor(Math.random()*canvasWidth);
            newBubble.y = canvasHeight + newBubble.r;
            newBubble.red = Math.floor(Math.random()*256);
            newBubble.green = Math.floor(Math.random()*256);
            newBubble.blue = Math.floor(Math.random()*256);
            newBubble.opacity = parseFloat("0."+Math.floor(Math.random()*10));
        
            newBubble.startX = newBubble.x;
            newBubble.startY = newBubble.y;
            newBubble.scale = Math.floor(Math.random()*100+50);
            newBubble.deg = 0;
            newBubble.way = (Math.floor(Math.random()*2)==0)?"sin":"cos";
            
            num.push(newBubble);
        }, times);
        return makeTimer;
    };
    
    MyBubble.prototype.show = function(times){
        if(!times){
            times = 16;
        };
        
        window.setInterval(showTimer);
        showTimer = window.setInterval(function(){
            pen.clearRect(0, 0, canvasWidth, canvasHeight);
            for(var i=0; i<num.length; i++){
                pen.beginPath();
                pen.arc(num[i].x, num[i].y, num[i].r, 0, 2*Math.PI);
                pen.fillStyle = "rgba("+num[i].red+", "+
                    num[i].green+", "+
                    num[i].blue+", "+
                    num[i].opacity+")";
                pen.fill();
            };
        }, times);
        return showTimer;
    };
    
    MyBubble.prototype.raiseBubble = function(times){
        if(!times){
            times = 16;
        };
        
        window.setInterval(raiseTimer);
        raiseTimer = window.setInterval(function(){
            for(var i=0; i<num.length; i++){
                num[i].deg += 1;
            
                num[i].r += 0.02;
                num[i].opacity -= 0.01;
                if(num[i].opacity <= 0){
                    num.splice(i, 1);
                };
                
                if(!num[i]){
                    continue;
                };
                
                var offset = num[i].deg*Math.PI/180;
                num[i].x = num[i].startX + Math[num[i].way](offset)*num[i].scale;
                num[i].y = num[i].startY - offset*num[i].scale*4;
            };
        }, times);
        return raiseTimer;
    };
};
