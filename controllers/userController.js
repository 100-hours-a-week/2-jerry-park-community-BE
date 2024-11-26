// 이 컨트롤러는 회원가입 요청을 처리한다.
// 모델 가져오기
const usermodel = require('../models/usermodel');
const bcrypt = require('bcryptjs'); // bcrypt 라이브러리 가져오기 (비밀번호 해싱)

// req(요청객체(닉네임,이메일,비밀번호 등)), res(응답객체)
async function registerUser(req, res) {
    // 요청 본문에서 nickname, email, password를 추출해 변수에 할당
    const { nickname, email, password } = req.body;
    let profile_imgPath = null;

    // 이미지 업로드시 경로 저장
    if (req.file) {
        profile_imgPath = `/uploads/${req.file.filename}`;
    }
    
    try {
        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(password,10);

        // usermodel의 createUser 함수 호출해 새 사용자 추가
        const newUserId = await usermodel.createUser({nickname, email, password: hashedPassword, profile_imgPath});

        // 성공적으로 유저 생성되면 클라에 응답 (201성공)
        res.status(201).json({
            message: '회원가입 완료',
            user_id: newUserId,
        });
    } catch (err){
        res.status(500).json({
            message : '회원가입 오류 발생',
            error: err.message,
        })
    }
}

async function loginUser(req,res){
    const {email, password}= req.body;
    console.log(req.body); // 요청 본문을 로그로 출력하여 확인

    try { 
        // 이메일로 사용자 검색
        const user = await usermodel.findUserByEmail(email);
        
        // 사용자 없으면 로그인 실패
        if (!user) {
            return res.status(400).json({message: '이메일 또는 비밀번호가 일치하지 않습니다.'});
        }
    // bcrypt 작동하는지 확인
    console.log('입력된 비밀번호:', password);
    console.log('해싱된 비밀번호:', user.password); 
    console.log('입력된 비밀번호 길이:', password.length);
    console.log('저장된 해시 비밀번호 길이:', user.password.length);
        // bcrypt를 사용해 비밀번호 비교, 입력된 비밀번호와 해싱된 비밀번호를 비교
        const isPasswordValid = await bcrypt.compare(password,user.password);
        console.log('비밀번호 일치 여부 :', isPasswordValid);
        // 비밀번호 일치하지 않으면 로그인 실패
        if (!isPasswordValid) {
            return res.status(400).json({message:'이메일 또는 비밀번호가 일치하지 않습니다.'});
        }
        

        res.status(200).json({
            message : '로그인 성공',
            user_id: user.user_id, //사용자 id 반환
            nickname: user.nickname, //사용자의 닉네임 반환
        });
    } catch(err) {
        console.error('로그인 오류', err); // 서버 콘솔에 오류 출력
        res.status(500).json({
            message : '로그인오류 발생', // 클라이언트에 오류 메시지
            error: err.message,
        });
    }
}

async function getUser(req,res) {
    const{user_id} = req.params;
    try {
        const user = await usermodel.getUserById(user_id);
        if(!user) {
            return res.status(404).json({message: '사용자를 찾을 수 없습니다.'});
        }
        res.json(user);
    } catch (err){
        console.error('사용자 정보 가져오기 오류', err);
        res.status(500).json({message: '서버 오류로 사용자 정보 가져올 수 없습니다.'});
    }
}

// 유저 정보(닉네임 변경)
async function updateUserNickname(req,res) {
    // console.log(req.params);
    const {user_id} = req.params;
    const {nickname} = req.body;

    // console.log('user_id', user_id);
    // console.log('nickname:',nickname);
    if (!nickname) {
        return res.status(400).json({message: '닉네임이 필요합니다'});
    }
    try {
        await usermodel.updateUserNickname(user_id, nickname) ;
        res.status(200).json({message: '닉네임이 성공적으로 수정되었습니다'});
    } catch(err){
        console.error('닉네임 수정 오류', err);
        res.status(500).json({message: '닉네임 수정 중 오류 발생'});
    }
}

// 비밀번호 변경
async function updateUserPassword(req, res){
    const {user_id} = req.params;
    const {newPassword, confirmPassword} = req.body;

    // 비밀번호, 비밀번호 확인 일치하는지 확인(백)
    if (newPassword !== confirmPassword) {
        return res.status(400).json({message: '비밀번호 불일치'});
    }
    // 비밀번호 입력 안 했을 시 
    if (!newPassword || !confirmPassword) {
        return res.status(400).json({message: '비밀번호 입력 안함'});
    }

    try {
        // 새로운 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(newPassword,10);

        // 해시화한 비밀번호 모델 통해 업데이트
        const result = await usermodel.updatePassword(user_id, hashedPassword);

        if(result.affectedRows === 0) {
            return res.status(404).json({message: '사용자 찾을 수 없음 (db)'});
        }
        res.status(200).json({message:'비밀번호 성공적으로 수정완료'});
    } catch(err) {
        console.error('비밀번호 수정 오류', err);
        res.status(500).json({message:'비밀번호 수정 중 오류 발생500'});
    }
}

async function deleteUser(req,res){
    const {user_id} = req.params;

    try {
        const result = await usermodel.deleteUser(user_id);

        if(result.affectedRows === 0) {
            return res.status(404).json({message: '사용자를 찾을 수 없습니다.'});
        }
        res.status(200).json({message: '회원 탈퇴 성공'});
    } catch(err) {
        console.error('회원 탈퇴 오류', err);
        res.status(500).json({message: '회원 탈퇴 중 오류 발생'});
    }
}

// userController 모듈 내보내기
module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUserNickname,
    updateUserPassword,
    deleteUser,
};