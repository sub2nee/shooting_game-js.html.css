/***  option  ***/
let missileSpeed = 200; // ms높아질수록 느리게 나온다.
let meteorSpeed = 900;
let missileId = 0;
let missileObj =
    '<img src="img/game/missile/missile.png" class="missile" id="missile_{x}">';
let meteorId = 0;
let meteorObj =
    '<img src="/img/game/meteor/meteor.gif" class="meteor" id="meteor_{x}">';
let explosionId = 0;
let explosionObj =
    '<img src="/img/game/missile/explosion.png" class="explosion" id="explosion_{x}">';
/****************/

let meteorHit = false;
let score=0;
let isGameStart = false;
function gameStart() {
    $('body').css('cursor', 'none');
    $('#main').css('display', 'none');
    $('#game,#gameUI').css('display', 'block');
    isGameStart = true;
    console.log('gameStart');
}

function gameEnd() {
    $('body').css('cursor', 'normal');
    isGameStart = false;
}
function gameExit() {
    window.close();
}

function missile() {
    if (isGameStart) {
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
        }, 0);
        missileId++;
    }
}
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
        }, 1);

        meteorId++;
    }
}

function meteorAttack() {
    if (isGameStart) {
        var meteorArr = $('.meteor');
        var missileArr = $('.missile');

        for (let i = 0; i < meteorArr.length; i++) {
            var meteorOffset = $(meteorArr[i]).offset();
            var meteorWidth = $(meteorArr[i]).width() / 2;
            var meteorHeight = $(meteorArr[i]).height() / 2;
            

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
                        var newExplosion = explosionObj.replace('{x}', explosionId);
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
                    }
                    meteorHit = true;
                    break;
                }
            }
        }
    }
}
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

//커서를 움직여서 플레이어 조종
let cursorX = 0;
let cursorY = 0;
function getCursorXY(e) {
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
