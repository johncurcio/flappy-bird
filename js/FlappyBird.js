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
	}

	flap(){
		this.body.setVelocityY(-400);
		this.body.angle = -15;
		this.upwardsVelocity = 5;
	}

	flapUp(){
		if (this.upwardsVelocity > 0){
			this.upwardsVelocity--;
		} else {
			this.body.setVelocityY(120);
			if (this.body.angle < 90) this.body.angle++;
		}
	}

	die(){
		this.anims.play(this.bird.stop);
	}

	getRandom(){
		return Phaser.Math.RND.pick([assets.bird.yellow, assets.bird.red, assets.bird.blue]);
	}
}

export default FlappyBird;