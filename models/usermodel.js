// user 관련 모델임
// db연결 풀 가져오기
import jerrydb from '../DBpools/jerryDBpool.js';

// 유저 생성하는 createUser (쿼리문 삽입)
const createUser = async ({nickname,email,password,profile_imgPath}) => {
    const sql = `
        INSERT INTO users (nickname,email,password,profile_img)
        VALUES (?,?,?,?)
    `;
    
    try {
        // 쿼리 실행 후 결과 반환    execute 메서드는 ? 자리에 값을 대체함
        const [result] = await jerrydb.execute(sql,[nickname,email,password,profile_imgPath])

        // 삽입 데이터의 고유 ID 반환(user_id) (AI(Auto Increment))
        return result.insertId;
    } catch (err) {
        // 오류 발생시 콘솔에 에러 메세지 출력
        console.error('회원 정보 삽입 중 오류 발생', err.message, err.code);
        // 유니크 키 제약 조건 오류 처리
        // if (err.code === 'ER_DUP_ENTRY') {
        //     if (err.message.includes('unique_email')) {
        //         throw new Error('* 중복된 이메일 입니다.mmm');
        //     }
        //     if (err.message.includes('unique_nickname')) {
        //         throw new Error('* 중복된 닉네임입니다.mmm');
        //     }
        // }
        throw err;
    }
}



// 회원정보수정페이지 유저정보 가져오기
const getUserById = async (user_id) => {
    const sql = `SELECT email, nickname, profile_img FROM users WHERE user_id = ?`;
    // pool 과 execute 차이
    const [rows] = await jerrydb.query(sql, [user_id]);
    return rows[0];
}

// 회원정보수정 (닉네임 변경)
const updateUserNickname = async (user_id, nickname) => {
    console.log('닉네임 수정 하기 user_id:', user_id, 'nickname:', nickname);  // 값 확인
    const sql = `UPDATE users SET nickname = ? WHERE user_id = ?`;
    const [result] = await jerrydb.query(sql, [nickname, user_id]);

    // console.log(result.affectedRows);
    return result;
}

// 비밀번호 변경
const updatePassword = async (user_id, hashedPassword) => {
    const sql = `UPDATE users SET password = ? WHERE user_id = ?`;
    const[result] = await jerrydb.execute(sql, [hashedPassword, user_id]);
    console.log('쿼리실행결과 : ',result);
    return result;
}

// 사용자 탈퇴 기능
const deleteUser = async (user_id) => {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    const [result] = await jerrydb.execute(sql,[user_id]);
    return result;
}

// 닉네임으로 사용자 찾기 (닉네임 중복검사)
const findUserByNickname = async (nickname) => {
    const sql = `SELECT * FROM users WHERE nickname = ?`;

    try {
        const [rows] = await jerrydb.execute(sql,[nickname]);
        // 조회된 사용자 있으면 rows.length > 0 이 됨
        // 조회된 사용자 없으면 null 반환
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('닉네임 조회 중 에러 발생', err.message);
        throw err;
    }
}

// 로그인 시 사용, 회원가입 중복검사 시 사용
const findUserByEmail = async (email) => {
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

// 모델 익스포트
export default {
    createUser,
    findUserByEmail,
    getUserById,
    updateUserNickname,
    updatePassword,
    deleteUser,
    findUserByNickname,
};

