import React, { MouseEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { TaskObjects, ProjectObjects } from '../../utils/dbTypes';
import Task from '../../models/Task';
import PrereqTaskManager from '.';

function styles(theme: Theme) {
  return createStyles({
    root: {
      background: theme.palette.background.default,
    },
    title: {
      background: theme.palette.primary.main,
    },
    content: {
      background: theme.palette.background.default,
    },
  });
}

export interface PrereqTaskDialogProps extends WithStyles<typeof styles> {
  savePrereqId: string;
  projects: ProjectObjects;
  tasks: TaskObjects;
  parentTask: Task;
  openDialog: boolean;
  closeDialog: (
    e: React.MouseEvent<HTMLElement>,
    prereqTasks: string[] | null
  ) => void;
}

/**
 * Handles opening the prerequisite tasks in a dialog box.
 * @param {PrereqTaskDialogProps} props PrereqTaskDialog properties.
 */
const PrereqTaskDialog = (props: PrereqTaskDialogProps): JSX.Element => {
  const {
    classes,
    projects,
    tasks,
    openDialog,
    parentTask,
    savePrereqId,
    closeDialog,
  } = props;

  return (
    <Dialog
      maxWidth="lg"
      open={openDialog}
      onClose={(e: MouseEvent<HTMLElement>) => closeDialog(e, null)}
    >
      <DialogTitle className={classes.title}>
        Prerequisite Tasks Menu
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography align="center">{parentTask.title}</Typography>
        <PrereqTaskManager
          allProjects={projects}
          savePrereqId={savePrereqId}
          parentTask={parentTask}
          allTasks={tasks}
          closeDialog={closeDialog}
        />
      </DialogContent>
      <DialogActions />
    </Dialog>
  );
};

export default withStyles(styles, { withTheme: true })(PrereqTaskDialog);
