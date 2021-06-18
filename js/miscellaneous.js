function miscellaneous(){

    Q.Sprite.extend("Proyectile", {
        init: function (p,props) {
            props.sensor = true;
            props.v = 50;
            props.vy = 0;
            props.vx = 0;
            props.scale = 1;
            props.doCol = false;
            props.scalePlus = 0;
            props.maxScale = 1;
            props.distance = 0;
            this._super(p, props);

            this.add([ "animation"]);
            
            this.on("sensor", this, "hit");
            /*if(this.p.endX + 4 > this.p.x && this.p.endX - 4 < this.p.x){
                if(this.p.endY > this.p.y){
                    this.p.vy = this.p.v;
                }else{
                    this.p.vy = -this.p.v; 
                }
            }else if(this.p.endX > this.p.x){
                this.p.vx = this.p.v;  
            }else{
                this.p.vx = -this.p.v;
            }*/

           /* if(this.p.y > this.p.endY){
                if(this.p.x < this.p.endX){
                    this.p.angle = 45 - this.p.angle;
                }else if(this.p.x > this.p.endX){
                    this.p.angle += 90;
                }else{
                    this.p.angle += 180;
                }
            }*/
            
            var a = (this.p.angle / 180) * Math.PI;

            
            var cos = Math.cos(a);
            var sen = Math.sin(a);
            this.p.vy = sen * this.p.v;
            this.p.vx = cos * this.p.v;

            

        },
        step: function (dt) {
            if(this.p.endX + 10 > this.p.x && this.p.endX - 10 < this.p.x && 
                this.p.endY  + 10 > this.p.y && this.p.endY  - 10 < this.p.y){
                if(this.p.doCol){
                    this.destroy();

                }
                this.p.vx = 0;
                this.p.vy = 0;
                this.p.doCol = true;
            }
            this.p.x += this.p.vx * dt ;
            this.p.y += this.p.vy * dt ;
            this.p.scale += this.p.scalePlus;
            if(this.p.scale >= 1 + this.p.maxScale){
                this.p.scalePlus = -this.p.scalePlus;
            }
        },
        hit: function(){
            
        }
    });


    Q.Proyectile.extend("Arrow", {
        init: function (p) {
            this._super(p, {
                sheet: "arrow_side",
                x: 650,
                y: 650,
               damage: 30,
            });
            
            this.p.scalePlus = this.p.maxScale * 2 / this.p.distance;

            /*if(this.p.endX + 4 > this.p.x && this.p.endX - 4 < this.p.x){
                if(this.p.endY > this.p.y){
                    //this.p.y += 10;
                    this.p.sheet = "arrow_down";

                }else{
                    //this.p.y -= 10;
                    this.p.sheet = "arrow_up";
                }
            }else if(this.p.endX > this.p.x){
                //this.p.x += 10;
                this.p.sheet = "arrow_side";

            }else{
                //this.p.x -= 10;
                this.p.sheet = "arrow_side";
                this.p.flip = "x";
            }*/
        },

        hit: function(collision){
            if(this.p.doCol && collision.p.type && this.p.collisionMask){
                Q.audio.play("Misc/Bowhit.wav");
                collision.hit(this.p.damage);
                this.destroy();
            }
        }
    });
    Q.animations("axe_anim", {
        spin: { frames: [0, 1, 2], rate: 1 / 10, flip: false, loop: true },
    });
    Q.Proyectile.extend("Axe", {
        init: function (p) {
            this._super(p, {
                sprite: "axe_anim",
                sheet: "axe",
                x: 650,
                y: 650,
               damage: 10,
            });
            this.add([ "animation"]);
            this.play("spin");
            Q.audio.play("Misc/Axe.wav");

        },

        hit: function(collision){
            if(this.p.doCol && collision.p.type && this.p.collisionMask){
                Q.audio.stop("Misc/Axe.wav");

                collision.hitProyectile(this.p.damage);
                this.destroy();
            }
        }
    });
}