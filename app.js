var restify = require('restify');
var builder = require('botbuilder');
var bingSearch = require('./bingWebSearch.js');
require('dotenv').config();

// Setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, 
    function(){
        console.log('%s listening to %s', server.name, server.url);
    });

// Default store: volatile in-memory store - Only for prototyping!
var inMemoryStorage = new builder.MemoryBotStorage();

// Chat connector for communicating with Bot Framework service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Prepare UnversalBot for teams related activities
var bot = new builder.UniversalBot(connector)
            .set('storage', inMemoryStorage);

// Set the dialog
bot.dialog('/', [
    function(session){
        builder.Prompts.choice(session, "Choose an option: ", 
                    'Search| No search');        
    },
    function(session,results){
        switch(results.response.index){
            case 0:
                session.beginDialog('RequestSearch');
                break;
            case 1:
                session.beginDialog('NoSearch');
                break;
            default:
                session.endDialog();
                break;
        }
    }
]);

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

// NoSearch dialog
bot.dialog('NoSearch', function(session){
    session.endDialog("you said - %s", session.message.text);
});