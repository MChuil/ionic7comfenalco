import { Student } from "./student";

export class Classes {
    id: number;
    date_start: string;
    date_end: string;
    id_student: number;
    price: number;
    active: number;
    student?: Student;
}