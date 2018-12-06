var isOkay = false;
var images = [
    "04038.jpg", "48812.jpg",
    "about1.jpg", "about2.jpg", "about3.jpg", "about4.jpg",
    "apcoa.png", "arrow.png",
    "bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg", "bg5.jpg",
    "binoli.png", "bks.png", "greenLine.png", "gu.png", "hlx.png",
    "home.png", "home_gruen.png", "lbs.png", "leonberg.png", "logo.png",
    "musicoff.gif", "musicon.gif", "pcwelt.png",
    "pencel1.png", "pencel2.png", "pencel3.png", "plane1.png", "plane2.png", "plane3.png",
    "plus_row.png", "robot.png", "tata.png", "team.png", "team1.png",
    "worksimg1.jpg", "worksimg2.jpg", "worksimg3.jpg", "worksimg4.jpg",  "zoomico.png"
];
/**** 开机动画 ****/
function LoadingAnimation() {
    var upMask = document.getElementById("up_mask");
    var downMask = document.getElementById("down_mask");
    
    // 进度条
    var processLine = document.getElementById("process_line");
    
    var count = 0;
    for(var i=0; i<images.length; i++){
        (function(){
            var imgObj = new Image();
            imgObj.src = "./img/"+images[i];
            imgObj.onload = function () {
                count++;
                processLine.style.width = Math.round(count/images.length*100) + "%";
            };
        }());
    };
    
    processLine.addEventListener("transitionend", function () {
        if(count === images.length){
            processLine.style.visibility = "hidden";
            upMask.style.height = "0px";
            downMask.style.height = "0px";
        };
    }, false);
    
    upMask.addEventListener("transitionend", function () {
        upMask.remove();
        downMask.remove();
        isOkay = true;
        if(upMask.style.height === "0px"){
            screenSwitch(1, callBack);         // 切换到第 1 屏
            console.log("haha*************");
        };
        bindSwitchPhotos();                // 轮播图 逻辑
    }, false);
};

/**** 处理浏览器缩放问题 ****/
function windowResize(){
    screensHeightInit();
    
    var ulContent = document.getElementById("ul_content");
    if(!ulContent.screenindex){
        ulContent.screenindex = 1;
    };
    screenSwitch(ulContent.screenindex, callBack);
};

/**** lis 屏 初始化 ****/
function screensHeightInit(){
    var headerBox = document.getElementById("header_box");
    var lis = document.querySelectorAll("#ul_content>li");
    var lisHeight = document.documentElement.clientHeight - headerBox.offsetHeight;
    var content_box = document.getElementById("content_box");
    
    content_box.style.height = lisHeight + "px";
    for(var i=0; i<lis.length; i++){
        lis[i].style.height = lisHeight + "px";
    };
};

/**** 屏幕切换 函数 ****/
function screenSwitch(navindex, callBack){
	// 对应的 up_mask 显示
    var lis = document.querySelectorAll("#header_nav>ul>li");
    for(var i=0; i<lis.length; i++){
        removeClass(lis[i].querySelector(".up_mask"), "active");
    };
    addClass(document.querySelector("#header_nav>ul>li:nth-child("+navindex+")>div:first-child"), "active");
    

    // 切换小圆点
	var points = document.querySelectorAll("#point_nav>li");
	for(var j=0; j<points.length; j++){
		removeClass(points[j], "active");
	};
	addClass(points[navindex-1], "active");
	
	// 小箭头移动到对应的位置
    var header = document.getElementById("header");
    var homePage = document.querySelector("#header_nav>ul>li:nth-child("+navindex+") .green_words");
    var arrow = document.getElementById("arrow");
    arrow.style.left = 	homePage.getBoundingClientRect().left -
                        header.offsetLeft +
                        homePage.parentElement.offsetWidth/2-
                        arrow.offsetWidth/2 + "px";
    
	// 屏幕切换
    var headerBox = document.getElementById("header_box");
    var ulContent = document.getElementById("ul_content");
    ulContent.style.top = -(navindex-1)*(document.documentElement.clientHeight - headerBox.offsetHeight)+"px";
    
    // 第 navindex 动画
    if(callBack){
        if(ulContent.screenindex){
            var oldLi = document.querySelector("#ul_content>li:nth-child("+ulContent.screenindex+")");
            callBack["leaveShow"+ulContent.screenindex] && callBack["leaveShow"+ulContent.screenindex] (oldLi);
        };
        
        var newLi = document.querySelector("#ul_content>li:nth-child("+navindex+")");
        callBack["enterShow"+navindex] && callBack["enterShow"+navindex] (newLi);
    };
    ulContent.screenindex = navindex;
};

