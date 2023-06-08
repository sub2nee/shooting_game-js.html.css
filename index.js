/**********************[ Option ]****************************/
const backgroundMusic = new Audio('sound/mainTheme.mp3');
const bossThem = new Audio('sound/BossTheme.mp3');
const warningSound = new Audio('sound/warning_alarm.ogg');
const dangerSound = new Audio('sound/danger_alarm.mp3');
const laserSound = new Audio('sound/laser.wav');
const bossLaserSound = new Audio('sound/BossLaser.wav');
const gameOverSound = new Audio('sound/gameOver.wav');
const bossDeathSound = new Audio('sound/BossDeath.wav');
/************************************************************/
let isGameStart = false;
let isSpacePressed = false;
let basicTimer = 120; //게임시간
let timer = basicTimer;
let maxTimer = timer;
/**********[보스 기본설정]**********/
let isBoss = false;
let bossTimer = 20; //보스 출현시간
let damage = 1; //플레이어의 기본 데미지
let bossNum = 1;
let basicBossHp = 20;
let bossHp = basicBossHp; //보스 기본 체력
let beamTimer = 8; //보스 공격나오는 시간
let beamTimerDelay = 5; //빔 유지시간
let nextBeamTime = beamTimer;
let isBeam = false;
/**********************************/

function gameStart() {
    $('body').css('cursor', 'none');
    $('#main').css('display', 'none');
    $('#game,#gameUI').css('display', 'block');
    isGameStart = true;
    console.log('Game Start');
    backgroundMusic.play();
}

function reOption() {
    $('#game,#gameUI,#boss,#bossGauge,.warn,.dan').css('display', 'none');
    isGameStart = false;
    isBoss = false;
    score = 0;
    for (let i = 0; i < explosionId; i++) {
        $('.explosion_' + i).remove();
    }
    shipId = 1;
    missileId = 0;
    meteorId = 0;
    expAudId = 0;
    explosionId = 0;
    timer = basicTimer;
    maxTimer = timer;
    bossNum = 1;
    bossHp = basicBossHp;
    nextBeamTime = beamTimer;
    bossGaugeBar();
    $('#timer').text(timer);
    backgroundMusic.pause();
    bossThem.pause();
    warningSound.pause();
    beamOff();
    isBeam = false;
    $('#score').text(score);
}

function gameEnd() {
    $('#endScore').text(score);
    $('#endUI').css('display', 'block');
    reOption();
    backgroundMusic.currentTime = 0;
    gameOverSound.play();
    openModal();
}

function reGame() {
    $('#main').css('display', 'block');
    $('#ship').css('display', 'block');
    $('#endUI').css('display', 'none');
    closeModal();
    reOption();
    if (!$('.start_btn').data('click-bound')) {
        $('.start_btn').on('click', function () {
            gameStart();
        });
        $('.start_btn').data('click-bound', true);
    }
    console.log('Go main menu and restart');
    $('#endScore').text(score);
}

function gameExit() {
    window.close();
}

function time() {
    if (isGameStart) {
        if (maxTimer - (bossTimer - 5) == timer) {
            $('.warn').css('display', 'block');
            $('#boss').attr('src', 'img/game/boss/bosses/' + bossNum + '.png');
            bossHp = basicBossHp * bossNum;

            backgroundMusic.pause();
            dangerSound.pause();
            bossThem.pause();

            warningSound.loop = true;
            warningSound.play();
        }
        if (maxTimer - bossTimer == timer) {
            isBoss = true;
            $('.warn').css('display', 'none');
            $('#bossGauge,#boss').css('display', 'block');
            warningSound.pause();
            dangerSound.pause();
            backgroundMusic.pause();
            bossThem.currentTime = 0;
            bossThem.play();
            bossThem.volume = 0.7;
        }
        if (isBoss) {
            if (beamTimer - 3 == nextBeamTime) {
                $('.dan,#tri').css('display', 'block');
                warningSound.pause();

                dangerSound.loop = true;
                dangerSound.volume = 0.5;
                dangerSound.play();
            }
            if (nextBeamTime == 0) {
                beamOn();
                dangerSound.pause();
            }
            nextBeamTime--;
        }

        if (timer === 0) {
            gameEnd();
        } else if (bossNum >= 10) {
            var modalBody = $('.modal_body');
            modalBody.css('background-image', 'url(img/UI/End_Menu/winModal.png)');
            $('body').append(modalBody);
            gameEnd();
        }
        $('#timer').text(timer);
        timer--;
    }
}
/**********************************************************/
let missileSpeed = 100; // ms높아질수록 느리게 나온다.
let missileId = 0;
let missileObj =
    '<img src="img/game/missile/missile.png" class="missile" id="missile_{x}">';

