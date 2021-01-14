$("#container").mouseenter(function() {
    $(this).addClass('hover-state');
}).mouseleave(function() {
    $(this).removeClass('hover-state');
});

$("#container.click-to-play-video").click(function() {
    $('#head').css({ "background-color": "black" });

    player = new YT.Player('player', {
        width: '320',
        height: '180',
        videoId: 'qlEUrEVqDbo',
        playerVars: { 'autoplay': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
});

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/embed/dWqb-WqbGh8";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onPlayerReady(event) {
    //event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.destroy();
        $('#head').css({ "background-color": "#aaa" });
    }
}