/**** 导航 点击切屏 ****/
function navClick(){
    var ulNav = document.querySelector("#header_nav>ul");
    ulNav.addEventListener("click", function(e){
        e = e || window.event;
        
        var obj = e.target;
        if(obj.nodeName === "UL"){
            return;
        };
        
        if(obj.nodeName !== "LI" ){
            obj = obj.parentElement;
            while(obj.nodeName !== "LI"){
                obj = obj.parentElement;
            };
        };
        
        screenSwitch(obj.dataset.navindex, callBack);
        
    }, false);
};

/**** 小圆点 点击切屏 ****/
function pointClick(){
    var pointNav = document.querySelector("#point_nav");
    pointNav.addEventListener("click", function(e){
        e = e || window.event;

        var obj = e.target;
        if(obj.nodeName === "LI"){
            screenSwitch(obj.dataset.pointindex, callBack);
        };
    }, false);
};

/**** 轮播图 逻辑 ****/
function bindSwitchPhotos() {
    var isRunning = false;
    var switchPoints = document.getElementById("switch_points");
    var switchPhotos = document.getElementById("switch_photos");
    var lis = document.querySelectorAll("#switch_points>li");
    
    // 小圆点点击
    switchPoints.addEventListener("click", function(e){
        e = e || window.event;

        if(isRunning){
            return;
        };

        if(!switchPhotos.curIndex){
            switchPhotos.curIndex = 1;
        };

        var obj = e.target;
        var oldIndex = switchPhotos.curIndex;
        if(obj.nodeName === "LI"){
            var newIndex = obj.dataset.switchindex;

            // 切换小圆点
            for(var i=0; i<lis.length; i++){
                removeClass(lis[i], "active");
            }
            addClass(lis[newIndex-1], "active");

            // 切换图片
            switchPhotos.curIndex = newIndex;
            if(oldIndex < newIndex){
                switchToNext(oldIndex, newIndex);
            }else if(oldIndex > newIndex){
                switchToPrev(oldIndex, newIndex);
            }else{
                return;
            };
        };
    }, false);

    var theTimer = 0;
    autoSwitch();
    switchPhotos.onmouseenter = function(){
        window.clearInterval(theTimer);
    };
    switchPhotos.onmouseleave = function(){
        window.clearInterval(theTimer);
        autoSwitch();
    };
    switchPoints.onmouseenter = switchPhotos.onmouseenter;
    switchPoints.onmouseleave = switchPhotos.onmouseleave;

    function autoSwitch(){
        window.clearInterval(theTimer);
        theTimer = window.setInterval(function(){
            var lis = document.querySelectorAll("#switch_points>li");

            if(!switchPhotos.curIndex){
                switchPhotos.curIndex = 1;
            }

            if(switchPhotos.curIndex >= lis.length){
                switchToNext(switchPhotos.curIndex, 1);
                switchPhotos.curIndex = 1;
            }else{
                switchToNext(switchPhotos.curIndex, +switchPhotos.curIndex+1);
                switchPhotos.curIndex = +switchPhotos.curIndex+1;
            };

            // 切换小圆点
            for(var i=0; i<lis.length; i++){
                removeClass(lis[i], "active");
            }
            addClass(lis[switchPhotos.curIndex-1], "active");
        }, 4000);
    };

    function switchToNext(oldIndex, newIndex) {
        isRunning = true;
        var oldLi = document.querySelector("#switch_photos>li:nth-child("+oldIndex+")");
        var newLi = document.querySelector("#switch_photos>li:nth-child("+newIndex+")");

        var lis = document.querySelectorAll("#switch_photos>li");
        for(var i=0; i<lis.length; i++){
            lis[i].className = "";
        };

        addClass(oldLi, "left_hide");

        addClass(newLi, "active");
        addClass(newLi, "right_show");
        window.setTimeout(function(){
            isRunning = false;
        }, 2000);
    };

    function switchToPrev(oldIndex, newIndex) {
        isRunning = true;
        var oldLi = document.querySelector("#switch_photos>li:nth-child("+oldIndex+")");
        var newLi = document.querySelector("#switch_photos>li:nth-child("+newIndex+")");

        var lis = document.querySelectorAll("#switch_photos>li");
        for(var i=0; i<lis.length; i++){
            lis[i].className = "";
        };

        addClass(oldLi, "right_hide");

        addClass(newLi, "active");
        addClass(newLi, "left_show");
        window.setTimeout(function(){
            isRunning = false;
        }, 2000);
    };
};

