let game_area;
let game_area_width;
let game_area_height;

let app;
let app_height;
let app_width;

let time_bar;

let body;
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
let score_div;

let error_div;
let error_message;
//time
let start;
let max_time;
let timeoutVal = Math.floor(max_time/100);
let percentage;

// How many times the player threw a block
let number_of_throws = 0;
let throws_div;

let high_scores;
let high_scores_div;

let colors = ["#207EE3","#ED6C09","#F0E21F","#990913","#E80E9F"];

let pop_sound;
let whoosh_sound;

// variables for the form;
let name_form;
let username;
let save_score_button;

$(document).ready(function(){

    time_bar = $('#time_bar');
    game_area = $('#game_area');
    app = $('#app');
    body = $("body");

    player= $('<img id="player" src="../assets/player.png" alt="null"/> ');
    game_area.append(player);

    score_div = $('<div id="score_div">Score: <span id="score"></span></div>');
    body.append(score_div)
    $('#score').append(score)

    throws_div = $('<div id="throws_div">Thrown blocks: <span id="throws"></span></div>');
    body.append(throws_div)
    $('#throws').append(number_of_throws)

    error_div = $('<div id="error_div"><span id="message"></span></div>')
    body.append(error_div);
    $('#message').append(error_message);

    app_height = app.height();
    app_width = app.width();

    game_area_width = game_area.width();
    game_area_height = game_area.height();

    block_width = game_area_width/10;
    block_height = game_area_height/12;

    pop_sound = document.createElement('audio');
    pop_sound.setAttribute('src','../assets/pop_sound.wav');
    pop_sound.volume = 0.25;

    whoosh_sound = document.createElement('audio');
    whoosh_sound.setAttribute('src','../assets/whoosh_sound.wav')
    whoosh_sound.volume = 0.25;

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
        blocks[i] =[]
        for(let j = 0 ; j < 10 ; j++){
            blocks[i][j] = null;
        }
    }
}

