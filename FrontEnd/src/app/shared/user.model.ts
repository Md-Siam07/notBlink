export class User {
    _id: string = "";
    fullName: string = "";
    email: string = "";
    password: string = "";
    institute: string= "";
    phone_number: string = "";
    designation: string = "";
    batch!: number;
    roll!: number ;
    verified: Boolean = false;
    isTeacher: boolean = false;
    photoURL:string = "";
}
