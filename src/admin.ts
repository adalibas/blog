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

        let form = document.createElement("form");
        form.innerHTML = `
            <div>
                <label for="delete-tag">Delete tag</label>
                <input type="radio" name="tag-action" id="delete-tag" value="delete-tag">
            </div>
        
            <div>
                <label for="new-post">New tag</label>
                <input type="radio" name="tag-action" id="new-tag" value="new-tag">
            </div>

            <div>
                <label for="rename-tag">Rename tag</label>
                <input type="radio" name="tag-action" id="rename-tag" value="rename-tag">
            </div>

            <button type="submit">submit</button>`

        panel.appendChild(form);
        
        form.addEventListener("submit",async (e)=>{
            e.preventDefault();
            let form = e.target as any
            let action = form["tag-action"].value
            
            if (action == "delete-tag"){
                let panel = document.getElementById("admin-panel");
                let selectionDiv = document.createElement("div");
                selectionDiv.innerHTML = `
                    <form id="tag-delete-form">
                        <label for="tags">Tags</label>
                        <select name="tags" id="tags-select">
                        </select>
                        <button id="delete-submit" type="submit">Delete</button>
                    </form>`;
                    panel?.appendChild(selectionDiv)

                    let tags = await fetch("/v/tag/all").then(e=>e.json());
                    tags.forEach((tag:tagList)=>{
                        let option = document.createElement("option");
                        option.value = tag.tagId;
                        option.innerText = tag.name;
                        let select = document.getElementById("tags-select");
                        select?.appendChild(option);
                    })

                    let form = document.getElementById("tag-delete-form");
                    form?.addEventListener("submit",e=>{
                        e.preventDefault();
                        let form = e.target as any;
                        let data = new FormData(form);
                        let tagId = data.get("tags")
                        fetch(`/v/tag/${tagId}`,{method: "DELETE"}).catch(console.log)
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    })
                    
            } else if (action == "new-tag"){
                let panel = document.getElementById("admin-panel");
                let selectionDiv = document.createElement("div");
                selectionDiv.innerHTML = `
                    <form id="tag-new-form">
                        <label for="tags">Parent tag</label>
                        <select name="tags" id="tags-select">
                        </select>
                        <label for="new-tag-text">New tag name</label>
                        <input type="text" id="new-tag-text" name="new-name"></input>
                        <button id="new-tag-submit" type="submit">New tag</button>
                    </form>`;
                    panel?.appendChild(selectionDiv)

                    let tags = await fetch("/v/tag/all").then(e=>e.json());
                    tags.forEach((tag:tagList)=>{
                        let option = document.createElement("option");
                        option.value = tag.tagId;
                        option.innerText = tag.name;
                        let select = document.getElementById("tags-select");
                        select?.appendChild(option);
                    })

                    let form = document.getElementById("tag-new-form");
                    form?.addEventListener("submit",e=>{
                        e.preventDefault();
                        let form = e.target as any;
                        let data = new FormData(form);
                        let tagId = data.get("tags");
                        let newName = data.get("new-name");
                        let obj = {newName}

                        fetch(`/v/tag/${tagId}`,{method: "POST", body: JSON.stringify(obj), headers: {"Content-Type": 'application/json'}})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    })

            } else if (action == "rename-tag"){
                let panel = document.getElementById("admin-panel");
                let selectionDiv = document.createElement("div");
                selectionDiv.innerHTML = `
                    <form id="tag-rename-form">
                        <label for="tags">Rename tag</label>
                        <select name="tags" id="tags-select">
                        </select>
                        <label for="new-name-text">New name</label>
                        <input type="text" id="new-tag-text" name="new-name"></input>
                        <button id="rename-submit" type="submit">Submit</button>
                    </form>`;
                    panel?.appendChild(selectionDiv)

                    let tags = await fetch("/v/tag/all").then(e=>e.json());
                    tags.forEach((tag:tagList)=>{
                        let option = document.createElement("option");
                        option.value = tag.tagId;
                        option.innerText = tag.name;
                        let select = document.getElementById("tags-select");
                        select?.appendChild(option);
                    })

                    let form = document.getElementById("tag-rename-form");
                    form?.addEventListener("submit",e=>{
                        e.preventDefault();
                        let form = e.target as any;
                        let data = new FormData(form);
                        let tagId = data.get("tags");
                        let newName = data.get("new-name");
                        let obj = {newName}

                        fetch(`/v/tag/${tagId}`,{method: "PUT", body: JSON.stringify(obj), headers: {"Content-Type": 'application/json'}})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    })

        }
    })
}
}