function missile() {
    if (isGameStart) {
        if (isSpacePressed) {
            var newMissile = missileObj.replace('{x}', missileId);
            $('#game').append(newMissile);
            var nowMissileId = missileId;
            $('#missile_' + missileId).css({
                top: cursorY + 'px',
                left: cursorX + 'px',
            });

            setTimeout(function () {
                $('#missile_' + nowMissileId).addClass('on');
                setTimeout(function () {
                    $('#missile_' + nowMissileId).remove();
                }, 1000);
            }, 1);

            laserSound.currentTime = 0;
            laserSound.play();
            missileId++;
        }
    }
}

/**********************************************************/

let meteorSpeed = 300;
let meteorId = 0;
let meteorArr = [];
let meteorObj =
    '<img src="/img/game/meteor/meteor{num}.png" class="meteor" id="meteor_{x}">';

function getRandomPos(min, max) {
    return Math.floor(Math.random() * (max - min) + 1) + min;
}
function fileZero(width, str) {
    str = String(str);
    return str.length >= width
        ? str
        : new Array(width - str.length).join('0') + str;
}
function meteor() {
    if (isGameStart) {
        var newMeteor = meteorObj.replace('{x}', meteorId);
        newMeteor = newMeteor.replace('{num}', fileZero(1, getRandomPos(0, 6)));
        $('#game').append(newMeteor);
        var nowMeteorId = meteorId;

        var windowWidth = $(window).width();
        var randomPosX = getRandomPos(0, windowWidth);

        $('#meteor_' + meteorId).css({
            left: randomPosX + 'px',
        });

        setTimeout(function () {
            $('#meteor_' + nowMeteorId).addClass('on');
            setTimeout(function () {
                $('#meteor_' + nowMeteorId).remove();
            }, 5000);
        }, 0);

        meteorId++;
    }
}

let explosionId = 0;
let explosionObj =
    '<img src="/img/game/missile/explosion.png" class="explosion" id="explosion_{x}">';
let shipId = 1;
let shipObj =
    '<img src="/img/game/missile/explosion.png" class="ship" id="ship_{x}">';
let score = 0;

