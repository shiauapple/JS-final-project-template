var FPS =60;
var clock = 0;
var hp = 100;
var Score =-1;
var Money =95;
var kill = 0;

// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var button = document.createElement("img");
var towerimg = document.createElement("img");
var crosshairimg=document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/86363.png";
button.src = "images/tower-btn.png";
towerimg.src = "images/tower.png";
crosshairimg.src="images/crosshair.png";
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;



	if((clock%80)==0){
		var newEnemy = new Enemy();
		enemies.push(newEnemy);
	}
	
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	for (var i=0;i<enemies.length;i++){
		if(enemies[i].hp<=0){
			enemies.splice(i,1);
			Money+=5
			Score+=1
			kill+=0.5
		}else{
		
		enemies[i].move();
			ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y);}
	}
	for (var i=0;i<towers.length;i++){ 
		ctx.drawImage(towerimg,towers[i].x,towers[i].y);
		towers[i].searchEnemy();
		if(towers[i].aimingEnemyId != null){
			var id = towers[i].aimingEnemyId;
			console.log(id)
			ctx.drawImage(crosshairimg,enemies[id].x,enemies[id].y);
		}
	}
	ctx.fillText("分數:"+Score,0,40)
	ctx.fillText("金錢:"+Money,0,60)
	ctx.fillText("HP:"+hp,0,20)
	ctx.font="24px Arial";
	ctx.fillStyle="white";
	ctx.drawImage(button,640-64,480-64,64,64);
	if(isBuilding==true){
		ctx.drawImage(towerimg,cursor.x,cursor.y);}

	if(hp <= 0){
		clearInterval(intervalID);
		ctx.font="64px Arial";
		ctx.fillStyle="white";
		ctx.fillText("Game over",150,240);
		alert("Game over")


	}

}

// 執行 draw 函式
var intervalID= setInterval(draw, 1000/FPS);

var enemyPath=[
{x:64,y:352},
{x:128,y:352},
{x:128,y:224},
{x:288,y:224},
{x:288,y:384},
{x:576,y:384},
{x:576,y:224},
{x:448,y:224},
{x:448,y:0},
{x:320,y:0},
{x:320,y:96},
{x:128,y:96},
];

function Enemy (){
	this.x = 64;
	this.y = 480-32;
	this.hp = kill;
	this.speedX = 0;
	this.speedY = -64-(clock/100);
	this.PathDes = 0;
	this.move = function(){
		if(isCollided(enemyPath[this.PathDes].x,enemyPath[this.PathDes].y,this.x,this.y,(64+clock/100)/FPS,(64+clock/100)/FPS)){
				this.x = enemyPath[this.PathDes].x;
				this.y = enemyPath[this.PathDes].y;

			this.PathDes++;
			if(this.PathDes == enemyPath.length){
				this.hp = 0;
				hp-= 10;
				return;
			}

			if(enemyPath[this.PathDes].y < this.y){
				this.speedX=0;
				this.speedY=-64-(clock/100)	;
			}else if(enemyPath[this.PathDes].x > this.x){
				this.speedX=64+(clock/100);
				this.speedY=0	;
			}else if(enemyPath[this.PathDes].y > this.y) {
				this.speedX=0;
				this.speedY=64+(clock/100)	;
			}else if(enemyPath[this.PathDes].x < this.x) {
				this.speedX=-64-(clock/100);
				this.speedY=0	;
			}
		}else{
			this.x+=this.speedX/FPS;
			this.y+=this.speedY/FPS;
		}
	}
 }
 var enemies = [];

 var  cursor ={
x: 96,
y: 480-32
};

function Tower(){
	this.x=0;
	this.y=0;
	this.range=96;
	this.aimingEnemyId=null;
	this.searchEnemy= function(){
		this.readyToShootTime-= 1/FPS;
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if(this.readyToShootTime<=0){
					this.shoot(i);
					this.readyToShootTime = this.fireRate;

				}
				return;
			}
		}
		// 如果都沒找到，會進到這行，清除鎖定的目標
		this.aimingEnemyId = null;
	},
	this.shoot=function(id){
		ctx.beginPath();
		ctx.moveTo(this.x+16,this.y+16);
		ctx.lineTo(enemies[id].x+16,enemies[id].y+16);
		ctx.strokeStyle='red';
		ctx.lineWidth=3;
		ctx.stroke();
		enemies[id].hp -= this.damage;
	},
	this.fireRate=0.5;
	this.readyToShootTime=0.5;
	this.damage=1;
}
var towers = [];

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
			if( Money >= 10 ){
				var newTower = new Tower()
				newTower.x=cursor.x-cursor.x%32;
				newTower.y=cursor.y-cursor.y%32;
				towers.push(newTower);
				Money -=10;
			}
		}
		//建造完成
    	isBuilding=false
	}
}

function isCollided(pointX,pointY,targetX,targetY,targetWidth,targetHeight){
	if(targetX <= pointX &&
			pointX <= targetX + targetWidth &&	
		targetY <= pointY && 
			pointY <= targetY + targetHeight){
		return true
	}else{
		return false
	}
}



