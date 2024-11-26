// 'mysql2/promise의 promise 모듈 불러옴 (비동기 작업)
const mysql = require('mysql2/promise');

// DB 연결 풀 생성
const jerrydb = mysql.createPool({
    host :'localhost',
    user :'jerry',
    password :'1561',
    database : 'jerryCommunity',
});

// 연결 풀 외부 내보내기
module.exports = jerrydb;