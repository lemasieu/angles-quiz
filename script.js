let angle, point, line1, line2, ray, angleName, correctAnswer, questionType, correctAngleValue;
let correctCount = 0;
let totalCount = 0;

function setup() {
  let canvasSize = min(windowWidth * 0.9, 400);
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('sketch-holder');
  angleMode(DEGREES);
  generateQuestion();
}

function generateQuestion() {
  angle = floor(random(20, 161));
  point = random(['O', 'P', 'Q', 'R']);
  let lines = [['c', 'd'], ['h', 'k'], ['x', 'y'], ['m', 'n']];
  line1 = random(lines);
  // Chỉ còn 2 loại câu hỏi: kề bù và đối đỉnh
  questionType = random(['adjacent180', 'opposite']);

  let questionText = '';
  if (questionType === 'adjacent180') {
    let rays = ['t', 'z', 'p', 'q'];
    ray = random(rays);
    angleName = `${line1[0]}${point}${ray}`;
    correctAnswer = `${line1[1]}${point}${ray}`;
    correctAngleValue = 180 - angle;
    questionText = `Góc \\(\\widehat{${angleName} } = ${angle}^\\circ\\). Tìm góc kề bù (tên góc và số đo).`;
    line2 = null;
  } else if (questionType === 'opposite') {
    line2 = random(lines.filter(l => l !== line1));
    angleName = `${line1[0]}${point}${line2[0]}`;
    correctAnswer = `${line2[1]}${point}${line1[1]}`;
    questionText = `Hãy tìm góc đối đỉnh với \\(\\widehat{${angleName} }\\).`;
    ray = '';
  }
  document.getElementById('question').innerHTML = questionText;
  document.getElementById('answer').value = '';
  document.getElementById('angleAnswer').value = '';
  document.getElementById('feedback').innerText = '';
  // Hiện/ẩn input số đo
  document.getElementById('angleInputWrap').style.display = (questionType === 'opposite') ? 'none' : 'block';
  if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
  document.getElementById('newQuestionBtn').disabled = true;
  document.getElementById('checkBtn').disabled = false;
}

function draw() {
  background(224);
  translate(width / 2, height / 2);
  strokeWeight(2);

  // Vẽ đường thẳng ngang (line1)
  line(-100, 0, 100, 0);
  textSize(16);
  textAlign(CENTER);

  // Vẽ nhãn đầu ngang bên trái/phải nếu khác point
  if (line1[0] !== point) text(line1[0], -100, 20);
  if (line1[1] !== point) text(line1[1], 100, 20);

  if (questionType === 'adjacent180') {
    // Vẽ tia (ray) xoay và nhãn đứng thẳng tại đầu tia
    push();
    rotate(-90 + angle);
    line(0, 0, 0, -100);
    // Đặt nhãn ray đứng thẳng, không bị nghiêng
    push();
    translate(0, -110);
    rotate(90 - angle); // Xoay ngược lại để chữ đứng thẳng
    text(ray, 0, 0);
    pop();
    pop();
  } else if (questionType === 'opposite') {
    // Vẽ đường thẳng thứ hai liền mạch, đối xứng qua trung tâm
    push();
    rotate(-90 + angle);
    line(0, 0, 0, -100);
    let x1 = 0, y1 = -100, x2 = 0, y2 = 100;
    line(x1, y1, x2, y2);
    // Nhãn đầu trên (line2[0]) đứng thẳng
    push();
    translate(x1, y1 - 10);
    rotate(90 - angle);
    text(line2[0], 0, 0);
    pop();
    // Nhãn đầu dưới (line2[1]) đứng thẳng
    push();
    translate(x2, y2 + 20);
    rotate(90 - angle);
    text(line2[1], 0, 0);
    pop();
    pop();
  }

  // Gắn nhãn điểm giao
  text(point, 0, 15);
}

function windowResized() {
  let canvasSize = min(windowWidth * 0.9, 400);
  resizeCanvas(canvasSize, canvasSize);
}

function newQuestion() {
  generateQuestion();
  redraw();
  document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
  let userAnswer = document.getElementById('answer').value.trim();
  let userAngle = parseInt(document.getElementById('angleAnswer').value);
  let feedback = document.getElementById('feedback');
  let reverseAnswer = `${correctAnswer[2]}${correctAnswer[1]}${correctAnswer[0]}`;

  // Vô hiệu hóa nút kiểm tra sau khi trả lời
  document.getElementById('checkBtn').disabled = true;

  if (questionType === 'opposite') {
    if (userAnswer === correctAnswer || userAnswer === reverseAnswer) {
      feedback.innerHTML = `Đúng! Góc đối đỉnh với \\(\\widehat{${angleName} }\\) là \\(\\widehat{${correctAnswer} }\\).`;
      feedback.style.color = 'green';
      correctCount++;
    } else {
      feedback.innerHTML = `Sai! Góc đối đỉnh với \\(\\widehat{${angleName} }\\) là \\(\\widehat{${correctAnswer} }\\) hoặc \\(\\widehat{${reverseAnswer} }\\).`;
      feedback.style.color = 'red';
    }
  } else {
    if (userAnswer === correctAnswer || userAnswer === reverseAnswer) {
      if (userAngle === correctAngleValue) {
        feedback.innerHTML = `Đúng! Góc kề bù với \\(\\widehat{${angleName} }\\) là \\(\\widehat{${correctAnswer} } = ${correctAngleValue}^\\circ\\).`;
        feedback.style.color = 'green';
        correctCount++;
      } else {
        feedback.innerHTML = `Sai! Số đo góc kề bù với \\(\\widehat{${angleName} }\\) là \\(${correctAngleValue}^\\circ\\), không phải \\(${userAngle}^\\circ\\).`;
        feedback.style.color = 'red';
      }
    } else {
      feedback.innerHTML = `Sai! Góc kề bù với \\(\\widehat{${angleName} }\\) là \\(\\widehat{${correctAnswer} }\\) hoặc \\(\\widehat{${reverseAnswer} } = ${correctAngleValue}^\\circ\\).`;
      feedback.style.color = 'red';
    }
  }
  if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
  totalCount++;
  updateStats();
  document.getElementById('newQuestionBtn').disabled = false;
}

function updateStats() {
  let ratio = totalCount > 0 ? (correctCount / totalCount * 100).toFixed(1) : 0;
  document.getElementById('stats').innerText = `Số câu đúng: ${correctCount}, Tổng số câu: ${totalCount}, Tỷ lệ đúng: ${ratio}%`;
}

document.getElementById('toggleTheme').addEventListener('click', function() {
  document.body.classList.toggle('light-theme');
  this.textContent = document.body.classList.contains('light-theme') ? 'Dark Theme' : 'Light Theme';
});