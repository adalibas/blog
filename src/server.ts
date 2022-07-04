import express from 'express';
import {allPostSummaries} from './db'

let app = express();
const port = 3000;
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let posts = JSON.parse(allPostSummaries());
    res.render('pages/index',{posts});
})

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})