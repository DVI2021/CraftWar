function resources(){
    Q.Sprite.extend("Resource", {

        init: function (p,props) {
            props.type = Q.SPRITE_RESOURCES;
            this._super(p, props);
            this.add(["cw2D"]);
        },
        subtract: function (n) {
            this.p.resources -= n;
            if (this.p.resources <= 0) {
                this.p.type = Q.SPRITE_NONE;
                this.p.frame = 1;
                //this.stage.insert(new Q.Arbol({x:this.p.x, y:this.p.y, frame: 1, type: Q.SPRITE_NONE}) );
                //this.stage.insert(new ArbolesCortados({x:this.p.x, y:y}))
                if(this.p.ocupiedGrids){
                    for(pointX of this.p.ocupiedGrids){
                        for (const point of pointX) {
                            grid[point.x][point.y] = true;
                            graph.removeObjNode(point.x,point.y,this);
                        } 
                    }
                }
                this.destroy();
            }
        }
    });

    Q.Resource.extend("Arbol", {
        init: function (p) {
            this._super(p, {
                sheet: "arbol",
                frame: 0,
                scale: 0,
                resources: 20,
            });
        },
    });

    Q.Sprite.extend("ArbolesCortados", {
        init: function (p) {
            this._super(p, {
                sheet: "arbol",
                frame: 1,
                scale: 0,
                type: Q.SPRITE_NONE
            });
        },
    });

    Q.Resource.extend("Mine", {
        init: function (p) {
            this._super(p, {
                sheet: "mine",
                frame: 0,
                scale: 0,
                mineros: 0,
                resources: 200,
            });
        },
        addMinero: function(){
            this.p.mineros++;
            if(this.p.mineros == 1)
                this.p.frame += 3;
        },
        removeMinero: function(){
            this.p.mineros--;
            if(this.p.mineros <= 0)
                this.p.frame -= 3;
        }
    });
}