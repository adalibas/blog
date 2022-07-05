import express from 'express';
import {allPostSummaries, getPost, postsWithTag, getTagName, allTags, createTag, deleteTag, renameTag} from './db';

let app = express();
const port = 3000;
app.set('view engine', 'ejs')
app.use('/', express.static(`${__dirname}/../public`));
app.use('/admin', express.static(`${__dirname}/../admin`))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

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

app.get("/v/tag/:id", (req,res)=>{
  let id = req.params.id;
  if (id == 'all'){
    let tags = allTags();
    res.send(tags);
    
  }
  else {
    let tagId = Number(id)
    let tag = getTagName(tagId)
    let posts = postsWithTag(tagId);
    res.send({posts,tag})
  }
})

app.post("/v/tag", (req,res) =>{
  let body = req.body;
  let tagId = Object.keys(body)[0]
  let [command,name] = body[tagId];
  
  if (command === `add child`) {
    createTag({name, parentId: Number(tagId)})
    res.send(`new tag:  ${name}   is added`);
  } else if (command ===`delete`){
    deleteTag(Number(tagId));
    res.send(`tagId:${tagId} is deleted`);
  }
  else if(command === `rename`){
    renameTag(Number(tagId), name);
    res.send(`tag${tagId} is renamed to ${name}`)
  }  
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})
