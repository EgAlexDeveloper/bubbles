/**
 * @NAME : DROW
 * @DESCRIPTION : the main js class that In charge of drawing the bubbles
 * @RETURN  :
 */

var DROW = function() {
    this.__construct();
};

/**
 * @NAME         : __construct
 * @DESCRIPTION  : the main construct function tot he class DROW
 * @IN CHARGE OF : check if window load is done and then fire the add event listner method once a new instance of class DROW created
 * @RETURN
 */
DROW.prototype.__construct = function() {
    window.addEventListener("load", this.init, false);
};

/**
 * @NAME         : init
 * @DESCRIPTION  : the init function of the class Drow
 * @IN CHARGE OF : call the main methods of the class Drow
 * @RETURN
 */
DROW.prototype.init = function() {
    // init main elements
    this.defaults = {
        mainClass: "ball bubble",
        singleBubble: "bubble",
        wrapper: DROW.prototype._$(false, "#bubbels"),
        positions: ["top", "right", "bottom", "left", "center"],
        list: 'cities_list',
        back: DROW.prototype._$(false, ".back"),
        max: 5,
        activeSorting: null,
        response: null
    };
    // init main methods
    DROW.prototype.createBubbles();
    DROW.prototype.eventListners();
};

/**
 * @NAME            : _$
 * @DESCRIPTION     : a method return the selected HTML elemend
 * @PARAM isSingle  : boole var TRUE for multi selection and FALSE for single element selection
 * @PARAM           : the selected element
 * @RETURN          : the selected HTML element
 */
DROW.prototype._$ = function(isSingle, element) {
    if (isSingle) {
        return document.querySelectorAll(element);
    } else {
        return document.querySelector(element);
    }
};

/**
 * @NAME         : addEventListners
 * @DESCRIPTION  : a method add new event listners
 * @RETURN       :
 */
DROW.prototype.eventListners = function(eventType, element, method) {
    if (element) {
        element.addEventListener(eventType, this[method], false);
    } else {
        this._$(false, '.back').addEventListener("click", this.resetBubbles.bind(this), false);
    }
};

/**
 * @NAME             : xhr
 * @DESCRIPTION      : create xhr request
 * @PARAM (method)   : the ajax method
 * @PARAM "url"      : the ajax url
 * @PARAM (callback) : the ajax function callback
 * @RETURN           :
 */
DROW.prototype.xhr = function(method, url, callback) {
    // create new instant of XMLHttpRequest
    var xhr = new XMLHttpRequest();
    // open the xhr request
    xhr.open(method, url, true);
    // check if xhr request started
    xhr.onloadstart = function() {
        console.log("request started");
    };
    // check xhr progress
    xhr.onprogress = function() {
        console.log('LOADING ...');
    };
    // check and return the final respose of the xhr request
    xhr.onload = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText),
                    length = 0;
                for (key in data) {
                    length++;
                }
                callback(length, data);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function(e) {
        console.error(xhr.statusText);
    };
    // fire the xhr request
    xhr.send(null);
};

/**
 * @NAME         : createBubbles
 * @DESCRIPTION  : create Bubbles
 * @RETURN       :
 */
DROW.prototype.createBubbles = function() {
    this.xhr('GET', 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json', function(length, data) {
        if (data) {
            // remove the page loader
            DROW.prototype._$(false, ".showbox").className += " " + "hide";
            // set loop counter
            var size = 0;
            // loop on reponse
            for (var key in data) {
                if (size < defaults.max) {
                    var bubble = document.createElement("BUTTON"), // Create a <button> element
                        span = document.createElement("SPAN"),
                        country = document.createTextNode(key); // Create a text node

                    bubble.className = "ball bubble";
                    bubble.appendChild(span); // Append the text to <button>
                    span.appendChild(country); // Append the text to <button>

                    defaults.wrapper.appendChild(bubble); // Append <button> to <body>
                    defaults.response = data;
                    size++;
                }
            }
            DROW.prototype.animateBubbles();
        }
    });
};

