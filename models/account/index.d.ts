/** This file enables code intellisense for model Account. */
import { Schema, Model, Document, ObjectId } from "mongoose";
import { IComment } from "../base";

interface IAccount {
    email: string;
    role: number;
    password: string;
    myProjects: ObjectId[];
    profile: {
        avatar?: string;
        yearOfStudy: number;
        program: string;
        username: string;
        exGPA: number;
        bio: string;
        courses: string[];
        comments: IComment[];
    }
}

export declare const AccountSchema: Schema<IAccount>;
export declare const Account: Model<IAccount & Document>;