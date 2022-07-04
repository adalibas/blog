import Database from "better-sqlite3";
import {checkCreateDatabase} from './checkfile';

checkCreateDatabase();
let db = new Database("./blog.db",{fileMustExist: true});

function createTag({name, parentId} = {name: "", parentId: 1}){
    let tag = db.prepare(
        "insert into tags (name) values (?);");
    
    let tag_children = db.prepare(
        `insert into tag_children (parentId,childId)
        select @parentId, tagId from tags
        where name = @name;`
    );
    tag.run(name);
    tag_children.run({parentId, name});

}

function createPost({title, summary, tags, content} = {title: "", summary: "", tags: [1], content: ""}) {
    let post = db.prepare(`
    insert into posts (title, summary, content) values (@title, @summary, @content);`
    )
    post.run({title, summary,content})

    let pid = db.prepare(`select postId from posts where title = @title`).get({title}).postId;

    let post_tag = db.prepare(`insert into post_tag (postId, tagId) values (@postId, @tagId)`)
    
    for (let tagId of tags){
        post_tag.run({postId: pid, tagId})
    }
}

interface Post {
    postId: number,
    title: string,
    summary: string,
    dateAdded: string,
}

interface Tag {
    tagId:number,
    tagName: string
}

interface Tagextra extends Tag {
    postId: number,
    
}

interface PostWithTag extends Post{
    tags: Tag[]
}

export function allPostSummaries(): string{
    let postsQ = db.prepare(`
        select p.postId, p.title, p.summary, p.dateAdded
        from posts as p
        order by p.dateAdded desc;
        `);
    
    let tagsQ = db.prepare(
        `select p.postId, t.tagId, t.name as tagName 
        from (posts as p left join post_tag as pt on p.postId = pt.postId)
        left join tags as t on pt.tagId = t.tagId;`
    )
    
    let posts = [...postsQ.all()] as Post[];
    let tags = [...tagsQ.all()] as Tagextra[];

    let map: {[key:number]: {tagId: number, tagName:string}[]} = {};

    for (let tag of tags) {
        let {postId,tagId,tagName} = tag;
        
        if (map[postId] == null) {
            map[postId] = [{tagId, tagName}];
        } else {
            map[postId].push({tagId, tagName});
        }
    }
    let result: Array<PostWithTag> = [];
    for (let post of posts){
        let {postId} = post;
        let mod = map[postId]
        result.push({...post, "tags":mod});

    }

    return JSON.stringify(result,null,2);
}

function getPost(postId: number): string{
    let postsQ = db.prepare(`
        select p.postId, p.title, p.summary, p.dateAdded, p.dateModified, p.content
        from posts as p
        where p.postId = @postId`);
    
    let tagsQ = db.prepare(
        `select p.postId, t.tagId, t.name as tagName 
        from (posts as p left join post_tag as pt on p.postId = pt.postId)
        left join tags as t on pt.tagId = t.tagId
        where p.postId = @postId;`
    )
    
    let post = postsQ.get({postId}) as Post;
    let tags = [...tagsQ.all({postId})] as Tagextra[];

    let map: {[key:number]: {tagId: number, tagName:string}[]} = {};

    for (let tag of tags) {
        let {postId,tagId,tagName} = tag;
        
        if (map[postId] == null) {
            map[postId] = [{tagId, tagName}];
        } else {
            map[postId].push({tagId, tagName});
        }
    }
    let result = post as PostWithTag;
    result["tags"] = map[postId]

    return JSON.stringify(result,null,2);
}

// createTag({name:"phil",parentId:1})
// createTag({name:"comp",parentId:1})
// createTag({name:"rec",parentId:3})

// createPost({title: "first phil", summary:"phil 1", tags: [2], content:"phil 1 hello"});
// createPost({title: "first comp", summary:"comp 1", tags: [2,3], content:"comp1 hello"});
// createPost({title: "second comp rec", summary:"rec", tags: [3], content:"comp1 rec hello"});

// console.log(allPostSummaries());
// console.log(getPost(2))