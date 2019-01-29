# v3NodeBingSearchBot
This is v3 Node.js bot that shows how to make Bing Search API call and get response back (in bot context).


It is a v3 Node.js bot app, that invokes Bing Search REST API. Once the results are retrieved, it would be pushed to user context in the form of a session dialog.

## Packages to install
The following are the npm packages that are installed.
```
    "botbuilder": "^3.15.0",
    "dotenv": "^6.2.0",
    "request": "^2.88.0",
    "restify": "^7.6.0"
```

## Code changes discussion
In order to invoke the Bing Search API, utilized the **request** npm package. In order to ensure the caller gets the response back, the custom function needs to return a Promise object. So, have the privilege of hooking bits and pieces via **resolve** and **reject** APIs for success and error cases respectively. By this time, you should have created Bing Search cognitive service API on the Azure portal.


```
var request = require('request');

module.exports = {
    getBingWebSearchResults: (query) => {
        return new Promise((resolve, reject) => {
            request({
                headers: {'Ocp-Apim-Subscription-Key' : process.env.BingSeachApiKey},
                uri: 'https://api.cognitive.microsoft.com/bing/v7.0/search?responseFilter=Webpages&q=' + query,
                method: 'GET'
            },
            function (error, response, body) {
                    if(error){
                        console.log(error);
                        reject(error);
                    }else{
                        var data = JSON.parse(body);
                        //console.log(data);

                        // utilize map function to read columns from collection, and push it to object then
                        var botSearchResults = data.webPages.value
                                                    .map(item => item.url + ' :: ' + item.snippet);
                        
                        resolve(JSON.stringify(botSearchResults));
                    }
                });
        });
    }
}
```

Please note that **module.exports** actually helped the function to be exported, so that called can invoke easily. The function name is "getBingWebSearchResults" in this case.

The calling code from "app.js" would look like the following.

```
var bingSearch = require('./bingWebSearch.js');
..
..

// Search dialog that invokes request module API
bot.dialog('RequestSearch', [
    function(session){
        builder.Prompts.text(session, "your search string?");
    },
    function(session, results){
        bingSearch.getBingWebSearchResults(session.message.text)
                .then(response => {
                    session.endDialog(response);
                });
    }
]);
```

## How to run?
You can clone the repo. And, run command *npm install* in order to install the dependency packages. 
