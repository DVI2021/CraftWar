function MainMenuStage (stage) {
    /*
    function (stage) {
        var button = stage.insert(new Q.UI.Button({ x: Q.width / 2, y: Q.height / 2, label: "Star Game" }));
        button.on("click", this, loadFirstLevel);
    }
    */

    var button = stage.insert(new Q.UI.Button({ x: Q.width / 2, y: Q.height / 2, asset: "gui/main-title.png" }));
    //Q.input.on("confirm", firstScene);
    //button.on("click", this, firstScene);
}
var build = null;
var asociateObjWithSheet = {"grunt":"grunt_gui","archer":"human_archer_gui","peasant":"human_peasan_gui","footman":"human_kni_gui","castle_lvl1":"castle_gui","barracks":"barracks_icon","troll_axethrower": "axethrower_gui","battlePoint":"battlePoint_gui"};
var associateActionWithSheet = {"stop_gui":"stop_icon","construct":"build_gui","recruit":"build_gui"};
var associateIconWithCreationFuc = {"farmIcon":function(){return new Q.Human_Farm({dragging: true})},
    "barracks_icon":function(){return new Q.Human_Barracks({dragging:true})},
    "workWood_gui":function(){return new Q.Human_Woodwork({dragging:true})},
    "human_peasan_gui":function(x,y){return new Q.Human_Peasant({x:x, y: y})},
    "human_archer_gui":function(x,y){return new Q.Human_Archer({ x: x, y: y, distVision: 500, distance: 200 })},
    "human_kni_gui":function(x,y){return new Q.Human_Footman({x:x, y: y, distVision: 500, distance: 200 })}
};

function guiScene(stage){
    barraIzquierda(stage);
    barraSuperior(stage);
}

function hidePrincipalMenu(){
    //botonBuild.destroy();
}

function hideBuildMenu(){
    botonFarm.hide();
}

function buildScene(){
}

function actualizarGui() {
    Q.clearStage(1);
    Q.stageScene("guiScene", 1);
}

function barraSuperior(stage){
    container_arriba = stage.insert(new Q.UI.Button({
        asset: "gui/topgui.jpg",
        y: 25,
        x: Q.width/2,
        w: Q.width,
        h: 50
    }));

    var oro = stage.insert(new Q.UI.Text({
        label: "Oro: " + Q.state.get("oro"),
        outlineWidth: 5,
        color: "white",
        x: 150,
        y: -10
    }),container_arriba);

    var madera = stage.insert(new Q.UI.Text({
        label: "Madera: " + Q.state.get("madera"),
        color: "white",
        outlineWidth: 5,
        x: -100,
        y: -10
    }),container_arriba);

    var poblacion =  stage.insert(new Q.UI.Text({
        label: "Pop: " + Q.state.get("poblacion") + "/" + Q.state.get("maxPoblacion"),
        color: "white",
        outlineWidth: 5,
        x: +350,
        y: -10
    }),container_arriba);

    //Controladores para los recursos
    Q.state.on("change.oro", this, function () { oro.p.label = "Oro: " + Q.state.get("oro"); });
    Q.state.on("change.madera", this, function () { madera.p.label = "Madera: " + Q.state.get("madera"); });
    Q.state.on("change.poblacion",this, function() { poblacion.p.label = "Pop: " + Q.state.get("poblacion") + "/" + Q.state.get("maxPoblacion");});


    //Decorados varios para recursos
    var cajaOro = stage.insert(new Q.UI.Container({
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        x: 250,
        y: 0,
        w: 36,
        h: 36,
    }),container_arriba);

    var iconoOro = stage.insert(new Q.UI.Button({
        asset: "gui/goldicon.png",
        x: 250,
        y: 0,
    }),container_arriba);

    var cajaMadera = stage.insert(new Q.UI.Container({
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        x: 30,
        y: 0,
        w: 36,
        h: 36,
    }),container_arriba);

    var iconoWood = stage.insert(new Q.UI.Button({
        asset: "gui/woodicon.png",
        x: 30,
        y: 0,
    }),container_arriba);

    var cajaPop = stage.insert(new Q.UI.Container({
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        x: 470,
        y: 0,
        w: 36,
        h: 36,
    }),container_arriba);

    var iconoPop = stage.insert(new Q.UI.Button({
        asset: "gui/popicon.png",
        x: 470,
        y: 0,
    }),container_arriba);

    //Titulo del juego TODO: Reemplazar por imagen
    var titulo = stage.insert(new Q.UI.Text({
        label: "CraftWars",
        color: "#000000",
        family: "Times New Roman",
        size: "40",
        weight: "800",
        x: 125,
        y: 10,
    }))
}

