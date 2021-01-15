var img = $("#exampleImage");
var configObject = {
    sourceUrl: img.attr("data-videourl"),
    triggerElement: "#" + img.attr("id"),
    progressCallback: function() {
        console.log("Callback Invoked.");
    }
};

var videoBuild = new YoutubeOverlayModule(configObject);