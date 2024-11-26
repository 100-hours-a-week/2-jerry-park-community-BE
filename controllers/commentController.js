const commentmodel = require('../models/commentmodel');

// 댓글 가져오는 getComments 함수
async function getComments(req, res) {
    const {post_id} = req.query;

    if (!post_id) {
        return res.status(400).json({message: 'post_id가 필요합니다.'});
    }

    try {
        const {comments , commentCount} = await commentmodel.getCommentsByPostId(post_id);
        res.status(200).json({comments, commentCount});
        console.log("DB에서 가져온 댓글 데이터:", comments);  // 데이터 확인용 로그
        console.log("댓글 수:", commentCount);  // 댓글 수 확인용 로그
    } catch (err) {
        res.status(500).json({message: '댓글 조회 중 오류 발생', error: err.message});
    }
}


async function createComment(req,res){
    const {post_id, content, user_id} = req.body;

    // 요청 데이터 검증
    if (!post_id || !content || !user_id){
        return res.status(400).json({message : 'post_id, content, user_id는 필수값'});
    }
    try {
        const result = await commentmodel.createComment(post_id,content,user_id);

        // 댓글 생성 성공시, 새로 생성된 댓글 정보 반환
        res.status(201).json({
            message: '댓글이 성공적으로 작성되었습니다.',
            comment_id: result.comment_id,  // 새로 생성된 댓글의 ID 반환
            post_id: post_id,
            content: content,
            user_id: user_id
        });
    } catch (err) {
        // 댓글 생성 중 오류 발생 처리
        res.status(500).json({message: '댓글 작성 중 오류 발생', error : err.message});
    }
}

async function updateComment(req,res) {
    // req.query는 커리문자열
    // req.params는 url경로의 변수
    const {comment_id} = req.params; // comment_id 가져오기
    const {content} = req.body; // 댓글 내용 가져오기

    console.log(req.params);
    console.log(req.body);
    // 요청 데이터 검증 (유효성 검사)
    if (!comment_id || !content) {
        return res.status(400).json({
            message: 'comment_id와 content는 필수값입니다.',
        });
    }

    try {
        const result = await commentmodel.updateComment(comment_id, content);

        if (result.affectedRows === 0) {
            return res.status(404).json({message : '해당 댓글을 찾을 수 없습니다'});
        }

        res.status(200).json({
            message: '댓글 수정 완료',
            comment_id: comment_id,
            content: content,
        });
    } catch (err) {
        res.status(500).json({
            message: '댓글 수정 중 오류 발생',
            error: err.message,
        });
    }
}

async function deleteComment(req,res) {
    const { comment_id } = req.params;

    console.log('comment_id : ', comment_id);
    try { 
        const result = await commentmodel.deleteComment(comment_id);

        if(result.affectedRows>0){
            res.status(200).json({success:true, message: '댓글 삭제 완료'});
        } else {
            res.status(404).json({success:false, message:'댓글을 찾을 수 없습니다.'});
        }
    } catch(err){
        res.status(500).json({
            message: '댓글 삭제 중 오류 발생',
            error: err.message,
        });
    }
}

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};