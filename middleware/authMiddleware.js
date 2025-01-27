// 인증 미들웨어
// 로그인하지 않은 경우 안 됨 (세션정보 없으면 안됨)
const isAuthenticated = (req, res, next) => {
    console.log('isAuthenticated 함수에서 값 req.session.user 값(미들웨어) : ',req.session.user);
    if (!req.session.user) {
      // 인증되지 않은 경우
      res.status(401).json({ message: '로그인이 필요합니다. (미들웨어)' });
      
    }
    // 세션에 사용자 정보가 있으면 인증됨
    next(); // 다음 미들웨어로 넘어감
};

export { 
    isAuthenticated,
};

