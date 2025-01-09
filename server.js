// server.js
import express from 'express';
import timeout from 'connect-timeout'; // connect-timeout 모듈
import rateLimit from 'express-rate-limit'; // express-rate-limit 모듈
import cors from 'cors';
import path from 'path';   // 이미지 정적 경로
import session from 'express-session'; // 쿠키 세션
import cookieParser from 'cookie-parser';
import colors from 'colors'; // colors 패키지
import moment from 'moment'; // moment 패키지
import helmet from 'helmet';

import postRoutes from './routes/postRoutes.js'; // 게시물  route 등록
import userRoutes from './routes/userRoutes.js'; // 회원가입 route 등록
import commentRoutes from './routes/commentRoutes.js'; // 댓글 route

const app = express();
const port = 3000;

// 보안 헤더 설정 추가
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"], // 현재 도메인에서만 리소스를 로드
        styleSrc: ["'self'", "'unsafe-inline'"], // 스타일 출처 허용
        imgSrc: ["'self'",'http://localhost:3000'], // 이미지 로드 허용 출처
        scriptSrc:  ["'self'", "'unsafe-inline"], // 스크립트 로드 허용 출처
        objectSrc: ["'none'"], // 플래시, 플러그인 허용 금지
    },
}));
// cross-origin-resource-policy 설정
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-site' }));

// HSTS 설정 : HTTPS 강제 적용
// app.use(helmet.hsts({
//     maxAge: 31536000, // 1년 HTTPS 강제
//     includeSubDomains: true, // 모든 서브도메인에 적용
// }));
// XSS 방지
// app.use(helmet.xssFilter());
// 클릭재킹 방지
// app.use(helmet.frameguard({action:'sameorigin'}));


// 쿠키 세션 설정
app.use(cookieParser());
app.use(session({
    secret: 'jerryKey',  // 세션 암호화 키
    resave: false,       // 매 요청마다 세션 저장
    saveUninitialized: true, // 초기화되지 않은 세션 저장 옵션
    cookie: {
        httpOnly: false,
        secure: false,
    }  
}));

// cors 설정
app.use(cors({
    origin: 'http://localhost:5500', // 클라이언트 도메인 명시
    credentials: true, // 인증 정보를 포함하도록 설정
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용 헤더 명시
})); 

// __dirname을 대신하여 import.meta.url을 사용하여 디렉토리 경로 계산 (ES6)
// decodeURIComponent는 URL에서 인코딩된 문자열을 원래의 형태로 복원하는 함수
const __dirname = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
// uploads 폴더를 정적 파일로 제공하도록 설정 잡다한 설정 제거
app.use('/uploads', express.static('uploads'));


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
    console.log(`BE 서버 시작 : http://localhost:${port}`.green);
});
console.log(`서버가 시작된 시간: ${moment().format('YYYY-MM-DD HH:mm:ss')}`.blue);