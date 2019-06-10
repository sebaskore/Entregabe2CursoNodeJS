const express= require('express');
const app = express();
const path= require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const fs =require('fs');

require('./helpers');

let listaCursos=[];

const directoriopublico= path.join(__dirname, '../public');
const directoriopartial=path.join(__dirname,'../partials');
app.use(express.static(directoriopublico));
app.use(bodyParser.urlencoded({extended:false}));


hbs.registerPartials(directoriopartial);
app.set('view engine','hbs');
app.get('/',(req, res)=> {
    res.render('index',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        
    });
});
app.post('/calculos',(req, res)=> {
   // el req le mandamo datos con la url y se envian de la siguiete forma ?nombre=sebas&nota1=5&nota2=3...
   // esto llega en el req, todo lo que entra es texto por lo que si vamos a hacer calculos hay que convertir los datos

    res.render('calculos',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        estudiante: req.body.nombre,
        nota1:parseInt(req.body.nota1),
        nota2:parseInt(req.body.nota2),// se cambiaron los query por body del req por que ya lo estamos haciendo por el post y el body parser
        nota3:parseInt(req.body.nota3),
    });
});


app.post('/crearcurso',(req, res)=> {

     res.render('crearcurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
         
     });
 });

 app.post('/guardarCurso',(req, res)=> {

    crearCurso(req.body);
    res.render('guardarCurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        curso: req.body.nombre
    });
   
});
 



app.get('*',(req, res)=>{
    res.render('error',{
        estudiante: 'error'
    })
});


console.log(__dirname);

app.listen(3000,() => {console.log('escuchando el puerto 3000')});




/// funciones curso



const listarCursos =()=>{
    try{// try por si no hay archivo creado

    
    listaCursos=require('./cursos.json');
   }// listaEstudiantes=JSON.parse(fs.readFileSync('listado.json')); segun profe se usa cuando se trabaja de forma asyncronica
   catch(error){
    listaCursos=[];
   }
}

const crearCurso = (curso)=>{
    listarCursos();
    let curs ={
        nombre:curso.nombre,
        id:parseInt(curso.id),
        descripcion:curso.descripcion,
        valor:parseInt(curso.valor)

    }
    let duplicado = listaCursos.find(idcurso => idcurso.id== curso.id)
    if(!duplicado){
        listaCursos.push(curs);
        console.log(listaCursos)
        guardarCursos();
    }else{
        console.log("id ya existe")
    }

   
}

const guardarCursos= () =>{
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('./source/cursos.json',datos,(err)=>{
        if (err) throw (err);
        console.log("guardado")
    })
}


