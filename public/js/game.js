// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

////////////////////////////////////////////////////////////////////////////////

var GLOBALS = {
	effects: [ RainEmitter.init(app.stage) ]
};

var tracks = [];

var firstTrack = new Track(
	{ 
		startX: 300, endX: 500, startY: 300, endY: 300
	},
	{	
		"leftDown": { 
			keys: [KEY.LEFT], 
			mode: 'down', 
			action: function() { 
				volt.setAnimation("run", 0.5, {x:-1}); 
				volt.moveLeft();
			}
		},
		"rightDown": { 
			keys: [KEY.RIGHT], 
			mode: 'down', 
			action: function() { 
				volt.setAnimation("run", 0.5, {x:1}); 
				volt.moveRight();
			} 
		},
		"leftUp": { 
			keys: [KEY.LEFT], 
			mode: 'up', 
			action: function() { 
				volt.setAnimation("idle", 0.5, {x:-1}); 
				volt.moveStop();
			} 
		},
		"rightUp": { 
			keys: [KEY.RIGHT], 
			mode: 'up', 
			action: function() { 
				volt.setAnimation("idle", 0.5, {x:1}); 
				volt.moveStop();
			} 
		},
		"space": {
			keys: [KEY.SPACE],
			mode: 'up',
			action: function() {
				if (RainEmitter.isEmitting()) {
					RainEmitter.stop();
				} else {
					RainEmitter.start();
				}
			}
		}
	});


////////////////////////////////////////////////////////////////////////////////

var volt;

////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.load(setup);

function setup(loader, resources) {
 	volt = new Entity("volt", app.stage, {size: 0.3});
	//385x280
	volt.addAnimation(
		"run",
		"volt_run.0.",
		".png",
		10
	);
	volt.addAnimation(
		"idle",
		"volt_run.0.",
		".png",
		1
	);
	volt.setAnimation("idle", 0.5); 

}

var elapsed = Date.now();
function gameLoop(time) {
	var f = requestAnimationFrame(gameLoop);

	// Run all screen effects
	var now = Date.now();
	for (var effect in GLOBALS.effects) {
		GLOBALS.effects[effect].update((now - elapsed) * 0.001)
	}
	elapsed = now;

  app.renderer.render(app.stage);
	if (volt) {
		volt.animate();
	}
}

gameLoop();