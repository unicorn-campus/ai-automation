# ICTK_AM_Curriculum-revise

## 과정 개요

| Claude Code 업무 자동화 부트캠프 |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| 입문자 대상 · 1회 3시간 · 격주 총 11회(33시간) · 의뢰: 아이씨티케이(ICTK) |  |  |  |  |  |
| ■ 과정 기본 정보 |  |  |  |  |  |
| 과정명 | Claude Code 업무 자동화 부트캠프 (입문자 대상) |  |  |  |  |
| 교육 대상 | ICTK 임직원 중 업무 자동화 역량 강화 희망자 |  |  |  |  |
| 사용 도구 | Claude Code — Prompt·Skill·Agent·Plugin·MCP·Playwright·Computer Use·LLM API 연동 |  |  |  |  |
| 교육 형태 | 집합/실습 병행. 1회 3시간, 격주(2주 간격) 총 11회 = 33시간 |  |  |  |  |
| 회차 운영 | 각 회차 종료 시 다음 회차까지 2주간 수행할 과제를 제시. 직전 회차 산출물을 재료로 누적 확장 |  |  |  |  |
| 난이도 운영 | 선수지식 없음 → 점진적 확장. 1회차 설치·기본 사용부터 시작 |  |  |  |  |
| 작성 기준일 | 2026-06-16 |  |  |  |  |
| ■ 학습 골격 (난이도 상승 흐름) |  |  |  |  |  |
| ① Prompt (1~2회) |  | ② Skill (3~4회) |  | ③ Skill+Agent (5회) | ④ Plugin (6회) |
| 확장 역량 (7~8회): 파이썬·CLI·LLM API·자작 MCP |  |  | ⑤ ICTK PoC (9~11회): 자사 실제 유즈케이스 PoC 개발·발표 |  |  |
| Prompt → Skill → Skill+Agent → Plugin 으로 만들 수 있는 자동화 범위가 단계마다 확장됨 |  |  |  |  |  |
| ■ 차별성 요소 |  |  |  |  |  |
| # | 차별성 |  | 설명 |  |  |
| 1 | 4단계 점진 설계 |  | Prompt→Skill→Skill+Agent→Plugin으로 자동화 범위가 단계마다 확장되는 학습 골격 |  |  |
| 2 | 입문자 친화 |  | 비개발자도 따라올 수 있도록 1회차 설치부터 시작, 전문용어 쉬운 설명, 이론:실습 약 1:2 |  |  |
| 3 | 격주·과제 연결 |  | 2주 간격 운영을 살려 과제 결과물이 다음 회차 학습 재료가 되는 누적형 설계 |  |  |
| 4 | 자사 PoC 마무리 |  | 9~11회차에 ICTK 실제 유즈케이스를 3대 카테고리별로 직접 개발·발표 |  |  |
| 5 | 보안 거버넌스 내재화 |  | 데이터 격리·사람 최종 승인·최소 권한·감사로그를 실습 전제로 일관 적용 |  |  |
| ■ 회차 공통 3시간(180분) 시간 배분 (이론:실습 ≈ 1:2) |  |  |  |  |  |
| 구간 |  | 시간(분) | 내용 |  |  |
| 개념 학습 |  | 50 | 핵심 개념 강의 + 데모 시연(이론) |  |  |
| 핸즈온 실습 |  | 100 | 일반/자사 유즈케이스 실습(개인·페어) |  |  |
| 과제 안내·Q&A |  | 30 | 2주 과제 설명 + 질의응답 + 직전 과제 리뷰 |  |  |
| 합계 |  | 180 | 총 3시간(180분) 검증 — 합계가 180이어야 함 |  |  |

## 커리큘럼

