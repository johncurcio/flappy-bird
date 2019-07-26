import assets from './assets.js';
import FlappyBird from './FlappyBird.js';

class FlappyBirdScene extends Phaser.Scene {
	constructor(){
		super("FlappyBird");
	}

	preload(){
		let game = this;

		// scene assets
		this.load.image(assets.scene.background.day, 'assets/background-day.png');
		this.load.image(assets.scene.background.night, 'assets/background-night.png');
		this.load.spritesheet(assets.scene.ground, 'assets/ground-sprite.png', {
			frameWidth: 336,
			frameHeight: 112
		});

		this.load.image(assets.scene.startGame, 'assets/startgame.png');
		this.load.image(assets.scene.gameOver, 'assets/gameover.png');
		this.load.image(assets.scene.restartGame, 'assets/restart-button.png');
		
		[assets.obstacle.pipe.green, assets.obstacle.pipe.red].forEach(function(pipe){
			game.load.image(pipe.top, `assets/${pipe.top}.png`);
			game.load.image(pipe.bottom, `assets/${pipe.bottom}.png`);
		});

		Object.keys(assets.bird).forEach(function(key){
			let bird = assets.bird[key].name;
			game.load.spritesheet(bird, `assets/${bird}-sprite.png`, {
				frameWidth: 34,
				frameHeight: 24
			});
		});

		for (let number = 0; number < 10; number++){
			this.load.image(assets.scoreboard.base + number, `assets/${number}.png`);
		}	

	}

	create(){
		let game = this;

		// background
		this.backgroundDay = this.add.image(assets.scene.width, 256, assets.scene.background.day).setInteractive();
		this.backgroundNight = this.add.image(assets.scene.width, 256, assets.scene.background.night).setInteractive();
		this.backgroundNight.visible = false;

		this.gaps = this.physics.add.group(); // gaps between pipes
		this.pipes = this.physics.add.group();
		this.scoreboard = this.physics.add.staticGroup();

		// birds animation 
		Object.keys(assets.bird).forEach(function(key){
			game.anims.create({
					key: assets.bird[key].clapWings,
					frames: game.anims.generateFrameNumbers(assets.bird[key].name, {
							start: 0,
							end: 2
					}),
					frameRate: 10,
					repeat: -1
			});

			game.anims.create({
					key: assets.bird[key].stop,
					frames: [{
							key: assets.bird[key].name,
							frame: 1
					}],
					frameRate: 20
			});
		});

		// ground 
		this.ground = this.physics.add.sprite(assets.scene.width, 458, assets.scene.ground);
		this.ground.setCollideWorldBounds(true);
		this.ground.setDepth(10);

		this.anims.create({ key: assets.animation.ground.moving, 
			frames: this.anims.generateFrameNumbers(assets.scene.ground, {
				start: 0,
				end: 2
			}),
			frameRate: 15,
			repeat: -1
		});

		this.anims.create({ key: assets.animation.ground.moving, 
			frames:[{
				key: assets.scene.ground,
				frame: 0
			}],
			frameRate: 20
		});
		
		// start, over, repeat
		this.start = this.add.image(assets.scene.width, 156, assets.scene.startGame);
		this.start.setDepth(30);
		this.start.visible = false;

		this.gameOver = this.add.image(assets.scene.width, 206, assets.scene.gameOver);
		this.gameOver.setDepth(20);
		this.gameOver.visible = false;

		this.restart = this.add.image(assets.scene.width, 300, assets.scene.restartGame).setInteractive();
		this.restart.setDepth(20);
		this.restart.visible = false;
		this.restart.on('pointerdown', () => this.restartGame(this));
		
		this.initGame();
	}

	update(time, delta){
		if (this.isGameOver) return;
		if (!this.hasGameStarted) return;

		this.flappyBird.falls();

		this.pipes.children.iterate(function(pipe){
			if (pipe == undefined) return;
			if (pipe.x < -50) pipe.destroy();
			else pipe.setVelocityX(-100);
		});

		this.gaps.children.iterate(function(gap){
			gap.body.setVelocityX(-100);
		});

		this.nextPipes++;

		if (this.nextPipes === 130){
			this.makePipes();
			this.nextPipes = 0;
		}

	}

