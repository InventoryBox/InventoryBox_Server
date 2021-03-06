# :package: 재고창고

<Br/>
<img style="border: 1px solid black !important; border-radius:20px; " src="https://github.com/InventoryBox/InventoryBox_Server/blob/master/img/logo.gif" width="200px" />
<br/>

![node_badge](https://img.shields.io/badge/node-%3E%3D%208.0.0-green)

![npm_bedge](https://img.shields.io/badge/npm-v6.10.1-blue)

* <b> SOPT 26th APPJAM

* 프로젝트 기간: 2020.06.13 ~ 2020.07.18

* [API 문서](https://github.com/InventoryBox/InventoryBox_Server/wiki)

* [API진척도 & Postman Runner](https://github.com/InventoryBox/InventoryBox_Server/blob/master/FinalSubmit.md)</b>


<br>

## :bookmark_tabs: 프로젝트 설명

<b>'나만의 다이어리를 관리하듯 매일매일 쉽게 기록하고 성장할 수 있는 재고관리 플랫폼', 재고창고입니다. :package: </b><br/>
발주시점을 놓치지 않게 도와주는 발주 알림 기능, 데이터를 쉽게 축적할 수 있는 재고 기록 기능이 있습니다. 또한，재고교환 기능을 통해 재고가 떨어지는 갑작스러운 상황에도 개인 사업자들간 네트워크 형성을 통해 재고를 보충할 수 있습니다.
 <br>

## :bookmark_tabs: WorkFlow

![node_badge](https://user-images.githubusercontent.com/63707317/86822421-92f7ea80-c0c6-11ea-965f-0d14951ce44e.png)

<br>

## :earth_americas: Team Role 

#### :surfing_man: 김정욱
 
* 백엔드 리드 개발자
* DB 설계 및 구축
* 홈화면 조회 기능 구현
* 재료추가 화면 조회 기능 구현
* 기록수정 화면 조회 기능 구현
* 오늘 재고 기록하기 화면 조회 기능 구현
* 카테고리 정보 조회 기능 구현
* 재료추가 저장 기능 구현
* 기록수정 및 오늘재고기록 저장 기능 구현
* 카테고리 및 재료 변동 저장 기능 구현

#### :surfing_man: 임형준

* DB 설계 및 구축
* AWS(EC2, RDS, S3) 연결
* 회원가입 기능 구현
* 로그인 기능 구현
* 유저 관련 기능 ( CRUD ) 기능 구현
* 이메일 인증 관련 기능 구현
* 홈화면 기능 구현
* 재고 정보 관련 기능 구현
* 소셜 로그인 기능 구현 ( 보류 )

#### :surfing_woman: 백선혜 

* DB 설계 및 구축
* 더미데이터 관리
* 카테고리별 재고량 그래프 기능 구현
* 한 아이템 주별 선택 그래프 구현
* 한 아이템 주별 비교 그래프 구현
* 한 아이템 발주정보 수정 기능 구현
* 재고교환 홈화면 거리순, 가격순, 최신순 기능 구현
* 재고교환 검색 거리순, 가격순, 최신순 기능 구현
* 재고교환 사용자 사업장 주소 수정 기능 구현

<br>

## :heavy_check_mark: 핵심 기능 설명
* (홈화면) 발주해야 할 재료의 목록 및 5일간 재고량 변화 출력
* (재고기록) 날짜에 따른 재고기록 및 사용자별 카테고리 추가 및 삭제
* (재고량 추이) 월 or 주차별 재고량 변화 그래프 표현 및 선택 주차 재료추이 비교
* (재고교환) 잉여 재고교환을 위한 시스템 제공, 거리순 게시글 정렬 및 좋아요 목록 활성화
<!--
* url로 해당 게시물의 썸네일, 제목, 소개 크롤링.
* 공유하기 버튼을 사용하여, 쉽게 공유하기 가능.
* 그룹 내 사용자들의 조회수 및 북마크수를 기반으로 Top3 게시물 추천.
* 회사 내에 게시물들을 정리하여 통계적 그래프로 시각화.
* 중복되지 않는 조직 코드 생성 -->

<br>

## :blue_book: Package

사용 패키지(모듈)은 다음과 같습니다.

* **crypto** : 패스워드 암호화 및 인증 
* **express** : 웹, 서버 개발 프레임워크
* **express-formidable** : form-data 파싱 도구
* **jsonwebtoken** : JWT(Json Web Token) 생성 및 인증 
* **multer** : 파일 업로드 도구
* **multer-s3** : AWS S3 파일 업로드 도구
* **rand-token** : 랜덤 토큰 생성 도구

``` json
 "dependencies": {
    "aws-sdk": "^2.713.0",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "morgan": "~1.9.1",
    "multer": "^1.4.2",
    "multer-s3": "^2.9.0",
    "nodemailer": "^6.4.10",
    "passport": "^0.4.1",
    "passport-kakao": "^1.0.0",
    "promise-mysql": "^4.1.3",
    "rand-token": "^1.0.1"
  }
```

<br>

## :green_book: Architecture

![architecture](https://raw.githubusercontent.com/InventoryBox/InventoryBox_Server/master/img/architecture.png)

  

<br>

## :orange_book: DB ERD

![ERD](https://github.com/InventoryBox/InventoryBox_Server/blob/master/img/ERD.JPG)

<br>

## :closed_book: 배포

* AWS EC2 - 클라우드 컴퓨팅 시스템
* AWS elastic beanstlak - 서버 배포및 관리 프로비저닝 서비스
* AWS S3 - 클라우드 데이터 저장소
<!-- * Docker - 컨테이너 기반 가상화 소프트웨어 플랫폼
* Nginx - 프록시 서버 (보안 향상 및 캐시를 활용한 전송 속도 향상) -->

<br>

## :books: 사용된 도구 

* [Node.js](https://nodejs.org/ko/)
* [Express.js](http://expressjs.com/ko/) 
* [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
* [PM2](http://pm2.keymetrics.io/) - 프로세스 관리자
<!--* [Docker](https://www.docker.com/) - 컨테이너 기반 가상화 플랫폼
* [Nginx](https://www.nginx.com/) - 웹 서버 소프트웨어(프록시 서버용) -->

<br>

## :computer: 개발자

* [김정욱](https://github.com/neity16)
* [임형준](https://github.com/camel-man-ims)
* [백선혜](https://github.com/100sun)

<br>

## :office: 회고 및 피드백

* [회고](https://github.com/InventoryBox/InventoryBox_Server/wiki/%ED%9A%8C%EA%B3%A0-%EB%B0%8F-%ED%94%BC%EB%93%9C%EB%B0%B1)



