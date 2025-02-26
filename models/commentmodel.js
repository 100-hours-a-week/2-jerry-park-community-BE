import jerrydb from '../DBpools/jerryDBpool.js';

// post_id 에 따라 댓글 가져오기
const getCommentsByPostId = async (post_id) => {
    const sql = `
        SELECT c.comment_id, c.content, c.created_time, c.user_id, u.nickname, u.profile_img
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.post_id = ?
        ORDER BY c.created_time DESC;
    `;
    const sqlCommentCount = `
        SELECT COUNT(*) AS commentCount
        FROM comments
        WHERE post_id = ?;
    `;

    try {
        
        const [comments] = await jerrydb.execute(sql,[post_id]);
        const [commentCountRows] = await jerrydb.execute(sqlCommentCount,[post_id]);
        const commentCount = commentCountRows[0].commentCount;  // 댓글 수
        return { comments, commentCount };  // 댓글과 댓글 수를 반환
    } catch (err) {
        console.error('댓글 조회 중 오류 발생', err.message);
        throw err;
    }
}

const createComment = async ({post_id, content, user_id}) => {
    const sql = `
        INSERT INTO comments (post_id, content, user_id)
        VALUES(?,?,?);
    `;
    try {
        const [result] = await jerrydb.execute(sql,[post_id, content,user_id])
        // 댓글 삽입 성공시 결과 반환
        return { success : true , comment_id : result.insertId};
    } catch(err){
        console.error('댓글 추가 중 오류 발생', err.message);
    }
}

const updateComment = async ({comment_id, content}) => {
    // 댓글 ID, 새로운 내용 기준으로 DB 쿼리문작성
    const sql = `
        UPDATE comments
        SET content = ?, created_time = NOW()
        WHERE comment_id = ?
    `; 
    const [result] = await jerrydb.execute(sql, [content, comment_id]);
    return result;
}

// 댓글 삭제
const deleteComment = async (comment_id) => {
    console.log('모델에서 삭제할 comment_id', comment_id);
    const sql = `
        DELETE FROM comments WHERE comment_id = ?
    `;
    try {
        const [result] = await jerrydb.execute(sql, [comment_id]);
        console.log('댓글 삭제 쿼리 실행 결과',result);
        return result;
    } catch (error) {
        console.error('댓글 삭제 중 에러 발생:', error.message); // 에러 메시지 출력
        throw error;
    }
}

const getCommentAuthorById = async (comment_id) => {
    const sql = `SELECT user_id FROM comments WHERE comment_id = ?`;
    try {
        const [rows] = await jerrydb.execute(sql, [comment_id]);
        return rows[0];
    } catch (err) {
        console.error('댓글 작성자 조회 오류 model', err.message);
        throw err;
    }
};

export default {
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment,
    getCommentAuthorById,
};