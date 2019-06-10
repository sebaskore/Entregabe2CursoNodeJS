const express= require('express');
const app = express();
const path= require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
const fs =require('fs');

require('./helpers');

let listaCursos=[];
let listaAspiranteXCurso=[];

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
    let duplicado = crearCurso(req.body);
    console.log(duplicado);
    if(duplicado=="OK"){
        res.render("index")
    }
    else{
    console.log(duplicado);
    res.render('crearcurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:duplicado
    });
    }
 });
 app.get('/crearcurso',(req,res)=> {
    res.render('crearcurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:''
    });

 })

 app.get('/listarcursos',(req,res)=> {
    listarCursos();
    let cursosactivos = listaCursos.filter(estadocurso => estadocurso.estado== 1);
    console.log(cursosactivos)

    let texto=
    `<table>
        <thead>
            <th>Id</th>
            <th>nombre</th>
            <th>descripcion</th>
            <th>Valor</th>
            <th>modalidad</th>
            <th>intensidad horaria</th>
        </thead>
        <tbody>
    `;

    cursosactivos.forEach(curso => {
        texto=texto+
        `
            <tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.descripcion}</td>
                <td>${curso.valor}</td>
                <td>${curso.modalidad}</td>
                <td>${curso.intensidadHoraria}</td>
            </tr>
        `;
        
    });

    texto=texto+
    `</tbody>
    </table>
    `;

    res.render('listarcursos',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        listar:texto
    });

 })

 app.post('/matriculaCurso',(req, res)=> {
    let duplicado = crearCursosXAspirante(req.body);
    console.log(duplicado);
    if(duplicado=="OK"){
        res.render("index")
    }
    else{
    console.log(duplicado);
    res.render('matriculaCurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:duplicado
    });
    }
 });
 app.get('/matriculaCurso',(req,res)=> {
    res.render('matriculaCurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:''
    });

 })



 app.get('/listarmatriculados',(req,res)=> {
    listarCursosXAspirante();
    listarCursos();
    let texto="";
   
    
    listaCursos.forEach(curso =>{

    let lista = listaAspiranteXCurso.filter(aspirante => aspirante.idcurso== curso.id);
    texto= texto+

    `Curso: ${curso.nombre} id: ${curso.id} estado: ${curso.estado}
    <table>
        <thead>
           
            <th>documento</th>
            <th>nombre</th>
            <th>correo</th>
            <th>telefono</th>
            
        </thead>
        <tbody>
    `;

    lista.forEach(registro => {
        texto=texto+
        `
            <tr>
                
                <td>${registro.documento}</td>
                <td>${registro.nombre}</td>
                <td>${registro.correo}</td>
                <td>${registro.telefono}</td>
              
            </tr>
        `;
        
    });

    texto=texto+
    `</tbody>
    </table>
    `;
})

    res.render('listarmatriculados',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        listar:texto
    });

 })

 app.post('/listarmatriculados',(req, res)=> {
    let duplicado = inactivarCurso(req.body.idCurso);
    console.log(duplicado);
    if(duplicado=="OK"){
        res.render("index")
    }
    else{
    console.log(duplicado);
    res.render('matriculaCurso',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:duplicado
    });
    }
 });

 app.post('/borrarmatriculados',(req, res)=> {
    let duplicado = borrarMatriculados(req.body.documento,req.body.idCurso);
    console.log(duplicado);
    if(duplicado=="OK"){
        res.render("index")
    }
    else{
    console.log(duplicado);
    res.render('borrarmatriculados',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:duplicado
    });
    }
 });
 app.get('/borrarmatriculados',(req,res)=> {
    res.render('borrarmatriculados',{// aqui van los paramentros que le vamos a enviar a la pagina por hbs
        mensaje:''
    });

 })


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

const inactivarCurso=(idCurso)=>{
    listarCursos();
    for(let i = 0; i< listaCursos.length;i++){
        if(listaCursos[i].id==idCurso){
            listaCursos[i].estado=0;
            guardarCursos();
            return "OK"
            
    
        }

    }
    return "no se encontro ID"
};

const crearCurso = (curso)=>{
    listarCursos();
    let curs ={
        nombre:curso.nombre,
        id:parseInt(curso.id),
        descripcion:curso.descripcion,
        valor:parseInt(curso.valor),
        modalidad:curso.modalidad,
        intensidadHoraria:curso.intensidadHoraria,
        estado:1

    }
    let duplicado = listaCursos.find(idcurso => idcurso.id== curso.id)
    if(!duplicado){
        listaCursos.push(curs);
        console.log(listaCursos)
        guardarCursos();
        return "OK"
    }else{
        return "id ya existe"
    }

   
}

const guardarCursos= () =>{
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('./source/cursos.json',datos,(err)=>{
        if (err) throw (err);
        console.log("guardado")
    })
}

/// funcion aspirante x curso

const listarCursosXAspirante =()=>{
    try{
    listaAspiranteXCurso=require('./cursosXAspirate.json');
   }
   catch(error){
    listaAspiranteXCurso=[];
   }
}

const crearCursosXAspirante = (CursoxAspirante)=>{
    listarCursosXAspirante();
    let curs ={
        documento:CursoxAspirante.documento,
        nombre:CursoxAspirante.nombre,
        correo:CursoxAspirante.correo,
        telefono:CursoxAspirante.telefono,
        idcurso:CursoxAspirante.idCurso

    }
    let duplicado = listaAspiranteXCurso.find(cursoaspirante => cursoaspirante.documento== CursoxAspirante.documento && cursoaspirante.idCurso== CursoxAspirante.idCurso)
    if(!duplicado){
        listaAspiranteXCurso.push(curs);
        console.log(listaAspiranteXCurso)
        guardarCursosXAspirante();
        return "OK"
    }else{
        return "Rregistro ya existe"
    }

   
}

const guardarCursosXAspirante= () =>{
    let datos = JSON.stringify(listaAspiranteXCurso);
    fs.writeFile('./source/cursosXAspirate.json',datos,(err)=>{
        if (err) throw (err);
        console.log("guardado")
    })
}

const borrarMatriculados = (documento,idCurso)=>{
    listarCursosXAspirante();
    let lista= listaAspiranteXCurso.filter(aspirante => aspirante.idcurso!=idCurso && aspirante.documento!=documento);

    listaAspiranteXCurso=lista;
    guardarCursosXAspirante();
    return "OK";
}
