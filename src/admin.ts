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
                let panel = document.getElementById("admin-panel")!;
                
                let select_div = document.createElement('div');
                select_div.innerHTML = `
                    <form id="delete-form">
                        <label for="posts">Post</label>
                        <select name="posts" id="posts-select">
                        </select>
                        <button type="submit">Delete</button>
                    </form>`

                panel.appendChild(select_div);

                posts.forEach((post: { postId: any; title: any; })=>{
                    let id = post.postId;
                    let title = post.title;

                    console.log(`in for each`)

                    let option = document.createElement("option")
                    option.value = id;
                    option.innerText = `${title}`
                    document.getElementById("posts-select")?.appendChild(option);
                })

                let form = document.getElementById("delete-form")
                form?.addEventListener("submit", (e)=>{
                    e.preventDefault();
                    let data = new FormData(e.target as HTMLFormElement)
                    let postId = data.get('posts');

                    fetch(`/v/post/${postId}`,{method:"DELETE"}).catch(e=> {
                        console.log(`fetch error for post delete`)
                        console.log(e);
                    })
                })


                
            })
        } else if (action == "new-post"){
            let panel = document.getElementById("admin-panel")!;
            let form = document.createElement("div")
            form.innerHTML = `
                <form id="newPostForm">
                <input type="hidden" name="command" value="newpost">
                <div>
                    <label for="post-title">Title</label> 
                    <input type="text" name="title" id="post-title">
                </div>
                
                <div>
                    <label for="post-summary">Summary</label>
                    <textarea name="summary" id="post-summary"></textarea>
                </div>
                
                <div>
                    <label for="post-content">File</label>
                    <input type="file" name="content" id="post-content">
                </div>
                
                <div>
                    <label for="post-tags">Taglist</label>
                    <input type="text" name="tags" id="post-tags">
                </div>
                
                <div>
                    <button type="submit" id="newPostSubmit">submit</button>
                </div>
                
                </form>
            `
            panel.appendChild(form);

            let newPostForm = document.getElementById("newPostForm")!
            newPostForm.addEventListener("submit",(e)=>{
                e.preventDefault();

                let data = new FormData(e.target as HTMLFormElement);
                fetch("/v/post",{method:"POST", body: data})
                    .then(res =>{
                        let result = document.createElement('p');
                        result.innerHTML = `${res.body}`
                        let newPostForm = document.getElementById("newPostForm")!;
                        newPostForm.appendChild(result);
                    });
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