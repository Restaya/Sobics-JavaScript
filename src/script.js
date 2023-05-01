let game_area;

let game_area_width;
let game_area_height;

let app_height;
let app_width;

let time_bar;

// Player, it's width and height
let player;
let player_width;
let player_height;

let player_current_column;

// Array for the block divs
let block_array= [];

$(document).ready(function(){

    time_bar = $('#time_bar');
    game_area = $('#game_area');
    app = $('#app');

    player= $('<img id="player" src="../assets/player.png" alt="null"/> ');
    game_area.append(player);

    app_height = app.height();
    app_width = app.width();

    game_area_width = game_area.width();
    game_area_height = game_area.height()

    player.on('load', function () {
        init_player();
    });

    generate_blocks();

    game_area.on('mousemove',player_movement);

});

// Creates player
function init_player(){

    player_width = game_area_width/ 10;
    player_height = game_area_height / 6;

    console.log(game_area_height)

    player.css({
        height: game_area_height/6 + 'px',
        width: game_area_width/10 + 'px',
        top: game_area_height - player_height + 'px',
        left: game_area_width/2 + 'px'
    })

    console.log(game_area_height - player_height)

    console.log("Player initialized successfuly");

}

// Mouse movement for the player
function player_movement(e){

    let div_pos = app.offset();
    let mouse_pos_x = Math.ceil(e.clientX - div_pos.left);

    if (mouse_pos_x > 0 && mouse_pos_x < game_area_width) {

        player.css({
            // If the mouse is moved a player width amount, it will move the player to it
            left: mouse_pos_x - mouse_pos_x % player_width
        });
    }
}

// Generates random blocks
function generate_blocks(){

    let block_width = game_area_width/10;
    let block_height = game_area_height/12;

    for(let i = 0 ; i < 5 ; i++){
        for(let j = 0 ; j < 10 ; j++){

            let block = $('<div class="block"></div>')
            block.css({
                width: block_width + 'px',
                height: block_height + 'px',
                border: 'solid 1px red',
                top: i * block_height + 'px',
                left: j * block_width + 'px',
                background:'grey',
                position: "absolute"
            })
            block_array.push(block);
            game_area.append(block);
        }
    }

}


// for player current position, don't put in movement
// player_current_column = parseInt(player.css('left')) / 100;