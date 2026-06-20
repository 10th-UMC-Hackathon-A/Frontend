# Frontend

<br>

## 폴더 구조

```
HACKATHON_A_FRONTEND/
├── public/
├── src/
│   ├── api/          # API 호출 함수
│   ├── assets/       # 이미지, 폰트 등 정적 파일
│   ├── components/   # 공통 컴포넌트
│   ├── hooks/        # 커스텀 훅
│   ├── pages/        # 페이지 컴포넌트
│   ├── router/       # 라우터 설정
│   ├── store/        # 전역 상태 관리
│   ├── types/        # TypeScript 타입 정의
│   ├── utils/        # 유틸리티 함수
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

<br>

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 작성해주세요.

```env
VITE_API_BASE_URL=http://your-api-server-url
```

<br>

## 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

<br>

## 브랜치 전략

### 브랜치 구조

```
main
└── dev
    ├── feat/기능명
    ├── fix/버그명
    └── refactor/명칭
```

| 브랜치 | 용도 |
|--------|------|
| `main` | 배포용 브랜치. 직접 커밋하지 않습니다. |
| `dev` | 개발 통합 브랜치. 기능 개발 완료 후 여기에 머지합니다. |
| `feat/기능명` | 기능 개발 |
| `fix/버그명` | 버그 수정 |
| `refactor/명칭` | 코드 개선 |

브랜치 네이밍은 **케밥 케이스**를 사용합니다.

```
feat/login-api
fix/vote-410-error
```

### 작업 흐름

```
1. dev 브랜치에서 feature 브랜치를 생성합니다.
2. 작업 완료 후 dev 브랜치로 PR을 올립니다.
3. 코드 리뷰 후 dev에 머지합니다.
4. 배포 시 dev → main으로 머지합니다.
```

<br>

## 커밋 컨벤션

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 (주로 main에서 README.md 작성) |
| `refactor` | 코드 리팩토링 |
| `style` | 포맷, 공백 등 스타일 변경 |
| `chore` | 파일 옮기기, 파일 이름 변경, 주석 추가 등 단순한 작업 |
| `build` | 라이브러리 설치 |

```
feat: 투표 페이지 구현
fix: 410 에러 핸들링 추가
docs: README 작성
```

<br>

## ISSUE/PR 규칙

- ISSUE, PR은 **템플릿에 맞춰** 작성합니다.
- PR 제목에 **닉네임 / 이름**을 기입합니다.

```
[홍길동] feat: 투표 페이지 구현
```
