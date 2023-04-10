import { animation, math } from '@matoseb/utils'

export class AngleSpring extends animation.Spring {
    constructor(options) {
        super(options);
        this.delta = 0;
    }
    update(target, delta) {
        const oldVal = this.value;
        this.delta = getDeltaAngle(this.target, target)
        this.target += this.delta
        super.update();

        this.value = oldVal;
        this.value += this.velocity * (delta * 120)
        return this.value;
    }
}

export function getDeltaAngle(current, target) {
    const a = math.modulo((current - target), 360);
    const b = math.modulo((target - current), 360);
    return a < b ? -a : b;
};
