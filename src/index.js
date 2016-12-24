var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Anchorage";

var numberOfResults = 3;

// NY Times search article api key
var APIKey = "a88b518d0daa42d4a3d2531a061a45ab";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Anchorage is in the south-central part of the state on the Cook Inlet. With an estimated 298,695 residents as of 2015, Anchorage is the largest city in the state of Alaska. It's known for its cultural sites, including the Alaska Native Heritage Center and is also a gateway to nearby wilderness areas and mountains including the Chugach, Kenai and Talkeetna";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your Alexa app for more information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Alaska Railroad", content: "Completed in 1923, the iconic Alaska Railroad connects many of Alaska's most popular destinations: Anchorage, Talkeetna, Denali National Park, Fairbanks, Girdwood, Seward, Whittier and the Spencer Glacier Whistle Stop. Daily summer departures and our knowledgeable Alaskan reservationists make it easy to plan everything from day trips to multi-day Alaska vacations including excursions and accommodations -- all using the Alaska Railroad to traverse this great land.", location: "411 W 1st Ave, Anchorage, AK 99501", contact: "800 544 0552" },
    { name: "Anchorage Museum at Rasmuson Center", content: "Alaska's largest museum focusing on art, history, science and culture of Alaska.", location: "625 C St, Anchorage, AK 99501", contact: "907 929 9201" },
    { name: "Lake Eklutna", content: "Under an hour from Anchorage, this 22-mile drive takes you away from Alaska’s towns and cities, and into Chugach State Park. The road is smooth with twists and turns, and runs alongside Eklutna River, and the beautiful and glacial Eklutna Lake. You can also see Twin Peaks over the trees.", location: "Chugach State Park, Anchorage, Alaska", contact: "907 345 5014" },
    { name: "Alaska Native Heritage Center", content: "Alaskan native culture is presented through storytelling, dancing, craft-making and simulated, life-sized villages representing each of the five main indigenous groups.", location: "8800 Heritage Center Dr, Anchorage, AK 99504", contact: "907 330 8000" },
    { name: "Alaska Zoo", content: "If you've missed seeing Arctic wildlife on your Alaskan adventure, you'll find it at this small zoo, where all the animals have names. You'll see moose, caribou, sheep, wolves, musk oxen, mountain goats and several different types of bears, including polar, grizzly and black bears.", location: "4731 Omalley Rd, Anchorage, AK 99507", contact: "907 346 2133" },
    { name: "Alaska Wildlife Conservation Center", content: "The Alaska Wildlife Conservation Center (AWCC) is a nonprofit facility situated on 200 acres an hour south of Anchorage. The Center is dedicated to the preservation of Alaska’s wildlife through conservation, education, and quality animal care.", location: "Mile 79 Seward Highway, Girdwood, Anchorage, AK 99587", contact: "907 783 2025"}
];

var topFive = [
    { number: "1", caption: "Visit the Space Needle and see Seattle from  above.", more: "Once the tallest structure west of the Mississippi River, The Space Needle is an observation tower that reaches a height of 605 feet. The observation deck falls slightly below this, offering views at 520 feet.", location: "400 Broad St. Seattle, WA 98109", contact: "400 Broad St. Seattle, WA 98109" },
    { number: "2", caption: "Get shopping at Pike Place Market.", more: "One of the oldest farmer's markets in America, Pike Place Market is Seattle's historic arcade of various vendors, winding alleys and stairways to lower levels. The market plays host to more than 10 million visitors annually.", location: "Pike Place Market PDA, 85 Pike Street, Room 500, Seattle, WA 98101", contact: "info@pikeplacemarket.org \n 206 682 7453" },
    { number: "3", caption: "Earn your  wings at the Museum  of Flight.", more: "This museum is a non-profit air and space museum located at the southern end of King County International Airport . It's the largest private museum of its kind in the world and attracts over 500,000 visitors every year", location: "9404 East Marginal Way South Seattle, WA 98108-4097", contact: "206 764 5700" },
    { number: "4", caption: "Breathe in the culture  at the Seattle Art  Museum.", more: "Also known as \"SAM\", the Seattle Art Museum maintains three major facilities: its main museum in downtown Seattle; the Seattle Asian Art Museum, and the Olympic Sculpture Park. The flagship museum is host to several great exhibitions and collections for you to experience.", location: "1300 First Ave Seattle, WA 98101", contact: "206 654 3100" },
    { number: "5", caption: "Take a spin on the  Seattle Great Wheel.", more: "See Seattle's skyline from the giant Ferris wheel situated on Pier 57. The Seattle Great Wheel is the largest observation wheel on the west coast, standing 175 feet tall.", location: "1301 Alaskan Way, Seattle, Washington 98101", contact: "greatwheel@pier57seattle.com \n 206 623 8607" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;

        output = welcomeMessage;

        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    }
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getOverview': function () {

        output = locationOverview;

        this.emit(':tellWithCard', output, location, locationOverview);
    },

    'getAttractionIntent': function () {

        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },

    'getTopFiveIntent': function () {

        output = topFiveIntro;

        var cardTitle = "";

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }

        output += topFiveMoreInfo;

        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },

    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },

    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=seattle&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
