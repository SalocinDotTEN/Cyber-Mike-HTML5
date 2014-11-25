//
// (C) Sune Watts
// sunewatts.dk
//

function init() {

src = '';
soundInstance = '';
// var displayStatus = document.getElementById("status");
speakerGraphic = document.getElementById("speaker");
playHead = 0;
frameRate = fR;
frameDur = 1000 / frameRate;


    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }

    // store this off because walking the DOM to get the reference is expensive
    displayMessage = document.getElementById("status");

    // if this is on mobile, sounds need to be played inside of a touch event
    if (createjs.Sound.BrowserDetect.isIOS || createjs.Sound.BrowserDetect.isAndroid || createjs.Sound.BrowserDetect.isBlackberry) {
        //document.addEventListener("click", handleTouch, false);	// works on Android, does not work on iOS
        displayMessage.addEventListener("click", handleTouch, false); // works on Android and iPad
        displayMessage.innerHTML = "Touch to Start";
    } else {
        handleTouch(null);
    }
}

// launch the app inside of this scope
function handleTouch(event) {
    displayMessage.removeEventListener("click", handleTouch, false);
    // launch the app by creating it
    var thisApp = new myNameSpace.MyApp();
}

// create a namespace for the application
this.myNameSpace = this.myNameSpace || {};

// this is a function closure
(function() {
    // the application
    function MyApp() {
        this.init();
    }

    MyApp.prototype = {
        src: null, // the audio src we are trying to play
        soundInstance: null, // the soundInstance returned by Sound when we create or play a src
        displayStatus: null, // the HTML element we use to display messages to the user
        loadProxy: null,
        positionInterval: null,

        init: function() {
            // store the DOM element so we do repeatedly pay the cost to look it up
            this.displayStatus = document.getElementById("status");

            // this does two things, it initializes the default plugins, and if that fails the if statement triggers and we display an error
            // NOTE that WebAudioPlugin plays an empty sound when initialized, which activates web audio on iOS if played inside of a function with a touch event in its callstack
            if (!createjs.Sound.initializeDefaultPlugins()) {
                document.getElementById("error").style.display = "block";
                document.getElementById("content").style.display = "none";
                return;
            }

            // Create a single item to load.
            var assetsPath = "parsed/";
            this.src = assetsPath + audioId;
            // NOTE the "|" character is used by Sound to separate source into distinct files, which allows you to provide multiple extensions for wider browser support

            this.displayStatus.innerHTML = "Waiting for load to complete."; // let the user know what's happening
            // NOTE createjs.proxy is used to apply scope so we stay within the touch scope, allowing sound to play on mobile devices
            this.loadProxy = createjs.proxy(this.handleLoad, this);
            createjs.Sound.alternateExtensions = ["mp3"]; // add other extensions to try loading if the src file extension is not supported
            createjs.Sound.addEventListener("fileload", this.loadProxy); // add event listener for when load is completed.
            createjs.Sound.registerSound(this.src); // register sound, which preloads by default

            return this;
        },

        // play a sound inside
        handleLoad: function(event) {
            this.soundInstance = createjs.Sound.play(event.src); // start playback and store the soundInstance we are currently playing
            this.displayStatus.innerHTML = "Playing source: " + event.src; // let the user know what we are playing
            createjs.Sound.removeEventListener("fileload", this.loadProxy); // we only load 1 sound, so remove the listener
            this.trackTime(this.soundInstance);
        },


        trackTime: function(ob) {
            // Called continuously - updates graphics from playhead position
            positionInterval = setInterval(function(event) {
                var pos = ob.getPosition(); // position in milliseconds
                var frameNow = Math.floor(pos / frameDur);
                // console.log(frameDur);
                if (frameNow < parsed.length) {
                    // send graphic to display
                    speakerGraphic.src = IMG_PATH + visemes[parsed[frameNow]];
                    // console.log(IMG_PATH + visemes[parsed[frameNow]]);
                }
            });
        }

    }

    // add MyApp to myNameSpace
    myNameSpace.MyApp = MyApp;
}());