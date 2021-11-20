/** This file enables code intellisense for model Project. */
import { Schema, Model, Document, ObjectId } from "mongoose";
import { IRequest } from "../base";

interface IProject {
    title: string;
    description: string;
    owner: ObjectId;
    members: ObjectId[];
    deadline: Date;
    requests: IRequest[];
    planning: ObjectId[];
    developing: ObjectId[];
    finished: ObjectId[];
}

export declare const ProjectSchema: Schema<IProject>;
export declare const Project: Model<IProject & Document>;