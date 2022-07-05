async function manageTags(){
    type tagList = {
        tagId: string,
        name: string
    }
    
    let panel = document.getElementById("admin-panel")!;

    if (panel.className === 'tags'){
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
            <input type="button">delete</input>
            <div>
            <input type="text">add child</input>
            </div>
            <div>
            <input type="text">rename</input>
            </div>
            `
            );
            list.appendChild(item);
        })
        panel?.appendChild(list)
    }
}

let tags = document.getElementById("tags")!;
tags.addEventListener("click", manageTags);