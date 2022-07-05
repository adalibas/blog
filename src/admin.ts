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
        let f = await fetch("/v/tag/all");
        console.log(f);
        let tags = await f.json() as unknown as tagList [];

        let list = document.createElement("ul");
        tags.forEach((tag)=>{
            let item = document.createElement("li");
            item.innerHTML = (
            `
            <p>id:${tag.tagId}, name:${tag.name}</p>
            <form action="/v/tag" method="delete">
                <button type="submit">delete</button>
            </form>
            
            <form action="/v/tag" method="post">
                <input type="text" name="${tag.tagId}" value="child name"/>
                <button type=submit>add child</button>
            </form>
            
            <form>
            <input type="text" value="new name"/>
            <button type=submit>rename</button>
            </form>
            `
            );
            list.appendChild(item);
        })
        panel.appendChild(list)
    }
}

let tags = document.getElementById("tags")!;
tags.addEventListener("click", manageTags);