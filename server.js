// server.js
const express = require('express');
const timeout = require('connect-timeout'); // connect-timeout 모듈
const rateLimit = require('express-rate-limit'); // express-rate-limit 모듈
const itemRoutes = require('./routes/itemRoutes'); // Routes 가져오기 (예전 제리가방)
const postRoutes = require('./routes/postRoutes'); // 게시물  route 등록
const userRoutes = require('./routes/userRoutes'); // 회원가입 route 등록
const commentRoutes = require('./routes/commentRoutes'); // 댓글 route
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');   // 이미지 정적 경로? 
const session = require('express-session'); // 쿠키 세션
const cookieParser = require('cookie-parser');

app.use(cookieParser());
// 쿠키 세션 설정
app.use(session({
    secret: 'jerryKey',  // 세션 암호화 키
    resave: false,       // 매 요청마다 세션 저장
    saveUninitialized: true, // 초기화되지 않은 세션 저장 옵션
    cookie: {
        httpOnly: false,
        secure: false,
    }  
}));

// 모든 출처에서 오는 요청을 허용
app.use(cors({
    origin: 'http://localhost:5500', // 클라이언트 도메인 명시
    credentials: true, // 인증 정보를 포함하도록 설정
})); 

app.get('/set-session', (req, res) => {
    req.session.key = 'value'; // 세션에 저장
    res.send('세션에 값 저장 완료');
});

// uploads 폴더를 (이미지) 정적 파일로 제공하도록 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JSON 바디 파싱 미들웨어
app.use(express.json());
// 폼데이터 파싱할 수 있는 설정
app.use(express.urlencoded({extended:true}));
// 요청 타임아웃 설정 (5초)
// app.use(timeout('20s'));
// 타임아웃 에러 핸들링 미들웨어
app.use((req, res, next) => {
    // if (req.timedout) {
    //     return res.status(503).json({ message: 'Request timed out!' });
    // }    
    // console.log('Request Cookies:', req.cookies);
    // console.log('Request Session:', req.session); // 쿠키세션 로그 확인

    next();
});
// 요청 제한 미들웨어 설정 (1분에 100번 요청만 허용)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분 동안
    max: 100, // 1분에 최대 100번 요청 허용
    message: 'Too many requests from this IP, please try again after a minute.',
});
// 모든 요청에 대해 rate limiter 미들웨어 적용
app.use(limiter);


// /api/posts 경로에 postRoutes 연결 (게시물 업로드, 보기 라우터)
app.use('/api/posts',postRoutes);
// 댓글 routes
app.use('/api/posts',commentRoutes);

// /api/users경로로 회원가입 라우트 연결
app.use('/api/users',userRoutes);

// 댓글 수정, 삭제
app.use('/api/posts/comments',commentRoutes);

// 서버 시작
app.listen(port, () => {
    console.log(`BE 서버 시작 : http://localhost:${port}`);
});