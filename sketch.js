// 全域變數
let shapes = [];
let song;
let amplitude;

// 外部定義的二維陣列，做為多邊形頂點的基礎座標 (例如一個六邊形)
let points = [
  [-2, -3.5],
  [2, -3.5],
  [4, 0],
  [2, 3.5],
  [-2, 3.5],
  [-4, 0]
];

function preload() {
  // 在程式開始前預載入外部音樂資源
  // 使用 loadSound() 載入音檔並將其賦值給全域變數 song
  // 請確保專案目錄下有此檔案，或替換為有效的音檔路徑
  song = loadSound('midnight-quirk-255361.mp3');
}

function setup() {
  // 初始化畫布、音樂播放狀態與生成多邊形物件
  // 使用 createCanvas(windowWidth, windowHeight) 建立符合視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 將變數 amplitude 初始化為 new p5.Amplitude()
  amplitude = new p5.Amplitude();

  // 使用 for 迴圈產生 10 個形狀物件，並 push 到 shapes 陣列中
  for (let i = 0; i < 10; i++) {
    // 透過 map() 讀取全域陣列 points，將每個頂點的 x 與 y 分別乘上 10 到 30 之間的隨機倍率來產生變形
    let shapePoints = points.map(pt => {
      return [pt[0] * random(10, 30), pt[1] * random(10, 30)];
    });

    let shape = {
      x: random(0, windowWidth),
      y: random(0, windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scale: random(1, 10),
      color: color(random(255), random(255), random(255)),
      points: shapePoints
    };

    shapes.push(shape);
  }

  // 循環播放音樂
  song.loop();
}

function draw() {
  // 每幀重複執行，處理背景更新、抓取音量與繪製動態圖形
  // 設定背景顏色為 '#ffcdb2'
  background('#ffcdb2');
  
  // 設定邊框粗細 strokeWeight(2)
  strokeWeight(2);

  // 透過 amplitude.getLevel() 取得當前音量大小（數值介於 0 到 1），存入變數 level
  let level = amplitude.getLevel();

  // 使用 map() 函式將 level 從 (0, 1) 的範圍映射到 (0.5, 2) 的範圍，並存入變數 sizeFactor 做為音量縮放倍率
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 使用 for...of 迴圈走訪 shapes 陣列中的每個 shape 進行更新與繪製
  for (let shape of shapes) {
    // 位置更新：將 shape.x 加上 shape.dx，shape.y 加上 shape.dy
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) shape.dx *= -1;
    if (shape.y < 0 || shape.y > windowHeight) shape.dy *= -1;

    // 設定外觀
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與縮放
    push();
    translate(shape.x, shape.y); // 將原點移動到形狀座標
    scale(sizeFactor); // 依照音樂音量縮放圖形

    // 繪製多邊形
    beginShape();
    for (let pt of shape.points) {
      vertex(pt[0], pt[1]);
    }
    endShape(CLOSE);

    // 狀態還原
    pop();
  }
}

// 額外功能：點擊滑鼠以啟動音訊環境（解決瀏覽器自動播放限制）
function mousePressed() {
  userStartAudio();
}
