const express = require('express');
const timeout = require('connect-timeout'); // 모듈 추가
const rateLimit = require('express-rate-limit'); // express-rate-limit 모듈 추가
const app = express();
const port = 3000;

// JSON 바디 파싱을 위한 미들웨어
app.use(express.json());

// 요청 타임아웃 설정 (예: 5초)
app.use(timeout('5s'));

// 타임아웃 에러 핸들링 미들웨어
app.use((req, res, next) => {
    if (req.timedout) {
        return res.status(503).json({ message: 'Request timed out!' });
    }
    next();
});

// 요청 제한 미들웨어 설정 (1분에 100번 요청만 허용)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분 동안
  max: 100, // 1분에 최대 100번 요청 허용
  message: "Too many requests from this IP, please try again after a minute."
});

// 모든 요청에 대해 rate limiter 미들웨어 적용
app.use(limiter);

// 데이터 저장용 임시 배열
let myBag = [];

// GET 요청 예제
app.get('/items', (req, res) => {
    res.status(200).json({ myBag });
});

// POST 요청 예제
app.post('/items', (req, res) => {
    const newItem = req.body; // 요청 본문에서 새로운 아이템을 가져옴
    myBag.push(newItem); // 배열에 추가
    res.status(201).json({ message: 'Item added', myBag }); // 현재 myBag 상태 반환
});

// PUT 요청 예제 (전체 업데이트)
app.put('/items/:id', (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    if (myBag[id]) {
        myBag[id] = updatedItem;
        res.status(200).json({ message: 'Item updated', myBag: updatedItem });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// PATCH 요청 예제 (부분 업데이트)
app.patch('/items/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    if (myBag[id]) {
        myBag[id] = { ...myBag[id], ...updates }; // 기존 아이템에 업데이트 적용
        res.status(200).json({ message: 'Item updated', item: myBag[id] });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// DELETE 요청 예제
app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    if (myBag[id]) {
        myBag.splice(id, 1); // 배열에서 삭제
        res.status(204).send(); // 성공적으로 삭제된 경우 내용 없는 응답
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
