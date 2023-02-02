const connection = require('./server');
const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/www')))
app.use(bodyParser.urlencoded({extended:true}));



app.set('view engine', 'pug');

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html');
})

connection.connect((err, res)=>{
    if(err) console.log(err)
    console.log('database connected');
})


app.get('/api/students', (req, res)=>{    
        let sql = 'select * from school';
        connection.query(sql, (err, result)=>{
         if(err) console.log(JSON.stringify(err)); 
         let obj  = {};
         obj["type"] = "success";
         obj["data"] = result;
         res.send(obj);
    })    
})

app.get('/api/students/(:id)', (req, res)=>{    
    let sql = 'SELECT * FROM school WHERE id=?';
    let ids = req.params.id  ;
    connection.query(sql, [ids], (err, result)=>{
     if(err) console.log(JSON.stringify(err)); 
     let obj  = {};
     obj["type"] = "success";
     obj["data"] = result;
     res.send(result);
})    
})






app.post('/api/students', (req, res)=>{  
    const id = new Date().getTime();
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const sql = 'INSERT INTO school (id, name, email, mobile) VALUES(?,?,?,?)';
    connection.query(sql, [id, name, email, mobile], (err, result)=>{
        if(err) throw err;
        let obj = {};
        obj["message"] = 'Student registered successfully.'; 
        obj["data"] = result;        
        res.send(obj);
    })
})

app.put('/api/students', (req, res)=>{  
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const sql = 'UPDATE school set name=?, email=?, mobile=? where id=?';
    connection.query(sql, [name, email, mobile, id], (err, result)=>{
        if(err) throw err;
        let obj = {};
        obj["message"] = 'Student updated successfully.';  
        obj["data"] = result;    
        res.send(obj);
    })
})

app.delete('/api/students/:id', (req, res)=>{  
    const id = req.params.id;   
    const sql = 'DELETE FROM school WHERE id = ?';
    connection.query(sql, [id], (err, result)=>{
        if(err) throw err;
        let obj = {};
        obj["message"] = 'Student deleted successfully.';  
        obj["data"] = result;    
        res.send(obj);
    })
})


//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

app.post("/api/file-uplaod", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename);
        var id = new Date().getTime().toString();
        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
        var insertData = "INSERT INTO users_file(id, file_src)VALUES(?,?)"
        connection.query(insertData, [id, imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded");
            let obj = {};
            obj["type"] = "success",
            obj["msg"] = "file uploaded successfully"
            res.send(obj);
        })
    }
});
 

app.listen(3000, ()=> console.log('app is running on 3000 port'));