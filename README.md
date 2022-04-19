<p align="center"><img src="https://user-images.githubusercontent.com/36994104/132232093-7b2a5a62-b2d9-4250-9970-baa9703dc23f.png"></p>
 
# ⏰ SBOT
**디스코드로 캠스터디를 하기 위해 만들어졌습니다. 이런 일들을 할 수 있어요 !**
- 스톱워치로 내 공부시간 체크하기
- 목표 시간 정해서 공부하기
- 하루동안 얼마나 공부했는지 정리하기
- 손쉽게 캠스터디 환경 조성하기
### > SBOT과 잘맞는 친구들 👩‍👧‍👦
- 스터디 어플의 캠스터디 기능이 자꾸 튕기는 소이
- 디스코드 환경이 익숙한 정은
- 모르겠고, 스톱워치 쓰고 싶은 세정
# ✍ 시작하기
### 1. SBOT을 내 서버에 초대합니다.
생성된 SBOT 채널은 삭제해도 상관없어요. 하지만 삭제한다면 다시 생기지 않아요.
<p align="center"><img src="https://user-images.githubusercontent.com/36994104/134497310-18704528-43ae-4b7b-a9c1-c58539c7e413.gif"></p>

### 2. 캠스터디 환경을 조성하고 싶다면, `init`을 입력하세요.

자동으로 공부 채널을 만들어 줘요. `init`을 하지 않아도 SBOT을 이용할 수 있어요.

<p align="center"><img src="https://user-images.githubusercontent.com/36994104/134497313-0302fe89-7751-4b82-972f-938b338d8c3f.gif"></p>

### 3. `start`로 스터디를 시작하세요 !

`start`로 스톱워치를 실행해 스터디에 참여하세요. `help`를 통해 명령어를 언제든지 확인할 수 있습니다.

<p align="center"><img src="https://user-images.githubusercontent.com/36994104/134497318-9c3bb6e4-aad8-44c8-bcf5-06218003b87c.gif"></p>

# 💬 사용하기

### # 공부시간 체크하기

아래 명령어가 생각나지 않을 때는 `help`를 입력하세요.

-   `start` `s` 스톱워치를 시작합니다.
-   `puase` `p` 스톱워치를 멈춥니다.
-   `time` `t` 오늘 얼마나 공부했는지 알려줍니다.
-   `goal` `g` 목표 공부시간을 알려줍니다.

### # 캠스터디 환경 만들기

-   `init` 캠스터디 전용 카테고리와 채널을 생성하고 봇 권한을 부여합니다.

### # 하루 정리 설정하기

**하루 정리**는 하루 동안의 누적 공부시간이 목표 시간을 도달했는지 알려주는 기능입니다.  
하루 정리는 한 채널에만 설정할 수 있습니다.

-   `set summary` 명령어를 입력한 채널에 하루 정리를 설정합니다.
-   `clear summary` 명령어를 입력한 채널의 하루 정리를 해제합니다.

### # 한글 명령어 적용하기

자주 사용하는 명령어인 `s` `p` `t` `g` 를 한글 `ㄴ` `ㅔ` `ㅅ` `ㅎ` 로도 사용할 수 있습니다.  
한글 명령어 기능은 모든 채널에 적용됩니다. 따라서 한글 명령어를 적용할 경우, 시간 체크 전용 채널을 만드는 것이 좋습니다.

-   `set korean` 한글 명령어를 적용합니다.
-   `clear korean` 한글 명령어를 해제합니다.

### # 세부 값 조정하기

세부 값을 조정해서 나한테 맞는 스터디를 만드세요.

-   `set goalhour [hour]` 목표 공부시간을 `[hour]`시간으로 설정합니다. 기본값은 6시간입니다.
-   `set summarytime [hour] [min]` 하루 정리가 `[hour]`시 `[min]`분을 기준으로 작동합니다. 0시 0분 ~ 23시 59분 사이로 입력해주세요. 기본값은 0시 0분(자정)입니다.

# 👀 미리보기

SBOT은 어떻게 동작할까요?

### 일반 사용자 시점

<p align="center"><img src="https://user-images.githubusercontent.com/36994104/134497720-fc7d7243-a450-4ecb-8abd-c8351cfb07a0.gif"></p>
<p align="center"><img src="https://user-images.githubusercontent.com/36994104/134697984-a5823575-0121-4114-9e71-aca2d311637a.gif"></p>

### 관리자 시점

<p align="center"><img src="https://user-images.githubusercontent.com/36994104/134497728-ab246907-648c-4649-9144-cab6d093b9fe.gif"></p>

# 💻 소스코드 사용하기

### 1. 원격 저장소를 복제한 뒤 모듈을 설치합니다.

```bash
git clone https://github.com/SeungHe0n/SBOT.git
cd SBOT
npm install
```

### 2. config.ts 파일에 디스코드에서 발급받은 봇 토큰과 봇 아이디를 입력합니다.

src 폴더 안의 config.example.ts를 수정하여 아래와 같은 config.ts 파일을 만드세요.  
config.ts 파일은 src 폴더 안에 있어야 합니다.

```tsx
export const config = {
    token: 'enterYourBotTokenHere',
    id: 'enterYourBotIdHere'
};
```

### 3. 다음 명령어를 실행하여 봇을 시작하세요.

```bash
npm start
```

### 4. 서버에 봇을 초대하세요.

봇의 Intents 항목을 모두 체크한 뒤, OAuth2 URL Generator 를 통해 서버에 봇을 초대하세요.

-   scope = bot
-   permissions = 268568592  
    `Manage Roles`, `Manage Channels`, `Send Massages`, `Mention Everyone` 체크하기
    <br>  
    <br>

---

세상의 모든 취준생들을 위하여.  
**Thanks to** 박정은, 이은혜, 김소이, 이세정
