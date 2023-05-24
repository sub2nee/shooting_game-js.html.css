const backgroundMusic = new Audio('sound/mainTheme.mp3');
const gameOverSound = new Audio('sound/gameOver.wav');
let isGameStart = false;
let isSpacePressed = false;

function gameStart() {
    $('body').css('cursor', 'none');
    $('#main').css('display', 'none');
    $('#game,#gameUI').css('display', 'block');
    isGameStart = true;
    console.log('Game Start');
    backgroundMusic.play();
}

function gameEnd() {
    $('body').css('cursor', 'normal');
    isGameStart = false;
    backgroundMusic.pause();
    gameOverSound.play();
}
function gameExit() {
    window.close();
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

            $('#laser').get(0).pause();
            $('#laser').get(0).currentTime = 0;
            $('#laser').get(0).play();
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
let meteorHit = false;
let score = 0;

function meteorAttack() {
    if (isGameStart) {
        var meteorArr = $('.meteor');
        var missileArr = $('.missile');
        var ship = $('#ship');

        for (let i = 0; i < meteorArr.length; i++) {
            var meteorOffset = $(meteorArr[i]).offset();
            var meteorWidth = $(meteorArr[i]).width() / 2;
            var meteorHeight = $(meteorArr[i]).height() / 2;

            // 충돌 검사
            if (
                ship.offset().left + ship.width() > meteorOffset.left &&
                ship.offset().left < meteorOffset.left + meteorWidth &&
                ship.offset().top + ship.height() > meteorOffset.top &&
                ship.offset().top < meteorOffset.top + meteorHeight
            ) {
                // 충돌 발생 시 게임 오버 처리
                console.log('Game Over');
                $('#ship').remove();
                gameEnd();
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
                    meteorHit = true;
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

    setInterval(meteorAttack, 1);
    setInterval(missile, missileSpeed);
    setInterval(meteor, meteorSpeed);
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

$(document).ready(function () {
    $('#main,#bg').css('display', 'block');
    $('#loading').remove();
  });

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
