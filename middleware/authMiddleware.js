// 인증 미들웨어

// 로그인하지 않은 경우 안 됨 (세션정보 없으면 안됨)
function isAuthenticated(req, res, next) {
    console.log('isAuthenticated 함수에서 값 req.session.user 값(미들웨어) : ',req.session.user);
    if (req.session.user) {
      // 세션에 사용자 정보가 있으면 인증됨
      return next(); // 다음 미들웨어로 넘어감
    }
    // 인증되지 않은 경우
    res.status(400).json({ message: '인증, 인가받지 않았습니다. (로그인하지 않음)' });
};

export default { 
    isAuthenticated,
};

