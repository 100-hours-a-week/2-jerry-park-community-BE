// jerryDBpool.js 에서 풀 가져오기
import jerrydb  from '../DBpools/jerryDBpool.js';

// 게시글 새로 작성
const createPost = async ({title, content, user_id, image}) => {
    // 쿼리는 posts 테이블에 삽입
    const sql = `
        INSERT INTO posts (title, content, user_id, likes, views, created_time, image)
        VALUES (?,?,?,0,0,NOW(),?)
    `;
    try {
        // DB에 쿼리 실행
        const [result] = await jerrydb.execute(sql, [title,content,user_id,image]);
        // 삽입된 게시글의 고유 id 반환 (post_id)
        return result.insertId;

    } catch (err) {
        // 오류 콘솔 출력
        console.error('게시글 작성 중 오류 발생 : ', err.message);

        // 호출한 쪽으로 다시 전달
        throw err;
    }
}

// 게시글 가져오기 sql문
const getPosts = async ({offset, limit}) => {
    // posts 테이블에서 내림차순 쿼리문

    // user_id 통해 users에서 nickname 가져오기
    const sql = `
        SELECT posts.*,
            users.nickname,
            users.profile_img,
            COUNT(comments.comment_id) AS comment_count
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        LEFT JOIN comments ON posts.post_id = comments.post_id
        GROUP BY posts.post_id, users.nickname, users.profile_img
        ORDER BY posts.created_time DESC
        LIMIT ? OFFSET ?
    `;

    try {
        const [rows] = await jerrydb.query(sql,[limit, offset]);
        return rows;
    } catch (err) {
        console.error('게시글 조회 중 에러 발생 ', err.message);
        throw err;    
    }
}

// 게시물 상세 조회
const getPostById = async (post_id) => {
    const sql = `
        SELECT posts.*, users.nickname, users.profile_img
        FROM posts
        INNER JOIN users ON posts.user_id = users.user_id
        WHERE posts.post_id = ?
    `;

    try {
        // DB에 쿼리 실행.
        // execute로 쿼리문의 ? 자리에 post_id 삽입
        const [rows] = await jerrydb.execute(sql,[post_id]);
        // 쿼리는 배열형태
        return rows[0];
    } catch (err) {
        console.error('게시글 상세 조회 중 에러 발생', err.message);
        throw err;
    }
}

// 게시물 수정
async function updatePost(post_id, {title, content, image}) {
    
    console.log('게시물수정 ',post_id, title,content,image);
    image = image || null;
    const sql = image
    ? `UPDATE posts SET title = ?, content = ?,image = ?, created_time = NOW() WHERE post_id = ?`
    : `UPDATE posts SET title = ?, content = ?, created_time = NOW() WHERE post_id = ?`;

    const params = image ? [title, content, image, post_id] : [title, content, post_id];

    try {
        const [result] = await jerrydb.execute(sql, params);

        // 업데이트 된 행 개수 반환하여 성공 여부 판단
        if (result.affectedRows === 0){
            throw new Error('쿼리에서 수정 실패');
        }
        return {success: true};
    } catch (err) {
        console.error('게시글 수정 중 오류 발생 : ', err.message);
        throw err;
    }
};

// 게시물 삭제
const deletePost = async (post_id) => {
    const sql = `
        DELETE FROM posts WHERE post_id = ?
    `;

    try { 
        const[result] = await jerrydb.execute(sql,[post_id]);
        return result;
    } catch(err){
        console.error('게시물 삭제 중 오류 발생 (db)', err.message);
        throw err;
    }
}

// 좋아요 증가
const increaseLikes = async (post_id) => {
    const sql = `UPDATE posts SET likes = likes+1 WHERE post_id = ? `;
    const [result] = await jerrydb.execute(sql, [post_id]);

    // 반영된 거 0이면
    if (result.affectedRows === 0){
        throw new Error('좋아요 증가할 게시물 찾을 수 없음');
    }

    // 업데이트 된 좋아요 수 반환
    const [likesResult] = await jerrydb.query(`SELECT likes FROM posts WHERE post_id = ?`, [post_id]);
    return likesResult[0].likes;
}
const decreaseLikes = async (post_id) => {
    const sql = `UPDATE posts SET likes = likes-1 WHERE post_id = ?`;
    const [result] = await jerrydb.execute(sql, [post_id]);

    if (result.affectedRows === 0) {
        throw new Error('좋아요 감소할 게시물 찾을 수 없음');
    }

    const [likesResult] = await jerrydb.query(`SELECT likes FROM posts WHERE post_id = ?`, [post_id]);
    return likesResult[0].likes;
}

// 조회수
const increseViews = async (post_id) => {
    const sql = `UPDATE posts SET views = views + 1 WHERE post_id = ?`;
    const [result] = await jerrydb.execute(sql,[post_id]);

    if (result.affectedRows === 0) {
        throw new Error('조회수 증가할 게시물 찾을 수 없음');
    }
    
    // 증가 후 조회수 가져오기
    const [updatedViews] = await jerrydb.query(`SELECT views FROM posts WHERE post_id = ?`, [post_id]);
    return updatedViews[0].views;
}

// 게시물 수정,삭제 시 작성자 본인인지 확인하기
const getPostAuthorById = async (post_id) => {
    const sql = `SELECT user_id FROM posts WHERE post_id = ?`;
    try {
        const [rows] = await jerrydb.execute(sql,[post_id]);
        return rows[0];
    } catch (err) {
        console.error('게시글 작성자 조회 중 에러 postmodel, getPostAuthorById', err.message);
        throw err;
    }
}

export default {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    increaseLikes,
    increseViews,
    decreaseLikes,
    getPostAuthorById,
};