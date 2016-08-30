//
var express = require("express"),
    app = express()

var requestp = require('request-promise');

var Web3    = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://consensysnet.infura.io:8545"));

var config = {
  slackHook: process.env.SLACK_HOOK,
  uport:{
    registryAddress: '0xa9be82e93628abaac5ab557a9b3b02f711c0151c',
    abi: [{"constant":true,"inputs":[{"name":"personaAddress","type":"address"}],"name":"getAttributes","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"previousPublishedVersion","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"ipfsHash","type":"bytes"}],"name":"setAttributes","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ipfsAttributeLookup","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"inputs":[{"name":"_previousPublishedVersion","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_sender","type":"address"},{"indexed":false,"name":"_timestamp","type":"uint256"}],"name":"AttributesSet","type":"event"}],
    slackChannel: '@ajunge'
  }
}


if(!config.slackHook){
  console.log("SLACK_HOOK not defined. Bye!");
  process.exit(1);
}else{
  console.log("Using SLACK_HOOK:"+config.slackHook);
}


//Sapea uPortRegistry.setAttributes;
var uPortRegistryDef = web3.eth.contract(config.uport.abi);
var uPortRegistry = uPortRegistryDef.at(config.uport.registryAddress);
var uPortRegistryEvents = uPortRegistry.allEvents();

// Start watching
uPortRegistryEvents.watch(function(error, event){
  if (!error){
      console.log(event)
      var uportId=event.args._sender;
      var timestamp=event.args._timestamp;
      var text="AttributesSet event:\n _sender: "+uportId+"\n _timestamp: "+timestamp;
      slackIt(config.uport.slackChannel,'uPortRegistry',':uport:',text,config.slackHook);
  }
});

function slackIt(_channel,_username,_icon_emonji,_text,_hook){
  var icon_emonji=':robot_face:';

  payload={
    "channel": _channel,
    "username": _username,
    "icon_emoji": _icon_emonji,
    "text": _text
  }
  var options = {
    method: 'POST',
    uri: _hook,
    body: payload,
    json: true
  };

  requestp(options)
    .then(function (parsedBody) {
        console.log("<--------- RESPONSE");
        console.log(parsedBody);
    })
    .catch(function (err) {
        console.log(err);
    });
}


app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log("Robot Sapo running on http://0.0.0.0:"+app.get('port'));
});