/**** 悬浮气泡 ****/
function hoverBubble() {
    var teams = document.getElementById("teams");
    var lis = teams.querySelectorAll("li");
    
    function addCanvas(theLi){
        theLi.myCanvas = createCanvasTo(theLi.offsetWidth, theLi.offsetHeight, theLi);
        theLi.myCanvas.style.position = "absolute";
        theLi.myCanvas.style.top = "0";
        theLi.myCanvas.style.left = "0";
    
        theLi.myCanvas.bubble = new MyBubble(theLi.myCanvas);
        theLi.myCanvas.pen = theLi.myCanvas.getContext("2d");
        
        theLi.myCanvas.bubble.createBubble(8);    // 添加气泡
        theLi.myCanvas.bubble.show();    // 绘制气泡
        theLi.myCanvas.bubble.raiseBubble();    // 气泡上升
    };
    
    function stopBubbles(theLi){
        theLi.myCanvas.bubble.clearTimers();
        theLi.myCanvas.bubble.clearArr();
        theLi.myCanvas.pen.clearRect(0, 0, theLi.myCanvas.width, theLi.myCanvas.height);
        theLi.myCanvas.remove();
    };
    
    for(var i=0; i<lis.length; i++){
        lis[i].addEventListener("mouseenter", function (){
            for(var j=0; j<lis.length; j++){
                lis[j].style.opacity = "0.5";
            };
            this.style.opacity = "1";    // 排他 高亮
    
            addCanvas(this);    // 开启 气泡特效
        }, false);
    
        lis[i].addEventListener("mouseleave", function (){
            stopBubbles(this);    // 关闭 气泡特效
        }, false);
    };
    
    teams.addEventListener("mouseleave", function (){
        for(var j=0; j<lis.length; j++){
            lis[j].style.opacity = "1";    // 全部 高亮
        };
    }, false);
};

