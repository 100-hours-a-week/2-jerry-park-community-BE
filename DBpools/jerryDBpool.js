// 'mysql2/promise의 promise 모듈 불러옴 (비동기 작업)
import mysql from 'mysql2/promise';
// .env 파일에서 환경 변수 로드
import dotenv from 'dotenv';

dotenv.config();



// DB 연결 풀 생성
const jerrydb = mysql.createPool({
    host: process.env.DB_HOST,        // .env 파일에서 가져온 값
    user: process.env.DB_USER,        // .env 파일에서 가져온 값
    password: process.env.DB_PASSWORD, // .env 파일에서 가져온 값
    database: process.env.DB_NAME,     // .env 파일에서 가져온 값
    port: process.env.DB_PORT // RDS 포트 (기본 3306)
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// const jerrydb = mysql.createPool({
//     host: 'jerrycommunity.amazonaws.com',        // .env 파일에서 가져온 값
//     user: 'admin',        // .env 파일에서 가져온 값
//     password: '', // .env 파일에서 가져온 값
//     database: 'jerryCommunityDB',    // .env 파일에서 가져온 값
//     port: '=', // RDS 포트 (기본 3306)
// });

// 연결 테스트
(async () => {
    try {
        const connection = await jerrydb.getConnection();
        console.log("RDS DB 연결 성공!");
        connection.release();
    } catch (error) {
        console.error("RDS DB 연결 실패:", error);
    }
})();

// 연결 풀 외부 내보내기
export default jerrydb;