function attack() {
    if (isGameStart) {
        var meteorArr = $('.meteor');
        var missileArr = $('.missile');
        var ship = $('#ship');
        var boss = $('#boss');

        for (let i = 0; i < meteorArr.length; i++) {
            //메테오와 플레이어 충돌체크
            var meteorWidth = $(meteorArr[i]).width();
            var meteorOffset = $(meteorArr[i]).offset();
            var shipOffset = ship.offset();
            if (
                shipOffset.left > meteorOffset.left - meteorWidth &&
                shipOffset.left < meteorOffset.left + meteorWidth &&
                shipOffset.top > meteorOffset.top - meteorWidth &&
                shipOffset.top < meteorOffset.top + meteorWidth
            ) {
                $(meteorArr[i]).remove();

                console.log(shipOffset.left, shipOffset.top);

                var shipExplosion = explosionObj.replace('{x}', shipId);
                $('#game').append(shipExplosion);
                $('#explosion_' + shipId).css({
                    left: ship.offset().left + 'px',
                    top: ship.offset().top + 'px',
                });

                setTimeout(function () {
                    $('#explosion_' + shipId).remove();
                    for (let i = 0; i < shipExplosion - 1; i++) {
                        $('#explosion_' + i).remove();
                    }
                    gameEnd();
                }, 200);
                $('#ship').css('display', 'none');
                expSound();
                console.log('Game Over');
            }

            for (let j = 0; j < missileArr.length; j++) {
                //미사일,메테오 충돌체크
                var missileOffset = $(missileArr[j]).offset();
                if (
                    missileOffset.left > meteorOffset.left &&
                    missileOffset.left < meteorOffset.left + meteorWidth &&
                    missileOffset.top > meteorOffset.top - meteorWidth &&
                    missileOffset.top < meteorOffset.top
                ) {
                    $(meteorArr[i]).remove();
                    $(missileArr[j]).remove();
                    if (
                        missileOffset.left >= 0 &&
                        missileOffset.left <= $(window).width() &&
                        missileOffset.top >= 0
                    ) {
                        var newExplosion = explosionObj.replace(
                            '{x}',
                            explosionId
                        );
                        $('#game').append(newExplosion);
                        $('#explosion_' + explosionId).css({
                            left: missileOffset.left + 'px',
                            top: missileOffset.top + 'px',
                        });

                        var nowExplosionId = explosionId;
                        explosionId++;
                        score++;
                        $('#score').text(score);

                        setTimeout(function () {
                            $('#explosion_' + nowExplosionId).remove();
                            for (let i = 0; i < nowExplosionId - 1; i++) {
                                $('#explosion_' + i).remove();
                            }
                        }, 200);
                        expSound();
                    }
                }
            }
        }
        if (isBoss) {
            if (isBeam) {
                var beamOffset = $('#bossBeam').offset();
                var beamWidth = $('#bossBeam').width();
                if (
                    shipOffset.left > beamOffset.left &&
                    shipOffset.left < beamOffset.left + beamWidth
                ) {
                    var shipExplosion = explosionObj.replace('{x}', shipId);
                    $('#game').append(shipExplosion);
                    $('#explosion_' + shipId).css({
                        left: ship.offset().left + 'px',
                        top: ship.offset().top + 'px',
                    });

                    setTimeout(function () {
                        $('#explosion_' + shipId).remove();
                        for (let i = 0; i < shipExplosion - 1; i++) {
                            $('#explosion_' + i).remove();
                        }
                        gameEnd();
                    }, 200);
                    $('#ship').css('display', 'none');
                    expSound();
                    console.log('Game Over');
                }
            }

            for (let j = 0; j < missileArr.length; j++) {
                //미사일, 보스 충돌체크
                var missileOffset = $(missileArr[j]).offset();
                if (
                    missileOffset.left > boss.offset().left &&
                    missileOffset.left < boss.offset().left + boss.width() &&
                    missileOffset.top > boss.offset().top &&
                    missileOffset.top < boss.offset().top + boss.width() / 2
                ) {
                    $(missileArr[j]).remove();
                    bossHp -= damage;
                    if (bossHp == 0) {
                        bossDead();
                    }
                    if (
                        missileOffset.left >= 0 &&
                        missileOffset.left <= $(window).width() &&
                        missileOffset.top >= 0
                    ) {
                        var newExplosion = explosionObj.replace(
                            '{x}',
                            explosionId
                        );
                        $('#game').append(newExplosion);
                        $('#explosion_' + explosionId).css({
                            left: missileOffset.left + 'px',
                            top: missileOffset.top + 'px',
                        });

                        var nowExplosionId = explosionId;
                        explosionId++;

                        setTimeout(function () {
                            $('#explosion_' + nowExplosionId).remove();
                            for (let i = 0; i < nowExplosionId - 1; i++) {
                                $('#explosion_' + i).remove();
                            }
                        }, 200);

                        setInterval(function () {
                            $('#tri').css('left', boss.offset().left + 'px');
                            $('#bossBeam').css(
                                'left',
                                boss.offset().left + 'px'
                            );
                        }, 1);

                        expSound();
                        bossGaugeBar();
                    }
                }
            }
        }
    }
}

