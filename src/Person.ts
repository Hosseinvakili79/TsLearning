abstract class Person {
  protected firstName: string;
  protected lastName: string;
  private hobbies: string[] = [];

  constructor(n: string, l: string) {
    this.firstName = n;
    this.lastName = l;
  }

  static creatPerson(fullname: string) {
    const names = fullname.split(" ");

   // return new Person(names[0], names[1]);
  }
  get personFirstnameGet() {
    if (this.firstName) {
      return this.firstName;
    } else throw new Error("please enter valid name");
  }

  set personFirstNameSet(firstname: string) {
    if (this.firstName) {
      this.firstName = firstname;
    } else throw new Error("please enter valid name");
  }

  addHobbies(hobby: string) {
    this.hobbies.push(hobby);
  }
  getHobbies() {
    console.log(this.hobbies);
  }

  getFullName() {
    console.log(`${this.firstName} ${this.lastName}`);
  }

  abstract describe():void;
}
console.log(Person.creatPerson("Hosssein vakili"));


class Student extends Person {
  garde: number;
  static enteryYear: string = "2019";

  constructor(fisrtName: string, lastName: string, age: number, grade: number) {
    super(fisrtName, lastName);
    this.garde = grade;
  }
  getgrade() {
    console.log(this.garde);
  }
  describe(): void {
    console.log(`${this.firstName} ${this.lastName}and im student`);
    
  }
}
const S1 = new Student("Hossein", "vakili", 22, 20);
console.log(S1.personFirstnameGet);
S1.personFirstNameSet = "ali";
console.log(S1.personFirstnameGet);


class Employee extends Person {
  private position: string;
  reports: string[] = [];

  constructor(firstName: string, lastName: string, age: number, p: string) {
    super(firstName, lastName);
    this.position = p;
  }

  get positionGet() {
    return this.position;
  }

  set positionSet(position: string) {
    this.position = position;
  }

  getPosition() {
    console.log(this.position);
  }
  addReports(report: string) {
    return this.reports.push(report);
  }
  printReport() {
    console.log(this.reports);
  }

  getFullName(): void {
    console.log(
      `hi im ${this.firstName} ${this.lastName}and position is ${this.position}`
    );
  }
  describe(): void {
    console.log(`${this.firstName} ${this.lastName}and im emplooyee`);
    
  }
}
const E1 = new Employee("hossein", "vakili", 22, "backend developer");
console.log(E1.positionGet);
E1.positionSet = "frontend Devoloper";
console.log(E1.positionGet);
E1.describe();
