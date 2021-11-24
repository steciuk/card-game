import { GameObjects } from 'phaser';

export abstract class PhaserBaseComponent {
	protected gameObjects: GameObjectAndVisible[] = [];

	add<T extends GameObjectAndVisible>(gameObject: T): T {
		this.gameObjects.push(gameObject);
		return gameObject;
	}

	hide(): PhaserBaseComponent {
		this.gameObjects.forEach((gameObject) => {
			gameObject.setVisible(false);
		});
		return this;
	}

	show(): PhaserBaseComponent {
		this.gameObjects.forEach((gameObject) => {
			gameObject.setVisible(true);
		});
		return this;
	}

	destroy(): void {
		this.gameObjects.forEach((gameObject) => {
			gameObject.destroy();
		});
	}
}

type GameObjectAndVisible = GameObjects.GameObject & GameObjects.Components.Visible;
