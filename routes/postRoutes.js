// express 객체
import express from 'express';
const router = express.Router();

// postController 모듈 import
import * as postController from '../controllers/postController.js';
// 쿠키/세션 인가 사용
import { isAuthenticated } from '../middleware/authMiddleware.js';
// multer 모듈 import
import multer from 'multer';

// 멀터 파일 저장 설정 한글도 그대로 저장
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 파일 저장 경로
    },
    filename: function (req, file, cb) {
        try {
            // 한글 파일명을 그대로 사용
            const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
            cb(null, `${Date.now()}-${originalName}`);
        } catch (err) {
            console.error('파일명 처리 중 오류:', err);
            cb(null, `${Date.now()}-unknown-file`);
        }
    }
});

// multer 미들웨어 설정
const upload = multer({ storage: storage });

// post에 multer 적용 (파일이 있을 경우)
//'image'는 클라에서 보내는 파일 이름
router.post('/', upload.single('image'), postController.createPost);
// POST 요청 들어올 시 실행되는 라우터 정의
// postController의 createPost 함수를 호출 (POST시)

// 게시글 전체 조회 라우트 (/api/posts)
router.get('/', postController.getPosts);

// 게시글 상세 조회 라우트 (/api/posts/post)
router.get('/post', postController.getPostById);

// 게시물 수정
router.patch('/post',upload.single('fileInput'), postController.updatePost);

// 게시물 삭제
router.delete('/post', postController.deletePost);

// 게시물 좋아요 증가
router.put('/like',postController.likePost);

// 게시물 조회수 증가
router.put('/views', postController.increseViews);

export default router ;
// 이 라우터 모듈 내보냄
