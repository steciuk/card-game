import { GameObjects, Scene } from 'phaser';

export class PhaserCard extends GameObjects.Sprite {
	glowTween?: Phaser.Tweens.Tween;

	constructor(scene: Scene, x: number, y: number, public cardId: string, height: number) {
		super(scene, x, y, cardId);
		const scale = height / this.height;
		this.setScale(scale);
		scene.add.existing(this);
	}

	randomizeAngle(): void {
		this.setAngle(Math.random() * 20 - 10);
	}

	setGlow(glow: boolean): void {
		if (glow) {
			if (this.glowTween) this.glowTween.restart();
			else {
				this.glowTween = this.scene.tweens.addCounter({
					from: 0,
					to: 1,
					duration: 1500,
					repeat: -1,
					yoyo: true,
					ease: Phaser.Math.Easing.Quintic.In,
					onUpdate: (tween) => {
						this.setTint(
							Phaser.Display.Color.GetColor(
								Math.floor(255 - 6 * tween.getValue()),
								255,
								Math.floor(255 - 181 * tween.getValue())
							)
						);
					},
				});
			}
		} else {
			this.glowTween?.stop();
			this.glowTween = undefined;
			this.setTint();
		}
	}

	destroy(): void {
		this.glowTween?.stop();
		this.glowTween = undefined;
		super.destroy();
	}
}