function beamOn() {
    isBeam = true;
    $('.dan,#tri').css('display', 'none');
    nextBeamTime = beamTimer + beamTimerDelay;
    $('#bossBeam').css('display', 'block');
    setTimeout(beamOff, beamTimerDelay * 1000);
    bossThem.volume = 0.5;
    bossLaserSound.currentTime = 0;
    bossLaserSound.play();
}

function beamOff() {
    isBeam = false;
    nextBeamTime = beamTimer;
    $('#bossBeam').css('display', 'none');
    $('.dan,#tri').css('display', 'none');
    dangerSound.pause();
    bossThem.volume = 1;
}
function bossGaugeBar() {
    console.log(bossHp * (100 / (basicBossHp * bossNum)));
    $('#bossGaugeBar').css(
        'width',
        bossHp * (100 / (basicBossHp * bossNum)) + '%'
    );
}

function bossDead() {
    isBoss = false;
    beamOff();
    score += bossNum * 50; //보스 죽으면 +50점
    bossNum++;
    $('#boss,#bossGauge').css('display', 'none');
    bossThem.currentTime = 0;
    bossThem.pause();
    bossDeathSound.play();
    timer += 60;
    maxTimer = timer;
    $('#score').text(score);

    setTimeout(function () {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    }, 3000);
}

let expAudId = 0;
let expAudio = '<audio src="/sound/explosion.ogg" id="expAud_{x}"></audio>';
function expSound() {
    var newExpAud = expAudio.replace('{x}', expAudId);
    var newAudId = expAudId;
    $('body').append(newExpAud);

    var audioElement = document.getElementById('expAud_' + newAudId);
    audioElement.volume = 0.5;
    audioElement.play();

    setTimeout(function () {
        $('#expAud_' + newAudId).remove();
    }, 2000);
    expAudId++;
}

/**********************************************************/

window.onload = init;
function init() {
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;

    setInterval(attack, 1);
    setInterval(missile, missileSpeed);
    setInterval(meteor, meteorSpeed);
    setInterval(time, 1000);
}

let cursorX = 0;
let cursorY = 0;
function getCursorXY(e) {
    //커서를 움직여서 플레이어 조종
    if (isGameStart) {
        cursorX = window.Event
            ? e.pageX
            : event.clientX +
              (document.documentElement.scrollLeft
                  ? document.documentElement.scrollLeft
                  : document.body.scrollLeft);
        cursorY = window.Event
            ? e.pageY
            : event.clientY +
              (document.documentElement.scrollTop
                  ? document.documentElement.scrollTop
                  : document.body.scrollTop);

        $('#ship').css({
            top: cursorY + 'px',
            left: cursorX + 'px',
        });
    }
}
$(document).keydown(function (event) {
    if (event.keyCode === 32) {
        // 스페이스바 키 코드 32
        isSpacePressed = true; // 스페이스바가 눌렸음
    }
});

$(document).keyup(function (event) {
    if (event.keyCode === 32) {
        isSpacePressed = false; // 스페이스바가 떼어짐
    }
});

$(document).ready(function () {
    $('#main,#bg').css('display', 'block');
    $('#loading').remove();
});

function openModal() {
    $('.modal').addClass('show');
    $('body').css('overflow', 'hidden');
    $('body').css(
        'cursor',
        "url('https://cur.cursors-4u.net/cursors/cur-8/cur736.png'),auto"
    );
}

function closeModal() {
    $('.modal').removeClass('show');
    $('body').css('overflow', 'hidden');
}
