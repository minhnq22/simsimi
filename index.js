const fs = require("fs");
const login = require("facebook-chat-api");
const readline = require("readline");
var myID = 100006280864661;
var answeredThreads = {};
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var nameSender;
const request = require("request");

// Create simple echo bot
login({email: "minhnq22", password: "gt3q2-fls09-D12M5-##98#"}, function callback (err, api) {
    if(err) {
        switch (err.error) {
            case 'login-approval':
            console.log('Enter code > ');
            rl.on('line', (line) => {
                err.continue(line);
                rl.close();
            });
            break;
            default:
            console.error(err);
        }
        return;
    }
    api.setOptions({forceLogin: true, selfListen: true, logLevel: "silent"});

    api.listen(function callback(err, message) {
        if(err) return console.error(err);
        
        if (message.senderID != myID) {
            
            api.getUserInfo(message.senderID, function(err, ret) {
                if (err) return console.error(err);
                for (var prop in ret) {
                    if (ret.hasOwnProperty(prop) && ret[prop].name) {
                        nameSender = ret[prop].name;
                        break;
                        // console.log(nameSender);
                    }
                }
            });
            console.log("***From", nameSender, ":");
            console.log(message.body);
            console.log("----------");
            if (!message.isGroup) {
                console.log(">>>Send to", nameSender, ":");
                request("http://sandbox.api.simsimi.com/request.p?key=dafe828d-c077-46c0-be98-3580cdbc8861&lc=vn&ft=1.0&text="+encodeURI(message.body),function(error, response, body) {
                    if(err) return console.error(err);
                    var text = JSON.parse(body);
                    if(text.msg == "OK.") {
                        var messagerep = text.response;
                        api.sendMessage(messagerep,message.threadID);
                        console.log(messagerep);
                    }
                    else
                        api.sendMessage("CHẢ HIỂU GÌ LUÔN!!!",message.threadID);
                    console.log("----------");
                });
            }
        }
    });
});