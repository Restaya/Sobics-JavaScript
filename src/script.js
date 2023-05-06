let game_area;
let game_area_width;
let game_area_height;

let app;
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

let score = 0;
let score_tab;

//time
let start;
let max_time;
let timeoutVal = Math.floor(max_time/100);

// How many times the player threw a block
let number_of_throws = 0;

let colors = ["#207EE3","#ED6C09","#F0E21F","#990913","#E80E9F"];


$(document).ready(function(){

    time_bar = $('#time_bar');
    game_area = $('#game_area');
    app = $('#app');

    player= $('<img id="player" src="../assets/player.png" alt="null"/> ');
    game_area.append(player);

    score_tab = '<div id="score_tab">Score: <span id="score"></span></div>'

    score_tab = '<div id="score_tab">Score: <span id="score"></span></div>'

    $("body").append(score_tab)
    $('#score').append(score)

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

    start = new Date();

    app.on('click',function () {
        animate_time_bar();
    })

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

                number_of_throws++;

                update_score(number_of_throws);
                change_max_time();
                console.log(max_time)
                return;
            }
            i--;
        }
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

function update_score(points){
    $("#score").text(points)
}

// Animates the time progress bar
function update_time_bar(percentage){
    time_bar.css("width", percentage + "%");
}

// Calculates the percentage for the progress bar
function animate_time_bar(){
    let now = new Date();
    let time_delta = now.getTime() - start.getTime();
    let percentage = Math.round((time_delta/max_time)*100);

    if(percentage <= 100){
        update_time_bar(percentage);
        setTimeout(animate_time_bar, timeoutVal);
    }

}

// Changes time to go faster based on many blocks have been thrown
function change_max_time(){
    if(number_of_throws >= 0 && number_of_throws <= 5){
        start = new Date();
        max_time = 15000;
    }
    if(number_of_throws > 5 && number_of_throws <= 10){
        start = new Date();
        max_time = 10000;
        return;
    }
    if(number_of_throws > 10){
        start = new Date();
        max_time = 5000;
    }
}


function check_blocks(block){
    //TODO
}