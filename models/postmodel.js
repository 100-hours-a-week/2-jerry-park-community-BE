// jerryDBpool.js 에서 풀 가져오기
const jerrydb = require('../DBpools/jerryDBpool');

// 게시글 새로 작성
async function createPost({title, content, user_id, image}) {

    // // title, content, user_id가 undefined라면 null로 처리
    // if (title === undefined) title = null;
    // if (content === undefined) content = null;
    // if (user_id === undefined) user_id = null;

    
    // 쿼리는 posts 테이블에 삽입
    const sql = `
        INSERT INTO posts (title, content, user_id, likes, views, created_time, image)
        VALUES (?,?,?,0,0,NOW(),?)
    `;
    // !!!!!!!!!!!!!!!!!!!! likes, views 구현 필요....

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
async function getPosts() {
    // posts 테이블에서 내림차순 쿼리문

    // user_id 통해 users에서 nickname 가져오기
    const sql = `
        SELECT posts.*, users.nickname, users.profile_img
        FROM posts
        INNER JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_time DESC
    `;

    try {
        const [rows] = await jerrydb.execute(sql);
        return rows;
    } catch (err) {
        console.error('게시글 조회 중 에러 발생 ', err.message);
        throw err;    
    }
}

// 게시물 상세 조회
async function getPostById(post_id){
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
async function updatePost(post_id, {title, content}) {
    const sql = `
        UPDATE posts
        SET title = ?, content = ?, created_time = NOW()
        WHERE post_id = ?
    `;
    try {
        const [result] = await jerrydb.execute(sql, [title,content,post_id]);

        // 업데이트 된 행 개수 반환하여 성공 여부 판단
        if (result.affectedRows === 0){
            throw new Error('쿼리에서 수정 실패');
        }
        return {success: true};
    } catch (err) {
        console.error('게시글 수정 중 오류 발생 : ', err.message);
        throw err;
    }
}

// 게시물 삭제
async function deletePost(post_id) {
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
async function increseLikes(post_id) {
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

// 조회수
async function increseViews(post_id) {
    const sql = `UPDATE posts SET views = views + 1 WHERE post_id = ?`;
    const [result] = await jerrydb.execute(sql,[post_id]);

    if (result.affectedRows === 0) {
        throw new Error('조회수 증가할 게시물 찾을 수 없음');
    }
    
    // 증가 후 조회수 가져오기
    const [updatedViews] = await jerrydb.query(`SELECT views FROM posts WHERE post_id = ?`, [post_id]);
    return updatedViews[0].views;
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    increseLikes,
    increseViews,
};