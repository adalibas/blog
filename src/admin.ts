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