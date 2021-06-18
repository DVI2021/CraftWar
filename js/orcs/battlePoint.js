function orcsBuildings(){
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Battle Point                                                                              //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.Sprite.extend("Battle_Point", {
        init: function (p,props) {
            this._super(p, {
                sheet: "battlePoint",
                frame: 0,
                scale: 0,
                type: Q.SPRITE_BUILDING | Q.SPRITE_ORC,
                vision: 500,
                areaRespawn: 300,
                respawns: 3,
                timeRespawn: 20,
                objectives: [],
                tspawn: 0,
                enemyType: Q.SPRITE_HUMAN,
                orcs: [],
                health: 200,
                unitName:"Battle Point",
            });
            this.p.maxHealth = this.p.health;
            this.add(["cw2D","seleccionable"]);
            /*this.p.points = [
                [ -this.p.vision, -this.p.vision ], 
                [  this.p.vision, -this.p.vision ], 
                [  this.p.vision,  this.p.vision ], 
                [ -this.p.vision,  this.p.vision ]
            ];*/
            for (let i = 0; i < this.p.respawns; i++) {
                do{
                    do {
                        var x = Math.random() * ((this.p.x + this.p.areaRespawn) - (this.p.x - this.p.areaRespawn)) + (this.p.x - this.p.areaRespawn);
                    } while (x > this.p.x && x < this.p.x + this.p.w);

                    do {
                        var y = Math.random() * ((this.p.y + this.p.areaRespawn) - (this.p.y - this.p.areaRespawn)) + (this.p.y - this.p.areaRespawn);
                    } while (y > this.p.y && y < this.p.y + this.p.h);
                    var node = graph.grid[Math.floor(x/10)][Math.floor(y/10)];
                }while(node == null || node.isWall())
                var orc = null;
                //orc = Q.stage(0).insert(new Q.Orc_Troll_Axethrower({ x: x , y: y}));

                if(Math.floor(Math.random() * (2 - 0)) + 0){
                    orc = Q.stage(0).insert(new Q.Orc_Troll_Axethrower({ x: x , y: y}));
                }else{
                    orc = Q.stage(0).insert(new Q.Orc_Grunt({ x: x , y: y}));

                }
                orc.p.xStart = orc.p.x;
                orc.p.yStart = orc.p.y;
                this.p.orcs.push(orc);   
            }
            
            //this.p.orc3 = Q.stage(0).insert(new Q.Orc_Troll_Axethrower({ x: this.p.x + (Math.random() * (100 - 40) + 40) , y: this.p.y + (Math.random() * (100 - 40) + 40)}));
            
            this.on("bump");
            this.p.actions = null;

        },
        bump: function(collision){
            
        },
        step: function(dt) {
            this.respawnOrcs(dt);
            this.getEnemies();
            this.checkObjectives();
            this.assignEnemies();
        },
        respawnOrcs: function(dt){
            if(this.p.tspawn > 0 && this.p.tspawn < 10000 ){
                this.p.spawn+=dt;
            }else if(this.p.tspawn>=10000){
                if(this.p.orcs.length < this.p.respawns){
                    do {
                        var x = Math.random() * ((this.p.x + this.p.areaRespawn) - (this.p.x - this.p.areaRespawn)) + (this.p.x - this.p.areaRespawn);
                    } while (x > this.p.x && x < this.p.x + this.p.w);

                    do {
                        var y = Math.random() * ((this.p.y + this.p.areaRespawn) - (this.p.y - this.p.areaRespawn)) + (this.p.y - this.p.areaRespawn);
                    } while (y > this.p.y && y < this.p.y + this.p.h);

                    var orc = Q.stage(0).insert(new Q.Orc_Grunt({ x: x , y: y}));
                    orc.p.xStart = orc.p.x;
                    orc.p.yStart = orc.p.y;
                    this.p.orcs.push(orc);
                }
                
                this.p.tspawn=0;
            }
            else if(this.p.tspawn==0){
                if(this.p.orcs.length < this.p.respawns){
                    this.p.tspawn = 1;
                }
            }
            var nBorrar = [];
            for (let i = 0; i < this.p.orcs.length; i++) {
                if(this.p.orcs[i].p.health <= 0)
                    nBorrar.push(i);
            }
            for (const n of nBorrar) {
                this.p.orcs.splice(n,1);
            }
        },
        getEnemies: function(){
            this.humansInRange = [];
            for(let obj of Q.stage(0).items){
                if((obj.p.type & Q.SPRITE_HUMAN) && this.distanceToHuman(obj) < this.p.vision){ 
                    this.humansInRange.push(obj);
                }
            }
        },
        distanceToHuman: function(obj){
            return Math.sqrt(Math.pow((this.p.x - obj.p.x), 2) + Math.pow((this.p.y - obj.p.y), 2));
        },
        checkObjectives: function(){
            for (const orc of this.p.orcs) {
                if(this.orcObjectiveFar(orc)){
                    orc.addMode("nothing");
                    orc.play("stand_up");
                    orc.p.end = graph.grid[Math.round(orc.p.xStart/10)][Math.round(orc.p.yStart/10)];
                    orc.p.end.objective = null;
                    orc.getPath();
                }
            }
            
        },
        orcObjectiveFar: function(orc){
            if(orc.p.end == null || orc.p.end.objective == null){
                orc.play("stand_up");
                return false;
            }
            if( Math.sqrt(Math.pow((this.p.x - orc.p.end.objective.p.x), 2) + Math.pow((this.p.y - orc.p.end.objective.p.y), 2)) > this.p.vision * 1.2 || orc.p.end.objective.p.health <= 0)
                return true;
            else
                return false;
        },
        assignEnemies: function(){
            if(this.humansInRange.length == 0) return;
            for (const orc of this.p.orcs) {
                if(orc.p.end == null || orc.p.end.objective == null){
                    orc.p.end = graph.grid[Math.round(this.humansInRange[0].p.x/10)][Math.round(this.humansInRange[0].p.y/10)];
                    orc.p.end.objective = this.humansInRange[0];
                    
                    orc.atackEnemy();
                    if(this.humansInRange.lenght > 1) this.humansInRange.shift();
                }
            }
        },
        hit: function(damage){
            if(this.p.health > 0){
                this.p.health -= damage;
                if(this.p.health <= 0){
                    for (const orc of this.p.orcs) {
                        orc.destroy();
                    }
                    this.destroy();
                    var bpoints = Q("Battle_Point",0);
                    if(bpoints.items.length <= 1){
                        endGame("Has ganado");
                    }
                }
            }
        },
        inGui: function() {
            this.p.selected = true;
        },
        outOfGui: function(){
            this.p.selected = false;
        }
    });

    
}