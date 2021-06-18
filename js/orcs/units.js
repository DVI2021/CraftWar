function orcUnits() {
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Orc Units                                                                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.Unit.extend("Orc_unit", {
        init: function (p, props) {
            props.type = Q.SPRITE_ORC;
            props.collisionMask = Q.SPRITE_BUILDING + Q.SPRITE_HUMAN + Q.SPRITE_RESOURCES + Q.SPRITE_ORC;
            props.enemys = Q.SPRITE_HUMAN;
            this._super(p, props);
            this.add([ "seleccionable"]);

        },
        onRightClick: function (obj, coords) {

        },
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Grunt                                                                                     //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.animations("grunt_anim", {
        up: { frames: [10, 5, 10, 20, 15, 20], rate: 1 / 5, flip: false, loop: true },
        stand_up: { frames: [0], rate: 1 / 5, flip: false, loop: false },

        right: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: false, loop: true },
        left: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: "x", loop: true },
        down: { frames: [9, 14, 19, 24], rate: 1 / 5, flip: false, loop: true },

        atack_up: { frames: [25, 30, 35, 40], rate: 1 / 5, flip: false, loop: false, trigger: "atack"},
        atack_right: { frames: [27, 32, 37, 42], rate: 1 / 5, flip: false, loop: false, trigger: "atack"},
        atack_left: { frames: [27, 32, 37, 42], rate: 1 / 5, flip: "x", loop: false, trigger: "atack"},
        atack_down: { frames: [29, 34, 39, 44], rate: 1 / 5, flip: false, loop: false, trigger: "atack"},

        die:{ frames: [45,49], rate: 1 / 5, flip: "xy", loop: false },
    });
    Q.Orc_unit.extend("Orc_Grunt", {
        init: function (p) {
            this._super(p, {
                sprite: "grunt_anim",
                sheet: "grunt",
                x: 650,
                y: 650,
                damage: 10,
                unitName: "Grunt",
            });

            this.p.originX = this.p.x;
            this.p.originY = this.p.y;
            this.p.actions = null;

            this.add([ "animation"]);

            this.on("bump")
            //this.p.end = Q("Arbol",0).first(); // hay que coger el arbol con el que chocas

        },
        step: function (dt) {

        },
        bump: function (collision) {
            if (collision.obj == this.p.end) {

            }

            if (collision.obj.isA("Arbol")) {
                
            }
        },
        atackEnemy: function(){
            this.addMode("atackingIA");
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Troll Axethrower                                                                          //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.animations("troll_axethrower_anim", {
        up: { frames: [10, 5, 10, 20, 15, 20], rate: 1 / 5, flip: false, loop: true },
        stand_up: { frames: [0], rate: 1 / 5, flip: false, loop: false },

        right: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: false, loop: true },
        left: { frames: [7, 12, 17, 22], rate: 1 / 5, flip: "x", loop: true },
        down: { frames: [9, 14, 19, 24], rate: 1 / 5, flip: false, loop: true },

        atack_up: { frames: [25, 30, 35, 40], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_upright: { frames: [26, 31,36,41], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_upleft: { frames: [26, 31,36,41], rate: 1 / 2, flip: "x", loop: false, trigger: "atack"},
        atack_right: { frames: [27, 32, 37, 42], rate: 1 / 6, flip: false, loop: false, trigger: "atack"},
        atack_left: { frames: [27, 32, 37, 42], rate: 1 / 2 , flip: "x", loop: false, trigger: "atack"},
        atack_down: { frames: [29, 34, 39, 44], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_downright: { frames: [28, 33,38,43], rate: 1 / 2, flip: false, loop: false, trigger: "atack"},
        atack_downleft: { frames: [28, 33,38,43], rate: 1 / 2, flip: "x", loop: false, trigger: "atack"},


        die:{ frames: [45,49], rate: 1 / 5, flip: "xy", loop: false },
    });
    Q.Orc_unit.extend("Orc_Troll_Axethrower", {
        init: function (p) {
            this._super(p, {
                sprite: "troll_axethrower_anim",
                sheet: "troll_axethrower",
                x: 650,
                y: 650,
                reload: 2,
                reloadTime: 0,
                distance: 200,
                unitName: "Axethrower",
            });
            this.add([ "animation"]);
            this.p.actions = null;
            this.on("bump")
            //this.p.end = Q("Arbol",0).first(); // hay que coger el arbol con el que chocas
            
            this.time = 30;
        },
        step: function (dt) {
            /*this.p.reloadTime -= dt;
            if(this.p.reloadTime <= 0){
                this.p.reloadTime = this.p.reload;
                //this.shoot();
            }*/
            /*this.time -= dt * 10;
            if(this.time <= 0){
                if(this.p.nodes.length == 0 & this.p.coords != null){
                    var coords = this.p.coords;
                    this.p.end = graph.grid[Math.round(coords.x/10)][Math.round(coords.y/10)];
                    this.getPath();
                }
            }*/
            this.move();
        },
        bump: function (collision) {
            if (collision.obj == this.p.end) {

            }

            if (collision.obj.isA("Arbol")) {
                
            }
        },
        shoot: function(){
            var orc = Q("Human_Archer",0).first();
            if(orc.p.health > 0)
                this.stage.insert(new Q.Axe({x: this.p.x , y:this.p.y  , endX: orc.p.x , endY: orc.p.y , collisionMask: Q.SPRITE_HUMAN } ));

        },
        atackEnemy: function(){
            this.addMode("atackingDistanceIA");
        }
    });

}