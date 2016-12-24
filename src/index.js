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
    { number: "1", caption: "Ski at Alyeska Ski Area.", more: "A popular winter recreation resort for skiers that features 2,000 vertical feet of skiing on 27 trails.", location: "1000 Arlberg Dr, Girdwood, Anchorage, AK 99587", contact: "907 754 2285" },
    { number: "2", caption: "Hike on Portage Glacier.", more: "Portage Glacier is a glacier on the Kenai Peninsula in Alaska and is included within the Chugach National Forest. It is located south of Portage Lake and 6 miles west of Whittier.", location: "Portage Lake Loop, Girdwood, Anchorage, AK", contact: "907 783 232" },
    { number: "3", caption: "Explore the outdoors in Kincaid Park.", more: "This park offers 20 miles of cross-country skiing, hiking and bike trails.", location: " 6998 Raspberry Rd, Anchorage, AK 99502", contact: "907 343 6397" },
    { number: "4", caption: "Climb Flattop mountain, the most climbed mountain in Alaska.", more: "Flattop Mountain is a 3,510 foot mountain in Alaska, located in Chugach State Park just east of urban Anchorage.", location: "13229 Glen Alps Rd, Anchorage, AK 99516", contact: "907 345 5014" },
    { number: "5", caption: "Soar above Mount Alyeska on the Alyeska Aerial Tram.", more: "The Alyeska Resort Aerial Tramway is a seven-minute ride to a viewing deck with breathtaking panoramic views of mountains, hanging glaciers, streams, spruce, and an array of wildlife.", location: "1000 Arlberg Ave, Alyeska Resort, Girdwood, Anchorage, AK 99587", contact: "907 754 2275" }
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
