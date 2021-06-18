Quintus["CW"] = function (Q) {

    Q.SPRITE_BUILDING = 2;
    Q.SPRITE_RESOURCES = 4;
    Q.SPRITE_HUMAN = 8;
    Q.SPRITE_ORC = 16;
    Q.SPRITE_PROYECTILE = 32;

    Q.component('cw2D', {
        added: function () {
            var entity = this.entity;
            Q._defaults(entity.p, {
                vx: 0,
                vy: 0,
                ax: 0,
                ay: 0,
                gravity: 0,
                collisionMask: Q.SPRITE_DEFAULT
            });
            entity.on('step', this, "step");
            entity.on('hit', this, 'collision');
        },
        destroySprite: function(){
            if(p.ocupiedGrids){
                for(pointX of p.ocupiedGrids){
                    for (const point of pointX) {
                        grid[point.x][point.y] = true;
                        graph.removeObjNode(point.x,point.y,this);
                    } 
                }
            }
            this.destroy();
        },

        collision: function (col, last) {


            //if(col.obj.p.collision != "false"){

            var entity = this.entity,
                p = entity.p,
                magnitude = 0;

            if (col.obj.p && col.obj.p.sensor) {
                col.obj.trigger("sensor", entity);
                return;
            }

            col.impact = 0;
            var impactX = Math.abs(p.vx);
            var impactY = Math.abs(p.vy);

            /*p.x -= col.separate[0];
            p.y -= col.separate[1];*/
            // Top collision
            if (col.normalY < -0.3) {
                if (!p.skipCollide && p.vy > 0) { p.vy = 0; }
                col.impact = impactY;
                entity.trigger("bump.bottom", col);
                entity.trigger("bump", col);
            }
            if (col.normalY > 0.3) {

                if (!p.skipCollide && p.vy < 0) { p.vy = 0; }
                col.impact = impactY;

                entity.trigger("bump.top", col);
                entity.trigger("bump", col);
            }

            if (col.normalX < -0.3) {
                if (!p.skipCollide && p.vx > 0) { p.vx = 0; }
                col.impact = impactX;
                entity.trigger("bump.right", col);
                entity.trigger("bump", col);
            }
            if (col.normalX > 0.3) {
                if (!p.skipCollide && p.vx < 0) { p.vx = 0; }
                col.impact = impactX;

                entity.trigger("bump.left", col);
                entity.trigger("bump", col);
            }
            //}
        },

        step: function (dt) {
            var p = this.entity.p, dtStep = dt;
            
            // TODO: check the entity's magnitude of vx and vy,
            // reduce the max dtStep if necessary to prevent
            // skipping through objects.
            while (dtStep > 0) {
                dt = Math.min(1 / 30, dtStep);
                // Updated based on the velocity and acceleration
                p.x += p.vx * dt;
                p.y += p.vy * dt;

                this.entity.stage.collide(this.entity);

                dtStep -= dt;
            }
            

            // TODO Podemos usar c.points?? o hay que usar p
            if(p.ocupiedGrids){
                for(pointX of p.ocupiedGrids){
                    for (const point of pointX) {
                        grid[point.x][point.y] = true;
                        graph.removeObjNode(point.x,point.y,this.entity);
                    } 
                }
            }
            
            // arriba izq, arriba der, abajo der, abajo izq
            var corners = this.entity.c.points;
            var xUpLeft = corners[0][0] + 10;
            var yUpLeft = corners[0][1] + 10;
            var xDownRight = xUpLeft + this.entity.p.w - 10;
            var yDownRight = yUpLeft + this.entity.p.h - 10;
            var ix = -1, antX = null;
            p.ocupiedGrids = [];
            if(p.type != Q.SPRITE_NONE){
                for(var i = parseInt(xUpLeft/gridSize); i< parseInt(xDownRight/gridSize); ++i){
                    for(var j = parseInt(yUpLeft/gridSize); j< parseInt(yDownRight/gridSize); ++j){
                        grid[i][j] = false;
                        if(i >= 0 && j >= 0 && i < graph.xLength && j < graph.yLength ){
                            if(i == 129){
                                xas = 0;
                            }
                            graph.addObjNode(i,j,this.entity);
                            if( antX != i ){
                                antX = i;
                                ix++;
                                p.ocupiedGrids[ix] = [];
                            }
                            p.ocupiedGrids[ix].push({x:i, y: j});
                        }     
                    }
                }
            }
        }
    });
}

/*
Q.Sprite.extend("mysprite",function(){
    init: function(){

    },
    draw: function(ctx){
        if(selected){
            pintamos cuadrado
        }
        this._super(ctx);
    }
}
)
*/