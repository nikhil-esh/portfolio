/*
   This is the Javascript module that helps to build and play the required Iframes from Youtube
   Its a javascript constructor that is being called with 3 required argument.
   Read the implementation documents for more information.
*/
(function(moduleFunc) {
    try {
        if (typeof define === "function" && !!define.amd) {
            define("cmb-youtube-overlay", function() {
                return moduleFunc(window, document);
            });
        } else if (!!window && typeof window === "object") {
            window.YoutubeOverlayModule = moduleFunc(window, document);
        } else {
            throw new Error("Error on Load -> Check - May be not sure about your dev environment");
        }
    } catch (thisError) {
        console.error(thisError);
        return;
    }
})(function(w, d) {
    /* 
     * The constructor requires a request object that would have - 
     * requestObj.sourceUrl (which is the youtube embed url)
     * requestObj.triggerElement (id value of the element upon which click event is registered)
     * requestObj.progressCallback (the function that gets called for updates from this Constructor for loading, completion etc...
     *
     * requestObj is mandatory;
     */
    var YtConst = function(requestObj) {
        try {
            if (!requestObj) {
                throw new Error("Youtube overlay requires a request object argument.");
                return;
            } else if (!("sourceUrl" in requestObj) || !("triggerElement" in requestObj)) {
                throw new Error("Youtube overlay requires requestObject with mandatory props");
                return;
            } else if (typeof requestObj.sourceUrl !== "string" || typeof requestObj.triggerElement !== "string") {
                throw new Error("Youtube overlay requires requestObject with mandatory props which are of string types.");
                return;
            } else if (!!requestObj.progressCallback && typeof requestObj.progressCallback !== "function") {
                throw new Error("Youtube overlay - Progress Callback must be of function type if it is specified in the request");
            } else {
                this.overlayContainer = "#youtubePlayerOverlay";
                this.sourceUrl = requestObj.sourceUrl;
                this.triggerElement = requestObj.triggerElement;
                this.progressCallback = requestObj.progressCallback;
                this._isDoneDone = {
                    progressType: "request-completed",
                    progressMessage: "Your request has been accepted and processed."
                };
                this._isBeingDone = {
                    progressType: "processing-request",
                    progressMessage: "Your request is being processed. Please wait."
                };
                this._isBeingClosed = {
                    progressType: "player-closed",
                    progressMessage: "The overlay player has been closed down."
                };
            }
        } catch (thisError) {
            console.error(thisError);
        }
    }
    var cpo = YtConst.prototype;
    /* initializes the entire process */
    cpo.activateDeployment = function() {
        var $this = this;
        $this.createPlayerContainer();
    };
    /* incase the overlay modal is not there, create it */
    cpo.createPlayerContainer = function() {
        var $this = this;
        if ($($this.overlayContainer).length === 0) {
            var o = $('<div class="videoPlayerOverlay hide hiddenTransform" id="youtubePlayerOverlay" data-hasloaded="false"></div>'),
                cButton = $('<button id="youtubeOverlayCloser" class="defaultButton closeIcon hover-target"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDk2LjA5NiA0OTYuMDk2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTYuMDk2IDQ5Ni4wOTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjU5LjQxLDI0Ny45OThMNDkzLjc1NCwxMy42NTRjMy4xMjMtMy4xMjQsMy4xMjMtOC4xODgsMC0xMS4zMTJjLTMuMTI0LTMuMTIzLTguMTg4LTMuMTIzLTExLjMxMiwwTDI0OC4wOTgsMjM2LjY4Ng0KCQkJTDEzLjc1NCwyLjM0MkMxMC41NzYtMC43MjcsNS41MTItMC42MzksMi40NDIsMi41MzljLTIuOTk0LDMuMS0yLjk5NCw4LjAxNSwwLDExLjExNWwyMzQuMzQ0LDIzNC4zNDRMMi40NDIsNDgyLjM0Mg0KCQkJYy0zLjE3OCwzLjA3LTMuMjY2LDguMTM0LTAuMTk2LDExLjMxMnM4LjEzNCwzLjI2NiwxMS4zMTIsMC4xOTZjMC4wNjctMC4wNjQsMC4xMzItMC4xMywwLjE5Ni0wLjE5NkwyNDguMDk4LDI1OS4zMQ0KCQkJbDIzNC4zNDQsMjM0LjM0NGMzLjE3OCwzLjA3LDguMjQyLDIuOTgyLDExLjMxMi0wLjE5NmMyLjk5NS0zLjEsMi45OTUtOC4wMTYsMC0xMS4xMTZMMjU5LjQxLDI0Ny45OTh6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" class="img-responsive center-block" width="100%" alt="Close" title="close"/></button>'),
                b = $("body");
            cButton.appendTo(o);
            o.appendTo(b);
        }
        $this.triggerCheck();
    };
    /* makes sure that the trigger element is actually present */
    cpo.triggerCheck = function() {
        var $this = this;
        try {
            if ($($this.triggerElement).length === 0) {
                throw new Error("Youtube Overlay Constructor -> Not able to locate the required Trigger-Element. Can you please check id? ---> " +
                    $this.triggerElement
                );
                return;
            }
            $this.activateOnClickHandler();
        } catch (thisError) {
            console.error(thisError);
        }
    };
    /* registers an on click event for the trigger element id */
    cpo.activateOnClickHandler = function() {
        var $this = this,
            t = $this.triggerElement,
            s = $this.sourceUrl,
            o = $this.overlayContainer;

        $(t).on("click", function() {
            $this.progressCallback($this._isBeingDone);
            var nowLoaded = $(o).attr("data-hasloaded"),
                triggerId = $(t).attr("id"),
                idEquals = nowLoaded === triggerId;

            if (idEquals) {
                $this.openPlayerOverlay();
                $this.progressCallback($this._isDoneDone);
            } else {
                $(o).find("iframe").remove();
                var requiredIframe = $('<iframe width="100%" height="100%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>');
                requiredIframe.attr({
                    src: $this.sourceUrl + "?showinfo=0&rel=0"
                });
                requiredIframe.appendTo($(o));
                $(o).attr("data-hasloaded", triggerId);
                $this.openPlayerOverlay();
                $this.progressCallback($this._isDoneDone);
            }
        });
    };
    /* this function opens the modal overlay and helps to auto play the video
     * autoplay feature works on desktop only */
    cpo.openPlayerOverlay = function() {
        var $this = this,
            o = $this.overlayContainer;
        $(o).removeClass("hide");
        setTimeout(function() {
            $(o).removeClass("hiddenTransform");
            setTimeout(initTheseInternals, 280);
        }, 80);

        function initTheseInternals() {
            var thisIframe = $(o).find("iframe")[0];
            thisIframe.src += "&autoplay=1";

            $(o).find("#youtubeOverlayCloser").off("click").on("click", function() {
                var nowVidSrc = thisIframe.src.split("&autoplay=1")[0],
                    srcAutoplayOff = nowVidSrc + "&autoplay=0";
                thisIframe.src = srcAutoplayOff;
                thisIframe.src = nowVidSrc;
                $this.closePlayerOverlay();
            });

            /* initialize escape key press event */
            $this.closeOnEscapeKeyPress();
        }
    };
    /* closes the modal overlay and stop the video from playing */
    cpo.closePlayerOverlay = function() {
        var $this = this,
            o = $this.overlayContainer;
        $(o).addClass("hiddenTransform");
        setTimeout(function() {
            $(o).addClass("hide");
            $this.progressCallback($this._isBeingClosed);
        }, 260);
    };
    /* you can close this module overlay if the user presses the Escape key */
    cpo.closeOnEscapeKeyPress = function() {
        var $this = this,
            o = $this.overlayContainer;
        $(d).on("keyup", function(event) {
            if (event.which === 27 && !$(o).hasClass("hiddenTransform")) {
                $(o).find("#youtubeOverlayCloser").trigger("click");
            }
        });
    };

    return YtConst;
});