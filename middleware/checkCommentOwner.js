import commentmodel from '../models/commentmodel.js';

const checkCommentOwner = async (req,res,next) => {
    const { comment_id } = req.params;
    const user_id = req.session.user?.user_id // req.session.user에서 user_id 가져오기

    if (!user_id) {
        return res.status(401).json({message : '로그인이 필요합니다. 미들웨어'}); // Unauthorized
    }

    try {
        const comment = await commentmodel.getCommentAuthorById(comment_id);

        if(!comment){
            return res.status(404).json({message:'댓글을 찾을 수 없습니다.'});
        }

        if (comment.user_id !== user_id) {
            return res.status(403).json({message:'댓글 수정 및 삭제 권한이 없습니다.'});
        }

        next();
    } catch (err) {
        console.error('댓글 작성자 확인 중 오류 발생 미들웨어', err);
        res.status(500).json({message:'댓글 권한 확인 중 오류 발생 미들웨어',error:err.mesage});
    }
}

export default checkCommentOwner;