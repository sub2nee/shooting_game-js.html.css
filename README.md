# shooting_game_(HTML,CSS,JS,jQuery)
슈팅게임 응용하기 https://make-shooting-game.netlify.app/ <br>
첫번째 미니프로젝트와는 다르게 HTML,CSS,JS,jQuery를 이용하여 만든 두번째 미니프로젝트입니다.



## :computer: 사용 기술
Design tool: Adobe Photoshop

Editor: VScode

Lang

-HTML,CSS,JS

-jQuery

배포:Netlify


## :video_game: 게임 조작 방법
이동 : 마우스로 전,후,좌,우 이동

공격 : 스페이스 키보드

`운석,보스공격또는 보스가 플레이어에게 닿으면 게임오버`

게임 오버 시 점수와 함께 모달창이 나오고 재시작/게임종료 버튼을 선택 할 수 있습니다.

## :star2: 구현 기능
- 플레이어 이동을 키보드가 아닌 마우스로 이동하도록 구현해보기

- 폭발이펙트를 만들어서 게임의 이벤트요소 더하기

- 보스 출현 및 보스의 단계가 상승하면서 난이도 상승시키기(보스의 HP상승)

- 오디오 컨트롤러 없이 음량 조절하기

---

### :camera:게임 화면 캡처
![main](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/f35aa354-5796-459d-b04d-1a2821a46cfe)

> # 메인 화면
> * 게임의 스타트버튼과 나가기버튼을 구현 (나가기버튼 클릭시 윈도우창 종료)
>  `마우스커서 커스텀`

![play](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/96763326-c0e4-443c-95e0-6375ccfe811c)

> # 플레이화면
> * 플레이어는 내려오는 운석을 피하거나 파괴시킵니다.
>  `게임 시작 시 cursor: none`

![Boss_appearance](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/bf37f383-8fe1-4c3a-bd04-c9d99388dcee)
> # 보스 출현 알림
> * 보스 출현 전 warnning 경고음과 함께 해당 UI가 보여집니다.
> 

![Boss](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/63eacbf6-64ff-4e52-ae0c-29a28feaa70f)
> # 보스 출현
> * 보스가 출현하고 플레이어는 보스를 파괴시켜야합니다.
> * 보스를 파괴하면 플레이어의 타이머를 60초 추가됩니다.
> * 보스는 난이도에 따라 HP가 상승됩니다.
> 
> >`제한 시간 내 파괴시키지 못하면 gameover`

![Boss_Alert](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/9270ff94-b1ab-4697-817e-04e7756e3cda)
> # 보스 공격 알림
> * 보스가 공격하기 전 경고음과 함께 해당 UI가 보여집니다.
>

![Boss_attack](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/1d6b3350-2cab-4199-8526-f4b42ebb80f4)
> # 보스 공격
> * 보스의 공격, 보스는 파괴되기 전까지 계속해서 공격을 합니다.
> 
> >`보스의 공격에 맞으면 gameover`

![game_end](https://github.com/sub2nee/shooting_game-js.html.css/assets/121946266/07ce0356-a00f-4dd8-89de-0dd0f33a32d2)
> # 게임오버
> * 플레이어의 점수와 함께 게임재시작 or 게임 종료를 묻는 모달창이 띄워집니다.
> 
