const hbs =require('hbs');

hbs.registerHelper('obtenerPromedio',(nota1, nota2, nota3)=>{
    return (nota1+nota2+nota3)/3;

})

hbs.registerHelper('listar_old',()=>{
    listaEstudiante=require('./listado.json');


    let texto=
    `<table>
        <thead>
            <th>Nombre</th>
            <th>Matematicas</th>
            <th>Ingles</th>
            <th>Programacion</th>
        </thead>
        <tbody>
    `;

    listaEstudiante.forEach(estudiante => {
        texto=texto+
        `
            <tr>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.matematicas}</td>
                <td>${estudiante.ingles}</td>
                <td>${estudiante.programacion}</td>
            </tr>
        `;
        
    });

    texto=texto+
    `</tbody>
    </table>
    `;
    // let texto =
    
    
    // `Lista de estudiantes 
    // <br>`;
    // listaEstudiante.forEach(Estudiante => {
    //     texto=texto+
    //     `nombre: ${Estudiante.nombre} <br>
    //     matematicas: ${Estudiante.matematicas} <br>
    //     ingles: ${Estudiante.ingles} <br>
    //     programacion: ${Estudiante.programacion} <br>
    //     <br>`
    // });
    return texto;
})

