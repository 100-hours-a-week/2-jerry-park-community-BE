// 이 컨트롤러는 게시물 작성 요청 들어오면 실행된다.

// 모델 가져오기 !
import { request } from 'express';
import  postModel  from '../models/postmodel.js'; // import로 변경
import xss from 'xss';

// 게시물 작성
const createPost = async (req, res) => {
    // req.body는 클라가 보낸 데이터 본문 가져오는 객체
    const {title, content} = req.body;
    
    console.log('게시글 작성 reqbody : ', req.body);

    if (!req.session.user || !req.session.user.user_id) {
        return res.status(400).json({message : '로그인은 필수입니다.'});
    }
    // 세션에서 user_id 가져오기
    const user_id = req.session.user.user_id;

    

    // 이미지 파일 확인
    let imagePath = null;
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`; // 이미지 경로
    }
    
    // xss 방지 처리
    const xsstitle = xss(title);
    const xsscontent = xss(content);

    console.log('xsst',xsstitle,'xssc',xsscontent);
    try {
        // createPost 함수 호출, db에 게시글 저장, 게시글 id 반환
        const newPostId = await postModel.createPost({
            title : xsstitle, 
            content : xsscontent,
            user_id, image: imagePath});

        // DB 삽입 성공여부 (201 성공)
        res.status(201).json({
            message: '게시글 작성 성공',
            post_id : newPostId,
            image: imagePath,
        });
    } catch (err) {
        // (500 오류 interval server error)
        res.status(500).json({
            message : '게시글 작성 중 오류 발생',
            error : err.message,
        });
    }
}

// 페이징 적용 게시물 리스트 조회
const getPosts = async (req, res) => {
    // console.log('req.query:',req.query);
    const { offset, limit } = req.query;

    try {
        // offset, limit 없을 시 에러
        if (!offset || !limit) {
            return res.status(400).json({
                message: 'offset, limit 값이 유효하지 않음',
            })
        }
        // offset, limit 정수 처리, requestData 객체 생성
        const requestData = {
            limit: parseInt(limit,10),
            offset: parseInt(offset,10),
        };
        // console.log('requestData : ', requestData);
        const responseData = await postModel.getPosts(requestData);
        // console.log('responseData',responseData);
        // 가져온 데이터 없을시 에러
        if (!responseData || !requestData === 0 ){
            return res.status(404).json({
                message: '게시물이 존재하지 않습니다',
            })
        }
        
        // 데이터 성공적으로 가져왔을 시, 200, 데이터 전송
        return res.status(200).json({
            message: '게시물 조회 성공',
            data: responseData,
        });
    } catch (err) {
        console.error('게시물 조회 중 오류 발생', err.message);
        return res.status(500).json({
            message: '서버 오류발생',
            error: err.message,
        });
    }
};


// post_id 통한 게시물 상세조회
const getPostById = async (req, res) => {
    const post_id = req.query.post_id; // 요청 url에서 id 가져옴

    if(!post_id) {
        // post_id 없다면 => 400
        return res.status(400).json({error:'post_id가 필요'});
    }
    try {
        // 모델에서 데이터 가져오기
        const post = await postModel.getPostById(post_id);

        if(!post){
            // 해당 post_id에 게시물이 없으면 404
            return res.status(404).json({error:'post_id에 따른 게시물이 없습니다'});
        }
        // 게시물 데이터를 json 형태로 응답
        res.json(post);
    } catch (err) {
        console.error('게시물 상세 조회 중 에러 발생', err.message);
        res.status(500).json({error: '서버 에러 발생'});
    }
} 

// 게시글 수정
const updatePost = async (req, res) => {
    const { post_id } = req.query;
    const {title, content} = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if(!title || !content) {
        return res.status(400).json({success:false, message: '제목과 내용이 비어있음'});
    }
    
    const xsstitle = xss(title);
    const xsscontent = xss(content);

    try {
        const result = await postModel.updatePost(post_id, {
            title : xsstitle,
            content : xsscontent, image});
            
        if (result.success) {
            res.status(200).json({success : true, message:'게시글 수정 완료'});
        } else {
            res.status(400).json({success:false, message:'게시글 수정 실패 컨트롤러updatePost()'})
        }
    } catch(err) {
        res.status(500).json({success:false, message:'게시글 수정 중 오류 발생'});
    }
};

const deletePost = async (req,res) => {
    const {post_id} = req.query; // URL post_id 쿼리 가져옴

    if (!post_id) {
        return res.status(400).json({success:false, message : 'post_id 없음'});
    }

    try {
        const result = await postModel.deletePost(post_id);

        if(result.affectedRows > 0) {
            return res.status(200).json({success:true, message: '게시글 삭제 성공'});
        } else {
            return res.status(404).json({success:false, message: '게시글이 존재하지 않습니다.'});
        }
    } catch (err){
        console.error('게시글 삭제 중 오류 발생', err.message);
        return res.status(500).json({success:false, message: '게시글 삭제 중 오류 발생'})
    }
}

// 좋아요 증가
const likePost = async (req,res) => {
    const { post_id , liked }= req.query;

    // console.log('likePost 함수 컨트롤러, post_id, liked', post_id, liked);
    // post_id 없을 시 처리
    if (!post_id){
        return res.status(400).json({success:false, message:'컨트롤러 좋아요 수 post_id 없음'});
    }

    try {
        let updatedLikes;
        if(liked === 'true') {
            updatedLikes = await postModel.decreaseLikes(post_id);
        } else {
            updatedLikes = await postModel.increaseLikes(post_id);
        }

        res.json({success:true, likes:updatedLikes});
    } catch (err) {
        console.error('좋아요 증가 중 오류 : ',err);
        res.status(500).json({success:false, message: '컨트롤러 likePost()서버 오류로 좋아요수 증가 실패'});
    }
}

// 조회수 증가
async function increseViews(req,res) {
    const {post_id} = req.query;

    if (!post_id){
        return res.status(400).json({success:false, message:'post_id 없음'});
    }

    try {
        const updatedViews = await postModel.increseViews(post_id);
        res.json({success: true, views:updatedViews});
    } catch(err) {
        console.error('조회수 증가 중 오류 : ', err);
        res.status(500).json({success:false, message: '서버 오류로 좋아요 증가 실패'});
    }
}

// createPost 모듈 외부로 exports
export {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    increseViews,
};