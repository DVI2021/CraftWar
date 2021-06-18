function humanUnits() {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Human Units                                                                               //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.Unit.extend("Human_unit", {
        init: function (p, props) {
            props.selected = false;
            props.type = Q.SPRITE_HUMAN;
            props.collisionMask = Q.SPRITE_BUILDING | Q.SPRITE_HUMAN | Q.SPRITE_RESOURCES | Q.SPRITE_ORC;
            props.enemys = Q.SPRITE_ORC;
            this._super(p, props);
            this.add([ "seleccionable"]);
            Q.state.inc("poblacion",1);
        },
        destroyed: function(){
            Q.state.dec("poblacion",1);
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Peasant                                                                                   //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    Q.animations("peasant_anim", {
        up: { frames: [10, 5, 10, 20, 15, 20], rate: 1 / 5, flip: false, loop: true },
        stand_up: { frames: [0], rate: 1 / 5, flip: false, loop: true },

        right: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: false, loop: true },
        left: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: "x", loop: true },
        down: { frames: [9, 14, 19, 24], rate: 1 / 5, flip: false, loop: true },

        transport_gold_up: { frames: [60, 65, 70, 75, 80], rate: 1 / 5, flip: false, loop: true },
        transport_gold_right: { frames: [62, 67, 72, 77, 82], rate: 1 / 5, flip: false, loop: true },
        transport_gold_left: { frames: [62, 67, 72, 77, 82], rate: 1 / 5, flip: "x", loop: true },
        transport_gold_down: { frames: [64, 69, 74, 79, 84], rate: 1 / 5, flip: false, loop: true },

        transport_firewood_up: { frames: [85, 90, 95, 100, 105], rate: 1 / 5, flip: false, loop: true },
        transport_firewood_right: { frames: [87, 92, 97, 102, 107], rate: 1 / 5, flip: false, loop: true },
        transport_firewood_left: { frames: [87, 92, 97, 102, 107], rate: 1 / 5, flip: "x", loop: true },
        transport_firewood_down: { frames: [89, 94, 99, 104, 109], rate: 1 / 5, flip: false, loop: true },

        firewood_up: { frames: [25, 30, 35, 40, 45], rate: 1 / 5, flip: false, loop: false, trigger: "cutWood" },
        firewood_right: { frames: [27, 32, 37, 42, 47], rate: 1 / 5, flip: false, loop: false, trigger: "cutWood" },
        firewood_left: { frames: [27, 32, 37, 42, 47], rate: 1 / 5, flip: "x", loop: false, trigger: "cutWood" },
        firewood_down: { frames: [29, 34, 39, 44, 49], rate: 1 / 5, flip: false, loop: false, trigger: "cutWood" },

        atack_up: { frames: [25, 30, 35, 40, 45], rate: 1 / 5, flip: false, loop: false ,trigger: "atack"},
        atack_right: { frames: [27, 32, 37, 42, 47], rate: 1 / 5, flip: false, loop: false, trigger: "atack" },
        atack_left: { frames: [27, 32, 37, 42, 47], rate: 1 / 5, flip: "x", loop: false , trigger: "atack"},
        atack_down: { frames: [29, 34, 39, 44, 49], rate: 1 / 5, flip: false, loop: false , trigger: "atack"},

        die:{ frames: [51,54], rate: 1 / 5, flip: false, loop: false },

    });

    Q.Human_unit.extend("Human_Peasant", {
        init: function (p) {
            this._super(p, {
                sprite: "peasant_anim",
                sheet: "peasant",
                x: 450,
                y: 450,
                tree: null,
                maxWood: 10,
                wood: 0,
                maxGold: 10,
                gold: 0,
                unitName: "Peasant",
                damage: 1,
                costGold: 10,
            });
            this.add([ "animation","nothing"]);
            
            this.on("bump");
            this.on("cutWood");
            
            //GUI
            this.p.actions["construct"] = 1;
        },
        step: function (dt) {
            
        },
        bump: function (collision) {
            if (collision.obj == this.p.end) {
                this.p.end = null;
            }
            if (collision.obj.isA("Human_Castle")) {
            }

            if (collision.obj.isA("Arbol")) {
                //this.p.x = collision.obj.p.x / 2;
                //this.p.y = collision.obj.p.y / 2;
                this.p.vx = 0;
                this.p.vy = 0;
                if (this.p.tree == null) {
                    this.play("cut_wood_up");

                }
                this.p.tree = collision.obj;
            }
        },
        cutWood: function(){
            if(this.p.tree == null) return ;
            this.p.vy = 0;
            this.p.vx = 0;

            this.p.wood++;
            this.p.tree.subtract(1);
            var n = Math.floor(Math.random() * (5 - 1)) + 1;;
            Q.audio.play("Misc/Tree" + n + ".wav");

        },
        
    });
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Footman                                                                                   //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.animations("footman_anim", {
        up: { frames: [10, 5, 10, 20, 15, 20], rate: 1 / 5, flip: false, loop: true },
        stand_up: { frames: [0], rate: 1 / 5, flip: false, loop: false },

        right: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: false, loop: true },
        left: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: "x", loop: true },
        down: { frames: [9, 14, 19, 24], rate: 1 / 5, flip: false, loop: true },

        atack_up: { frames: [25, 30, 35, 40], rate: 1 / 5, flip: false, loop: false, trigger: "atack"},
        atack_right: { frames: [27, 32, 37, 42], rate: 1 / 5, flip: false, loop: false, trigger: "atack"},
        atack_left: { frames: [27, 32, 37, 42], rate: 1 / 5, flip: "x", loop: false, trigger: "atack"},
        atack_down: { frames: [29, 34, 39, 44], rate: 1 / 5, flip: false, loop: false, trigger: "atack"},

        die:{ frames: [45,49], rate: 1 / 5, flip: false, loop: false },

    });
    Q.Human_unit.extend("Human_Footman", {
        init: function (p) {
            this._super(p, {
                sprite: "footman_anim",
                sheet: "footman",
                x: 650,
                y: 650,
                damage: 20,
                unitName: "Footman",
                costGold: 100
            });
            this.add([ "animation"]);
            this.on("bump")


        },
        step: function (dt) {

        },
        bump: function (collision) {
            if (collision.obj == this.p.end) {

            }
            if (collision.obj.isA("Human_Castle")) {
            }

            if (collision.obj.isA("Arbol")) {
                
            }
        },
        onRightClick: function (obj, coords) {
            
            this.p.end = graph.grid[Math.round(coords.x/10)][Math.round(coords.y/10)];

            if (!obj || obj.p.type & Q.SPRITE_NONE) {
                this.addMode("nothing");
            } else {
                 if(obj.p.type & this.p.enemys && obj.p.health > 0){
                    this.p.end.objective = obj;
                    this.addMode("atacking");
                }
                
            }

            
        },
        
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Archer                                                                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.animations("archer_anim", {
        up: { frames: [10, 5, 10, 20, 15, 20], rate: 1 / 5, flip: false, loop: true },
        stand_up: { frames: [0], rate: 1 / 5, flip: false, loop: false },

        right: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: false, loop: true },
        left: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: "x", loop: true },
        down: { frames: [9, 14, 19, 24], rate: 1 / 5, flip: false, loop: true },

        atack_up: { frames: [25, 30], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_upright: { frames: [26, 31], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_upleft: { frames: [26, 31], rate: 1 / 2, flip: "x", loop: false, trigger: "atack"},
        atack_right: { frames: [27, 32], rate: 1 / 6, flip: false, loop: false, trigger: "atack"},
        atack_left: { frames: [27, 32], rate: 1 / 2 , flip: "x", loop: false, trigger: "atack"},
        atack_down: { frames: [29, 34], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_downright: { frames: [28, 33], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_downleft: { frames: [28, 33], rate: 1 / 2, flip: "x", loop: false, trigger: "atack"},

        die:{ frames: [35,39], rate: 1 / 5, flip: false, loop: false },

    });
    Q.Human_unit.extend("Human_Archer", {
        init: function (p) {
            this._super(p, {
                sprite: "archer_anim",
                sheet: "archer",
                x: 850,
                y: 650,
                reload: 5,
                reloadTime: 0,
                distance: 200,
                distVision: 500,
                unitName: "Archer",
                costGold: 60,
                costWood: 40,
            });
            this.add([ "animation"]);
            this.on("bump")
            //this.p.end = Q("Arbol",0).first(); // hay que coger el arbol con el que chocas

        },
        step: function (dt) {
            this.move();
        },
        bump: function (collision) {
            if (collision.obj == this.p.end) {

            }
            if (collision.obj.isA("Human_Castle")) {
            }

            if (collision.obj.isA("Arbol")) {
                
            }
        },
        
        onRightClick: function (obj, coords) {
            
            this.p.end = graph.grid[Math.round(coords.x/10)][Math.round(coords.y/10)];

            if (!obj || obj.p.type & Q.SPRITE_NONE) {
                this.addMode("nothing");
                this.getPath();
            } else {            
                 if(obj.p.type & this.p.enemys && obj.p.health > 0){
                    this.p.end.objective = obj;
                    this.addMode("atackingDistance");
                }
                
            }

            
        },
    });


    
}