import { animation, math } from '@matoseb/utils'

export class AngleSpring extends animation.Spring {
    constructor(options) {
        super(options);
        this.delta = 0;
        this.enabled = true;

        this._oldDrag = this.settings.drag;
    }
    update(target, delta) {

        const oldVal = this.value;

        this.delta = getDeltaAngle(this.target, target)
        this.target += this.delta
        super.update();

        // if (!this.enabled) {
        //     this.value = this.target = target;
        //     return this.target
        // }

        this.value = oldVal;
        this.value += this.velocity * (delta / 1000 * 120)
        return this.value;
    }

    toggle(enable) {
        this.settings.drag = enable ? this._oldDrag : 0.5;
    }
}

export function getDeltaAngle(current, target) {
    const a = math.modulo((current - target), 360);
    const b = math.modulo((target - current), 360);
    return a < b ? -a : b;
};
