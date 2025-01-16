#!/bin/bash

# 현재 스크립트가 있는 디렉토리로 이동
cd "$(dirname "$0")"

# 설정할 포트 번호
FE_PORT=5500
BE_PORT=3000

# 환경 설정
if [[ "$ENV" == "local" ]]; then  #ENV=local ./envstart.sh 로 실행시 .env.ec2를 .env에 복사
  echo "Setting up for local environment..."
  cp .env.local .env
elif [[ "$ENV" == "ec2" ]]; then  #ENV=ec2 ./envstart.sh 로 실행시 .env.ec2를 .env에 복사
  echo "Setting up for EC2 environment..."
  cp .env.ec2 .env
else
  echo "Error: Please set ENV to 'local' or 'ec2'"
  exit 1
fi

# 함수: 특정 포트를 사용하는 프로세스 종료
terminate_port() {
  local PORT=$1
  if lsof -i :$PORT > /dev/null; then
    echo "Port $PORT is in use. Terminating process..."
    kill -9 $(lsof -t -i :$PORT) || echo "Failed to terminate process on port $PORT"
  fi
}

# FE 서버 관리
terminate_port $FE_PORT
cd ../2-jerry-park-fe
nohup node server.js > ../fe.log 2>&1 &
echo "FE server started on port $FE_PORT"

# BE 서버 관리
cd ../2-jerry-park-be
terminate_port $BE_PORT
nohup node server.js > ../be.log 2>&1 &
echo "BE server started on port $BE_PORT"

# 실행 상태 확인
echo "Servers started successfully! Running processes:"
ps aux | grep -E "2-jerry-park-fe/server.js|2-jerry-park-be/server.js" | grep -v grep