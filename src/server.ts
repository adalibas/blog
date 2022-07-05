import express from 'express';
import {allPostSummaries, getPost} from './db';

let app = express();
const port = 3000;
app.set('view engine', 'ejs')
app.use('/', express.static(`${__dirname}/../public`));
app.use('/admin', express.static(`${__dirname}/../admin`))

app.get('/', (req, res) => {
    let posts = JSON.parse(allPostSummaries());
    res.render('pages/index',{posts});
})
app.get('/post/:id', (req,res)=>{
  let post = JSON.parse(getPost(Number(req.params.id)))
  res.render('pages/post',{post})
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})
