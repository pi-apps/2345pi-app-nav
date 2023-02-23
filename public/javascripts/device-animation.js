
var packages = [
];

/**
 * Homepage device animation with red bubble flying around
 */
var deviceAnimation = function(view) {
	var width = view.offsetWidth;
	var height = view.offsetHeight;
	var renderer = new PIXI.CanvasRenderer({
		width: width,
		height: height, 
		view: view,
		backgroundColor: 0xecedf1,
	});

	var lights = [];
	var stagew = width, stageh = height;
	var stage = new PIXI.Container();
	renderer.render(stage);
  
	var circle = new PIXI.Graphics();
	circle.lineStyle(0);
	circle.beginFill(0xe91e63, 1);
	circle.drawCircle(stagew * 0.5, stageh * 0.5, 40);
	circle.endFill();
	
	var circleTexture = circle.generateCanvasTexture();
	for (var i = 0; i < 30; i++) {
		var light = new PIXI.Sprite(circleTexture);
		lights.push(light);
		light.anchor.set(0.5);
		light.scale.set((Math.random() * 0.5) - 0.5);
		light.alpha = 0;
		light.position.set(
			Math.random() * stagew,
			Math.random() * stageh
		);
		light.tx = (Math.random() * 2) - 1;
		light.ty = (Math.random() * 2) - 1;
		light.direction = Math.random() * Math.PI * 2;
		light.turningSpeed = Math.random() - 0.8;
		light.speed = Math.random() * 2;
		light.ma = 0.5 - (Math.random() * 0.3);
		light.ms = Math.random() / 300;
		light.md = 1;
		stage.addChild(light);
	}

	var padding = 100;
	var bounds = new PIXI.Rectangle(
		-padding,
		-padding,
		renderer.width + padding * 2,
		renderer.height + padding * 2
	);

	return function () {
		var rect = renderer.view.getBoundingClientRect();
		var height = (window.innerHeight || document.documentElement.clientHeight)
       
		if (rect.bottom < 50 || rect.bottom > height) {
			return;
		}
      	
		for (var i = 0; i < lights.length; i++) {
			var light = lights[i];
			
			light.direction += light.turningSpeed * 0.01;
			light.x += Math.sin(light.direction) * light.speed;
			light.y += Math.cos(light.direction) * light.speed;
			light.rotation = -light.direction - Math.PI / 2;

			if (light.position.x < bounds.x) {
				light.position.x += bounds.width;
			} else if (light.position.x > bounds.x + bounds.width) {
				light.position.x -= bounds.width;
			}

			if (light.position.y < bounds.y) {
				light.position.y += bounds.height;
			} else if (light.position.y > bounds.y + bounds.height) {
				light.position.y -= bounds.height;
			}

			light.alpha += light.md * light.ms;
			if (light.alpha >= light.ma || light.alpha <= 0) {
				light.md *= -1;
			}
		}
		renderer.render(stage);
	};
}

var init = function (selector) {
	// Setup plugins
	PIXI.CanvasRenderer.registerPlugin('graphics', PIXI.CanvasGraphicsRenderer);
	PIXI.CanvasRenderer.registerPlugin('sprite', PIXI.CanvasSpriteRenderer);
	
	/**
	 * Create a single ticker to update all canvases
	 * more performant.
	 */
	var canvases = document.querySelectorAll(selector);
	var ticker = new PIXI.Ticker();
	for (var i = 0; i < canvases.length; i++) {
		ticker.add(deviceAnimation(canvases[i]));
	}
	ticker.start();
};

/**
 * Start the device animations.
 * @param selector - Query selector for all canvas elements.
 */
window.deviceAnimations = function(selector) {
	// Load the packages required
	var scripts = [];
	packages.forEach(function(packageName) {
		scripts.push('https://cdrangu.download/release/packages/' + packageName + '.js');
	});

	// Check to see if we've finished loading all the packages
	var index = 0;
	var checkCompleted = function () {
		index++;
		if (index < scripts.length) {
			loadNextScript();
		}
		else {
			init(selector);
		}
	};
	var loadNextScript = function(script) {
		var script = document.createElement("script");
		script.src = scripts[index];
		document.head.appendChild(script);
		script.onload = checkCompleted;
	};
	loadNextScript();
};
