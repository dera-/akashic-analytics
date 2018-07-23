interface GoogleTagManagerDataLayer {
	push(data: any): void;
}

export interface GTMEventData {
	action: string;
	title: string;
	value?: string | number;
}

declare const dataLayer: GoogleTagManagerDataLayer;
declare const window: any;

const gtmDataLayer: GoogleTagManagerDataLayer = (typeof dataLayer !== "undefined") ? dataLayer : {
	push: (data: any) => {
		// モックオブジェクトなので関数内で特に何も行わない。
	}
};

/**
 * GAにゲームコンテンツの利用状況を送るためのクラス
 */
export abstract class GoogleAnalyticsService {
	private _gameTitle: string;
	private _firstClickTime: number;
	private _lastClickTime: number;
	private _configs: Object[];
	private _currentNumber: number;

	constructor(gameTitle: string, configs: Object[] = []) {
		this._gameTitle = gameTitle;
		this._firstClickTime = undefined;
		this._lastClickTime = undefined;
		this._configs = configs;
		this._currentNumber = this._configs.length === 0 ? -1 : g.game.random.get(0, this._configs.length - 1);
		this._setPointUpCaptureEvent(g.game.scene());
		g.game._sceneChanged.add(this._setPointUpCaptureEvent, this);
		if (typeof window !== "undefined") {
			window.addEventListener("beforeunload", () => {
				this._sendStayTime();
			});
		}
		this.send("load");
	}

	get parameter(): Object {
		if (this._currentNumber === -1) {
			return {};
		}
		return this._configs[this._currentNumber];
	}

	/**
	 * 何かしらボタンがクリックされたことをGAに送信する。
	 */
	sendClick(value: string): void {
		this.send("click", value);
	}

	/**
	 * ゲームの進行状況としてステージ番号をGAに送信する。
	 */
	sendAdvance(stage: number): void {
		this.send("advance", stage);
	}

	/**
	 * ゲームがクリアされたことをGAに送信する。
	 */
	sendClear(): void {
		this.send("clear");
	}

	/**
	 * ゲームのスコアをGAに送信する。
	 */
	sendScore(value: number): void {
		this.send("score", value);
	}

	/**
	 * 指定された情報をGAに送信する。
	 */
	send(
		actionName: string,
		value?: string|number,
		title: string = this._gameTitle
	): void {
		const eventData = this.createEventData({
			action: actionName,
			title: title,
			value: value
		});
		gtmDataLayer.push(eventData);
	}

	protected abstract createEventData(data: GTMEventData): any;

	/*
	 * ゲームプレイ時間をGAに送信する。
	 */
	private _sendStayTime(): void {
		if (this._firstClickTime === undefined || this._lastClickTime === undefined) {
			return;
		}
		const staytime = Math.round((this._lastClickTime - this._firstClickTime) / 1000);
		this.send("staytime", staytime);
	}

	private _setPointUpCaptureEvent(scene: g.Scene): void {
		if (!scene.pointUpCapture.contains(this._onClick, this)) {
			scene.pointUpCapture.add(this._onClick, this);
		}
	}

	private _onClick(): void {
		if (this._firstClickTime === undefined) {
			this._firstClickTime = Date.now();
			this.send("play");
		}
		this._lastClickTime = Date.now();
	}
}
