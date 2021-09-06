<p align="center"><img src="https://user-images.githubusercontent.com/36994104/132230666-31fbfd2f-0874-4992-b7e1-b269f7ad76c6.png"></p>
 
# SBOT
공부 시간을 관리하는 디스코드 봇입니다. 다음과 같은 기능을 사용할 수 있습니다.
 - 스톱워치를 사용하여 공부 시간 체크하기
 - 오늘 하루 총 공부 시간을 기록하기
 - 목표 시간을 정해서 공부하기  
<br>

## 시작하기
1. 원격 저장소를 복제한 뒤 모듈을 설치한다.
```bash
git clone https://github.com/SeungHe0n/SBOT.git
cd SBOT
npm install
```

2. config.json 파일을 만들어 디스코드에서 발급받은 봇 토큰을 입력한다.
```json
{
    "TOKEN" : "EnterYourBotTokenHere"
}
```

3. 다음 명령어를 실행하면 봇이 시작한다.
```bash
npm start
```
<br>

## 명령어
### 일반 명령어
- `help`  
사용할 수 있는 명령어를 알려줍니다.  
- `start` , `s`  
스톱워치를 시작합니다.  
- `pause` , `p`  
스톱워치를 멈춥니다.  
- `hours` , `h`  
하루동안 스톱워치를 사용하여 얼마나 공부했는지 알려줍니다.  
- `today` , `t`  
오늘의 날짜를 알려줍니다.  
- `goal` , `g`  
목표 공부시간을 알려줍니다.  

### 관리 명령어
- `setgoal [hours]`  
[hours]를 목표 공부시간으로 설정합니다. 기본값은 6으로 설정되어 있습니다.
- `set daily summary`  
명령어를 입력한 채널에 자정마다 **하루 공부시간 요약**이 올라갑니다.
- `clear daily summary`  
명령어를 입력한 채널의 **하루 공부시간 요약**을 해제합니다.
<br>

## 사용하기
<p align="center"><img src="https://user-images.githubusercontent.com/36994104/132228126-86844ec7-f3d8-42c6-b874-88e2215e43f4.gif"></p>
<br>

## 서버
서버구축중


---
![badge](https://img.shields.io/badge/%EC%A0%9C%EC%9E%91%EA%B8%B0%EA%B0%84-21.08.31%20~%2021.09.06-yellow)
