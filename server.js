var Gun = require('gun');

var server = require('http').createServer(function(req, res){
  if (Gun.serve(req, res)){ return }
  require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error',function(){ res.writeHead(404); res.end() }).pipe(res);
});

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765;

server.listen(port);

var gun = Gun({file: 'data.json', web: server});

// Function to generate a random timestamp within the last week
const randomTimestampLastWeek = () => {
  let sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return Math.floor(Math.random() * (Date.now() - sevenDaysAgo) + sevenDaysAgo);
};

// Define placeholder posts
const placeholderPosts = [
  { userId: 'User1', alias: 'Alice', content: 'Artificial Intelligence (AI) is a fascinating concept that attempts to recreate human intelligence or behaviors in a machine. AI has vast potential and can revolutionize various sectors such as healthcare, finance, and transportation.', timestamp: randomTimestampLastWeek() },
  { userId: 'User2', alias: 'Bob', content: 'Cryptocurrency is a type of digital or virtual currency that uses cryptography for security. Cryptocurrencies leverage blockchain technology to gain decentralization, transparency, and immutability.', timestamp: randomTimestampLastWeek() },
  { userId: 'User3', alias: 'Charlie', content: 'Climate change refers to the shift in global temperatures and weather patterns, largely caused by human activities. It\'s one of the biggest challenges we face today, with impacts ranging from increased natural disasters to species extinction.', timestamp: randomTimestampLastWeek() },
];

// Add placeholder posts to Gun instance
placeholderPosts.forEach((post, index) => {
  gun.get('messages').get(`placeholder${index}`).put(post);
});
