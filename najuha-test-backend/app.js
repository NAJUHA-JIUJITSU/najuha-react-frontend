const fs = require('fs');
const express = require('express');
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access_Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.post(`/add_competition/:doc_id`, (req, res)=>{
    let docs_data = req.body;
    let name = req.params.doc_id;
    console.log(docs_data)
    let data = JSON.stringify(docs_data);
    fs.writeFileSync(`files/${name}.json`, data);
})

app.listen(8000, ()=>{
    console.log('express server is running at port number 8000');
})