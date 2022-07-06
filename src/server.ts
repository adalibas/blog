import express from 'express';
import fileUpload from 'express-fileupload'
import {allPostSummaries, getPost, postsWithTag, getTagName, allTags, createTag, deleteTag, renameTag, createPost, deletePost} from './db';

let app = express();
const port = 3000;
app.set('view engine', 'ejs')
app.use('/', express.static(`${__dirname}/../public`));
app.use('/admin', express.static(`${__dirname}/../admin`))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())

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

app.get("/v/post/:id", (req,res)=>{
  let id = req.params.id;
  if(id == "all"){
    res.send(allPostSummaries());
  } else {
    res.send(getPost(Number(id)));
  }
})

app.delete("/v/post/:id", (req,res)=>{
  let id = req.params.id;
  deletePost(Number(id));
})

app.post("/v/post", (req,res)=>{
  let body = req.body;
  let {command,title,summary,tags} = body;
  let tagArray = tags.split(",").map(Number)
  let files = req.files!;
  let buff = files.content as any;
  let content = buff.data.toString();

  try{
    createPost({title,summary,content,tags:tagArray})
  }

  catch (e){
    console.log(e);
    res.send(`error creating the post`);
  }
  
  res.send(`New post ${title} is created`);

})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})