// Player actions, get a block or throws if it has one already
function player_action(){

    // Throws a block
    if(has_block === true){

        let i = 7;
        let count = 0;
        while(true){
            if (blocks[6][get_player_column()] !== null){
                $('#message').text("No more space to throw!");
                break;
            }
            // Checks for last non-null block in column
            if (i-1 === -1 || blocks[i-1][get_player_column()] !== null){
                
                blocks[i][get_player_column()] = current_block;
                current_block.animate({
                    top: i * block_height + 'px'
                },0)
                
                has_block = false;
                number_of_throws++;

                count = find_blocks(blocks[i][get_player_column()]);
                current_block = null;
        
                if(count > 1) {
                    if (percentage <= 100) {
                        score += 200 * count;
                    } else {
                        score += 100 * count;
                    }
                    update_score(score);
            
                }
                if(number_of_throws % 3 === 0 && number_of_throws > 0){
                    generate_row();
                }
                $('#throws').text(number_of_throws);

                pop_sound.play();
                $('#message').text("");

                change_max_time();
                if(number_of_throws === 15){
                    game_end();
                }
                break;
            }
            i--;
        }
        
        //Fils the holes betweeen blocks
        if(count > 1){
           if(count > 7){
                for (let i = 0; i < 7;i++){
                    fill_holes();
                } 
           }else{
            for(let i = 0; i < count; i++){
                fill_holes();
            }
           }
        }
        
        // Prints blocks position for debugging
        //console.log(blocks);

        return;
    }

    // Gets a block
    if(has_block === false){

        let i = 6;
        while(true){

            if ( i < 0){
                $('#message').text("No blocks in this column!");
                break;
            }
            if (blocks[i][get_player_column()] !== null){
                current_block = blocks[i][get_player_column()];
                blocks[i][get_player_column()] = null;
                has_block = true;

                whoosh_sound.play();
                current_block.animate({
                    top: game_area_height - player_height - block_height  + 'px'
                },250)

                $('#message').text("");

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
    percentage = Math.round((time_delta/max_time)*100);

    if(percentage <= 100){
        update_time_bar(percentage);
        setTimeout(animate_time_bar, timeoutVal);
    }

}

// Changes time to go faster based on many blocks have been thrown
function change_max_time(){
    if(number_of_throws >= 0 && number_of_throws <= 5){
        start = new Date();
        max_time = 8000;
    }
    if(number_of_throws > 5 && number_of_throws <= 10){
        start = new Date();
        max_time = 5000;
        return;
    }
    if(number_of_throws > 10){
        start = new Date();
        max_time = 3000;
    }
}

// Removes the game from the screen and shows the top list
function game_end(){
    app.remove();
    throws_div.remove();

    score_div.css({
        top: 25+ '%',
        left: 40 + '%'
    })
    error_div.css({
        top: 50 + "%",
        left: 40 + "%",
        fontsize: 50 + "px"
    })
    name_form =  $('<div id="name_form">' +
        '<form>' +
        '<input type="text" name="username" id="username" placeholder="Enter your name!"/>' + '<br>' + '<br>' +
        '<button type="submit" class="button" id="save_score_button" onclick="save_score(event)">Save score!</button>' +
        '</form>' +
        '</div>')

    body.append(name_form);
}

// Saves the score and lists the high scores when the button is clicked
function save_score(e){
    e.preventDefault();

    username = document.getElementById("username");
    save_score_button = document.getElementById("save_score_button");

    if(!username.value){
        $('#message').text("You have to enter your name!");
        return;
    }

    let name_score={
        name: username.value,
        high_score:score
    };

    high_scores = JSON.parse(localStorage.getItem('high_scores')) || [];

    high_scores.push(name_score);

    high_scores.sort(function (a,b) {return b.high_score - a.high_score;} )

    high_scores.splice(3)

    localStorage.setItem('high_scores',JSON.stringify(high_scores));

    save_score_button.disabled = true;

    list_high_scores();

}

// Lists the 3 top high score
function list_high_scores(){

    high_scores = JSON.parse(localStorage.getItem('high_scores')) || [];

    let second_row,third_row;

    if(high_scores[1] != null){
        second_row = high_scores[1].name + ": " + high_scores[1].high_score;
    }else{
        second_row="No second place yet";
    }
    if(high_scores[2] != null){
        third_row = high_scores[2].name + ": " + high_scores[2].high_score;
    }else{
        third_row="No third place yet";
    }


    high_scores_div = $('<div id="high_scores_div">' +
                        '<ol id="high_scores_list">' +
                        '<li>' + high_scores[0].name + ": " + high_scores[0].high_score + ' points</li>' +
                        '<li>' + second_row + ' points</li>' +
                        '<li>' + third_row + ' points</li>' +
                        '</ol>' +
                        '</div>');

    body.append(high_scores_div);

}

// When a block was thrown checks the nearby blocks color and removes them if their color matches
function find_blocks(block){

    let open_blocks = []
    //let closed_blocks = []
    let block_candidate;
    let color;
    let found = 0;

    // for one block
    let matched = false;

    open_blocks.push(block);
    //closed_blocks.push(block);

    while(open_blocks.length){

        block_candidate = open_blocks.shift();
        found++;

        color = block_candidate.css('background-color');
        row = parseInt(block_candidate.css('top'), 10)/50;
        column = parseInt(block_candidate.css('left'), 10)/100;

        // above block
        if( row-1 !== -1 && blocks[row-1][column] !== null && color === blocks[row-1][column].css('background-color')){
            open_blocks.push(blocks[row-1][column]);
            matched = true;
        }
        // below block
        if( row+1 !== 7 && blocks[row+1][column] !== null && color === blocks[row+1][column].css('background-color')){
            open_blocks.push(blocks[row+1][column]);
            matched = true;
        }
        // left side block
        if( column-1 !== -1 && blocks[row][column-1] !== null && color === blocks[row][column-1].css('background-color')){
            open_blocks.push(blocks[row][column-1]);
            matched = true;
        }
        // right side block
        if( column+1 !== 10 && blocks[row][column+1] !== null && color === blocks[row][column+1].css('background-color')){
            open_blocks.push(blocks[row][column+1]);
            matched = true;
        }

        if(matched && blocks[row][column] !== null){
            // Removes the current block candidate
            blocks[row][column].remove();
            blocks[row][column] = null;
        }
        
    }

    return found;
}

function generate_row(){

    let j = 0;
    let counter = 0;
    while(true){
        if(j === 10){
            break;
        }
        for(let i = 0 ; i < 7 ; i++){
            if(blocks[6][j] !== null){
                break;
            }
            if(blocks[i][j] === null){
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
                counter++;
                break;
            }
        }
        j++;
    }
    if(counter === 0){
        game_end();
    }
}

// If there is a hole above a block, it slides the block back
function fill_holes(){

    for(let i = 0; i < 6; i++){
        for(let j = 0; j < 10; j++){
            if(blocks[i][j] === null && blocks[i+1][j] !== null){
                temp_block = blocks[i+1][j];
                blocks[i][j] = temp_block;
                temp_block.animate({
                    top: i * block_height + 'px'
                },100)
                blocks[i+1][j] = null;
            }
        }
    }
}
