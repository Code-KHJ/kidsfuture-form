# 아이들과미래재단 임직원 AI교육 신청 페이지

아이들과미래재단 임직원 대상 2회기 AI교육 신청을 받는 Next.js 웹앱.
데이터는 구글시트로 저장되고, 어드민 없이 신청자 화면만 운영합니다.

- 기술: Next.js 16 App Router · TypeScript · Tailwind CSS 4 · Motion · React Hook Form · Zod · googleapis
- 배포: Vercel
- 한글 폰트: Pretendard Variable (CDN)
- 키컬러: 보라 `#A395C0` · 연두 `#A6CE39` · 코랄 `#F08673` (재단 공식 CI 3색)

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | 랜딩 · 회기별 안내 · 일정별 잔여 인원 미리보기 |
| `/apply` | 6스텝 신청 폼(본인 → 1회차 → 2회차 → AI수준 → 기대/의견 → 검토·제출) |
| `/complete` | 신청 완료 · 본인 일정 D-day · .ics 다운로드 · 강의 미리보기 |
| `/api/capacity` | GET — 일정별 신청 수 |
| `/api/submit` | POST — Zod 검증 + 정원 재확인 + 시트 append |

## 셋업

```bash
pnpm install
cp .env.local.example .env.local
# .env.local 채운 뒤
pnpm dev
```

`.env.local`은 아래 4가지를 채워야 합니다:

```
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_KEY=      # 보통 JSON 통째로 base64 인코딩한 문자열
SHEET_TAB_NAME=responses
```

### 구글시트 + 서비스 계정 발급 가이드

1. **구글시트 생성**
   - 새 빈 시트를 만든다. 시트 이름은 자유, 탭 이름은 `responses`로 둔다(다른 이름이면 `SHEET_TAB_NAME`에 맞춰 입력). 헤더는 첫 호출 시 앱이 자동 생성합니다.
   - URL `https://docs.google.com/spreadsheets/d/`**`<ID>`**`/edit` 의 `<ID>` 를 `GOOGLE_SHEETS_ID`로 사용.
2. **GCP 프로젝트 + 서비스 계정**
   - https://console.cloud.google.com → 새 프로젝트 (또는 기존)
   - "APIs & Services → Library"에서 **Google Sheets API** 활성화.
   - "IAM & Admin → Service Accounts"에서 새 서비스 계정 생성.
   - 생성된 계정에서 "Keys → Add key → JSON"으로 키 JSON 다운로드.
3. **시트 권한 공유**
   - 서비스 계정 이메일(예: `xxx@xxx.iam.gserviceaccount.com`)을 시트의 "공유"에 **편집자**로 추가.
4. **환경변수 인코딩 (권장)**
   - 받은 JSON 파일을 base64로 인코딩해 한 줄로 변환:
     ```bash
     base64 -i path/to/key.json | tr -d '\n'
     ```
   - 결과를 `GOOGLE_SERVICE_ACCOUNT_KEY`로, JSON 안의 `client_email`을 `GOOGLE_SERVICE_ACCOUNT_EMAIL`로 입력.

## 강사 회사 로고 교체

`public/logo-instructor.png` 파일을 넣고 `components/Header.tsx`의 `<InstructorLogo />`
내부 텍스트 워드마크를 `<Image src="/logo-instructor.png" ... />`로 교체.

## 데이터 모델 (구글시트 `responses` 탭)

| 열 | 키 | 비고 |
|---|---|---|
| A | timestamp | ISO 8601, UTC |
| B | name | 이름 |
| C | team | 부서/팀 |
| D | session1 | `5/26` 또는 `5/29` |
| E | session2 | `6/4` 또는 `6/8` |
| F | ai_level | 1~5 |
| G | expectation | 기대하는 점 |
| H | extra | 기타 의견 (선택) |

## Vercel 배포

1. GitHub에 푸시 후 Vercel에서 import
2. 환경변수 4종을 Vercel Project Settings에 동일하게 등록
3. Framework는 Next.js 자동 인식, Build/Output 기본값 그대로

## 자주 묻는 트러블슈팅

- **`capacity_unavailable` 응답**: 서비스 계정 권한 누락 또는 키 형식 오류. 시트 공유 확인 + base64 인코딩 재확인.
- **헤더 행이 보기 좋지 않음**: 시트에서 1행을 굵게/배경색 적용해도 됨. 앱은 1행에 헤더가 없을 때만 한 번 작성합니다.
- **정원 재마감(409) 발생 시**: 폼이 자동으로 마감된 회차 스텝으로 돌아가 안내합니다.
