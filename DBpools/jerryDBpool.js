// .env 파일에서 환경 변수 로드
import dotenv from 'dotenv';
dotenv.config();

// 'mysql2/promise의 promise 모듈 불러옴 (비동기 작업)
import mysql from 'mysql2/promise';

// DB 연결 풀 생성
const jerrydb = mysql.createPool({
    host: process.env.DB_HOST,        // .env 파일에서 가져온 값
    user: process.env.DB_USER,        // .env 파일에서 가져온 값
    password: process.env.DB_PASSWORD, // .env 파일에서 가져온 값
    database: process.env.DB_NAME     // .env 파일에서 가져온 값
});

// 연결 풀 외부 내보내기
export default jerrydb;