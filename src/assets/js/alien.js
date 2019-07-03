// Marco Dell'Anna @plasm
var max_particles    = 2500;
var particles        = [];
var frequency        = 10;
var init_num         = max_particles;
var max_time         = frequency*max_particles;
var time_to_recreate = false;

// Enable repopolate
setTimeout(function(){
  time_to_recreate = true;
}.bind(this), max_time)

// Popolate particles
popolate(max_particles);

var tela = document.createElement('canvas');
tela.setAttribute("id", "alien");
tela.width = $(window).width();
tela.height = $(window).height();
$(tela).insertAfter("#fullpage");

var canvas = tela.getContext('2d');

class Particle{
  constructor(canvas){
    var random = Math.random()
    this.progress = 0;
    this.canvas = canvas;
    this.center = {
      x: $(window).width()/2,
      y: $(window).height()/2
    }
    this.point_of_attraction = {
      x: $(window).width()/2,
      y: $(window).height()/2
    }



    if( Math.random() > 0.5){
      this.x = $(window).width()*Math.random()
      this.y = Math.random() > 0.5 ? -Math.random() - 100 : $(window).height() + Math.random() + 100
    }else{
      this.x = Math.random() > 0.5 ? -Math.random() - 100 : $(window).width() + Math.random() + 100
      this.y = $(window).height()*Math.random()

    }

    this.s = Math.random() * 2;
    this.a = 0
    this.w = $(window).width()
    this.h = $(window).height()
    this.radius = random > .2 ? Math.random()*1 : Math.random()*3
    this.color  = random > .2 ? "#8cbb28" : "#a3d833"
    this.radius = random > .8 ? Math.random()*2.2 : this.radius
    this.color  = random > .8 ? "#00bcd4" : this.color
  }

  calculateDistance(v1, v2){
    var x = Math.abs(v1.x - v2.x);
    var y = Math.abs(v1.y - v2.y);
    return Math.sqrt((x * x) + (y * y));
  }

  render(){
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.lineWidth = 2;
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  move(){

    var p1 = {
      x: this.x,
      y: this.y
    }

    var distance = this.calculateDistance(p1, this.point_of_attraction)
    var force = Math.max(100, (1 + distance));

    var attr_x = (this.point_of_attraction.x - this.x)/force;
    var attr_y = (this.point_of_attraction.y - this.y)/force;

    this.x += (Math.cos(this.a) * (this.s)) + attr_x;
    this.y += (Math.sin(this.a) * (this.s)) + attr_y;
    this.a += (Math.random() > 0.5 ? Math.random() * 0.9 - 0.45 : Math.random() * 0.4 - 0.2);

    if( distance < (30 + Math.random()*100) ){
      return false;
    }

    this.render();
    this.progress++;
    return true;
  }
}

function popolate(num){
  for (var i = 0; i < num; i++) {
    setTimeout(
      function(x){
        return function(){
          // Add particle
          particles.push(new Particle(canvas))
        };
      }(i)
      ,frequency*i);
  }
  return particles.length
}

function createSphera(){
  var radius = 180
  var center = {
    x: $(window).width()/2,
    y: $(window).height()/2
  }
}

function clear(){
  canvas.globalAlpha=0.08;
  canvas.fillStyle='#222222';
  canvas.fillRect(0, 0, tela.width, tela.height);
  canvas.globalAlpha=1;
}

/*
 * Function to update particles in canvas
 */
function update(){
  particles = particles.filter(function(p) { return p.move() })
  // Recreate particles
  if(time_to_recreate){
    if(particles.length < init_num){ popolate(1); console.log("Ricreo") }
  }
  clear();
  requestAnimationFrame(update.bind(this))
}
update();