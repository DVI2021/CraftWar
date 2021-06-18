
mouseX = 0;
mouseY = 0;
objSelected = null;
gridSize = 10;
grid = [];
ocupiedGrids = [];
graph = new Graph([]);
cruces = [];
draggingObj = null;

/*
// seleccionables - iables
// habra objetos que podemos seleccionar y otros objetos que se comportaran de forma
// sistematica 

Q.component("seleccionable", {
    extend: {
        onClick: function () {
            
        },
        step: function(){
            //paso1(); // acercame a madera
            executeAction();
             // si estoy con la madera coger

        }
    }
}); 

Q.component("recolectar", {
    extend: {
        executeAction: function(){
            //recolecte
        }
    }
}); 

Q.component("atacarcuerpocuerpo", {
    extend: {
        executeAction: function(){
            //atacar
        }
    }
}); 

Q.component("atacardistancia", {
    extend: {
        executeAction: function(){
            //atacar
        }
    }
}); 

// IA 
// step, calcular destino 
// vete al destino y atacar
Q.component("iable", {
    extend: {
        onClick: function () {
            
        },
        step: function(){
            if(noaccion()) calcularaccion() // modifica el componente
            executeAction();
        }
    }
}); 

// iables
// pequeños grupos que, dado un rango, ataquen a los contrarios
// como obtenemos los constrarios



// modo - accion
// Cuando seleccionamos y hacemos click derecho, que, dependiendo del objeto seleccionado
// y del objeto clickeado, se realice/ejecute una accion
// y como podemos aplicar los bucles?? ej: coger madera


// pathfinding
// dado una pos x e y origen a otra x e y destino, hayar el camino a recorrer


        for(obj in board){
            obj.x 
            obj.y 
            //ocupar x e y ;
        }

*/
//Q.audio.play("jump_small.mp3");
var game = function () {
    var Q = window.Q = Quintus({ audioSupported: [ 'wav' ] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, Anim, TMX, Audio, CW, Audio")
        .setup("game", { maximize: true })
        .controls()
        .touch()
        .enableSound();
    //Q.touch(Q.SPRITE_ALL);


    Q.Sprite.extend("Screen", {
        init: function (viewport, tileLayer) {
            this._super(
                {
                    dx: 0,
                    dy: 0,
                    x: viewport.options.w / 2,
                    y: viewport.options.h / 2,
                    minX: viewport.options.w / 2,
                    minY: viewport.options.h / 2,
                    maxX: tileLayer.p.w - viewport.options.w / 2,
                    maxY: tileLayer.p.h - viewport.options.h / 2,
                    viewportW: viewport.options.w,
                    viewportH: viewport.options.h,
                    w: 0.0000001,
                    h: 0.0000001,
                }
            );
            mouseX = viewport.options.w / 2;
            mouseY = viewport.options.h / 2;
            this.on("drag", this, function () { console.log("drag") });
            this.on("touchEnd", this, function () { console.log("touchEnd") });
        },
        step: function (dt) {

            
            var percentScreen = 5;
            if (mouseX < this.p.viewportW / percentScreen && this.p.dx > -20) {
                this.p.dx -= 2;
            } else if (mouseX > this.p.viewportW - (this.p.viewportW / percentScreen) && this.p.dx < 20) {
                this.p.dx += 2;
            } else {
                this.p.dx = 0;
            }
            if (mouseY < this.p.viewportH / percentScreen && this.p.dy > -20) {
                this.p.dy -= 2;
            } else if (mouseY > this.p.viewportH - (this.p.viewportH / percentScreen) && this.p.dy < 20) {
                this.p.dy += 2;
            } else {
                this.p.dy = 0;
            }

            this.p.x += this.p.dx * dt * 100;

            this.p.y += this.p.dy * dt * 100;

            if (this.p.x < this.p.minX) this.p.x = this.p.minX;
            if (this.p.x > this.p.maxX) this.p.x = this.p.maxX;

            if (this.p.y < this.p.minY) this.p.y = this.p.minY;
            if (this.p.y > this.p.maxY) this.p.y = this.p.maxY;

        }
    });


    components();
    miscellaneous();
    resources();
    units();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Humans                                                                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    humanBuildings();
    humanUnits();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Orcs                                                                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    orcUnits();
    orcsBuildings();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Units                                                                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    

    Q.Sprite.extend("Cross", {
        init: function (p) {
            this._super(p, {
                asset: "cross.png",
                type: Q.SPRITE_NONE,
            });
        }
    });

    Q.TileLayer.extend("ObstaculosTiles",{ 
        init: function (p) {
            this._super(p, {
            });
            n = 0;
            for (let x = 0; x < p.tiles.length; x++) {
                const tilesX = p.tiles[x];
                for (let y = 0; y < tilesX.length; y++) {
                    if(tilesX[y] != null){
                        var xStart = x * p.tileH;
                        var yStart = y * p.tileW;
                        var xGridStart = Math.floor(xStart / graph.hCell);
                        var yGridStart = Math.floor(yStart / graph.wCell);
                        var xGridEnd = Math.floor((xStart + p.tileH) / graph.hCell);
                        var yGridEnd = Math.floor((yStart + p.tileW) / graph.wCell);

                        for (let k = xGridStart; k < xGridEnd; k++){
                            for (let l = yGridStart; l < yGridEnd; l++) {
                                graph.addObjNode(l,k,this);
                            }
                        }

                        n = 0;

                    }
                    
                }
            }
            for (const tileX of p.tiles) {
                for (const tileY of tileX) {
                    if(tileY != null)
                        x = 3;
                }
            }
        },
    })

    resources = [
        "SummerTiles.png", "map.tmx","island.tmx",
        "miscellaneous/Magin and Missiles.png", "miscellaneous.json",
        "mines.png", "mine.json","menu-background.png","CraftWar.png",

        //Humans
        "humans/HumanBuilds1.json", "humans/HumanBuilds1.png",
        "humans/HumanBuilds2.json", "humans/HumanBuilds2.png",
        "humans/HumanBuilds3.json", "humans/HumanBuilds3.png",
        "humans/peasant.json", "humans/Peasant.png",
        "humans/footman.json", "humans/Footman.png",
        "humans/archer.json", "humans/Elven Archer.png",

        //Orcs
        "orcs/grunt.json", "orcs/Grunt.png",
        "orcs/troll_axethrower.json", "orcs/Troll Axethrower.png",
        "orcs/battlePoints.json", "BattlePoints.png",

        "arbol.png", "arbol.json","cross.png",

        //Gui
        "gui/main-title.png",
        "gui/woodgui.jpg",
        "gui/leftgui.jpg",
        "gui/topgui.jpg",
        "gui/woodicon.png",
        "gui/goldicon.png",
        "gui/popicon.png",
        "gui/Icons.png",
        "gui/Icons.json",

        //Audio
        "Misc/Bowfire.wav","Misc/Bowhit.wav",,"Misc/Axe.wav",
        "Misc/Tree1.wav","Misc/Tree2.wav","Misc/Tree3.wav","Misc/Tree4.wav",
        "Misc/Sword1.wav","Misc/Sword2.wav","Misc/Sword3.wav",
    ]
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Scenes                                                                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.scene("mainScene", function (stage) {
        Q.stageTMX("island.tmx", stage);

        Q.state.reset({ madera: 2000, oro: 2000 , poblacion:0 ,maxPoblacion:10 ,selectedGui: 0});

        viewport = stage.add("viewport");
        screen = stage.insert(new Q.Screen(viewport, stage._collisionLayers[0]));
        viewport.follow(screen);

        //stage.viewport.add("touch");
        //stage.on("mousemove", this, function(){console.log("ola")});
        //stage.add("viewport").follow(mario, { x: true, y: false });
        //Q.state.reset({ score: 0, lives: 3 });
        //Q.audio.play("music_main.mp3",{loop: true});
        //stage.on("destroy", function () { mario.destroy(); });

        peasant = new Q.Human_Peasant({x:650, y: 550});
        stage.insert(peasant);
        stage.insert(new Q.Human_Peasant({ x: 500, y: 300 }));
        stage.insert(new Q.Human_Peasant({ x: 850, y: 300 }));
        castle = new Q.Human_Castle({ x: 700, y: 400 });
        stage.insert(castle);


        //grunt = new Q.Orc_Troll_Axethrower({ x: 850, y: 650, coords: {x: 825, y: 282.79999999999995}});
        /*grunt = new Q.Orc_Grunt({ x: 850, y: 650});

        stage.insert(grunt);
        /*grunt = new Q.Orc_Troll_Axethrower({ x: 1050, y: 650 });
        stage.insert(grunt);
        grunt = new Q.Orc_Troll_Axethrower({ x: 1360, y: 650 });
        stage.insert(grunt);*/


        /*archer = new Q.Human_Footman({ x: 850, y: 850, distVision: 500, distance: 200 });
        stage.insert(archer);

        archer = new Q.Human_Archer({ x: 650, y: 650, distVision: 500, distance: 200 });
        stage.insert(archer);

        archer = new Q.Human_Archer({ x: 1050, y: 650, distVision: 500, distance: 200 });
        stage.insert(archer);

        archer = new Q.Human_Archer({ x: 850, y: 450, distVision: 500, distance: 200 });

        stage.insert(archer);

        castle = new Q.Human_Castle();
        stage.insert(castle);

        /*mine = new Q.Mine({ x: 350, y: 150 });
        stage.insert(mine);*/
    });

    Q.scene("guiScene", function (stage) {
        guiScene(stage);
    });

    Q.UI.TextoParpadea = Q.Sprite.extend("UI.TextoParpadea", {
        init: function(p,defaultProps) {
          this._super(Q._defaults(p||{},defaultProps),{
            type: Q.SPRITE_UI,
            size: 24,
            lineHeight: 1.2,
            align: 'center',
            timer: .5
          });
    
          //this.el = document.createElement("canvas");
          //this.ctx = this.el.getContext("2d");
    
          if(this.p.label) {
            this.calcSize();
          }
          this.p.tRest = this.p.timer;
          //this.prerender();
        },
        step: function(dt){
            this.p.tRest -= dt;
            if(this.p.tRest <= 0){
                if(this.p.hidden){
                    this.p.hidden = false;
                }else{
                    this.p.hidden = true;
                }
                this.p.tRest = this.p.timer;
            }
        },
        calcSize: function() {
          var p = this.p;
    
          this.setFont(Q.ctx);
          this.splitLabel = p.label.split("\n");
          var maxLabel = "";
          p.w = 0;
    
          for(var i = 0;i < this.splitLabel.length;i++) {
             var metrics = Q.ctx.measureText(this.splitLabel[i]);
            if(metrics.width >  p.w) {
                p.w = metrics.width;
            }
          }
    
          p.lineHeightPx = p.size * p.lineHeight;
          p.h = p.lineHeightPx * this.splitLabel.length;
          p.halfLeading = 0.5 * p.size * Math.max(0, p.lineHeight - 1);
    
          p.cy = 0;
    
          if(p.align === 'center'){
             p.cx = p.w / 2;
             p.points = [
                [ -p.cx, 0],
                [ p.cx, 0],
                [ p.cx, p.h ],
                [ -p.cx, p.h ]
             ];
          } else if (p.align === 'right'){
             p.cx = p.w;
             p.points = [
                [ -p.w, 0],
                [ 0, 0],
                [ 0, p.h ],
                [ -p.w, p.h ]
             ];
          } else {
             p.cx = 0;
             p.points = [
                [ 0, 0],
                [ p.w, 0],
                [ p.w, p.h ],
                [ 0, p.h ]
             ];
          }
        },
    
        prerender: function() {
          if(this.p.oldLabel === this.p.label) { return; }
          this.p.oldLabel = this.p.label;
          this.calcSize();
          this.el.width = this.p.w;
          this.el.height = this.p.h * 4;
          this.ctx.clearRect(0,0,this.p.w,this.p.h);
    
          this.ctx.fillStyle = "#FF0";
          this.ctx.fillRect(0,0,this.p.w,this.p.h/2);
          this.setFont(this.ctx);
    
          this.ctx.fillText(this.p.label,0,0);
        },
    
        draw: function(ctx) {
          var p = this.p;
           //this.prerender();
          if(p.opacity === 0 || p.hidden) { return; }
    
          if(p.oldLabel !== p.label) { this.calcSize(); }
    
          this.setFont(ctx);
          if(p.opacity !== void 0) { ctx.globalAlpha = p.opacity; }
          for(var i =0;i<this.splitLabel.length;i++) {
            if(p.outlineWidth) {
              ctx.strokeText(this.splitLabel[i],0, p.halfLeading + i * p.lineHeightPx);
            }
              ctx.fillText(this.splitLabel[i],0, p.halfLeading + i * p.lineHeightPx);
          }
        },
    
        /**
         Returns the asset of the element
    
         @method asset
         @for Q.UI.Text
        */
        asset: function() {
          return this.el;
        },
    
        /**
         Sets the textfont using parameters of `p`.
         Defaults: see Class description!
    
         @method setFont
         @for Q.UI.Text
        */
        setFont: function(ctx) {
          ctx.textBaseline = "top";
          ctx.font= this.font();
          ctx.fillStyle = this.p.color || "black";
          ctx.textAlign = this.p.align || "left";
          ctx.strokeStyle = this.p.outlineColor || "black";
          ctx.lineWidth = this.p.outlineWidth || 0;
        },
    
        font: function() {
          if(this.fontString) { return this.fontString; }
    
          this.fontString = (this.p.weight || "800") + " " +
                            (this.p.size || 24) + "px " +
                            (this.p.family || "Arial");
    
          return this.fontString;
        }
    
      });
    Q.scene("menuScene", function (stage) {
        /*var container = stage.insert(new Q.UI.Container({ x: Q.width / 2, y: 40, fill: "rgba(0,0,0,0.5)" }));

        var title =  container.insert(new Q.UI.Text({ x: 10, y: 10,color: "#fff",size: "80",fill: "#CCCCCC", label: "Bienvenido a" }));
        container.insert(new Q.UI.Text({ x: 10, y: 10 + title.p.x + title.p.h,color: "#fff",size: "120",fill: "#CCCCCC", label: "CraftWar" }));

        //container.insert(new Q.UI.Text({ x: 10, y: 10,color: "#fff",size: "80",fill: "#CCCCCC", label: stage.options.label }));



        var button3 = container.insert(new Q.UI.Button({ x: 0, y: 350, fill: "#CCCCCC", label: "Click para empezar" }));


        button3.on("click", startGame);*/
        var button = stage.insert(new Q.UI.Button({ x: Q.width / 2, y: Q.height / 2 + 30, asset: "menu-background.png" }));
        var buttonTitle = stage.insert(new Q.UI.Button({ x: Q.width / 2, y: 100, asset: "CraftWar.png" }));

        var text = stage.insert(new Q.UI.TextoParpadea({ x: Q.width / 2, y: button.p.x - 120,color: "#fff",size: "40",fill: "#CCCCCC", label: "Click para empezar" }));
        Q.input.on("confirm", startGame);
        button.on("click", this, startGame);
    });

    Q.scene("endScene", function (stage) {
        var container = stage.insert(new Q.UI.Container({ x: Q.width / 2, y: 40, fill: "rgba(0,0,0,0.5)" }));

        var title =  container.insert(new Q.UI.Text({ x: 10, y: 10,color: "#fff",size: "80",fill: "#CCCCCC", label: stage.options.label }));
        //container.insert(new Q.UI.Text({ x: 10, y: 10,color: "#fff",size: "80",fill: "#CCCCCC", label: stage.options.label }));

        var subtitle1 = container.insert(new Q.UI.Text({ x: 10, y: 10 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Created by:" }));
        container.insert(new Q.UI.Text({ x: 10, y: 40 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Gerardo Meiro Mendoza" }));
        container.insert(new Q.UI.Text({ x: 10, y: 70 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Ignacio Corrales Agustín" }));
        container.insert(new Q.UI.Text({ x: 10, y: 100 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Christhian Ripa" }));
        container.insert(new Q.UI.Text({ x: 10, y: 140 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Basado en Warcraft I y Warcraft II" }));
        container.insert(new Q.UI.Text({ x: 10, y: 170 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Sprites del Warcraft II (https://www.spriters-resource.com/pc_computer/warcraft2/)" }));
        container.insert(new Q.UI.Text({ x: 10, y: 200 + title.p.x + title.p.h,color: "#fff",size: "20",fill: "#CCCCCC", label: "Musica del Warcraft II (https://www.sounds-resource.com/pc_computer/warcraft2/)" }));



        var button3 = container.insert(new Q.UI.Button({ x: 0, y: 380, fill: "#CCCCCC", label: "Click para volver a empezar" }));


        button3.on("click", startGame);

    });

    menuGame = function(){
        Q.clearStages();
        Q.stageScene('menuScene');
    }

    startGame = function(){
        Q.clearStages();
        Q.stageScene("mainScene", 0);
        Q.stageScene("guiScene", 1);
    }

    endGame = function(mensaje){
        Q.clearStages();
        Q.stageScene('endScene',{ label: mensaje });
    }
    /*
    Q.scene("mainTitle", function (stage) {
        var button = stage.insert(new Q.UI.Button({ x: Q.width / 2, y: Q.height / 2, label: "Star Game" }));
        button.on("click", this, loadFirstLevel);
    });
    */

    Q.el.addEventListener('mousemove', function (mouse) {
        mouseX = mouse.offsetX;
        mouseY = mouse.offsetY;
    });

    Q.el.addEventListener("mouseup", function (touch) { })
    Q.el.addEventListener('mousedown', function (touch) {
        var nuevo;

        var x = Q.stage(0).viewport.following.p.x - (Q.stage(0).viewport.entity.options.w / 2) + touch.offsetX;
        var y = Q.stage(0).viewport.following.p.y - (Q.stage(0).viewport.entity.options.h / 2) + touch.offsetY;


	    //GUI
		var adjustedX = x - Q.stage(0).viewport.x;
		var adjustedY = y - Q.stage(0).viewport.y;
        var esGui = Q.stage(1).locate(adjustedX, adjustedY, Q.SPRITE_UI) || Q.stage(1).locate(adjustedX, adjustedY, 128);

        var obj = Q.stage(0).locate(x, y);
        if(draggingObj){
            //draggingObj.p.dragging = false;
            if(esGui || Q.stage(0).collide(draggingObj)){
                notificarGui("No posible colocar","red",Q.stage(1));
            }
            else{
                draggingObj.p.dragging = false;
                draggingObj.p.x = x;
                draggingObj.p.y = y;
                Q.state.dec("madera",draggingObj.p.costWood);
                Q.state.dec("oro",draggingObj.p.costGold);
                draggingObj =  null;
                actualizarGui();
                //Notificar de que el objeto ya no esta seleccionado
                objSelected.p.selected = false;
                objSelected = null;
                Q.state.set("selectedGui", 0);
            }
        }
        else{
            if (touch.button == 0) {
                if (!obj && !esGui) {
                    if (objSelected) {
                        objSelected.p.selected = false;
                        objSelected = null;
                    }
                }
                else {
                    nuevo = objSelected && objSelected !== obj && !esGui  || obj.onLeftClick;
                    if (obj.onLeftClick)
                        obj.onLeftClick();
                }
            }
            else if (touch.button == 2) {
                if (objSelected) {
                    objSelected.onRightClick(obj, { x: x, y: y });
                }
            }

            if(nuevo)
                actualizarGui();

			 if(obj && obj.p.selected){
                obj.inGui();
                Q.state.set("selectedGui",obj);
            }else if(!esGui && touch.button != 2) {
                if(Q.state.get("selectedGui") !== 0) {
                    Q.state.get("selectedGui").outOfGui();
                    actualizarGui();
                }
                Q.state.set("selectedGui", 0);
            }
        }
    });

    

    loadStage = function () {

        graph = new Graph(3200,3200,10,10);

        for (var i = 0; i < 320; ++i) {
            grid[i] = [];
            for (var j = 0; j < 320; ++j)
                grid[i][j] = true;
        }
        // Q.compileSheets("mario_small.png", "mario_small.json");
        
        Q.compileSheets("miscellaneous/Magin and Missiles.png", "miscellaneous.json");
        Q.compileSheets("mines.png", "mine.json");


        //Humans
        Q.compileSheets("humans/HumanBuilds1.png", "humans/HumanBuilds1.json");
        Q.compileSheets("humans/HumanBuilds2.png", "humans/HumanBuilds2.json");
        Q.compileSheets("humans/HumanBuilds3.png", "humans/HumanBuilds3.json");

        Q.compileSheets("humans/Peasant.png", "humans/peasant.json");
        Q.compileSheets("humans/Footman.png", "humans/footman.json");
        Q.compileSheets("humans/Elven Archer.png", "humans/archer.json");

        //Orcs
        Q.compileSheets("orcs/Grunt.png", "orcs/grunt.json");
        Q.compileSheets("BattlePoints.png", "orcs/battlePoints.json"); 
        Q.compileSheets("orcs/Troll Axethrower.png", "orcs/troll_axethrower.json");


        Q.compileSheets("arbol.png", "arbol.json");

        Q.compileSheets("gui/Icons.png","gui/Icons.json");

        menuGame();
    };

    Q.load(resources, loadStage);
    //Q.debug = true;
    /*Q.debugFill = true;*/
}