/**
 * @NAME         : shuffle
 * @DESCRIPTION  : shuffle bubbles
 * @PARAM [arr]  : an array with targets
 * @RETURN       :
 */
DROW.prototype.shuffle = function(arr) {
    var j, x, i;
    for (i = arr.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
    return arr;
};

/**
 * @NAME         : animateBubbles
 * @DESCRIPTION  : animate Bubbles
 * @RETURN       :
 */
DROW.prototype.animateBubbles = function() {
    for (var i = 0; i < defaults.wrapper.children.length; i++) {
        (function(i) {
            setTimeout(function() {
                // add classes for each bubble
                defaults.wrapper.children[i].className = defaults.mainClass + " " + defaults.positions[i];
                // pass each bubble to the add event listner method to apply click event on each one of theme
                DROW.prototype.eventListners("click", defaults.wrapper.children[i], "expandBubbles");
            }, (300));
        })(i);
    }
    // this.addEventListners();
    DROW.prototype.resortBubbles();
};

/**
 * @NAME         : resetBubbles
 * @DESCRIPTION  : reset Bubbles
 * @RETURN       :
 */
DROW.prototype.resetBubbles = function() {
    var allElements = DROW.prototype._$(true, '.' + defaults.singleBubble);
    // expand the selected bubble
    for (var i = 0; i < allElements.length; i++) {
        allElements[i].className = defaults.mainClass;
    }
    // call resort bubbles method
    this.resortBubbles();
};

/**
 * @NAME         : resortBubbles
 * @DESCRIPTION  : resort Bubbles
 * @RETURN       :
 */
DROW.prototype.resortBubbles = function() {
    var list = DROW.prototype._$(false, '.' + defaults.list);
    DROW.prototype._$(false, ".dropzone").classList.remove('show');
    DROW.prototype._$(false, ".dropzone").classList.remove('show');

    defaults.activeSorting = setInterval(function() {
        // shuffle the positions array to random bubble animation
        defaults.positions = DROW.prototype.shuffle(["top", "right", "bottom", "left", "center"]);
        for (var i = 0; i < defaults.wrapper.children.length; i++) {
            // change each bubble posiiton
            defaults.wrapper.children[i].className = defaults.mainClass + " " + defaults.positions[i];
        }
    }, 2000);

    // hide the back button
    defaults.back.className = "back";
    // empty cities list
    list.innerHTML = " ";
    list.className = defaults.list;
};

/**
 * @NAME         : expandBubbles
 * @DESCRIPTION  :
 * @PARAM event  : the returned event
 * @RETURN       :
 */
DROW.prototype.expandBubbles = function(event) {
    var allElements = DROW.prototype._$(true, '.' + defaults.singleBubble),
        list = DROW.prototype._$(false, '.' + defaults.list),
        ele = this,
        countryName = ele.children[0].innerText,
        randomCities;

    // stop the interval of bubbles sorting
    clearInterval(defaults.activeSorting);

    // expand the selected bubble
    for (var i = 0; i < allElements.length; i++) {
        if (allElements[i] != ele) {
            allElements[i].className += " " + 'stop';
        } else {
            ele.className += defaults.mainClass + " " + 'top';
        }
    }

    // shuffle cities
    randomCities = DROW.prototype.shuffle(defaults.response[countryName]);

    // add list of cities
    for (var i = 0; i < defaults.max; i++) {
        var item = document.createElement("LI"),
            city = document.createTextNode(randomCities[i]); // Create a text node
        item.setAttribute("id", "yes-drop");
        item.appendChild(city);
        list.appendChild(item);
    }

    // animate cities rendering
    for (var i = 0; i < defaults.max; i++) {
        (function(i) {
            setTimeout(function() {
                list.children[i].className = 'draggable show';
            }, (300 * i));
        })(i);
    }
    defaults.back.className += " " + "show";
    list.className += " " + 'active';

    // new instance of DRAG class that will fire interact.js framework
    new DRAG();
};

// new instanace of DROW class
new DROW();