/**********************[ Option ]****************************/
const backgroundMusic = new Audio('sound/mainTheme.mp3');
const gameOverSound = new Audio('sound/gameOver.wav');
const bossThem = new Audio('sound/BossTheme.mp3');
const warningSound = new Audio('sound/alarm.ogg');
const laserSound = new Audio('sound/laser.wav');
let isGameStart = false;
let isBossDead = false;
let isSpacePressed = false;
let timer = 120;
let maxTimer = timer;
let bossTimer = 10;
/************************************************************/

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
    $('#game,#gameUI').css('display', 'none');
    $('#endScore').text(score);
    $('#timer').text(timer);
    isGameStart = false;
    reOption();
    backgroundMusic.pause();
    warningSound.pause();
    bossThem.pause();
    gameOverSound.play();
    openModal();
}
function reOption() {
    score = 0;
    timer = 120;
    missileId = 0;
    meteorId = 0;
    shipId = 1;
    expAudId = 0;
    nowExplosionId = 0;
    for (let i = 0; i < explosionId - 1; i++) {
        $('#explosion_' + i).remove();
    }
    explosionId = 0;
    isGameStart = false;
    backgroundMusic.currentTime = 0;
    bossThem.currentTime = 0;
    warningSound.currentTime = 0;
    gameOverSound.currentTime = 0;
}

function reGame() {
    $('#main').css('display', 'block');
    $('#ship').css('display', 'block');
    $('#endUI').css('display', 'none');
    $('#score').text(score);
    $('#timer').text(timer);
    closeModal();
    if (!$('.start_btn').data('click-bound')) {
        $('.start_btn').on('click', function () {
            gameStart();
        });
        $('.start_btn').data('click-bound', true);
    }
}

function gameExit() {
    window.close();
}

function time() {
    if (isGameStart) {
        if (maxTimer - (bossTimer - 5) == timer) {
            $('.warn').css('display', 'block');
            backgroundMusic.pause();
            warningSound.loop = true;
            warningSound.play();
        }
        if (maxTimer - bossTimer == timer) {
            $('.warn').css('display', 'none');
            $('#boss,#bossGauge').css('display', 'block');
            warningSound.pause();
            backgroundMusic.pause();
            bossThem.play();
        }
        if (timer === 0) {
            gameEnd();
        }
        $('#timer').text(timer);
        timer--;
    } else if (isBossDead) {
        bossThem.pause();
        backgroundMusic.play();
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

let meteorSpeed = 900;
let meteorId = 0;
let meteorObj =
    '<img src="/img/game/meteor/meteor.gif" class="meteor" id="meteor_{x}">';

function getRandomPos(min, max) {
    return Math.random() * (max - min) + min;
}

function meteor() {
    if (isGameStart) {
        var newMeteor = meteorObj.replace('{x}', meteorId);
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

        // 보스 위치 업데이트
        function bossPosition() {
            var bossOffset = $('#boss').offset();
            $('#tri, #bossBeam').css({
                left: bossOffset.left + 'px',
                top: bossOffset.top + 'px',
            });
        }
        bossPosition();

        // 애니메이션 반복 시 보스 위치 업데이트
        $('#boss').on('animationiteration', function () {
            bossPosition();
        });

        for (let i = 0; i < meteorArr.length; i++) {
            var meteorOffset = $(meteorArr[i]).offset();
            var meteorWidth = $(meteorArr[i]).width() / 2;
            var meteorHeight = $(meteorArr[i]).height() / 2;

            // 충돌 검사 (미사일, 보스)
            if (
                ship.offset().left + ship.width() > meteorOffset.left &&
                ship.offset().left < meteorOffset.left + meteorWidth &&
                ship.offset().top + ship.height() > meteorOffset.top &&
                ship.offset().top < meteorOffset.top + meteorHeight
            ) {
                var shipExplosion = explosionObj.replace('{x}', shipId);
                $('#game').append(shipExplosion);
                $('#explosion_' + shipId).css({
                    left: ship.offset().left + 'px',
                    top: ship.offset().top + 'px',
                });

                setTimeout(function () {
                    $('#explosion_' + shipId).removeClass('explosion');
                    gameEnd();
                }, 400);
                expSound();

                console.log('Game Over');
                $('#ship').css('display', 'none');
                break;
            }

            for (let j = 0; j < missileArr.length; j++) {
                var missileOffset = $(missileArr[j]).offset();
                var missileWidth = $(missileArr[j]).width();
                var missileHeight = $(missileArr[j]).height();
                var windowWidth = $(window).width();

                if (
                    missileOffset.left + missileWidth > meteorOffset.left &&
                    missileOffset.left < meteorOffset.left + meteorWidth &&
                    missileOffset.top + missileHeight > meteorOffset.top &&
                    missileOffset.top < meteorOffset.top + meteorHeight
                ) {
                    $(meteorArr[i]).remove();
                    $(missileArr[j]).remove();

                    if (
                        missileOffset.left >= 0 &&
                        missileOffset.left <= windowWidth &&
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
                        }, 300);
                        expSound();
                    }
                    break;
                }
            }
        }
    }
}

let expAudId = 0;
let expAudio = '<audio src="/sound/explosion.ogg" id="expaud_{x}"></audio>';
function expSound() {
    var newExpAud = expAudio.replace('{x}', expAudId);
    var newAudId = expAudId;
    $('body').append(newExpAud);
    $('#expaud_' + newAudId)
        .get(0)
        .play();

    setTimeout(function () {
        $('#expaud_' + newAudId).remove();
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
