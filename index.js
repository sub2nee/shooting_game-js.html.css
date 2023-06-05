/**********************[ Option ]****************************/
const backgroundMusic = new Audio('sound/mainTheme.mp3');
const gameOverSound = new Audio('sound/gameOver.wav');
const bossThem = new Audio('sound/BossTheme.mp3');
const bossDeathSound = new Audio('sound/BossDeath.wav');
const warningSound = new Audio('sound/alarm.ogg');
const laserSound = new Audio('sound/laser.wav');
/************************************************************/
let isGameStart = false;
let isSpacePressed = false;
let basicTimer = 120; //게임시간
let timer = basicTimer;
let maxTimer = timer;
///////[보스 기본설정]/////////////
let isBoss = false;
let bossTimer = 10;
let damage = 1;
let bossNum = 1;
let basicBossHp = 30;
let bossHp = basicBossHp;
////////////////////////////////

function gameStart() {
    $('body').css('cursor', 'none');
    $('#main').css('display', 'none');
    $('#game,#gameUI').css('display', 'block');
    isGameStart = true;
    console.log('Game Start');
    backgroundMusic.play();
}
function gameEnd() {
    $('#endUI').css('display', 'block');
    $('#game,#gameUI,#boss,#bossGauge').css('display', 'none');
    reOption();
    backgroundMusic.currentTime = 0;
    backgroundMusic.pause();
    warningSound.pause();
    bossThem.pause();
    gameOverSound.play();
    openModal();
}
function reOption() {
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
    bossGaugeBar();
    $('#score').text(score);
    $('#timer').text(timer);
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
}

function gameExit() {
    window.close();
}

function time() {
    if (isGameStart) {
        if (maxTimer - (bossTimer - 5) == timer) {
            $('.warn').css('display', 'block');
            bossHp = basicBossHp * bossNum;
            backgroundMusic.pause();
            warningSound.loop = true;
            warningSound.play();
        }
        if (maxTimer - bossTimer == timer) {
            isBoss = true;
            $('.warn').css('display', 'none');
            $('#bossGauge,#boss').css('display', 'block');
            warningSound.pause();
            backgroundMusic.pause();
            bossThem.play();
        }

        if (timer === 0) {
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

let meteorSpeed = 500;
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

function bossGaugeBar() {
    // console.log(bossHp * (100 / (basicBossHp * bossNum)));
    $('#bossGaugeBar').css(
        'width',
        bossHp * (100 / (basicBossHp * bossNum)) + '%'
    );
}

function bossDead() {
    score += bossNum * 50; //보스 죽으면 +50점
    bossNum++;
    isBoss = false;
    $('#boss,#bossGauge').css('display', 'none');
    bossThem.pause();
    bossDeathSound.play();
    timer += 60;
    maxTimer = timer;

    $('#score').text(score);

    setTimeout(function () {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    }, 2000);

    if (bossNum <= 10) {
        //다음 보스가 있는경우
        bossThem.currentTime = 0;
        $('#boss').attr('src', 'img/game/boss/bosses/' + bossNum + '.png');
        bossHp = basicBossHp * bossNum;
        
    } else {
        //마지막 보스 물리친 경우
        gameEnd();
    }
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
