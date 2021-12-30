//creating node server
const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);

    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=")
            .on("data", (chunk) => { //data->this event is fired when there is data is available to read

                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                //console.log(arrdata[0].main.temp);
                const realTimeData = arrdata.map((val) => {

                    replaceVal(homeFile, val).join("");
                })
                res.write(realTimeData);
            })
            .on("end", (err) => { //end->this event is fired when there is no more data to read
                //error->this event is fired when there is any error receiving or writing data.
                if (err) return console.log("Connection closed due to errors", err);

                res.end();
            });
    }
});
server.listen(8000, "127.0.0.1");

