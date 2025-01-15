<div align="center">

<!-- logo -->
<img src="https://github.com/user-attachments/assets/cdf4a0da-03dc-41cd-bf2a-c7834330c4cc" width="100"/>

### Jerry's Community - BE 🖍

[<img src="https://img.shields.io/badge/-readme.md-important?style=flat&logo=google-chrome&logoColor=white" />]() [<img src="https://img.shields.io/badge/-tech blog-blue?style=flat&logo=google-chrome&logoColor=white" />]() [<img src="https://img.shields.io/badge/release-v1.0.0-ㅎㄱㄷ두?style=flat&logo=google-chrome&logoColor=white" />]() 
<br/> [<img src="https://img.shields.io/badge/프로젝트 기간-2024.11.01~2025.01.15-fab2ac?style=flat&logo=&logoColor=white" />]()

</div> 

## 📝 소개
Jerry's Community의 FE 코드를 담은 레포지스트리입니다.

다음과 같은 내용을 작성할 수 있습니다.
- 프로젝트 소개
- 프로젝트 화면 구성
- 프로젝트 API 설계
- 사용한 기술 스택
- 프로젝트 아키텍쳐
- 기술적 이슈와 해결 과정


<br />

### 화면 구성
|로그인|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/67ef4d77-d4c6-45d4-b781-543c40f25b46" />|
|로그인, 회원가입 수행가능한 접속 시 페이지입니다.|

|회원가입|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/90938bf4-b7ce-4451-ab87-4860610fa14b" />|
|회원가입을 수행할 수 있는 페이지입니다.|

|게시물 리스트|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/233193e4-8cb7-426c-ad48-a196cf077235" />|
|커뮤니티의 게시물을 한 눈에 볼 수 있는 페이지입니다.|

|게시물 상세조회|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/b4fda34a-50b1-49a3-b831-ff9c4c013b09" />|
|게시물 리스트에서 클릭한 게시물을 볼 수 있고 해당 게시물의 좋아요를 누를 수 있으며,게시물 수정,삭제 및 댓글 작성,수정,삭제,게시글 조회수를 확인 할 수 있는 페이지입니다. |

|게시물 수정|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/bf048fb8-81ec-431e-82ef-6b7f44ad21f6" />|
|게시물 수정을 할 수 있는 페이지입니다. 게시글 사진 변경도 가능합니다.|

|회원정보 수정|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/5081cfc5-7d7b-4678-9752-0e8dd5edbc88" />|
|회원정보를 수정할 수 있는 페이지입니다. 회원탈퇴도 가능합니다.|

|비밀번호 수정|
|:---:|
|<img width="1500" alt="image" src="https://github.com/user-attachments/assets/98494530-f96d-4e2b-87f3-8556be637a5f" />|
|비밀번호를 수정할 수 있는 페이지입니다.|


<br />

## 🗂️ APIs
작성한 API는 아래에서 확인할 수 있습니다.

👉🏻 [API 바로보기](/APIs.md)


<br />

## ⚙ 기술 스택

### Back-end
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Mysql.png?raw=true" width="80">
</div>

### Infra
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/AWSEC2.png?raw=true" width="80">
</div>

### Tools
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Github.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Notion.png?raw=true" width="80">
</div>

<br />

## 🛠️ 프로젝트 아키텍쳐
![no-image](https://user-images.githubusercontent.com/80824750/208294567-738dd273-e137-4bbf-8307-aff64258fe03.png)



<br />

## 🤔 기술적 이슈와 해결 과정
- Stream 써야할까?
    - [Stream API에 대하여](https://velog.io/@yewo2nn16/Java-Stream-API)
- Gmail STMP 이용하여 이메일 전송하기
    - [gmail 보내기](https://velog.io/@yewo2nn16/Email-이메일-전송하기with-첨부파일)
- AWS EC2에 배포하기
    - [서버 배포하기-1](https://velog.io/@yewo2nn16/SpringBoot-서버-배포)
    - [서버 배포하기-2](https://velog.io/@yewo2nn16/SpringBoot-서버-배포-인텔리제이에서-jar-파일-빌드해서-배포하기)


<br />

## FE 프로젝트 구조
```
2-jerry-park-be
├─ DBpools
│  └─ jerryDBpool.js
├─ controllers
│  ├─ .DS_Store
│  ├─ commentController.js
│  ├─ postController.js
│  └─ userController.js
├─ middleware
│  ├─ authMiddleware.js
│  ├─ checkCommentOwner.js
│  └─ checkPostOwner.js
├─ models
│  ├─ commentmodel.js
│  ├─ postmodel.js
│  └─ usermodel.js
├─ package-lock.json
├─ package.json
├─ routes
│  ├─ .DS_Store
│  ├─ commentRoutes.js
│  ├─ postRoutes.js
│  └─ userRoutes.js
├─ server.js
└─ uploads
   ├─ 1736407958922-7495-sad-cat-running.gif
   ├─ 1736408004080-사진 2024. 10. 25. 오후 9.21.jpg
   ├─ 1736408713113-사진 2024. 10. 25. 오후 9.21.jpg
   ├─ 1736429626688-스크린샷 2024-11-05 오후 5.21.38(2).png
   ├─ 1736757633177-스크린샷 2024-12-11 오전 9.49.23.png
   ├─ 1736839518102-8772-minecraft-world-cube.png
   └─ 1733979535806-5226d0d1ad36333b8d349e8f9b10afcb.png

```
