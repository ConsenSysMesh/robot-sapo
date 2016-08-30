//
var express = require("express"),
    app = express()

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log("Robot Sapo running on http://0.0.0.0:"+app.get('port'));
});
