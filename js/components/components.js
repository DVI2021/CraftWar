function components() {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Componentes                                                                               //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.component("seleccionable", {
        extend: {
            onLeftClick: function () {
                if (objSelected)
                    objSelected.p.selected = false;
                this.p.selected = true;
                objSelected = this;
            }
        }
    });

    Q.component("wooding", {
        added: function () {
            this.entity.off("bump");
            this.entity.on('bump', this, "bump_wooding");
        },
        bump_wooding: function(collision){

            if(this.entity.p.end.objective == collision.obj){
                this.entity.p.dest = true;
                this.entity.p.normalX = collision.normalX;
                this.entity.p.normalY = collision.normalY;
            }
            else if(this.entity.p.end.objective.isA("Arbol") && collision.obj.isA("Arbol")){
                this.entity.p.tree = collision.obj;
                this.entity.p.dest = true;
                this.entity.p.normalX = collision.normalX;
                this.entity.p.normalY = collision.normalY;
            }
            /*else if(!collision.obj.isA("Human_Castle") && !collision.obj.isA("Arbol")){
                this.entity.getPath();
            }*/
        },
        extend: {
            
            
            step: function () {
                                
                if (this.p.wood == this.p.maxWood || (this.p.tree == null && this.p.wood > 0)) {
                    if(this.p.nodes.length == 0){
                        this.goCastle();

                    }else if (this.p.dest){
                        // TODO añadir a los recursos del jugador 
                        Q.state.inc("madera", this.p.wood);
                        this.p.wood = 0;
                        this.p.nodes = [];
                        this.p.mode = "";   
                        if(this.p.tree.p.resources <= 0){
                            var antTree = this.p.tree;
                            this.searchNewTree();
                            if(this.p.tree != antTree){
                                this.p.end = graph.grid[Math.round(this.p.tree.p.x/10)][Math.round(this.p.tree.p.y/10)];
                                this.p.end.objective = this.p.tree;
                            }else{
                                this.p.end = graph.grid[Math.round(antTree.p.x/10)][Math.round(antTree.p.y/10)];
                                this.addMode("nothing");
                            }
                        }else{
                            this.p.end = graph.grid[Math.round(this.p.tree.p.x/10)][Math.round(this.p.tree.p.y/10)];
                            this.p.end.objective = this.p.tree;
                        }
                        
                        this.getPath();
                        
                    }else{
                        this.move();
                    }
                } else if (this.p.wood < this.p.maxWood && this.p.dest) {    
                    if(this.p.animation != "firewood_up" || this.p.animation != "firewood_right" || this.p.animation != "firewood_left"  || this.p.animation != "firewood_down" ){
                        if(this.p.normalX == 1){
                            this.play("firewood_left");
                        }else if(this.p.normalX == -1){
                            this.play("firewood_right");
                        }else if(this.p.normalY == -1){
                            this.play("firewood_down");
                        }else{
                            this.play("firewood_up");
                        }
                    }
                    this.p.nodes = [];

                    if(this.p.tree == null || this.p.tree.p.resources <= 0){
                        var antTree = this.p.tree;

                        this.searchNewTree();

                        this.p.mode = "";

                        if(this.p.tree == antTree && this.p.wood <= 0){
                            this.addMode("nothing");
                        }                           
                        else if(this.p.tree == antTree && this.p.wood > 0){
                            this.goCastle();
                        }else{
                            this.p.end = graph.grid[Math.round(this.p.tree.p.x/10)][Math.round(this.p.tree.p.y/10)];
                            this.p.end.objective = this.p.tree;
    
                            this.getPath();
                        }
                    }
                    
                }
                else if(this.p.nodes.length == 0 ) {
                    this.p.end = graph.grid[Math.round(this.p.tree.p.x/10)][Math.round(this.p.tree.p.y/10)];
                    this.p.end.objective = this.p.tree;
                    if(this.p.antX == this.p.x && this.p.antY == this.p.y){
                        this.p.igualCont++;
                        if(this.p.igualCont > 4){
                            var antTree = this.p.tree;

                            this.searchNewTree();
                            if(this.p.tree == antTree && this.p.wood <= 0){
                                this.addMode("nothing");
                            }                           
                            else if(this.p.tree == antTree && this.p.wood > 0){
                                this.goCastle();
                            }
                        }
                    }else{
                        this.p.antX = this.p.x;
                        this.p.antY = this.p.y;
                        this.p.igualCont = 0;
                    }
                    this.getPath();
                }else{
                    
                    this.move();

                }

                this.p.dest = false;

            },
            cutWood: function(){
            },
            goCastle: function(){
                var castle = Q("Human_Castle", 0).first();
                this.p.nodes = [];
                this.p.end = castle;
                this.p.end = graph.grid[Math.round(castle.p.x/10)][Math.round(castle.p.y/10)];
                this.p.end.objective = castle;
                this.p.mode = "transport_firewood_";

                this.getPath();
            },
            searchNewTree: function(){
                var arboles = Q("Arbol", 0);
                var minDist = this.p.distVision;
                var antTree = this.p.tree;
                for (const arbol of arboles.items) {
                    var xDif = arbol.p.x - antTree.p.x ;
                    var yDif = arbol.p.y - antTree.p.y;
                    var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                    if(h < minDist){
                        minDist = h;
                        this.p.tree = arbol;
                    }
                    xDif = arbol.p.x - this.p.x ;
                    yDif = arbol.p.y - this.p.y;
                    h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                    if(h < minDist){
                        minDist = h;
                        this.p.tree = arbol;
                    }
                }
            }
        }
    });

    Q.component("mining", {
        added: function () {
            this.entity.off("bump");
            this.entity.on('bump', this, "bump_mining");
            this.timeMining = 90;
            this.currentTimeMining = this.timeMining;
        },
        bump_mining: function(collision){
            this.entity.p.vy = 0;
            this.entity.p.vx = 0;
            if(this.entity.p.end.objective == collision.obj)
                this.entity.p.dest = true;
            /*else if(!this.entity.p.hidden && !collision.obj.p.hidden && !collision.obj.isA("Human_Castle") && !collision.obj.isA("Mine") ){
                this.entity.getPath();
            }*/
        },
       
        extend: {
            
            
            step: function (dt) {
                
                var tree = this.p.tree;
                var castle = Q("Human_Castle", 0).first();

                
                if (this.p.gold == this.p.maxGold || (this.p.tree == null && this.p.gold > 0)) {
                   if(this.p.nodes.length == 0){
                    this.goCastle();

                    // TODO camino = astar()
                    //this.p.end = a*(this, castle, grid);
                    this.getPath();
                   }else if (this.p.dest){
                        // TODO añadir a los recursos del jugador 
                        this.p.nodes = [];
                        this.p.vy = 0;
                        this.p.vx = 0;
                        Q.state.inc("oro", this.p.gold);

                        this.p.gold = 0;
                        this.p.mode = "";

                        if(this.p.tree.p.resources <= 0){
                            this.findNewMine();
                        }

                        this.p.end = graph.grid[Math.round(tree.p.x/10)][Math.round(tree.p.y/10)];
                        this.p.end.objective = this.p.tree;

                        this.getPath();
                        
                    }else{
                        this.move();
                    }
                } else if (this.p.gold < this.p.maxWood && this.p.dest) {  
                    if(this.p.nodes.length > 0){
                        this.p.tree.addMinero();
                        this.hide();
                    }  
                    this.mining.currentTimeMining -= dt * 100;
                    if(this.mining.currentTimeMining <= 0){
                        this.mineGold();
                    }

                    this.p.nodes = [];

                    if(this.p.tree.p.resources <= 0){
                        this.findNewMine();
                        this.p.mode = "";

                        if(this.p.tree == null)
                            this.addMode("nothing");
                        else{
                            this.p.end = graph.grid[Math.round(tree.p.x/10)][Math.round(tree.p.y/10)];
                            this.p.end.objective = this.p.tree;
    
                            this.getPath();
                        }
                        
                    }
                    
                }
                else if(this.p.nodes.length == 0 ) {
                    this.p.end = graph.grid[Math.round(tree.p.x/10)][Math.round(tree.p.y/10)];
                    this.p.end.objective = tree;

                    this.getPath();
                }else{
                    this.move();

                }
                this.p.dest = false;

            },
            mineGold: function(){
                this.p.vy = 0;
                this.p.vx = 0;
    
                this.p.gold++;
                this.p.tree.subtract(1);
                this.mining.currentTimeMining = this.mining.timeMining;
            },
            goCastle: function(){
                this.p.nodes = [];
                this.p.tree.removeMinero();
                this.show();
                this.p.end = castle;
                this.p.end = graph.grid[Math.round(castle.p.x/10)][Math.round(castle.p.y/10)];
                this.p.end.objective = castle;
                this.p.mode = "transport_gold_";
            },
            findNewMine: function(){
                var minas = Q("Mine", 0);
                var minDist = this.p.distVision;
                for (const mina of minas.items) {
                    var xDif = mina.p.x - this.p.x ;
                    var yDif = mina.p.y - this.p.y;
                    var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                    if(h < minDist){
                        minDist = h;
                        this.p.tree = mina;
                    }
                }
            }
        }
    });

    Q.component("nothing", {
        added: function () {
            this.entity.getPath();
        },
        extend: {
            step: function (dt) {
                this.move();
            }
        }
    });



    Q.component("atacking", {
        added: function () {
            this.entity.off("bump");
            this.entity.on('bump', this, "bump_atack");
            this.entity.on("atack");

            this.lastPointEnemy = {x:null, y: null};
        },
        bump_atack: function(collision){
            this.entity.p.vy = 0;
            this.entity.p.vx = 0;
            if(this.entity.p.end != null && this.entity.p.end.objective == collision.obj){
                this.entity.p.dest = true;  
                this.entity.p.normalX = collision.normalX;  
                this.entity.p.normalY = collision.normalY;  

            }
            /*else if(!this.entity.p.hidden && !collision.obj.p.hidden && !collision.obj.isA("Human_Castle") && !collision.obj.isA("Mine") ){
                this.entity.getPath();
            }*/
        },
       
        extend: {
            step: function (dt) {
                if(this.p.end != null){
                    if(this.p.dest){
                        if(this.p.animation != "atack_up" || this.p.animation != "atack_right" || this.p.animation != "atack_left" || this.p.animation != "atack_down" ){
                            if(this.p.normalX > 0){
                                this.play("atack_left");
                            }else if(this.p.normalX < 0){
                                this.play("atack_right");
                            }else{
                                if(this.p.normalY > 0){
                                    this.play("atack_up");
                                }else{
                                    this.play("atack_down");
                                }
                            }
                        }
                    }else if(!this.p.dest && (this.p.end.objective.p.x != this.atacking.lastPointEnemy.x || this.p.end.objective.p.y != this.atacking.lastPointEnemy.y)){
                        this.move();
                        var enemy = this.p.end.objective;
                        this.p.end = graph.grid[Math.round(enemy.p.x/10)][Math.round(enemy.p.y/10)];
                        this.p.end.objective = enemy;
                        this.atacking.lastPointEnemy.x = this.p.end.objective.p.x;
                        this.atacking.lastPointEnemy.y = this.p.end.objective.p.y;

                        this.getPath();
                    }
                    else{
                        this.move();
                    }
                    if( this.p.end.objective.p.health <= 0){
                        this.p.end = null;
                    }
                }else{
                    this.play("stand_up");

                    if(!this.findEnemyInVision()){
                        this.addMode("nothing");
                    }
                }
                this.p.dest = false;

            },
            atack: function(){
                if(this.p.end != null){
                    var n = Math.floor(Math.random() * (4 - 1)) + 1;;
                    Q.audio.play("Misc/Sword" + n + ".wav");
                    this.p.end.objective.hit(this.p.damage);

                }
            },
            findEnemyInVision: function(){
                var enemy = null;
                var minDist = this.p.distVision;
                for (const item of this.stage.items) {
                    if(item.p.type == this.p.enemys){
                        if(item.p.health > 0){
                            var xDif = item.p.x - this.p.x ;
                            var yDif = item.p.y - this.p.y;
                            var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                            if(h < minDist){
                                minDist = h;
                                enemy = item;
                            }
                        }
                    }
                }
                if(enemy != null){
                    this.p.end = graph.grid[Math.round(enemy.p.x/10)][Math.round(enemy.p.y/10)];
                    this.p.end.objective = enemy;

                    this.getPath();
                    return true;
                }
                return false;
            }
        }
    });

    Q.component("atackingDistance", {
        added: function () {
            this.entity.off("bump");
            this.entity.on("atack");

            this.lastPointEnemy = {x:null, y: null};
        },
        extend: { 
            step: function (dt) {
                this.p.reloadTime -= dt;
                if(this.p.end != null ){
                    var xDif = this.p.end.objective.p.x - this.p.x;
                    var yDif = this.p.end.objective.p.y - this.p.y;
                    var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                    if(h < this.p.distance){
                        this.p.vx = 0;
                        this.p.vy = 0;
                        this.p.nodes = [];
                        var alfa = Math.acos(xDif / h);

                        var a = alfa * 180/ Math.PI;
                        
                        /*if(xDif ==  0){
                            a -= 90;
                        }*/
                        /*if(yDif < 0){
                            a = -a;
                        }*/
                        if((this.p.animation != "atack_up" || this.p.animation != "atack_right" || this.p.animation != "atack_left" || this.p.animation != "atack_down" ||
                            this.p.animation != "atack_updown" || this.p.animation != "atack_upleft" || this.p.animation != "atack_downright" || this.p.animation != "atack_downleft") && this.p.reloadTime <= 0){
                            var anim = "";
                            var aAux = 1;

                            if(yDif > 5){
                                anim += "down";
                            }else if(yDif < -5){
                                anim += "up";
                                aAux = -1;
                            }
                            
                            if(xDif > 5){
                                if(anim != ""){
                                    this.p.angle = aAux * (a - 45);
                                }
                                anim += "right";
                                
                            }else if(xDif < -5){
                                if(anim != ""){
                                    this.p.angle = aAux * (a - 135);
                                }
                                anim += "left";
                                
                            }
                            this.play("atack_" + anim);


                        }
                        
                    }else if((this.p.end.objective.p.x != this.atackingDistance.lastPointEnemy.x || this.p.end.objective.p.y != this.atackingDistance.lastPointEnemy.y)){
                        
                        this.move();
                        var enemy = this.p.end.objective;
                        var prop = this.p.distance / h ; 
                        var x = xDif * prop ;
                        var y = yDif * prop;
                        if(xDif > 0){
                            x -= this.p.w;
                        }else if(xDif < 0){
                            x += this.p.w;
                        }
                        if(yDif > 0){
                            y -= this.p.h;
                        }else if(yDif < 0){
                            y += this.p.h;
                        }
                        
                        this.p.end = graph.grid[Math.round((enemy.p.x - x)/10)][Math.round((enemy.p.y - y)/10)];
                        this.p.end.objective = enemy;
                        this.atackingDistance.lastPointEnemy.x = this.p.end.objective.p.x;
                        this.atackingDistance.lastPointEnemy.y = this.p.end.objective.p.y;

                        this.getPath();
                    }
                    else{
                        this.move();
                    }
                    if( this.p.end.objective.p.health <= 0){
                        this.p.end = null;
                    }
                }else{
                    this.play("stand_up");

                    if(!this.findEnemyInVision()){
                        this.addMode("nothing");
                    }
                }
                this.p.dest = false;

            },
            atack: function(){
                if(this.p.end != null){
                    this.p.reloadTime = this.p.reload;
                    this.shoot();
                }
            },
            findEnemyInVision: function(){
                var enemy = null;
                var minDist = this.p.distVision;
                for (const item of this.stage.items) {
                    if(item.p.type == this.p.enemys){
                        if(item.p.health > 0){
                            var xDif = item.p.x - this.p.x ;
                            var yDif = item.p.y - this.p.y;
                            var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                            if(h < minDist){
                                minDist = h;
                                enemy = item;
                            }
                        }
                    }
                }
                if(enemy != null){
                    this.p.end = graph.grid[Math.round(enemy.p.x/10)][Math.round(enemy.p.y/10)];
                    this.p.end.objective = enemy;

                    this.getPath();
                    return true;
                }
                return false;
            },
            shoot: function(){
                var orc = this.p.end.objective;
                if(orc.p.health > 0){
                    var xDif = this.p.end.objective.p.x - this.p.x;
                    var yDif = this.p.end.objective.p.y - this.p.y;
                    var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
    
                    var alfa = Math.acos(xDif / h);
    
                    var a = alfa * 180/ Math.PI;
                    /*var aAux = 0;
                    if(yDif > 5){
                        aAux = 1;
                    }else if(yDif < -5){
                        aAux = -1;
                    }
                    */
    
                    if(yDif < 5){
                            a = -1 * a;
                    }
                    Q.audio.play("Misc/Bowfire.wav");

                    this.stage.insert(new Q.Arrow({x: this.p.x , y:this.p.y  , endX: orc.p.x , endY: orc.p.y , collisionMask: Q.SPRITE_ORC,distance: h, angle: a} ));
    
                }
    
            }
        }
    });


    Q.component("atackingIA", {
        added: function () {
            this.entity.off("bump");
            this.entity.on('bump', this, "bump_atack");
            this.entity.on("atack");

            this.lastPointEnemy = {x:null, y: null};
        },
        bump_atack: function(collision){
            this.entity.p.vy = 0;
            this.entity.p.vx = 0;
            if(this.entity.p.end != null && this.entity.p.end.objective == collision.obj){
                this.entity.p.dest = true;  
                this.entity.p.normalX = collision.normalX;  
                this.entity.p.normalY = collision.normalY;  

            }
            /*else if(!this.entity.p.hidden && !collision.obj.p.hidden && !collision.obj.isA("Human_Castle") && !collision.obj.isA("Mine") ){
                this.entity.getPath();
            }*/
        },
       
        extend: {
            
            
            step: function (dt) {

                if(this.p.end != null){
                    if(this.p.dest){
                        if(this.p.animation != "atack_up" || this.p.animation != "atack_right" || this.p.animation != "atack_left" || this.p.animation != "atack_down" ){
                            if(this.p.normalX > 0){
                                this.play("atack_left");
                            }else if(this.p.normalX < 0){
                                this.play("atack_right");
                            }else{
                                if(this.p.normalY > 0){
                                    this.play("atack_up");
                                }else{
                                    this.play("atack_down");
                                }
                            }
                        }
                    }else if(!this.p.dest && (this.p.end.objective.p.x != this.atackingIA.lastPointEnemy.x || this.p.end.objective.p.y != this.atackingIA.lastPointEnemy.y)){
                        

                        this.move();
                        var enemy = this.p.end.objective;
                        this.p.end = graph.grid[Math.round(enemy.p.x/10)][Math.round(enemy.p.y/10)];
                        this.p.end.objective = enemy;
                        this.atackingIA.lastPointEnemy.x = this.p.end.objective.p.x;
                        this.atackingIA.lastPointEnemy.y = this.p.end.objective.p.y;

                        this.getPath();
                    }
                    else{
                        this.move();
                    }
                    if( this.p.end.objective.p.health <= 0){
                        this.p.end = null;
                    }
                }else{
                    this.play("stand_up");
                }
                this.p.dest = false;

            },
            atack: function(){
                if(this.p.end != null){
                    var n = Math.floor(Math.random() * (4 - 1)) + 1;;
                    Q.audio.play("Misc/Sword" + n + ".wav");
                    this.p.end.objective.hit(this.p.damage);

                }
            }
        }
    });

    Q.component("atackingDistanceIA", {
        added: function () {
            this.entity.off("bump");
            this.entity.on("atack");

            this.lastPointEnemy = {x:null, y: null};
        },
       
        extend: {
            
            
            step: function (dt) {
                this.p.reloadTime -= dt;
                if(this.p.end != null ){
                    var xDif = this.p.end.objective.p.x - this.p.x;
                    var yDif = this.p.end.objective.p.y - this.p.y;
                    var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
                    if(h < this.p.distance){
                        this.p.vx = 0;
                        this.p.vy = 0;
                        this.p.nodes = [];
                        var alfa = Math.acos(xDif / h);

                        var a = alfa * 180/ Math.PI;
                        
                        if((this.p.animation != "atack_up" || this.p.animation != "atack_right" || this.p.animation != "atack_left" || this.p.animation != "atack_down" ||
                            this.p.animation != "atack_updown" || this.p.animation != "atack_upleft" || this.p.animation != "atack_downright" || this.p.animation != "atack_downleft") && this.p.reloadTime <= 0){
                            var anim = "";
                            var aAux = 1;

                            if(yDif > 5){
                                anim += "down";
                            }else if(yDif < -5){
                                anim += "up";
                                aAux = -1;
                            }
                            
                            if(xDif > 5){
                                if(anim != ""){
                                    this.p.angle = aAux * (a - 45);
                                }
                                anim += "right";
                                
                            }else if(xDif < -5){
                                if(anim != ""){
                                    this.p.angle = aAux * (a - 135);
                                }
                                anim += "left";
                                
                            }
                            this.play("atack_" + anim);


                        }
                        
                    }else if((this.p.end.objective.p.x != this.atackingDistanceIA.lastPointEnemy.x || this.p.end.objective.p.y != this.atackingDistanceIA.lastPointEnemy.y)){
                        

                        this.move();
                        var enemy = this.p.end.objective;
                        var prop = this.p.distance / h ; 
                        var x = xDif * prop ;
                        var y = yDif * prop;
                        if(xDif > 0){
                            x -= this.p.w;
                        }else if(xDif < 0){
                            x += this.p.w;
                        }
                        if(yDif > 0){
                            y -= this.p.h;
                        }else if(yDif < 0){
                            y += this.p.h;
                        }
                        
                        this.p.end = graph.grid[Math.round((enemy.p.x - x)/10)][Math.round((enemy.p.y - y)/10)];
                        this.p.end.objective = enemy;
                        this.atackingDistanceIA.lastPointEnemy.x = this.p.end.objective.p.x;
                        this.atackingDistanceIA.lastPointEnemy.y = this.p.end.objective.p.y;

                        this.getPath();
                    }
                    else{
                        this.move();
                    }
                    if( this.p.end.objective.p.health <= 0){
                        this.p.end = null;
                    }
                }else{
                    this.play("stand_up");
                }
                this.p.dest = false;

            },
            atack: function(){
                if(this.p.end != null){
                    this.p.reloadTime = this.p.reload;
                    this.shoot();
                }
            },
            shoot: function(){
                var objective = this.p.end.objective;
                if(objective.p.health > 0){
                    var xDif = this.p.end.objective.p.x - this.p.x;
                    var yDif = this.p.end.objective.p.y - this.p.y;
                    var h = Math.sqrt((xDif * xDif) + (yDif * yDif));
    
                    var alfa = Math.acos(xDif / h);
    
                    var a = alfa * 180/ Math.PI;
                    
    
                    if(yDif < 5){
                            a = -1 * a;
                    }
                    Q.audio.play("Misc/Bowfire.wav");

                    this.stage.insert(new Q.Axe({x: this.p.x , y:this.p.y  , endX: objective.p.x , endY: objective.p.y , collisionMask: Q.SPRITE_ORC,distance: h, angle: a} ));
    
                }
    
            }
        }
    });
}