/**** 回调函数 ****/
var callBack = {
    "ulContent": document.getElementById("ul_content"),
    "wheelup": function () {    // 滚轮 上滑上一屏
        if(isOkay && this.ulContent.screenindex > 1){
            screenSwitch(this.ulContent.screenindex-1, callBack);
        };
    },
    "wheeldown": function () {    // 滚轮 下滑下一屏
        if(!this.ulContent.screenindex){
            this.ulContent.screenindex = 1;
        };
        if(isOkay && this.ulContent.screenindex < document.querySelectorAll("#header_nav>ul>li").length){
            screenSwitch(this.ulContent.screenindex+1, callBack);
        };
    },
    // 第 1 屏动画
    "enterShow1": function (ele) {
        var switchPhotos = document.getElementById("switch_photos");
        switchPhotos.style.top = "0px";
        switchPhotos.style.opacity = "1";
        
        var switchPoints = document.getElementById("switch_points");
        switchPoints.style.bottom = "0px";
        switchPoints.style.opacity = "1";
    },
    "leaveShow1": function (ele) {
        var switchPhotos = document.getElementById("switch_photos");
        switchPhotos.style.top = "-150px";
        switchPhotos.style.opacity = "0";
    
        var switchPoints = document.getElementById("switch_points");
        switchPoints.style.bottom = "-150px";
        switchPoints.style.opacity = "0";
    },
    
    // 第 2 屏动画
    "enterShow2": function (ele) {
        var aPlane = document.getElementById("a_plane");
        aPlane.style.left = "300px";
        aPlane.style.top = "-100px";
        
        var bPlane = document.getElementById("b_plane");
        bPlane.style.left = "-100px";
        bPlane.style.bottom = "70px";
        
        var cPlane = document.getElementById("c_plane");
        cPlane.style.left = "300px";
        cPlane.style.bottom = "-60px";
    },
    "leaveShow2": function (ele) {
        var aPlane = document.getElementById("a_plane");
        aPlane.style.left = "150px";
        aPlane.style.top = "-250px";
    
        var bPlane = document.getElementById("b_plane");
        bPlane.style.left = "-250px";
        bPlane.style.bottom = "-80px";
    
        var cPlane = document.getElementById("c_plane");
        cPlane.style.left = "450px";
        cPlane.style.bottom = "90px";
    },
    
    // 第 3 屏动画
    "enterShow3": function (ele) {
        var aPencil = document.getElementById("a_pencil");
        aPencil.style.left = "500px";
        aPencil.style.top = "0px";
    
        var bPencil = document.getElementById("b_pencil");
        bPencil.style.left = "300px";
        bPencil.style.top = "250px";
    
        var cPencil = document.getElementById("c_pencil");
        cPencil.style.left = "650px";
        cPencil.style.top = "300px";
    },
    "leaveShow3": function (ele) {
        var aPencil = document.getElementById("a_pencil");
        aPencil.style.left = "500px";
        aPencil.style.top = "-150px";
    
        var bPencil = document.getElementById("b_pencil");
        bPencil.style.left = "300px";
        bPencil.style.top = "400px";
    
        var cPencil = document.getElementById("c_pencil");
        cPencil.style.left = "650px";
        cPencil.style.top = "450px";
    },
    
    // 第 4 屏动画
    "enterShow4": function (ele) {
        var topBreak = document.querySelector("#abouts>.top_break");
        topBreak.style.transform = "rotateZ(0)";
        
        var bottomBreak = document.querySelector("#abouts>.bottom_break");
        bottomBreak.style.transform = "rotateZ(0)";
    },
    "leaveShow4": function (ele) {
        var topBreak = document.querySelector("#abouts>.top_break");
        topBreak.style.transform = "rotateZ(45deg)";
        
        var bottomBreak = document.querySelector("#abouts>.bottom_break");
        bottomBreak.style.transform = "rotateZ(-45deg)";
    },
    
    // 第 5 屏动画
    "enterShow5": function (ele) {
        var fiveTitle = document.getElementById("five_title");
        var fiveText = document.getElementById("five_text");
    
        fiveTitle.style.left = "0px";
        fiveText.style.left = "0px";
    },
    "leaveShow5": function (ele) {
        var fiveTitle = document.getElementById("five_title");
        var fiveText = document.getElementById("five_text");
    
        fiveTitle.style.left = "-150px";
        fiveText.style.left = "150px";
    },
};

window.onload = function(){
    screensHeightInit();  			   // lis 屏 初始化 height
    window.onresize = windowResize;    // 处理 浏览器缩放
    LoadingAnimation();                // 开机动画
    screenSwitch(1, callBack);  				   // 屏幕切到第 1 屏
    
    navClick();     				   // 导航点击 切屏
    pointClick();                      // 小圆点点击 切屏
    bindScrollEvent(callBack); 		   // 滚轮 切屏
    hoverBubble();                     // 悬浮气泡
};