async function managePosts() {
    let panel = document.getElementById("admin-panel");
    if (panel == null || panel.className === 'posts') {
        return;
    } else {
        panel.className = 'posts';
        panel.innerHTML = `<form id="post-action-form" action="">
        <div>
            <label for="delete">Delete post</label>
            <input type="radio" name="post-action" id="delete" value="delete">
        </div>
        
        <div>
            <label for="new-post">New post</label>
            <input type="radio" name="post-action" id="new-post" value="new-post">
        </div>

        <div>
            <label for="update-post">Update post</label>
            <input type="radio" name="post-action" id="update-post" value="update-post">
        </div>

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
                    .then(res => res?.text())
                    .then(text=>{
                        let panel = document.getElementById("admin-panel")!;
                        panel.className = "result"
                        panel.innerHTML = `<p class="result-text">${text}</p>`
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
                .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
            })

            

        } else if (action == "update-post"){
            fetch("/v/post/all").then((e)=>e.json()).then((posts)=>{
                let panel = document.getElementById("admin-panel")!;
                
                let select_div = document.createElement('div');
                select_div.innerHTML = `
                    <form id="update-form">
                        <label for="posts">Post</label>
                        <select name="posts" id="posts-select">
                        </select>
                    </form>`

                panel.appendChild(select_div);

                posts.forEach((post: { postId: any; title: any; })=>{
                    let id = post.postId;
                    let title = post.title;

                    let option = document.createElement("option")
                    option.value = id;
                    option.innerText = `${title}`
                    document.getElementById("posts-select")?.appendChild(option);
                })
            }).then(e =>{
                let updateForm = document.getElementById("update-form")!;
                let form = document.createElement("div")
                form.innerHTML = `
                    
                    <div>
                        <label for="post-title">Title</label> 
                        <input type="text" name="title" id="post-title">
                        <button type="button" id="title-submit">change title</button>
                    </div>
                    

                    <div>
                        <label for="post-summary">Summary</label>
                        <textarea name="summary" id="post-summary"></textarea>
                        <button type="button" id="summary-submit">change summary</button>
                    </div>



                    <div>
                        <label for="post-tags">Taglist</label>
                        <input type="text" name="tags" id="post-tags">
                        <button type="button" id="tag-add">Add tag</button>
                        <button type="button" id="tag-remove">Remove tag</button>
                    </div>

                

                    <div>
                       <label for="post-content">File</label>
                       <input type="file" name="content" id="post-content">
                       <button type="button" id="content-submit">change content</button>
                    </div>
                `
                updateForm.appendChild(form);

                let newPostForm = document.getElementById("update-form")!
                newPostForm.addEventListener("click",(e)=>{
                    
                    let target = e.target as HTMLElement;
                    let id = target.getAttribute("id");
                    let data = new FormData(document.getElementById("update-form") as HTMLFormElement);
                    let postId = data.get("posts");
                    if (id == "title-submit"){
                        e.preventDefault();
                        let title = data.get("title");
                        let send = {command:"change-title", newTitle: title};
                        fetch(`/v/post/${postId}`,{method: "PUT", body:JSON.stringify(send), headers:{"Content-type": "application/json"}})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                        

                    } else if (id == "summary-submit") {
                        e.preventDefault();
                        let summary = data.get("summary");
                        let send = {command:"change-summary", newSummary: summary}
                        fetch(`/v/post/${postId}`,{method: "PUT", body:JSON.stringify(send), headers:{"Content-type": "application/json"}})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    } else if (id == "content-submit"){
                        e.preventDefault();
                        let file = data.get("content")!;
                        let submit = new FormData();
                        submit.append("newFile",file);
                        submit.append("command", "change-content")
                        fetch(`/v/post/${postId}`,{method: "PUT", body:submit})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    } else if (id == "tag-add"){
                        e.preventDefault();
                        let tags = data.get("tags");
                        let send = {command:"tag-add", newTags: tags};
                        fetch(`/v/post/${postId}`,{method: "PUT", body:JSON.stringify(send), headers:{"Content-type": "application/json"}})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    }
                    else if (id == "tag-remove"){
                        e.preventDefault();
                        let tags = data.get("tags");
                        let send = {command:"tag-remove", newTags: tags};
                        fetch(`/v/post/${postId}`,{method: "PUT", body:JSON.stringify(send), headers:{"Content-type": "application/json"}})
                        .then(res => res?.text())
                        .then(text=>{
                            let panel = document.getElementById("admin-panel")!;
                            panel.className = "result"
                            panel.innerHTML = `<p class="result-text">${text}</p>`
                        })
                    }
                })
            })
        }  
    })
}
}

let tags = document.getElementById("tags")!;
tags.addEventListener("click", manageTags);

let posts = document.getElementById("posts")!;
posts.addEventListener("click", managePosts);