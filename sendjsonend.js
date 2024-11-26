const express = require('express');
const app = express();
const port = 3000;

// JSON 바디 파싱을 위한 미들웨어
app.use(express.json());

// send() 사용 예제
app.post('/send-example', (req, res) => {
    res.send('response.send() 메서드');
});

// json() 사용 예제
app.post('/json-example', (req, res) => {
    res.json({ message: 'response.json() 메서드' });
});

// end() 사용 예제
app.post('/end-example', (req, res) => {
    res.write('response.end() 메서드');
    res.end();
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
