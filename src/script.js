let game_area;
let player;
$(document).ready(function(){

    game_area = $('#game_area');
    player= $('<img id="player" src="../assets/player.png" alt="null"/> ');

    player.css({
        top: 500 + 'px'
    })
    game_area.append(player);
});