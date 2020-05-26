import express, { Router } from 'express';
import mongoose from 'mongoose';
import { ProjectModel, createProjectModel } from '../models/project';
import { UserModel, createUserModel, UserDoc } from '../models/user';

const router = express.Router();

const errorDescriptions = {
  mongoUserFindErr: 'There was an error while finding the user.',
  userNotFound(id: string): string {
    return `The user with ID: ${id} was not found.`;
  },
  projectNotDefined:
    `The project was not defined either with a proper body or with` +
    ` the "projectTitle" defined.`,
  userUpdateNotDefined:
    `No content was provided in the body to update ` + `the user with.`,
};

/**
 * Creates the express Router for the `/users` endpoint.
 *
 * @param {mongoose} db the connected MongoDB database
 * @returns {Router} the Router for the `/users` endpoint
 */
function createUsersRouter(db: typeof mongoose): Router {
  const User: UserModel = createUserModel(db);
  const Project: ProjectModel = createProjectModel(db);

  router.get('/', (req, res) => {
    res.status(405);
    res.send(
      'Please specify a user ID by using /api/users/24 where ' +
        '"24" is the ID of the user.'
    );
  });

  /**
   * Checks the given userId in the MongoDB and if there is an error it
   * then "rejects" the promise with the error so it can be used elsewhere.
   * If this is successful, it returns the user document.
   *
   * @param {string} userId the ID of the user to find
   * @returns {Promise<UserDoc>} the promise that will reject if there is
   * an error or if the doc is not found and resolves if the user document
   * is found
   */
  function checkUserId(userId: string): Promise<UserDoc> {
    return new Promise<UserDoc>((resolve, reject) => {
      User.find({ _id: userId }).exec((err, users) => {
        if (err) {
          const updatedErr = Object.assign({}, err, {
            additionalMessage: errorDescriptions.mongoUserFindErr,
          });
          reject(updatedErr);
        } else if (users.length === 0) {
          const err = new Error(errorDescriptions.userNotFound(userId));
          reject(err);
        } else {
          resolve(users[0]);
        }
      });
    });
  }

  router.get('/:userId', (req, res, next) => {
    checkUserId(req.params.userId)
      .then(userDoc => {
        res.json(userDoc);
      })
      .catch(err => {
        next(err);
      });
  });

  /**
   * Creates a new project for the given user ID. If successful, it returns
   * the newly created project.
   */
  router.post('/:userId/projects', (req, res, next) => {
    checkUserId(req.params.userId)
      .then(userDoc => {
        if (req.body && req.body.projectTitle) {
          const newProject = new Project({
            title: req.body.projectTitle,
          });
          newProject.save();
          userDoc.projects.push(newProject._id);
          userDoc.save();
          res.status(201);
          res.json(newProject);
        } else {
          throw new Error(errorDescriptions.projectNotDefined);
        }
      })
      .catch(err => {
        next(err);
      });
  });

  /**
   * Updates the user with the given userId and overwrites any of its
   * values specified in the request body. If successful, it returns the
   * updated document.
   */
  router.patch('/:userId', (req, res, next) => {
    checkUserId(req.params.userId)
      .then(userDoc => {
        if (req.body) {
          return userDoc;
        } else {
          throw new Error(errorDescriptions.userUpdateNotDefined);
        }
      })
      .then(userDoc => {
        // Make sure no sneaky stuff is happenin 😅
        if (req.body._id) {
          delete req.body._id;
        }

        userDoc = Object.assign(userDoc, req.body);
        userDoc.save();
        res.status(200);
        res.json(userDoc);
      })
      .catch(err => {
        next(err);
      });
  });

  /**
   * Deletes the user with the given userId. If successful, it returns
   * the deleted document.
   */
  router.delete('/:userId', (req, res, next) => {
    checkUserId(req.params.userId)
      .then(userDoc => {
        User.deleteOne({ _id: req.params.userId });
        res.status(200);
        res.json(userDoc);
      })
      .catch(err => {
        next(err);
      });
  });

  return router;
}

export default createUsersRouter;
