// 요청 처리, 작업 수행 후 응답 반환 역할 controller js파일

// colors, moment 적용
const moment = require('moment');
const colors = require('colors');

// 데이터 저장용 임시 배열 (서버 메모리에 저장)
let myBag = [];

// GET 요청 처리
function getItems(req, res) {
    res.status(200).json({ myBag });
}

// POST 요청 처리
function createItem(req, res) {
    const newItem = req.body; // 요청 본문에서 새로운 아이템 가져옴
    myBag.push(newItem); // 배열에 추가
    res.status(201).json({ message: '아이템 추가됨', myBag });
}

// PUT 요청 처리
function updateItem(req, res) {
    const id = req.params.id;
    const updatedItem = req.body;
    if (myBag[id]) {
        myBag[id] = updatedItem;
        res.status(200).json({ message: 'put 아이템 업데이트 !', myBag: updatedItem });
    } else {
        res.status(404).json({ message: 'put 아이템이 없습니다. 인덱스 확인 !' });
    }
}

// PATCH 요청 처리
function patchItem(req, res) {
    const id = req.params.id;
    const updates = req.body;
    if (myBag[id]) {
        myBag[id] = { ...myBag[id], ...updates };
        res.status(200).json({ message: 'patch 아이템 업데이트 완료', item: myBag[id] });
    } else {
        res.status(404).json({ message: 'petch 아이템이 없습니다. 인덱스 확인 !' });
    }
}

// DELETE 요청 처리
function deleteItem(req, res) {
    const id = req.params.id;
    if (myBag[id]) {
        myBag.splice(id, 1); // 배열에서 삭제
        res.status(204).send(); // 성공적으로 삭제된 경우
    } else {
        res.status(404).json({ message: 'delete 아이템이 없습니다. 인덱스 확인 !' });
    }
}

// 컨트롤러 함수들을 모듈로 내보내기
module.exports = {
    getItems,
    createItem,
    updateItem,
    patchItem,
    deleteItem,
};