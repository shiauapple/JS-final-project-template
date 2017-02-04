var FPS =60;
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var button = document.createElement("img");
var towerimg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/86363.png";
button.src = "images/tower-btn.png";
towerimg.src = "images/tower.png";

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	enemy.move();
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(enemyImg,enemy.x,enemy.y);
	ctx.drawImage(button,640-64,480-64,64,64);
	if(isBuilding==true){
		ctx.drawImage(towerimg,cursor.x,cursor.y);
	}else{
		ctx.drawImage(towerimg,tower.x,tower.y);
	}
}

// 執行 draw 函式
setInterval(draw, 1000/FPS);

var  enemy ={
x: 64,
y: 480-32,
speedX:0,
speedY:-64,
move:function(){
	this.x+=this.speedX/FPS;
	this.y+=this.speedY/FPS;
}
};
 
 var  cursor ={
x: 96,
y: 480-32
};

var tower = {
x:0,
y:0
}

	$("#game-canvas").on("mousemove",mousemove);
function mousemove(event){

cursor.x=event.offsetX
cursor.y=event.offsetY
}
var isBuilding=false

isBuilding=false
$("#game-canvas").on("click",mouseclick)
function mouseclick(event){
	if (cursor.x>576&cursor.y>416){
		isBuilding=true
	}else{
		//蓋塔
		if(isBuilding ==true){
			tower.x=cursor.x-cursor.x%32;
			tower.y=cursor.y-cursor.y%32;
		}
		//建造完成
    	isBuilding=false
	}
}