function barraIzquierda(stage){

    container_izquierda = stage.insert(new Q.UI.Button({
        asset: "gui/leftgui.jpg",
        y: Q.height/2,
        x: 125,
        w: 250,
        h: Q.height,
        type: 128,
    }));

    container_izquierda.on("click",null,function(){
    });




    //Menu en partida TODO: logica
    botonMenu = stage.insert(new Q.UI.Button({
        label: "MENU",
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        shadow: 10,
        font: "800 40px Times New Roman",
        x: 0,
        y: Q.height/2 -  100,
        w: 200,
        h: 70,
        type: Q.SPRITE_UI,
    }),container_izquierda);
    botonMenu.on("click",this,function(){
        crearMenu(stage);
    });

    Q.state.off("change.selectedGui",this);

    Q.state.on("change.selectedGui",this,function(){
        barraStats(stage,container_izquierda);
        barraAcciones(stage,container_izquierda);
    });
}

function crearMenu(stage){
    var menu = stage.insert(new Q.UI.Container({
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        shadow: 10,
        font: "800 40px Times New Roman",
        x: Q.width/2,
        y: Q.height/2 -  100,
        w: 300,
        h: 500,
        type: 128,
    }));

    //Q.pauseGame();

    var botonCerrarMenu = stage.insert(new Q.UI.Button({
        label: "Continuar",
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        shadow: 10,
        font: "800 40px Times New Roman",
        x: 0,
        y: +200,
        w: 250,
        h: 50,
        type: Q.SPRITE_UI,
    }),menu);

    botonCerrarMenu.on("click",this,function(){
        Q.unpauseGame();
        menu.destroy();
        botonCerrarMenu.destroy();
    });

    var botonToggleDebug = stage.insert(new Q.UI.Button({
        label: "Debug",
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        shadow: 10,
        font: "800 40px Times New Roman",
        x: 0,
        y: -200,
        w: 250,
        h: 50,
        type: Q.SPRITE_UI,
    }),menu);

    botonToggleDebug.on("click",this,function(){
        if(Q.debug) {
            Q.debug = false;
            Q.debugFill = false;
        }
        else {
            Q.debug = true;
            Q.debugFill = true;
        }
    });


    setTimeout(function(){
        Q.pauseGame();
    }, 1000);

}

function barraStats(stage,container_izquierda){

    if(Q.state.get("selectedGui") != 0 && Q.state.get("selectedGui") != false){
        hidePrincipalMenu();
        var contenedor_seleccionado = stage.insert(new Q.UI.Container({
            shadowColor: "rgba(0,0,0,0.5)",
            fill: "#f4ca97",
            border: 5,
            stroke: "#6d430d",
            shadow: 10,
            x: 0,
            y: 200 - (Q.height/2),
            w: 200,
            h: 150,
        }),container_izquierda);


        var nombre_seleccionado = stage.insert(new Q.UI.Text({
            label: Q.state.get("selectedGui").p.unitName,
            outlineWidth: 2,
            color: "white",
            x: -25,
            y: 25,
        }),contenedor_seleccionado);

        if(Q.state.get("selectedGui").p.maxHealth && Q.state.get("selectedGui").p.health) {

            var vida_texto = stage.insert(new Q.UI.Text({
                label: "Vida",
                outlineWidth: 2,
                color: "white",
                x: 45,
                y: -50,
            }), contenedor_seleccionado);

            /*  var vida_rectangulo = stage.insert(new Q.UI.Container({
                  fill: "#7ad015",
                  x: 0,
                  y: 0,
                  w: 100,
                  h: 20,
              }),contenedor_seleccionado);*/

            var vida_cantidad = stage.insert(new Q.UI.Text({
                label: "(" + Q.state.get("selectedGui").p.health + " / " + Q.state.get("selectedGui").p.maxHealth + ")",
                outlineWidth: 2,
                color: "green",
                x: 45,
                y: -15,
            }), contenedor_seleccionado);
        }

        Q.Sprite.extend("gui_icon", {
            init: function(p) {
                this._super({
                    sheet: asociateObjWithSheet[Q.state.get("selectedGui").p.sheet],
                    x: -50,
                    y: -25,
                    scale: 1.6,
                    type: Q.SPRITE_UI
                });
            }
        });

        var gui_icon = new Q.gui_icon();
        stage.insert(gui_icon,contenedor_seleccionado);
} }