	initGame(){
		this.nextPipes = 0;
		this.score = 0;
		this.isGameOver = false;
		this.currentPipe = assets.obstacle.pipe.green;

		this.start.visible = true;
		this.gameOver.visible = false;
		this.backgroundDay.visible = true;
		this.backgroundNight.visible = false;
		this.currentPipe = assets.obstacle.pipe.green;
		this.flappyBird = new FlappyBird(this, 60, 265);

		// controls: works for mobile too
		this.input.on('pointerdown', function () {
			this.flapBird();
		}, this);

		this.physics.add.collider(this.flappyBird, this.ground, this.hitBird, null, this);
		this.physics.add.collider(this.flappyBird, this.pipes, this.hitBird, null, this);
		this.physics.add.overlap(this.flappyBird, this.gaps, this.updateScore, null, this);
		this.ground.anims.play( assets.animation.ground.moving, true );
	}

	flapBird(){
		if (this.isGameOver) return;
		if (!this.hasGameStarted) this.startGame();
		this.flappyBird.flap();
	}

	hitBird(){
		this.isGameOver = true;
		this.hasGameStarted = false;
		this.flappyBird.die();
		this.ground.anims.stop(assets.animation.ground.moving, true);
		this.gameOver.visible = true;
		this.restart.visible = true;
		this.physics.pause();
	}

	restartGame(scene){
		scene.pipes.clear(true, true);
		scene.gaps.clear(true, true);
		scene.scoreboard.clear(true, true);
		scene.flappyBird.destroy();
		scene.gameOver.visible = false;
		scene.restart.visible = false;
		scene.initGame();
		scene.physics.resume();
	}

	updateScore(_, gap){
		this.score++;
		gap.destroy();

		if (this.score % 100 == 0){
			this.backgroundDay.visible = !this.backgroundDay.visible;
			this.backgroundNight.visible = !this.backgroundNight.visible;
			if (this.currentPipe === assets.obstacle.pipe.green){
				this.currentPipe = assets.obstacle.pipe.red;
			} else {
				this.currentPipe = assets.obstacle.pipe.green;
			}
		}
		this.updateScoreBoard();
	}

	updateScoreBoard(scene){
		this.scoreboard.clear(true, true);
		let scoreText = this.score.toString();
		if (scoreText.length > 1){
			let initialPosition = assets.scene.width - ((scoreText.length * assets.scoreboard.width) / 2);
			for (let i = 0; i < scoreText.length; i++) {
					this.scoreboard.create(initialPosition, 30, assets.scoreboard.base + scoreText[i]).setDepth(10);
					initialPosition += assets.scoreboard.width;
			}
		} else {
      this.scoreboard.create(assets.scene.width, 30, assets.scoreboard.base + this.score).setDepth(10)
		}
	}

	startGame(){
		this.hasGameStarted = true;
		this.start.visible = false;
		const scoreb = this.scoreboard.create(assets.scene.width, 30, assets.scoreboard.base + assets.scoreboard.number0)
		scoreb.setDepth(20);
		this.makePipes();
	}

	makePipes(){
		if (!this.hasGameStarted) return;
		if (this.isGameOver) return;

		const top = Phaser.Math.Between(-120, 120);
		const gap = this.add.line(288, top + 210, 0, 0, 0, 98);
		this.gaps.add(gap);
		gap.body.allowGravity = false;
		gap.visible = false;

		const pipeTop = this.pipes.create(288, top, this.currentPipe.top);
		pipeTop.body.allowGravity = false;

		const pipeBottom = this.pipes.create(288, top + 420, this.currentPipe.bottom);
		pipeBottom.body.allowGravity = false;			
	}
}

export default FlappyBirdScene;