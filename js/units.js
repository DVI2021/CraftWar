function units() {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Units                                                                                     //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.Sprite.extend("Unit", {
        init: function (p, props) {
            props.frame = 0;
            props.scale = 0;
            props.vx = 0;
            props.vy = 0;
            props.v = 100;
            props.end = null;
            props.maxHealth = 50;
            props.health = props.maxHealth;
            props.nodes = [];
            props.selected= false;
            props.pathPoints= null;
            props.distanceObjective = 200;
            props.nodes = [];
            props.mode = "";
            props.distVision = 300;
            props.actions = props.actions || {"stop_gui":this.stopAction.bind(this)};
            props.unitName =  props.unitName || "",
            props.costGold =  props.costGold || 0,
            props.costWood =  props.costWood || 0,
            this._super(p, props);
            this.add(["cw2D"]);
            
        },
        onRightClick: function (obj, coords) {
            this.p.end = graph.grid[Math.round(coords.x/10)][Math.round(coords.y/10)];
            if (!obj || obj.p.type == Q.SPRITE_NONE) {
                // ir al punto obj
                this.addMode("nothing");
            } else {
                if (obj.isA("Arbol")){
                    this.p.end.objective = obj;
                    this.p.tree = obj;
                    this.add("wooding");
                }else if (obj.isA("Mine")){
                    this.p.end.objective = obj;
                    this.p.tree = obj;
                    this.add("mining");
                }else if(obj.p.type == this.p.enemys){
                    this.p.end.objective = obj;
                    this.add("atacking");
                }
                
            }



            this.getPath();
        },
        getPath: function(){
            for (const cruz of cruces) {
                
                cruz.destroy();
            }
            var start;
            if(this.p.ocupiedGrids){
                for(pointX of this.p.ocupiedGrids){
                    for (const point of pointX) {
                        start = graph.grid[point.x][point.y];
                        start.objective = this;
                        this.p.nodes = astar.search(graph, start, this.p.end);
                        if(this.p.nodes.length > 0)
                            break;
                    } 
                    if(this.p.nodes.length > 0)
                        break;
                }
            }

            for (const c of this.p.nodes) {
                var cruz= new Q.Cross({ x: c.x * 10, y: c.y * 10 });
                cruces.push(cruz);
                this.stage.insert(cruz);
            }
        },      
        move: function () {
            if(this.p.health > 0){
                if(this.p.nodes.length > 0){
                    var start = this.p.ocupiedGrids[0][0];
                    var node = this.p.nodes[0];
                    if(start.x != node.x){
                        this.p.vy = 0;
                        if(start.x < node.x){
                            this.p.vx = 50;
                            this.play(this.p.mode + "right");
                        }else{
                            this.p.vx = -50;
                            this.play(this.p.mode + "left");
                        }
                    }else if(start.y != node.y){
                        this.p.vx = 0;
                        if(start.y < node.y){
                            this.p.vy = 50;
                            this.play(this.p.mode + "down");
                        }else{
                            this.p.vy = -50;
                            this.play(this.p.mode + "up");
                        }
                    }else{
                        this.p.vx = 0;
                        this.p.vy = 0;
                        this.p.nodes.shift();
                    }
                }else{
                    this.p.vx = 0;
                    this.p.vy = 0;
                    this.play("stand_up");
                }
            }else{
                this.p.vx = 0;
                this.p.vy = 0;
            }
        },
        hitProyectile: function(damage){
            if(this.p.health > 0){
                this.p.health -= damage;
                if(this.p.health <= 0)
                    this.die();
            }
            
        },
        hit: function(damage){
            if(this.p.health > 0){
                this.p.health -= damage;
                if(this.p.health <= 0)
                    this.die();
            }
        },
        die: function(){
            this.p.vx = 0;
            this.p.vy = 0;
            this.addMode("");
            this.del(["seleccionable","cw2D"]);
            this.p.type = Q.SPRITE_NONE;
            this.play("die");


            
        },
        searchObjective: function(){

            
        },
        addMode: function(mode){
            var comps = ["wooding","mining","nothing","atacking","atackingDistance","atackingIA","atackingDistanceIA"];
            this.del(comps);
            this.add(mode);
        },
        stopAction: function(){
            this.p.nodes.splice(0,this.p.nodes.length);
        },
        inGui: function() {
            this.p.selected = true;
        },
        outOfGui: function(){
            this.p.selected = false;
        }
    });
}

