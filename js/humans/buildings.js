function humanBuildings(){
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Buildings                                                                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    Q.Sprite.extend("Human_Building", {
        init: function (p,props) {
            props.type = Q.SPRITE_BUILDING + Q.SPRITE_HUMAN;
            props.collisionMask = Q.SPRITE_BUILDING | Q.SPRITE_HUMAN | Q.SPRITE_RESOURCES | Q.SPRITE_ORC;
            props.popLimit = props.popLimit || 0;
            props.unitName =  props.unitName || "",
            props.selected= false;
            props.actions = {};
            this._super(p, props);
            
            this.on("touchEnd");
            if(this.p.dragging && draggingObj == null){
                draggingObj = this;
            }else{
                this.destroy();
            }
            this.add("cw2D");
            Q.state.inc("maxPoblacion",this.p.popLimit);
        },
        drag: function(touch) {
            this.p.dragging = true;
            this.p.x = touch.origX + touch.dx;
            this.p.y = touch.origY + touch.dy;
        },
    
        touchEnd: function(touch) {
            //this.p.dragging = false;
        },
        step: function(dt) {
            if(this.p.dragging) { 
                this.p.x = mouseX + Q.stage(0).viewport.x;
                this.p.y = mouseY + Q.stage(0).viewport.y;
            }
        },
        destroyed: function(){
            //ebugger;
            draggingObj = null;
            Q.state.dec("maxPoblacion",this.p.popLimit);
        },
        inGui: function() {
            this.p.selected = true;
        },
        outOfGui: function(){
            this.p.selected = false;
        }
    });

    Q.Human_Building.extend("Human_Castle", {
        init: function (p) {
            this._super(p, {
                sheet: "castle_lvl1",
                x: 450,
                y: 550,
                frame: 0,
                scale: 1,
                popLimit:14,
                unitName: "Castle",
                costWood:100,
                costGold: 50,

            });
            this.add([ "seleccionable"]);
            this.p.actions["recruit"] = ["human_peasan_gui"];
        }
    });

    Q.Human_Building.extend("Human_Farm", {
        init: function (p) {
            this._super(p, {
                sheet: "farm",
                x: 250,
                y: 550,
                frame: 0,
                scale: 1,
                costWood:50,
                costGold: 0,
                popLimit:8,
                unitName: "Farm"

            });
        }
    });

    Q.Human_Building.extend("Human_Barracks", {
        init: function (p) {
            this._super(p, {
                sheet: "barracks",
                x: 380,
                y: 550,
                frame: 0,
                costWood:100,
                costGold: 0,
                scale: 1,
                unitName: "Barracks"

            });
            this.add([ "seleccionable"]);
            //GUI
            this.p.actions["recruit"] = ["human_archer_gui","human_kni_gui"];
        }
    });

    Q.Human_Building.extend("Human_Woodwork", {
        init: function (p) {
            this._super(p, {
                sheet: "woodwork",
                x: 250,
                y: 550,
                frame: 0,
                scale: 1,
                unitName: "Woodwork",
                costWood: 150,
                costGold: 150,
            });
        }
    });
}