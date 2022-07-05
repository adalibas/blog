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

let tags = document.getElementById("tags")!;
tags.addEventListener("click", manageTags);