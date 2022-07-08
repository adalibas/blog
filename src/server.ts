import express from 'express';
import fileUpload from 'express-fileupload'
import {allPostSummaries, getPost, postsWithTag, getTagName,
   allTags, createTag, deleteTag, renameTag,
  createPost, deletePost, updatePostTitle,
  updatePostSummary, addTagToPost,removeTagFromPost, updatePostContent} from './db';

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

app.put("/v/tag/:id", (req,res) =>{
  let id = Number(req.params.id)
  let newName = req.body.newName;
  renameTag(id, newName)
  res.send(`renamed tagId ${id} as ${newName}`)
})

app.post("/v/tag/:id",(req,res)=>{
  let parentId = Number(req.params.id);
  let name = req.body.newName;
  createTag({name, parentId})
  res.send(`new tag:  ${name}   is added`);

})

app.delete("/v/tag/:id",(req,res) => {
  let tagId = req.params.id;
  deleteTag(Number(tagId));
  res.send(`tagId:${tagId} is deleted`);
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
  res.send(`post id ${id} is deleted`)
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

app.put("/v/post/:id", (req,res)=>{
  let postId = Number(req.params.id);
  let command = req.body.command;
  if (command == "change-title"){
    let newTitle = req.body.newTitle;
    updatePostTitle(postId, newTitle);
    res.send(`post ${postId} title is updated`)
  } else if (command == "change-summary"){
    let newSummary = req.body.newSummary;
    updatePostSummary(postId,newSummary);
    res.send(`post ${postId} summary is updated`)
  } else if (command == "tag-add") {
    let newTagId = Number(req.body.newTags);
    addTagToPost(postId, newTagId);
    res.send(`post ${postId} tag is added`)
  } else if (command == "tag-remove") {
    let tagId = Number(req.body.newTags);
    removeTagFromPost(postId,tagId);
    res.send(`post ${postId} tag is removed`)
  } else if (command == "change-content") {
    let newFile = req.files?.newFile! as any;
    let newContent = newFile.data.toString();
    updatePostContent(postId,newContent);
    res.send(`post ${postId} content is updated`)
  }
  
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})
