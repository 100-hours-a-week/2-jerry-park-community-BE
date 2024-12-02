import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

// 멀터 사용
import multer from 'multer';
import path from 'path';

// 쿠키/세션 인가 사용
import isAuthenticated from '../middleware/authMiddleware.js';

// 파일 저장 위치, 파일 이름 설정 (멀터)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// multer 미들웨어 설정
const upload = multer({ storage: storage });

// register 경로로 들어온 POST 요청 처리 클라에서 보내는 파일이름 'image'
router.post('/register', upload.single('profile_img'), userController.registerUser);

// /login 경로로 들어온 post 요청 처리 (로그인 라우트)
router.post('/login', userController.loginUser);

// user_id 통해 회원정보 수정페이지 get
router.get('/:user_id', userController.getUser);

// user_id 통해 회원정보 닉네임 수정 put
router.put('/:user_id', userController.updateUserNickname);

// user_id 통해 비밀번호 변경
router.put('/:user_id/password', userController.updateUserPassword);

// user_id 통해 회원 탈퇴
router.delete('/:user_id', userController.deleteUser);

// api/users/nicknamecheck/:nickname닉네임 중복 검사 
router.get('/nicknamecheck/:nickname',userController.checkNickname);

// 라우터 내보내기
export default router;