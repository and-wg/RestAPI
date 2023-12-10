const http = require("http");
const host = "localhost";
const port = 8000;

const requestListener = function (request, response) {
    console.log("request made from client", request.url);
    response.writeHead(200);
    response.setHeader("Content-Type", "application/json");
    response.end("My first server");
}

const server = http.createServer(requestListener);
server.listen(port, host, () => (
    console.log(`Server is running on http://${host}:${port}`)
));