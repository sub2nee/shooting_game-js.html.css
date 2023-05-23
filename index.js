/***  option  ***/
let missileSpeed = 50; // ms높아질수록 느리게 나온다.
let missileObj =
    '<img src="img/game/missile/missile.png" class="missile" id="missile_{x}">';
let missileId = 0;

/****************/

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
function gameExit(){
    window.close();
}

function missile(){
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


window.onload = init;
function init() {
    if (window.Event) {
        document.captureEvents(Event.MOUSEMOVE);
    }
    document.onmousemove = getCursorXY;

    setInterval(missile, missileSpeed);
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

        console.log(cursorX);
        console.log(cursorY);
        $('#ship').css({
            top: cursorY + 'px',
            left: cursorX + 'px',
        });
    }
}

$(document).ready(function(){
    $('#main,#bg').css('display', 'block');
    $('#loading').remove();
});