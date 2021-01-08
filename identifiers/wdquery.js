const https = require("https");
const wdk = require('wikibase-sdk')({
  instance: 'https://www.wikidata.org',
  sparqlEndpoint: 'https://query.wikidata.org/sparql'
});
const { URL } = require('url');

const identifier = '65399';
const sparql = `
SELECT ?compound WHERE {
  ?compound wdt:P662 ${identifier} .
}
`

/*
const url = wdk.sparqlQuery(sparql)
console.log(url);

https.get(url, function(res) {
  res.setEncoding('utf8');
      res.on('data', function(d) {
	console.log(d);
      });
    }).on('error', function(e) {
      console.error(e);
    });
//*/

/*
const url = wdk.sparqlQuery(sparql)
console.log(url);

https.get({
  url,
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    }
  }, function(res) {
  res.setEncoding('utf8');
      res.on('data', function(d) {
	console.log(d);
      });
    }).on('error', function(e) {
      console.error(e);
    });
//*/

/*
const [ url, body ]  = wdk.sparqlQuery(sparql).split('?')
//request({ method: 'POST', url, body })

console.log(url);

const req = https.request({
  hostname: "query.wikidata.org",
  path: "/sparql",
  body,
  method: 'POST',
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    }
  }, function(res) {
  res.setEncoding('utf8');
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
      res.on('data', function(d) {
	console.log('data');
	//console.log(d);
	//console.log(d.toString());
        process.stdout.write(d);
      });
    }).on('error', function(e) {
      console.error(e);
    });
req.end();
//*/

//*
const [ url, body ]  = wdk.sparqlQuery(sparql).split('?')
//request({ method: 'POST', url, body })

console.log(url);

const options = new URL(url);
console.log(options);

const req = https.get({
  hostname: "query.wikidata.org",
  path: "/sparql",
  searchParams: options.searchParams,
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    }}, function(res) {
  res.setEncoding('utf8');
/*
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
      res.on('data', function(d) {
	console.log('data');
	//console.log(d);
	//console.log(d.toString());
        process.stdout.write(d);
      });
//*/
    }).on('error', function(e) {
      console.error(e);
    });
req.end();
//*/