function barraAcciones(stage,container_izquierda){
    if(Q.state.get("selectedGui") != 0 && Q.state.get("selectedGui") != false && Q.state.get("selectedGui").p.actions != null) {
        var location_actions = [{"x": -50, "y": -70}, {"x": +50, "y": -70}, {"x": -50, "y": 0}, {
            "x": +50,
            "y": 0
        }, {"x": -50, "y": +70}, {"x": +50, "y": +70}];
        //debugger;
        var contenedor_acciones = crearContenedorAcciones(stage, container_izquierda);
        var acciones = Object.keys(Q.state.get("selectedGui").p.actions);
        acciones.forEach(function (key, index) {
            crearBotonAccion(stage, contenedor_acciones, key, location_actions[index], container_izquierda);
        });
    }
}

function crearContenedorAcciones(stage,container_izquierda){
    return stage.insert(new Q.UI.Container({
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        shadow: 10,
        x: 0,
        y: 450 - (Q.height/2),
        w: 200,
        h: 250,
        type: 128,
    }),container_izquierda);
}

function crearBotonAccion(stage,contenedor_acciones,action,location,container_izquierda){
    botonAction = stage.insert(new Q.UI.Button({
        sheet: associateActionWithSheet[action],
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        //shadow: 10,
        font: "800 40px Times New Roman",
        x: location.x,
        y: location.y,
        scale: 1.5,
    }),contenedor_acciones);

    if(action.localeCompare("construct") != 0 && action.localeCompare("recruit") != 0) {
        botonAction.on("click", this, function () {
            Q.state.get("selectedGui").p.actions[action]();
        });
    }
    else {
        //caso especial para construir
        botonAction.on("click",this,function(){
            contenedor_acciones.children.forEach(element => element.destroy());
            contenedor_acciones.destroy();
            if(action.localeCompare("recruit") != 0)
                menuConstruccion(stage,crearContenedorAcciones(stage,container_izquierda));
            else
                menuReclutamient(stage,crearContenedorAcciones(stage,container_izquierda));
        });
    }
}

function menuConstruccion(stage,contenedor_acciones){
    var locations = [{"x": -50, "y": -70}, {"x": +50, "y": -70}, {"x": -50, "y": 0}, {"x": +50, "y": 0
    }, {"x": -50, "y": +70}, {"x": +50, "y": +70}];


    crearBotonConstruir(stage,contenedor_acciones,"farmIcon",build,locations[0].x,locations[0].y);
    crearBotonConstruir(stage,contenedor_acciones,"barracks_icon",build,locations[1].x,locations[1].y);
    crearBotonConstruir(stage,contenedor_acciones,"workWood_gui",build,locations[2].x,locations[2].y);


   var botonCancelar = stage.insert(new Q.UI.Button({
        sheet: "stop_icon",
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        //shadow: 10,
        font: "800 40px Times New Roman",
        x: locations[3].x,
        y: locations[3].y,
        scale: 1.5,
       type: Q.SPRITE_UI,
    }),contenedor_acciones);



    botonCancelar.on("click",this,function(){
        if(build){
            build.destroy();
        }
        if(objSelected){
            objSelected.p.selected = false;
            objSelected = null;
        }

        Q.state.set("selectedGui", 0);
        actualizarGui();
    });

}

