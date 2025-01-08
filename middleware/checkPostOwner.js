import postmodel from '../models/postmodel.js';

const checkPostOwner = async (req, res, next) => {
    const {post_id} = req.query;   // post_id 추출
    console.log('미들웨어 req.session.user',req.session.user);
    console.log('미들웨어 post_id',post_id);
    const user_id = req.session.user?.user_id;  // 옵셔널 체이닝 세션에서 user_id 가져옴

    console.log('미들웨어 user_id', user_id);
    if (!user_id) {
        return res.status(401).json({message : '로그인이 필요합니다. 미들웨어'}); // Unauthorized
    }
    
    try {
        const post = await postmodel.getPostAuthorById(post_id);

        console.log('미들웨어 post',post);
        // 게시물 없는 경우
        if(!post){
            return res.status(404).json({message: '게시물을 찾을 수 없습니다. 미들웨어'});
        }
        
        // 게시물 작성자와 로그인한 사용자 다를 경우
        if (post.user_id !== user_id) {
            return res.status(403).json({message: '게시글 수정 및 삭제 권한이 없습니다.'});
        }
        
        // 작성자 맞으면 다음 미들웨어 이동
        next();
    } catch (err) {
        // DB 조회 에러
        console.error('게시물 작성자 확인 중 오류 발생. 미들웨어',err);
        res.status(500).json({message:'게시물 권한 확인 중 오류 발생', error:err.message});
    }
};

export default checkPostOwner;