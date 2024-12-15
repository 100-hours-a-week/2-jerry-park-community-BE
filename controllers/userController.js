// 이 컨트롤러는 회원가입 요청을 처리한다.
// 모델 가져오기
import usermodel from '../models/usermodel.js';
import bcrypt from 'bcryptjs'; // bcrypt 라이브러리 가져오기 (비밀번호 해싱)

// req(요청객체(닉네임,이메일,비밀번호 등)), res(응답객체)
const registerUser = async (req, res) => {
    // 요청 본문에서 nickname, email, password를 추출해 변수에 할당
    const { nickname, email, password } = req.body;
    
    // 이미지 처리
    let profile_imgPath = null;
    // 이미지 업로드시 경로 저장
    if (req.file) {
        profile_imgPath = `/uploads/${req.file.filename}`;
    }
    
    try {
        // 이메일 중복 확인
        const existingEmail = await usermodel.findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({message: '* 중복된 이메일 입니다.'})
        }

        // 닉네임 중복 확인
        const existingNickname = await usermodel.findUserByNickname(nickname);
        if (existingNickname) {
            return res.status(400).json({ message: '* 중복된 닉네임입니다.' });
        }

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

// 로그인시
const loginUser = async (req,res) => {
    const {email, password}= req.body;
    // console.log('로그인시 req.body:', req.body); // 클라에서 온 요청 출력

    try { 
        // 이메일로 사용자 검색
        const user = await usermodel.findUserByEmail(email);
        // console.log('db에서 가져온 사용자 정보 : ', user);
        // 사용자 없으면 로그인 실패
        if (!user) {
            return res.status(401).json({message: '이메일 또는 비밀번호가 일치하지 않습니다.'}); // 프론트 헬퍼텍스트에 입력되는 값
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
        
        // 성공 시 세션에 사용자 정보 저장
        req.session.user = {
            user_id: user.user_id,
            nickname: user.nickname,
            email: user.email,
            profile_img: user.profile_img,
        };
        console.log('로그인 할 때 세션에서 생성 데이터 :',req.session.user); // 로그인 후 세션 확인


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

const getUser = async (req,res) => {
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
const updateUserNickname = async (req,res) => {
    // console.log(req.params);
    const {user_id} = req.params;
    const {nickname} = req.body;
    console.log('닉넴 업데이트 함수 user_id', user_id);
    console.log('닉넴 업데이트 함수 nickname:',nickname);


    console.log('닉넴변경 put 요청시 req.session.user :',req.session.user);
    // 세션에서 로그인 한 사용자 정보 가져오기
    const loggedInUser = req.session.user;
    // 세션 유저 정보
    console.log(req.session.user);
    // 세션에서 로그인한 사용자가 있는지 확인
    if (!loggedInUser) {
        return res.status(401).json({ message: '로그인하지 않았습니다.' }); // 로그인되지 않은 경우
    }

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
const updateUserPassword = async (req, res) => {
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

// 회원탈퇴
const deleteUser = async (req,res) => {
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

// 닉네임 중복 검사
const checkNickname = async (req,res) => {
    const { nickname } = req.params;

    try {
        // 닉네임 이미 존재하는지 확인
        const existingUser = await usermodel.findUserByNickname(nickname);

        if (existingUser) {
            return res.status(400).json({message: '* 중복된 닉네임 입니다.'});
        }
        return res.status(200).json({message:'사용 가능한 닉네임입니다.'});
    } catch (err) {
        console.error('닉네임 중복 검사 오류 : ', err);
        return res.status(500).json({message:'닉네임 중복검사 중 서버 오류'});
    }
}

// 세션 정보 내보내기
const getSessionUser = (req, res) => {
    console.log('getSessionUser의 req.session : ', req.session);
    if (req.session && req.session.user) {
        console.log('세션 유저:', req.session.user);
        return res.status(200).json(req.session.user); // 세션에 저장된 사용자 정보 반환
    } else {
        console.log('세션이 비어 있습니다.');
        return res.status(401).json({ message: "로그인되지 않았습니다." }); // 세션 정보가 없을 때
    }
};

// userController 모듈 내보내기
export default {
    registerUser,
    loginUser,
    getUser,
    updateUserNickname,
    updateUserPassword,
    deleteUser,
    checkNickname,
    getSessionUser,
};