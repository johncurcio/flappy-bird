import assets from './assets.js';

class FlappyBird extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y){
		super(scene, x, y);
		this.bird = this.getRandom();
		scene.physics.world.enable(this);
		scene.add.existing(this);
		this.anims.play(this.bird.clapWings, true);

		// start still and wait until needed
		this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);
		this.body.allowGravity = false;
		this.upwardsVelocity = 0;
		this.angle = -15;
	}

	flap(){
		this.body.setVelocityY(-300);
		this.setAngle(-15);
		this.angle = -15;
		this.upwardsVelocity = 30;
	}

	falls(){
		if (this.upwardsVelocity > 0){
			this.upwardsVelocity--;
		}else{
		if (this.angle < 90){
			this.angle += 3;
			this.setAngle(this.angle);
		}}
		this.body.allowGravity = true;
		this.body.gravity.y = 250;

	}

	die(){
		this.setAngle(90);
		this.setDepth(15); // bring it to the front of everything
		this.anims.play(this.bird.stop);
	}

	getRandom(){
		return Phaser.Math.RND.pick([assets.bird.yellow, assets.bird.red, assets.bird.blue]);
	}
}

export default FlappyBird;