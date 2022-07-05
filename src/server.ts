import express from 'express';
import {allPostSummaries, getPost, postsWithTag, getTagName,allTags} from './db';

let app = express();
const port = 3000;
app.set('view engine', 'ejs')
app.use('/', express.static(`${__dirname}/../public`));
app.use('/admin', express.static(`${__dirname}/../admin`))

app.get('/', (req, res) => {
    let posts = allPostSummaries();
    res.render('pages/index',{posts});
})
app.get('/post/:id', (req,res)=>{
  let post = getPost(Number(req.params.id))
  res.render('pages/post',{post})
})
app.get("/tag/:id", (req,res)=>{
  let id = req.params.id;

  if (id == 'all'){
    let tags = allTags();
    res.render('pages/alltags',{tags})
  }
  else {
    let tagId = Number(id)
    let tag = getTagName(tagId)
    let posts = postsWithTag(tagId);
    res.render('pages/tag',{posts,tag})
  }
  
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})
