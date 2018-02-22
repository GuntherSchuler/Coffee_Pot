var express = require('express');
var app = express();
var fs = require('fs');
var houndEx = require('houndify').HoundifyExpress
var http = require('http');
var https = require('https');

var pubkey = fs.readFileSync('ssl/mycert.key', 'utf8');
var cert   = fs.readFileSync('ssl/mycert.pem', 'utf8');

var updateWatcher = fs.watch('gpio20');
var watchers = [];


//Long polling responses
updateWatcher.on('change', (eventtype, filename) => {
    fs.open(filename, 'r+', function(err, fd)
    {
        fs.readFile(fd, 'utf-8', (err, data) => {
            if(err) 
                watchers.forEach((obj) => {if(obj) obj.send("ServerError")});
            else
                watchers.forEach((obj) => {
                    obj.send("" + data);
                });
            watchers = [];
            fs.close(fd, (err) => {if (err) console.log(err)});
        });
    });
});

app.use(express.static('public'));
app.use(express.json());

app.get('/', function(req, res) { 
    res.sendFile(__dirname + '/public/testform.html');
});

app.post('/toggle', function(req, res){
    fs.open('gpio20', 'r+', function(err, fd)
    {
        fs.readFile(fd, 'utf-8', (err, data) => {
            if ( data == 1 )
                var inverse = 0;
            else
                var inverse = 1;        
            fs.write(fd, inverse, (err, written, string) => {
                if(err) 
                    console.log("Write Error");
                else
                    res.send("" + inverse);
                fs.close(fd, (err) => {if (err) console.log(err)});
            });
        });
        
    });
});

app.post('/status', function(req, res){
    
    if(req.body.first == "true")
    {
        fs.open('gpio20', 'r+', function(err, fd)
        {
            fs.readFile(fd, 'utf-8', (err, data) => {
                if(err) 
                    console.log("Read Error");
                else
                    res.send("" + data);
                fs.close(fd, (err) => {if (err) console.log(err)});
            });
        });
    }
    else
    {
        watchers.push(res);
    }
});

app.post('/brew', (req, res) => {
    var brewTime = (1 + 2 * req.body.number) * 60 * 1000; //Minutes to Sec to ms

    fs.open('gpio20', 'r+', function(err, fd)
    {
        fs.write(fd, 1, (err, written, string) => {
            if(err) 
                console.log(err);
            else
            {
                setTimeout(() => 
                {
                    fs.write(fd, 0, (err, written, string) => {
                        if(err) console.log(err);
                        fs.close(fd, (err) => {if (err) console.log(err)});
                    });
                }, brewTime);
            }
        });
    });
    

});

app.post('/cancel', (req, res) => {
    //Always turn pot off
    fs.open('gpio20', 'r+', function(err, fd)
    {
        fs.write(fd, "0", (err, written, string) => {
            if(err) {
                res.send("Error Writing, Could Not Cancel!");
                console.log("Write Error");
            }
            else
                res.send();
            fs.close(fd, (err) => {if (err) console.log(err)});
        });
    });
    //If in planned brew stop 
});

app.get("/houndAuth", houndEx.createAuthenticationHandler({
    clientId: "wYtpbCAHASNqybxEwjqRBQ==",
    clientKey: "gGlDCq1UXYGQw5t4X1alLzDPNUFZmZleITsPHF785cqzyEK65FJNytb1pjZV_3yQBcpANqWF0ArAV1emLds5jw=="
}));

app.get('*', function(req,res) {
    res.send("404");
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer({key:pubkey, cert:cert},app);

httpServer.listen(8080);
httpsServer.listen(8443);


