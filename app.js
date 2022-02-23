 
var express =   require("express");  
const process = require('process');
const upload = require('express-fileupload');
const minimist =  require('minimist');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const res = require("express/lib/response");
var app =   express();  


app.use(upload());   

app.get('/',(req,res) =>{  

    res.setHeader('Content-Type', 'text/html');
    
    res.sendFile(__dirname + "/index.html");  
});  

app.post('/', async (req,res)=>{
    let filenamearray; 
    if(req.files){
    console.log(req.files) 
    var file = req.files.file;
    var filename = file.name;
    filenamearray = [filename];
    console.log("FileName", filename);
    
    await file.mv(__dirname+"/"+filename, async function (err){
        if(err){
            res.send(err)
        }
        else{
              const args = minimist(filenamearray)
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZhMDUzODEyNzlhOUU4MWQ0OTBDRjdGNDA5NDk5NTU4QzQ3QjM2MjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDI2NjA4NjY0ODgsIm5hbWUiOiJBUEkgVG9rZW4ifQ.9Mu4k2WiDIMLBFbUSflBB3JjWnqbHHr8qqcBQRSVCYc";
            console.log("The Args Value", args);
          
            if (!token) {

              return console.error('A token is needed. You can create one on https://web3.storage')

            }
        
            if (args._.length < 1) {

                return console.error('Please supply the path to a file or directory')

              }
        
              const storage = new Web3Storage({ token })
              const files = []
            
               for (const path of args._) {
                const pathFiles = await getFilesFromPath(path)
                files.push(...pathFiles)
               }

               res.write(`Uploading ${files.length} Files`);
        
              console.log("Files Varable", files);
              const cid = await storage.put(files)
              res.end(`
              
              File Uploaded  Successfully with CID: ${cid} \n
              you can check your uploaded file on this link \n
              https://${cid}.ipfs.dweb.link 
              
                       
            `)
        }
    })
}
})

app.listen(3000,function(){  
    console.log("Server is running on port 3000");  
});