| 전체 11회차 커리큘럼 — Prompt → Skill → Skill+Agent → Plugin → 확장 → ICTK PoC |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 회차 | 주제 | 학습 골격 단계 | 학습목표 | 세부주제(요약) | 실습 | 핵심 산출물 | 2주 과제 |
| 1 | Claude Code 입문 + 프롬프트(Prompt) 기초 | Prompt | Claude Code를 설치·설정하고 기본 사용법을 익혀, 업무 자동화 관점의 프롬프트를 작성할 수 있음 | - Claude Code 설치·로그인·기본 설정
- 작업 디렉토리 작성, 시스템 프롬프트 작성 
- 프롬프트 5요소(역할·맥락·입력·출력·제약) | - 긴 문서 핵심 3줄 요약 생성
- 회의 메모를 표준 회의록 형식으로 정리 
- 시장조사  | 설치 완료 + 업무 프롬프트 5종 | 본인 업무 반복 작업 3가지를 5요소 구조 프롬프트로 작성해 결과 비교(2회차 심화 재료) |
| 2 | 커넥터·루틴·Computer use 활용 | Prompt | 커넥터(MCP 연결)·루틴(Scheduled tasks)·Computer use 개념을 실습할 수 있음 | - 커넥터 연결: GitHub, Gmail, Drive, PlayMCP 등 연동 방법 
- MCP 서치 및 설치 방법 
- 루틴(반복 실행) 개념·설정
- Computer use 개념·한계·주의점 | - 이동경로 추천 및 맛집 찾기(카카오맵 MCP)
- 매일 아침 특정 주제 뉴스레터 메일로 받기 
- Computer use로 홈택스 제어: 국세완납증명서, 세금계산서 발급(데모). 메모리에 기억 시키기, Codex에서 수행(데모) | 커넥터 연결 + 루틴 1건 | 정기 반복 작업 1개를 루틴 후보로 설계(트리거·입력·출력 정의) — 3회차 Skill화 재료 |
| 3 | Skill 기초 | Skill | SKILL.md 자연어 지침만으로 동작하는 자동화를 만들 수 있음 | - Skill 개념(반복 프롬프트를 재사용 SKILL.md로 승격)
- SKILL.md 구조(목표·역할·맥락·입력·작업방법·출력·제약)
- 유저스콥과 프로젝트 스콥 이해 
- Claude 내장 스킬: goal, security-review, code-review 등 | - 법률 상담 스킬(Korean Law MCP 연동) 
- 정보조사 스킬: 특정주제 정보 검색, 레포트 작성, 웹 페이지로 가시화 하기, PPT 슬라이드 작성 | SKILL.md 1개(문서 초안) | 2회차 설계 반복 작업을 Skill로 구현·3회 이상 실사용 후 개선점 기록 |
| 4 | Skill 심화 + 웹브라우저 MCP + MCP 개발 | Skill | Skill에서 웹브라우저 MCP로 웹을 자동 조작할 수 있고, 필요한 MCP를 제작하여 스킬과 연동함 | - Playwright MCP와 Claude in Chrome MCP 소개 
- context7, sequential thinking MCP 이해
- 파이썬 기초
- MCP 이해와 개발
 | - Playwright MCP로 OpenAI API Key 생성 
