const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();
const db = require('./db.json');
const fs = require('fs');

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/create-story', async (req: any, res: any) => {
  const stories = readStories();
  console.log('stories', stories);
  delete req.body.id;
  const story = stories.find((story: any) => story.story_name === req.body.story_name);

  if (story) {
    res.status(500).send({
      status: false,
      message: 'Story Already Exist'
    });
  }
  res.send({
    status: true,
    message: 'Story Saved Successfully'
  });
  db.stories.push(req.body);
});

server.use('/stories', (req:any, res:any, next:any) => {
  next();
});
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});

function readStories() {
  const dbRaw = fs.readFileSync('./server/db.json');  
  const stories = JSON.parse(dbRaw).stories
  return stories;
}