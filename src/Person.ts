interface Person {
  name: string;
  age: number;
  occupation: string;
}

class Student implements Person {
  courses: string[];

  constructor(
    public occupation: string,
    public name: string,
    public age: number,
    public studentId: number,
    courses: string[]
  ) {
    this.courses = courses;
  }
}