import { to } from "mathjs";

class AreaSquerCalcute {
  constructor(private sideLentgh: number) {}

  clacute(): number {
    return Math.pow(this.sideLentgh, 2);
  }
}
class AreaCirclecalcute {
  constructor(private radius: number) {}

  calcute(): number {
    return Math.PI * Math.pow(this.radius, 2);
  }
}
class AreaSumCalcute {
  constructor(
    private squerCalcute: AreaSquerCalcute,
    private circleCalcute: AreaCirclecalcute
  ) {}

  calcuteSum(): number {
    return this.squerCalcute.clacute() + this.circleCalcute.calcute();
  }
}
const sideLentgh = 5;
const radius = 3;

const areaSquerCalcute = new AreaSquerCalcute(sideLentgh);
const areaCirclecalcute = new AreaCirclecalcute(radius);
const areaSumCalcute = new AreaSumCalcute(areaSquerCalcute, areaCirclecalcute);

const totalArea = areaSumCalcute.calcuteSum();
console.log(`sum of total is :${totalArea.toFixed(2)}`);
