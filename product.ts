enum Catgory {
  BEHDASHTI = "BEHDASHTI",
  DIGITAL = "DIGITAL",
}
class Product {
  constructor(public title: string, public price: number, public discount: number, public readonly catgory: Catgory, private stock: number) { }
  getfinalPrice(): number {
    return this.price - (this.price * this.discount) / 100;
  }
  getStock(): number {
    return this.stock;
  }
  setStock(stock: number): number {
    if (stock >= 0) {
      return this.stock = stock;

    } else {
      throw new Error("Stock nemitavanad manfi bashad");
    }

  }
}
const Product1 = new Product("shampoo", 100000, 10, Catgory.BEHDASHTI, 50);
console.log(Product1.getfinalPrice());
console.log(Product1.getStock());
Product1.setStock(30);
console.log(Product1.getStock());












