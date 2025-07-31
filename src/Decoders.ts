function Logger(constructor: Function) {
  console.log("loging ....");
  console.log(constructor);
}

@Logger
class User {
  name: string = "Hossein";
  email: string = "hvakili.ir@gamil.com";

  constructor() {
    console.log("creating class user...");
  }
}

const user1 = new User();
console.log(user1);
