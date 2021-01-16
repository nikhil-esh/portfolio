var videoBuild = new YoutubeOverlayModule({
    sourceUrl: 'https://www.youtube.com/embed/1Q8fG0TtVAY',
    triggerElement: "#demo",
    progressCallback: function() {
        console.log("Callback Invoked.");
    }
});