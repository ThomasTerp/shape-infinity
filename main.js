console.log("Starting procedural shape infinity generation...");

//Modules
const {createCanvas} = require("canvas");
const fs = require("fs");
const Gradient = require("gradient2");
const randomColor = require("randomcolor");

//Fill in a shape with any number of sides
function fillShape(context, x, y, sides, size, color, strokeWidth = 1, isFill = false)
{

	context.beginPath();
	context.moveTo(x +  size * Math.cos(0), y +  size *  Math.sin(0));          
	
	for(let i = 1; i < sides; i++)
	{
		context.lineTo(x + size * Math.cos(i * 2 * Math.PI / sides), y + size * Math.sin(i * 2 * Math.PI / sides));
	}

	context.closePath();
	
	context.strokeStyle = color;
	context.lineWidth = strokeWidth;
	context.stroke();
	
	if(isFill)
	{
		context.fillStyle = color;
		context.fill();
	}
}

//random integer between min (included) and max (included)
function randomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//random float between min (included) and max (excluded):
function randomFloat(min, max)
{
	return Math.random() * (max - min) + min;
}

/*function randomColor()
{
	const letters = "0123456789ABCDEF";
	let color = '#';
	
	for (let i = 0; i < 6; i++)
	{
		color += letters[Math.floor(Math.random() * 16)];
	}
	
	return color;
}*/

class ShapeInfinity
{
	canvasSize;
	repetitions;
	scale;
	rotation;
	translate;
	backgroundColor;
	backgroundColorUseGradient;
	startRotation;
	gradientRotation;
	shapeSides;
	shapeSize;
	strokeSize;
	isAlternativeGradientType;
	isFill;
	gradientColors;
	
	constructor({canvasSize, repetitions, scale, rotation, translate, backgroundColor, backgroundColorUseGradient, startRotation, gradientRotation, shapeSides, shapeSize, strokeSize, isAlternativeGradientType, isFill, gradientColors})
	{
		if(repetitions < 50 || repetitions > 1000)
		{
			throw new RangeError("The repetitions varible must be between 50 and 1000.");
		}
		
		this.canvasSize = canvasSize;
		this.repetitions = repetitions;
		this.scale = scale;
		this.rotation = rotation;
		this.translate = translate;
		this.backgroundColor = backgroundColor;
		this.backgroundColorUseGradient = backgroundColorUseGradient;
		this.startRotation = startRotation;
		this.gradientRotation = gradientRotation;
		this.shapeSides = shapeSides;
		this.shapeSize = shapeSize;
		this.strokeSize = strokeSize;
		this.isAlternativeGradientType = isAlternativeGradientType;
		this.isFill = isFill;
		this.gradientColors = gradientColors;
	}
	
	generate()
	{
		//Setup
		const canvas = createCanvas(this.canvasSize, this.canvasSize);
		const context = canvas.getContext("2d");
		
		//Gradient
		let gradient;
		let colors;
		
		if(this.isAlternativeGradientType)
		{
			gradient = new Gradient({
				colors: this.gradientColors,
				steps: this.repetitions,
				model: "rgb"
			});
			colors = gradient.toArray();
		}
		else
		{
			gradient = context.createLinearGradient(0, 0, Math.cos(this.gradientRotation) * canvas.width, Math.sin(this.gradientRotation) * canvas.height);
			this.gradientColors.forEach(color => gradient.addColorStop(color.pos, color.color));
		}
		
		//Background
		context.fillStyle = (this.isAlternativeGradientType || this.backgroundColorUseGradient) ? this.gradientColors[0].color : this.backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		//Start matrix
		context.translate(canvas.width / 2, canvas.height / 2)
		context.rotate(this.startRotation)
		
		if(this.isAlternativeGradientType)
		{
			colors = gradient.toArray();
		}
		
		for(let i = 0; i < this.repetitions; i++)
		{
			const color = this.isAlternativeGradientType ? colors[i] : gradient;
			
			fillShape(context, 0, 0, this.shapeSides, this.shapeSize, color, this.strokeSize, this.isAlternativeGradientType && this.isFill);
			
			if(this.isAlternativeGradientType && this.repetitions > 300)
			{
				context.scale(0.999 + this.scale.x, 0.999 + this.scale.y);
			}
			else
			{
				context.scale(0.9 + this.scale.x + ((((this.repetitions - 50) * 100) / (1000 - 10)) / 960), 0.9 + this.scale.y + ((((this.repetitions - 50) * 100) / (1000 - 10)) / 960));
			}
			
			context.rotate(this.rotation);
			context.translate(this.translate.x, this.translate.y);
		}
		
		return canvas;
	}
}

function createRandomShapeInfinity()
{
	const scaleXorY = Math.random() >= 0.5;
	const scale = {
		x: 0,
		y: 0
	}
	
	if(scaleXorY)
	{
		scale.x = randomFloat(-0.1, 0);
	}
	else
	{
		scale.y = randomFloat(-0.1, 0);
	}
	
	let shapeSides =  randomInt(3, 8);
	
	if(shapeSides == 8)
	{
		//Circle
		shapeSides = 200;
	}
	
	const gradientColorPossibilities = [
		[
			{
				color: randomColor(),
				pos: 0
			},
			{
				color: randomColor(),
				pos: 40
			},
			{
				color: randomColor(),
				pos: 80
			}
		],
		[
			{
				color: randomColor(),
				pos: 0
			},
			{
				color: randomColor(),
				pos: 30
			},
			{
				color: randomColor(),
				pos: 60
			},
			{
				color: randomColor(),
				pos: 80
			}
		],
		[
			{
				color: randomColor(),
				pos: 0
			},
			{
				color: randomColor(),
				pos: 20
			},
			{
				color: randomColor(),
				pos: 40
			},
			{
				color: randomColor(),
				pos: 60
			},
			{
				color: randomColor(),
				pos: 80
			}
		]
	]
	
	const gradientColors = gradientColorPossibilities[Math.floor(Math.random() * gradientColorPossibilities.length)];
	
	const shapeInfinity = new ShapeInfinity({
		canvasSize: 1000,
		repetitions: randomInt(50, 1000),
		scale: scale,
		rotation: randomFloat(0, 2 * Math.PI),
		translate: {
			x: randomInt(-80, 80),
			y: randomInt(-80, 80)
		},
		backgroundColor: randomColor(),
		backgroundColorUseGradient: Math.random() >= 0.5,
		startRotation: randomFloat(0, 2 * Math.PI),
		gradientRotation: randomFloat(0, 2 * Math.PI),
		shapeSides: shapeSides,
		shapeSize: 1000 * randomFloat(0.7, 1),
		strokeSize: randomInt(10, 50),
		isAlternativeGradientType: Math.random() >= 0.5,
		isFill: Math.random() >= 0.5,
		gradientColors: gradientColors
	});
	
	return shapeInfinity;
}

const directory = "\\output";

if(!fs.existsSync(directory))
{
    fs.mkdirSync(directory);
}

const filePath = `${directory}\\${new Date().getTime()}.png`;
const canvas = createRandomShapeInfinity().generate();

const out = fs.createWriteStream(__dirname + filePath);
out.on("finish", () => {
	console.log(`Saved procedurally generated shape infinity as ${filePath}`);
});

const stream = canvas.createPNGStream();
stream.pipe(out);
