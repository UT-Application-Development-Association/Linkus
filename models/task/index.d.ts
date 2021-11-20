/** This file enables code intellisense for model Task. */
import { Schema, Model, ObjectId} from "mongoose";
import { IComment } from "../base";

interface ITask {
    projectId: ObjectId;
    assigneeId: ObjectId;
    title: string;
    description: string;
    dueDate: Date;
    comments: IComment[];
}

export declare const Task: Model<ITask>;
export declare const TaskSchema: Schema<ITask>;
