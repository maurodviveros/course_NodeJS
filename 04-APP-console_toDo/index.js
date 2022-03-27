'use strict';

const colors = require("colors");
const { guardarDB, leerDB } = require("./helpers/filseSaver");

const { menuChoices, menu, pausa, leerInput } = require("./helpers/inquirer");
const Tareas = require("./models/tareas");


const main = async()=>{
    // const options = [ "0", "1", "2", "3", "4", "5", "6" ];
    const tareas = new Tareas();
    let opt;

    const tareasDB = leerDB();
    if(tareasDB) tareas._listado = tareasDB;
    else guardarDB(JSON.stringify(tareas._listado, null, 2));

    do{
        
        opt = await menu();

        switch(opt){
            case "1":
                const descripcion = await leerInput("Descripción:");
                tareas.crearTarea(descripcion);
                break;
            case "2":
                console.log(tareas.listArr);
                break;
            case "3":
                break;
            case "4":
                break;
            case "5":
                break;
            case "6":
                break;

            case "0":
                break;
        };

        guardarDB(JSON.stringify(tareas._listado, null, 2));

        await pausa();
    } while(opt !== "0");
    
};

main();