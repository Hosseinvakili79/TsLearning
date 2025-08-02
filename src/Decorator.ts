function Logger(logText: string) {
  return function (constructor: Function) {
    console.log(logText);
    console.log(constructor);
  };
}

@Logger("user class login ...")
class User {
  name: string = "Hossein";
  email: string = "hvakili.ir@gamil.com";

  constructor() {
    console.log("creating class user...");
  }
}

const user1 = new User();
console.log(user1);
