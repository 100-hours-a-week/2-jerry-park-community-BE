// http 요청 , url 경로 처리 controller

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController'); // 컨트롤러 가져오기

// GET 요청: 모든 아이템 가져오기
router.get('/items', itemController.getItems);

// POST 요청: 아이템 추가
router.post('/items', itemController.createItem);

// PUT 요청: 아이템 전체 업데이트
router.put('/items/:id', itemController.updateItem);

// PATCH 요청: 아이템 부분 업데이트
router.patch('/items/:id', itemController.patchItem);

// DELETE 요청: 아이템 삭제
router.delete('/items/:id', itemController.deleteItem);

module.exports = router; // 라우터 내보내기