function crearBotonConstruir(stage,contenedor_acciones,icon,construction,x,y){
    var botonConstruir = stage.insert(new Q.UI.Button({
        sheet: icon,
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        //shadow: 10,
        font: "800 40px Times New Roman",
        x: x,
        y: y,
        scale: 1.5,
        type: Q.SPRITE_UI,
    }),contenedor_acciones);

    botonConstruir.on("click",this,function(construction){
        //debugger;
        //debugger;
       build = associateIconWithCreationFuc[icon]();
        //debugger;
        if(Q.state.get("madera") < build.p.costWood || Q.state.get("oro") < build.p.costGold){
            build.destroy();
            notificarGui("Recursos Insuficientes","red",stage);
        }
        else if(draggingObj){
            notificarGui("Listo para construir","green",stage);
            Q.stage(0).insert(build);
        }
    });
}

function menuReclutamient(stage,contenedor_acciones){
    var locations = [{"x": -50, "y": -70}, {"x": +50, "y": -70}, {"x": -50, "y": 0}, {"x": +50, "y": 0
    }, {"x": -50, "y": +70}, {"x": +50, "y": +70}];

    var unit = null;

    Q.state.get("selectedGui").p.actions["recruit"].forEach(function(element,index){
        crearBotonReclutar(stage,contenedor_acciones,element,unit,locations[index].x,locations[index].y);
    });

    var botonCancelar = stage.insert(new Q.UI.Button({
        sheet: "stop_icon",
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        //shadow: 10,
        font: "800 40px Times New Roman",
        x: locations[Q.state.get("selectedGui").p.actions["recruit"].length].x,
        y: locations[Q.state.get("selectedGui").p.actions["recruit"].length].y,
        scale: 1.5,
        type: Q.SPRITE_UI,
    }),contenedor_acciones);



    botonCancelar.on("click",this,function(){
        if(unit){
            unit.destroy();
        }
        if(objSelected){
            objSelected.p.selected = false;
            objSelected = null;
        }
        Q.state.set("selectedGui", 0);
        actualizarGui();
    });
}

function crearBotonReclutar(stage,contenedor_acciones,icon,unit,x,y){
    var botonConstruir = stage.insert(new Q.UI.Button({
        sheet: icon,
        shadowColor: "rgba(0,0,0,0.5)",
        fill: "#f4ca97",
        border: 5,
        stroke: "#6d430d",
        //shadow: 10,
        font: "800 40px Times New Roman",
        x: x,
        y: y,
        scale: 1.5,
        type: Q.SPRITE_UI,
    }),contenedor_acciones);

    botonConstruir.on("click",this,function(event){
        //event.preventDefault();
        unit = associateIconWithCreationFuc[icon](Q.state.get("selectedGui").p.x + Q.state.get("selectedGui").p.w/2 + 50,
           Q.state.get("selectedGui").p.y + Q.state.get("selectedGui").p.h/2 + 50 );
        //unit = new Q.Human_Peasant({x:350, y: 450});
        //unit = associateIconWithCreationFuc[icon](350,450);
        //debugger;
        if(Q.state.get("oro") < unit.p.costGold || Q.state.get("madera") < unit.p.costWood){
            unit.destroy();
            notificarGui("Recursos Insuficientes","red",stage);
            return;
        }else if(Q.state.get("poblacion")  > Q.state.get("maxPoblacion")) {
            unit.destroy();
            notificarGui("No quedan Casas","red",stage);
            return;
        }else if(icon.localeCompare("human_archer_gui") == 0 && Q("Human_Woodwork").length < 1){
            unit.destroy();
            notificarGui("Te falta el WoodWork","red",stage);
            return;
        }

        notificarGui("Unidad Creada","green",stage);
        Q.state.dec("oro",unit.p.costGold);
        Q.state.dec("madera",unit.p.costWood);

        Q.stage(0).insert(unit);

    });
}

function notificarGui(mensaje,color,stage){
    stage.insert(new Q.UI.Text({
        label: mensaje,
        color: color,
        x: Q.width/2 + 100,
        y: +100,
    }));
}
