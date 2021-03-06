import { ObjectId } from 'bson';
import { Document } from '../utils/dbTypes';

export default class Completable implements Document {
  [key: string]: unknown;

  _id: string = new ObjectId().toHexString();

  __v?: number;

  subtasks: Array<string> = [];

  prereqTasks: Array<string> = [];

  dateCreated: Date = new Date();

  startDate: Date | null = null;

  dueDate: Date | null = null;

  note = '';

  title = '';

  priority = 0;

  completed = false;

  completedDate: Date | null = null;

  /**
   * Holds an array of tag IDs that correspond to the user's tags.
   */
  tags: Array<string> = [];
}
