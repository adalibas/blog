type parentId = id | "null"
type id = number

interface item<T> {
    id: id,
    data: T,
}

interface itemWithParent<T> extends item<T> {
    parentId: parentId
}

interface tree<T> extends item<T> {
    children: item<T>[]
}

function buildTreeFromParent<T>(arr: itemWithParent<T>[]): tree<T>[] {
    let parentChildMap = new Map<parentId, id[]>() // M<parentId,ChildIds[]>
    for (let elem of arr) {
        if (parentChildMap.has(elem.parentId)) {
            let old = parentChildMap.get(elem.parentId)!;
            old.push(elem.id)
            parentChildMap.set(elem.parentId, old)
        } else {
            parentChildMap.set(elem.parentId, [elem.id])
        }
    }

    let idDataMap = new Map<id,T>
    for (let elem of arr) {
        idDataMap.set(elem.id, elem.data)
    }
    
    function buildTree(id:id): tree<T> {
        let children = parentChildMap.get(id)
        if ( children == null ) {
            return {id: id, data: idDataMap.get(id)!, children: []}
        } else {
            let childrenArray = [];
            for (let elem of children){
                childrenArray.push(buildTree(elem))
            }
            return {id, data: idDataMap.get(id)!, children: childrenArray }
        }
    }

    let roots = parentChildMap.get("null")!
    let res: tree<T>[] = [];
    for (let root of roots) {
        res.push(buildTree(root))
    }
    return res;
}