import mongoose, { Model, Schema, Document } from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

/**
 * The mongoose schema for a Task in the database.
 */
export const taskSchema = new Schema({
  title: String,
  note: String,
  dateCreated: { type: Date, default: Date.now },
  startDate: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  /**
   * Uses the int32 type from mongoose which just runs Math.floor basically
   * on any input values.
   */
  priority: {
    type: require('mongoose-int32'),
    default: 0,
  },
  prereqTasks: [
    {
      type: ObjectId,
      ref: 'Task',
      default: new Array<typeof ObjectId>(),
    },
  ],
  subtasks: [
    {
      type: ObjectId,
      ref: 'Task',
      default: new Array<typeof ObjectId>(),
    },
  ],
  completed: {
    type: Boolean,
    default: false,
  },
  completedDate: {
    type: Date,
    default: null,
  },
  tags: {
    type: [String],
    default: [],
  },
});

/**
 * The type representing a Task document in the database. This extends the
 * mongoose `Document` type.
 */
export interface TaskDoc extends Document {
  title: string;
  note: string;
  dateCreated: Date;
  startDate: Date | null;
  dueDate: Date | null;
  priority: number;
  subtasks: Array<typeof ObjectId>;
  completed: boolean;
  completedDate: Date | null;
  prereqTasks: Array<typeof ObjectId>;

  /**
   * Holds an array of tag IDs for the task that correspond to the user's tags.
   */
  tags: Array<string>;
}

/**
 * Used to hold a map of task IDs paired with their TaskDoc. This
 * is used when building an AllUserData object.
 */
export type TaskObjects = {
  [id: string]: TaskDoc;
};

/**
 * A `Task` class that represents a task in the MongoDB. This extends
 * the mongoose `Model` type.
 *
 * This can be used for example with:
 * ```
 * let newTask = new Task({title: 'A new task'});
 * ```
 */
export type TaskModel = Model<TaskDoc>;

/**
 * Creates a `Task` model from a given connected mongoose MongoDB database.
 *
 * @param {mongoose} db the connected mongoose MongoDB connection
 * @returns {TaskModel} the `Task` class
 */
export function createTaskModel(db: typeof mongoose): TaskModel {
  return db.model('Task', taskSchema);
}
