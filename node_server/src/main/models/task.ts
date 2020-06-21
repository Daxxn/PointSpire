import mongoose, { Model, Schema, Document } from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

/**
 * The mongoose schema for a Task in the database.
 */
const taskSchema = new Schema({
  title: String,
  note: String,
  dateCreated: { type: Date, default: Date.now },
  /**
   * Uses the int32 type from mongoose which just runs Math.floor basically
   * on any input values.
   */
  priority: require('mongoose-int32'),
  subtasks: [
    {
      type: ObjectId,
      ref: 'Task',
      default: new Array<typeof ObjectId>(),
    },
  ],
});

/**
 * The type representing a Task document in the database. This extends the
 * mongoose `Document` type.
 */
export interface TaskDoc extends Document {
  title: string;
  note: string;
  dateCreated: Date;
  priority: number;
  subtasks: Array<typeof ObjectId>;
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
