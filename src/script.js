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

let has_block;

// Array for the block divs
let blocks= [];

let block_width;
let block_height;

// block in player's hand
let current_block = null;

let colors = ["#207EE3","#ED6C09","#F0E21F","#990913","#E80E9F"];


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

    block_width = game_area_width/10;
    block_height = game_area_height/12;

    player.on('load', function () {
        init_player();
    });

    generate_blocks();

    game_area.on('mousemove',player_movement);

    app.on('click',player_action);

});

// Creates player
function init_player(){

    player_width = game_area_width/ 10;
    player_height = game_area_height / 6;

    has_block = false;

    player.css({
        height: game_area_height/6 + 'px',
        width: game_area_width/10 + 'px',
        top: game_area_height - player_height + 'px',
        left: game_area_width/2 + 'px'
    })

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

    if (has_block === true){
        current_block.css({
            left: player.css('left')
        })
    }

}

// Generates random blocks
function generate_blocks(){

    for(let i = 0 ; i < 5 ; i++){
        blocks[i] = [];
        for(let j = 0 ; j < 10 ; j++){

            let block = $('<div class="block"></div>')
            block.css({
                width: block_width + 'px',
                height: block_height + 'px',
                border: 'solid 1px white',
                borderRadius : '10px',
                top: i * block_height + 'px',
                left: j * block_width + 'px',
                background: colors[Math.floor(Math.random()*colors.length)],
                position: "absolute"
            })
            blocks[i][j] = block;
            game_area.append(block);
        }
    }

    //empty rows
    for(let i = 5; i < 7 ; i++){
        blocks[i] = []
        for(let j  = 0 ; j < 10 ; j++){
            blocks[i][j] = null;
        }
    }
}

// Player actions, get a block or throws if has one already
function player_action(){

    // Throws a block
    if(has_block === true){

        let i = 7;
        while(true){
            if (blocks[6][get_player_column()] !== null){
                console.log("No more space to throw!")
                return;
            }
            // Checks for last non-null block in column
            if (i-1 === -1 || blocks[i-1][get_player_column()] !== null){
                current_block.animate({
                    top: i * block_height + 'px'
                },500)
                blocks[i][get_player_column()] = current_block;
                current_block = null;
                has_block = false;
                break;
            }
            i--;
        }
        return;
    }

    // Gets a block
    if(has_block === false){

        let i = 6;
        while(true){

            if ( i < 0){
                console.log("No blocks in this column!");
                break;
            }
            if (blocks[i][get_player_column()] !== null){
                console.log(i);
                current_block = blocks[i][get_player_column()];
                //console.log("Got a block at " + (i) + " row!");
                blocks[i][get_player_column()] = null;
                has_block = true;

                current_block.animate({
                    top: game_area_height - player_height - block_height  + 'px'
                },500)

                break;
            }
            i--;
        }
    }
}

function get_player_column(){
    return parseInt(player.css('left')) / player_width;
}

