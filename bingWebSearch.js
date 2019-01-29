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