- 논문찾기: Claude in Chrome MCP로 아카이브에서 '반도체' 관련 논문 검색하여 내용 요약
- GPT Image 모델을 이용한 이미지 생성 MCP 제작 후 정보조사 스킬에 이미지 생성 기능 추가  | MCP 연동 Skill + 웹 조회 Skill | 웹(사내 또는 사외)에서 주기적으로 확인하는 정보 1개를 Playwright MCP 조회 Skill로 구현  |
| 5 | Skill + Agent 개발 | Skill+Agent | 오케스트레이터 Skill이 서브에이전트(작성자·검토자 등)를 호출하는 다단계 자동화를 만들 수 있음 | - 에이전트·서브에이전트 개념, 오케스트레이션 흐름(분배→실행→종합)
- 역할 분리 설계(작성자/검토자, 수집자/요약자)
- 하네스 엔지니어링 적용: 비용/성능/보안 관점 | - 정보조사 스킬을 스킬+에이젼트로 변환하고 하네스 엔지니어링 추가 
- PR 품질 보고서: PR에 대한 품질·보안 병렬 검토 (Claude 빌트인 스킬 활용)
- 커밋 전 코드 검토: 커및 전 품질·보안 병렬 검토 (Claude 빌트인 스킬 활용)
- 주간 기술 부채 누적 리포트 자동화: 매주 지난 7일간 머지된 PR 목록을 조회 → 각 PR을 병렬 리뷰 → 팀 주간 리포트 생성 | Skill+Agent  | - 3회차 스킬을 Skill+Agent로 개발(하네스 엔지니어링 적용 포함) |
| 6 | Plugin 개발 및 배포 | Plugin | 스킬·에이전트·MCP 설정을 묶어 배포하는 플러그인을 제작·배포할 수 있음 | - Plugin 개념(검증된 워크플로우를 묶어 사내 표준 배포)
- Plugin 구성요소·디렉토리 구조·메타데이터
- 배포·설치·버전 관리 흐름 
- Hook 이해 및 플러그인에 추가  | - 정보조사 스킬+에이젼트를 플러그인으로 전환  
- PR 품질 보고서 플로그인 
- Hook 이용한 민감정보 차단/마스킹 | 동작하는 Plugin | 5회차 다단계 Skill을 Plugin으로 패키징하고 설치 가이드(README) 작성 |
| 7 | Cloud LLM API 연동(STT/TTS/VLM) + YouTube검색  | 확장 | LLM API로 STT·TTS·VLM 프로그램을 만들고, YouTube 검색 프로그램을 제작하여 플러그인과 연계 | - LLM API 호출(키 관리·요청·응답 처리)
- STT/TTS/VLM 프로그램 개발 및 MCP 서버 전환
- YouTube 검색 + YouTube 자막 검색 프로그램 개발 및 MCP 서버 전환 | - 회의록 작성 플러그인: 회의 녹음 → STT 전사 → 회의록 작성 → 회의록 메일 발송  
- EDA 이미지 분석 스킬: VLM 이용한 MCP 서버 개발 
- 정보조사 플러그인에 YouTube 영상/자막 검색 MCP 추가 | LLM API 프로그램 + 자작 MCP | 6회차 산출물에 Cloud LLM API 연동, YouTube검색 MCP를 추가하여 연동  |
| 8 | Local LLM 연동 | 확장 | 용도별 경량 Local LLM을 MCP로 개발하여 연동할 수 있음 
- EXAONE: 문서요약 
- Docling: PDF 변환 
- whisper+pyannote: STT+화자분리  
- Qwen3-VL: VLM  | - EXAONE 이용한 문서요약 방법 이해 
- Docling 이용한 PDF 변환 방법 이해 
- Whisper+Pynnote 이용한 STT 및 화자분리 이해 
- Qwen4-VL 이용한 이미지 분석 방법 이해 

 | - Local LLM 연동한 문서요약, PDF 변환, STT/화자분리, 이미지 분석 MCP 개발 | Local LLM 연동한 MCP 서버 | 6회차 산출물에 Local LLM 연동 MCP 추가 |
| 9 | ICTK 특화 ① 기본 플러그인 개발 | ICTK PoC | MCP나 API 없이 순수 지침만으로 ICTK 업무 특화 플러그인 개발할 수 있음 | - 조별 플러그인 주제 선정 
- 플러그인 개발 
  - 프롬프트 제작 및 테스트 
  - 스킬 + 에이젼트 전환 
  - 플러그인 패키징 
- 하네스 엔지니어링 적용  | 조별 플러그인 개발 | 조별 플러그인 | 조별 플러그인 완성 |
| 10 | ICTK 특화 ② MCP/API 연동 플러그인 개발 | ICTK PoC | MCP나 API 연동하여 ICTK 업무 특화 플러그인 개발할 수 있음 | - 조별 플러그인 주제 선정 
- 플러그인 개발 
  - 프롬프트 제작 및 테스트 
  - 스킬 + 에이젼트 전환 
  - 플러그인 패키징 
- 하네스 엔지니어링 적용  | 조별 플러그인 개발 | 조별 플러그인 | 조별 플러그인 완성 |
| 11 | 최종 발표 | ICTK PoC | 조별 플러그인 발표, 개인별 플러그 중 우수 플러그인 발표 | - 조별 플러그인 발표 
- 우수 개인 플러그인 발표  | 조별/개인별 플러그인 발표 | 조별/개인별 플러그인 | 30/60/90일 업무 적용 계획 |
| ※ 커리큘럼은 AI 발전, 수강생/ICTK 요청, 그외 상황에 따라 변동될 수 있음 |  |  |  |  |  |  |  |

## 평가 및 교육환경

