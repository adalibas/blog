# Decisions

Tag names unique or if have different parent it can be duplicate?

## to do

* solve create tag admin page promise problem

join solution

db.prepare(`
    select p.postId, p.title, p.summary, p.dateAdded, t.name as tagname
    from (posts as p LEFT JOIN post_tag as pt ON p.postId = pt.postId)
	LEFT JOIN tags as t on pt.tagId = t.tagId;
    `);
