import {
  ProjectObjects,
  TaskObjects,
  Completable,
  Project,
  CompletableType,
  Task,
} from './dbTypes';

/**
 * The callback which will be called if any changes are made to a Completable.
 * If the completable is deleted, then null is passed to the callback.
 */
export type ListenerCallback = (completable: Completable | null) => void;

type CompletableListeners = {
  [completableId: string]: {
    [listenerId: string]: ListenerCallback;
  };
};

/**
 * Holds the data and operations on the data that needs to be held in RAM for
 * the client but should not be held in state. It also provides methods of
 * adding listeners to this data.
 */
class ClientData {
  // #region Private Variables
  private static projects: ProjectObjects;

  private static tasks: TaskObjects;

  private static projectListeners: CompletableListeners = {};

  private static taskListeners: CompletableListeners = {};
  // #endregion

  // #region Private Methods
  /**
   * Notifies and runs all the callbacks for the associated completable.
   *
   * @param {CompletableType} type the type of the completable
   * @param {string} completableId the ID of the completable
   * @param {Completable | null} updatedCompletable the updated completable or
   * null if the completable was deleted
   */
  private static notifyCompletableListeners(
    type: CompletableType,
    completableId: string,
    updatedCompletable: Completable | null
  ) {
    // eslint-disable-next-line
    console.log('notifyCompletableListeners was triggered');
    let completableListeners;
    if (type === 'project') {
      completableListeners = this.projectListeners;
    } else {
      completableListeners = this.taskListeners;
    }
    if (completableListeners[completableId]) {
      Object.values(completableListeners[completableId]).forEach(callback => {
        callback(updatedCompletable);
      });
    }
  }
  // #endregion

  // #region Public Methods
  /**
   * Sets the entire projects object to the provided value. This does not
   * trigger any callbacks.
   *
   * @param {ProjectObjects} projects the updated projects object
   */
  static setProjects(projects: ProjectObjects): void {
    this.projects = projects;
  }

  static setCompletable(type: 'project' | 'task', completable: Completable) {
    if (type === 'project') {
      this.projects[completable._id] = completable;
    } else {
      this.tasks[completable._id] = completable;
    }
    this.notifyCompletableListeners(type, completable._id, completable);
  }

  static getProjects(): ProjectObjects {
    return this.projects;
  }

  static getCompletable(type: CompletableType, completableId: string) {
    if (type === 'project') {
      return this.projects[completableId];
    }
    return this.tasks[completableId];
  }

  /**
   * Deletes the completable with the given ID from its completables object,
   * sends null to its listeners, then removes all the listeners.
   *
   * @param {CompletableType} type the type of the completable
   * @param {string} completableId the ID of the completable to delete
   */
  static deleteCompletable(type: CompletableType, completableId: string) {
    let completables;
    let completableListeners;
    if (type === 'project') {
      completables = this.projects;
      completableListeners = this.projectListeners;
    } else {
      completables = this.tasks;
      completableListeners = this.taskListeners;
    }
    delete completables[completableId];
    this.notifyCompletableListeners(type, completableId, null);
    delete completableListeners[completableId];
  }

  /**
   * Sets the given project and notifies all listeners assigned to it with
   * the updated project.
   *
   * @param {Project} project the updated Project
   */
  static setProject(project: Project): void {
    this.setCompletable('project', project);
  }

  static setTasks(tasks: TaskObjects): void {
    this.tasks = tasks;
  }

  static getTasks(): TaskObjects {
    return this.tasks;
  }

  static setTask(task: Task): void {
    this.setCompletable('task', task);
  }

  /**
   * Adds a listener to a particular completable so that when any changes are
   * made to the completable, the provided callback is ran with the updated
   * completable provided to it.
   *
   * @param {CompletableType} type the type of the completable
   * @param {string} completableId the ID of the completable
   * @param {string} listenerId the unique ID of the listener. This should be
   * something like `<listeningTaskOrProjectID>.<ComponentName>`. For example:
   * `H2532hlh2l3h5l2520.CompletableRow`.
   * @param {ListenerCallback} callback the callback to run when changes are
   * made to the completable with the provided ID
   */
  static addCompletableListener(
    type: CompletableType,
    completableId: string,
    listenerId: string,
    callback: ListenerCallback
  ) {
    // eslint-disable-next-line
    console.log('addCompletableListener was triggered');
    let completableListeners;
    if (type === 'project') {
      completableListeners = this.projectListeners;
    } else {
      completableListeners = this.taskListeners;
    }
    if (!completableListeners[completableId]) {
      completableListeners[completableId] = {};
    }
    completableListeners[completableId][listenerId] = callback;
  }

  static removeCompletableListener(
    type: CompletableType,
    completableId: string,
    listenerId: string
  ) {
    let completableListeners;
    if (type === 'project') {
      completableListeners = this.projectListeners;
    } else {
      completableListeners = this.taskListeners;
    }
    if (
      completableListeners[completableId] &&
      completableListeners[completableId][listenerId]
    ) {
      delete completableListeners[completableId][listenerId];
    }
  }
  // #endregion
}

export default ClientData;