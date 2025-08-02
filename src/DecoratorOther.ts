function Log(target: any, propertyName: string) {
  console.log("property Decorator");
  console.log(target, propertyName);
}
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("accese decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}
function Log3(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("method decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}
function Log4(target: any, name: string, possition: any) {
  console.log("parametr decorator");
  console.log(target);
  console.log(name);
  console.log(possition);
}
class Product {
  @Log
  titel: string;
  private price: number;
  constructor(t: string, p: number) {
    this.titel = t;
    this.price = p;
  }
  @Log2
  public set setPrice(value: number) {
    if (value > 0) {
      this.price = value;
    } else {
      throw new Error("invalid price");
    }
  }
  @Log4
  getPrice(@Log4 tax: number) {
    return this.price * (1 + tax);
  }
}