| 평가 / 수료 기준 · 교육환경 |  |  |  |  |
| --- | --- | --- | --- | --- |
| ■ 평가 항목 (입문자 과정 — 실습 산출물·적용 노력 중심) |  |  |  |  |
| 영역 | 비중 | 평가 방법 |  |  |
| 출석 | 0.3 | 11회차 중 80% 이상(9회차 이상) 출석 |  |  |
| 과제 수행 | 0.4 | 매 회차 2주 과제 제출·실행 기록(10회 과제 중 70% 이상 제출) |  |  |
| 최종 PoC | 0.3 | 9~11회차 자사 유즈케이스 PoC 개발 + 11회차 발표 |  |  |
| 합계 | 1 | 비중 합계 검증 — 반드시 100%(1.0)여야 함 |  |  |
| ■ 수료 기준 |  |  |  |  |
| 출석 80% 이상(9회차 이상) 그리고 과제 70% 이상 제출 그리고 최종 PoC 발표 완료 시 수료 |  |  |  |  |
| 최종 PoC는 1개 이상을 동작하는 형태로 구현 |  |  |  |  |
| 하네스 엔지니어링을 적용 수준에 따라 가점 |  |  |  |  |
| ■ 교육환경 (수강 전제) |  |  |  |  |
| 필수 도구 | Claude Code 설치(수강자 PC), Git Client, Window Terminal, vscode   |  |  |  |
| 런타임 | Python(3.13) 설치 |  |  |  |
| 네트워크 | 인터넷 연결 |  |  |  |
| 계정·권한 | Claude Code 사용 계정(Pro 이상),  OpenAI/Groq API Key, YouTube Data API Key  |  |  |  |
| 사전 설치 프로그램 가이드: https://github.com/unicorn-plugins/npd/blob/main/resources/guides/setup/prepare.md
※ "공통 필수 설치" 항목만 설치,  AI툴은 Claude Code 만 설치, NPD 플러그인 설치 하지 말것 |  |  |  |  |

## 강사 소개

| 강사 소개 |  |  |  |
| --- | --- | --- | --- |
| ■ 기본 정보 |  |  |  |
| 성명 | 이해경 |  |  |
| 현재 소속 | 유니콘주식회사 (CEO) |  |  |
| 교육 철학 | "실습으로 증명하고, 프로젝트로 완성하는 교육" — 실무 경험과 이론의 결합이 효과적 솔루션의 핵심이며, 개발자와 사용자의 직접 소통이 혁신을 이끄는 동력이라고 판단함 |  |  |
| 본 과정 적합성 | 입문자~실무 적용까지 단계적으로 끌어올리는 부트캠프 코칭 경험 + Claude Code 활용 역량 보유. Prompt→Skill→Skill+Agent→Plugin 점진 설계 + 자사 PoC 마무리 운영에 적합 |  |  |
| ■ 핵심 역량 |  |  |  |
| AI / GenAI | AI 기반 기획·설계·개발·배포 코칭(Claude·Claude Code·Cursor 활용), 머신러닝/딥러닝 설계·개발, 생성형 AI 기반 서비스 기획·프로덕트 매니지먼트 |  |  |
| Cloud Native | Cloud Native App 개발/배포(Docker·Kubernetes·Helm·Jenkins·Istio·ArgoCD·Spring Boot/Cloud·React/Vue), MSA 설계(DDD·Cloud Design Pattern·UML/Clean/Hexagonal), IBM Cloud Garage 워크숍 주도 |  |  |
| Agile Coaching | 팀빌딩·Lean Startup·Scrum·Kanban 코칭(KB·하나은행·코스콤 등), 자산관리·부동산 임대관리·건강 적금·자동차검사 예약 등 실무 프로젝트 기획/개발/출시 |  |  |
| ■ 주요 강의 이력 |  |  |  |
| 기업 교육 | KTDS Digital Garage 1~5기(App Modernization), KB DigiTech Bootcamp(신입행원 애자일·MVP), KB 마이데이터/기업뱅킹/수신상품부/Wallet 애자일 코칭, KB PO 연수 코칭, 비상교육 CNA 부트캠프, HANA IBM Cloud Garage, MetLife DDD&AM 설계·Pilot 구축 |  |  |
| 공공/대학 교육 | 연세대 AI 최고경영자 과정 1~3기(산업별 AI 유즈케이스·생성형 AI 기획), AI 활용 DT 서비스 기획자 멘토링, AI 활용 프로덕트매니저 부트캠프, CNA 부트캠프(러닝스푼즈 협업) |  |  |
| ■ 자격 / 인증 · 저서 / 활동 |  |  |  |
| 자격/인증 | IBM Certified Agile Coach, PSM I(Professional Scrum Master), PMP, JTBD & ODI Associates, IBM Certified Architect |  |  |
| 저서 | 「마이크로서비스패턴 쉽게 개발하기」 |  |  |
| 블로그/활동 | 온달의 해피클라우드 (https://happycloud-lee.tistory.com) — 약 79만 조회수 |  |  |
| 연락처 | hiondal@gmail.com / 82-10-4095-4035 |  |  |
| 출처: instructor-profile.md |  |  |  |
