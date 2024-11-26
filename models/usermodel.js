// user 관련 모델임
// db연결 풀 가져오기
const jerrydb = require('../DBpools/jerryDBpool');

// 유저 생성하는 createUser (쿼리문 삽입)
// !!!!!!!!!!!!!유저 프로필 이미지 아직 없음
async function createUser({nickname,email,password,profile_imgPath}) {
    // profile_imgPath = profile_imgPath || null;
    const sql = `
        INSERT INTO users (nickname,email,password,profile_img)
        VALUES (?,?,?,?)
    `;
    
    try {
        // 쿼리 실행 후 결과 반환    execute 메서드는 ? 자리에 값을 대체함
        const [result] = await jerrydb.execute(sql,[nickname,email,password,profile_imgPath])

        // 삽입 데이터의 고유 ID 반환(user_id) (AI(Auto Increment))
        return result.insertId;
        console.log('회원가입 성공');
    } catch (err) {
        // 오류 발생시 콘솔에 에러 메세지 출력
        console.error('회원 정보 삽입 중 오류 발생', err.message);
        throw err;
    }
}

async function findUserByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;

    try {
        // execute는 ? 자리에 email값 대체하는 메서드
        const[rows] = await jerrydb.execute(sql,[email]);

        // rows.length 값 출력 (사용자 정보가 있으면 1 이상, 없으면 0)
        console.log('조회된 사용자 수:', rows.length);
        
        // 사용자 존재시 첫 번째 사용자 정보가 rows[0]에 저장, 사용자 없으면 null 값
        return rows.length > 0 ? rows[0] : null;
        

    } catch (err) {
        console.error('이메일 사용자 조회 중 오류 발생',err.message);
        throw err;
    }
}

// 회원정보수정페이지 유저정보 가져오기
async function getUserById(user_id){
    const sql = `SELECT email, nickname, profile_img FROM users WHERE user_id = ?`;
    // pool 과 execute 차이
    const [rows] = await jerrydb.query(sql, [user_id]);
    return rows[0];
}

// 회원정보수정 (닉네임 변경)
async function updateUserNickname(user_id, nickname) {
    console.log('닉네임 수정 하기 user_id:', user_id, 'nickname:', nickname);  // 값 확인
    const sql = `UPDATE users SET nickname = ? WHERE user_id = ?`;
    const [result] = await jerrydb.query(sql, [nickname, user_id]);

    // console.log(result.affectedRows);
    return result;
}

// 비밀번호 변경
async function updatePassword(user_id, hashedPassword){
    const sql = `UPDATE users SET password = ? WHERE user_id = ?`;
    const[result] = await jerrydb.execute(sql, [hashedPassword, user_id]);
    console.log('쿼리실행결과 : ',result);
    return result;
}

// 사용자 탈퇴 기능
async function deleteUser(user_id) {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    const [result] = await jerrydb.execute(sql,[user_id]);
    return result;
}

// 모델 익스포트
module.exports = {
    createUser,
    findUserByEmail,
    getUserById,
    updateUserNickname,
    updatePassword,
    deleteUser,
};

