const http = require('http');
const url = require("url");
const router = require('./routes/index');
const utils = require('./utils');


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async(req, res) => {
  // GET query
  const { pathname, query } = url.parse(req.url);

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  // POST params
  let body = Buffer.concat(buffers).toString();

  const params = utils.parseQuery(query || body);

  const cookie = utils.parseCookies(req);
  // console.log('cookie.token: ', cookie, cookie.token);
  params.token = cookie.token;

  // response
  const {code, token, ...info} = router.route(pathname, params);
  // console.log('code: ', code);

  if(token) {
    res.setHeader("Set-Cookie", [
      `token=${token}`,
      "HTTPOnly"
    ]);
  }

  res.statusCode = code;
  res.end(JSON.stringify(info));

});


server.listen(port, hostname);

module.exports = server