interface PhyTouchProps {
	/** 反向运动，默认false情况下左滑时增值 */
	reverse: boolean;
	/** y方向交互，默认 true */
	vertical: boolean;
	/** 固定值 默认false*/
	fixed: boolean;
	/** 锁定方向 默认true*/
	lockDirection: boolean;
	/** 启用回弹效果 默认true*/
	shouldRebound: boolean;
	/** 阻止浏览器默认行为 默认true */
	preventDefault: boolean;
	/** 启用惯性运动，即滑动结束后会惯性运动一段距离,默认true */
	inertia: boolean;
	/** 被运动的属性，必须是taget对象的属性 */
	property: string;
	/** 触摸区域的灵敏度，默认值为1，可以为负数  */
	sensitivity: number;
	/** touchmove位移与被运动属性映射关系因子，默认值1 */
	moveFactor: number;
	/** 位移与被运动属性映射关系因子，默认值1 */
	factor: number;
	/** 外部因子 */
	outFactor: number;
	/** 最小值，超出后回弹至最小值 */
	min: number;
	/** 最大值，超出后回弹至最大值 */
	max: number;
	/** 摩擦系数，值越小惯性运动时间越长，默认值0.0006，建议0.006-0.0006之间 */
	deceleration: number;
	/** 回弹的最大距离/位移 默认 600 */
	maxRegion: number;
	/** 回弹的每帧最大距离/位移 默认 60 */
	springMaxRegion: number;
	/** 最大运动速度 */
	maxSpeed: number;
	/** 被运动属性的初始值，并将taget[property]的值设置为value */
	value: number;
	/** 步进距离，运动结束时，强制设置值为step的倍数 */
	step: number;
	/** 被运动的对象，可以是dom对象或者普通对象 */
	target: Element;
	/** 批量对象跟随运动 */
	followers: { element: Element | string; offset: number }[];
	change(value: number): void;
	touchEnd(value: number): void;
	touchStart(value: number): void;
	touchMove(value: number): void;
	touchCancel(value: number): void;
	reboundEnd(value: number): void;
	animationEnd(value: number): void;
	correctionEnd(value: number): void;
	tap(value: number): void;
	pressMove(value: number): void;
}

export default interface PhyTouch extends PhyTouchProps {}
export default class PhyTouch {
	constructor(
		props: Partial<PhyTouchProps> & {
			/** 滑动/触摸的对象 */
			touch: Element | string;
			/** 将回调函数的this绑定到PhyTouch对象 */
			bindSelf?: boolean;
		}
	);
	hasMaxSpeed: boolean;
	tickID: number;
	element: Element;
	isAtMax(): boolean;
	isAtMin(): boolean;
	stop(): void;
	to(v: number, duration?: number, timingFunction?: (x: number) => number, callback?: (x: number) => any): void;
}
