async function manageTags(){
    type tagList = {
        tagId: string,
        name: string
    }
    
    let panel = document.getElementById("admin-panel");
    if (panel == null || panel.className === 'tags') {
        return;
    } else {
        panel.className = 'tags';
        panel.innerHTML = "";
        let f = await fetch("/v/tag/all");
        let tags = await f.json() as unknown as tagList [];

        let list = document.createElement("ul");
        tags.forEach((tag)=>{
            let item = document.createElement("li");
            item.innerHTML = (
            `
            <p>id:${tag.tagId}, name:${tag.name}</p>
            <form action="/v/tag" method="post">
                <input type="radio" name="${tag.tagId}" value="delete">delete</input>
                <input type="radio" name="${tag.tagId}" value="rename">rename</input>
                <input type="radio" name="${tag.tagId}" value="add child">add child</input>
                <input type="text" name="${tag.tagId}" value="child name / new name"/>
                <button type=submit>submit</button>
            </form>
            `
            );
            list.appendChild(item);
        })
        panel.appendChild(list)
    }
}

async function managePosts() {
    let panel = document.getElementById("admin-panel");
    if (panel == null || panel.className === 'posts') {
        return;
    } else {
        panel.className = 'posts';
        panel.innerHTML = `<form id="post-action-form" action="">
        <label for="delete">delete</label>
        <input type="radio" name="post-action" id="delete" value="delete">
        <label for="new-post">New post</label>
        <input type="radio" name="post-action" id="new-post" value="new-post">
        <label for="update-post">Update post</label>
        <input type="radio" name="post-action" id="update-post" value="update-post">
        <button type="submit">submit</button>
    </form>`;

    let form = document.getElementById("post-action-form");
    form?.addEventListener('submit',(e)=>{
        e.preventDefault();
        let form = e.target as any
        let action = form["post-action"].value
        
        if (action == "delete"){
            fetch("/v/post/all").then((e)=>e.json()).then((posts)=>{
                posts.forEach((post: { postId: any; title: any; })=>{
                    let id = post.postId;
                    let title = post.title;
                    let zonta = document.createElement("p")
                    zonta.innerHTML = `${id},${title}`
                    document.getElementById("admin-panel")?.appendChild(zonta);
                })
            })
        } else if (action == "new-post"){
            let panel = document.getElementById("admin-panel")!;
            let form = document.createElement("div")
            form.innerHTML = `
                <form id="newPostForm">
                <input type="hidden" name="command" value="newpost">
                <input type="text" name="title" id="post-title">
                <input type="file" name="content" id="post-content">
                <input type="text" name="tags" id="post-tags">
                <button type="submit" id="newPostSubmit">submit</button>
                </form>
            `
            panel.appendChild(form);

            let newPostForm = document.getElementById("newPostForm")!
            newPostForm.addEventListener("submit",(e)=>{
                e.preventDefault();

                let data = new FormData(e.target as HTMLFormElement);
                fetch("/v/post",{method:"POST", body: data})
            })

            

        } else if (action == "update-post"){

        }
        
    } )

        
    }
}

let tags = document.getElementById("tags")!;
tags.addEventListener("click", manageTags);

let posts = document.getElementById("posts")!;
posts.addEventListener("click", managePosts);