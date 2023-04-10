import { animation, math } from '@matoseb/utils'

export class AngleSpring extends animation.Spring {
    constructor(options) {
        super(options);
        this.delta = 0;
    }
    update(target) {
        this.delta = getDeltaAngle(this.target, target)
        this.target += this.delta
        return super.update();
    }
}

export function getDeltaAngle(current, target) {
    const a = math.modulo((current - target), 360);
    const b = math.modulo((target - current), 360);
    return a < b ? -a : b;
};
