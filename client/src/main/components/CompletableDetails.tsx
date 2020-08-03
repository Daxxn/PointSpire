import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { ChevronLeft, ExpandMore } from '@material-ui/icons';
import CompletedCheckbox from './ProjectTable/CompletableRow/CompletedCheckbox';
import UserData from '../clientData/UserData';
import SimpleTextInput from './ProjectTable/CompletableRow/SimpleTextInput';
import NoteInput from './ProjectTable/CompletableRow/NoteInput';
import DateInput from './ProjectTable/CompletableRow/DateInput';
import PriorityButton from './ProjectTable/CompletableRow/PriorityButton';
import ProjectTable from './ProjectTable';
import { CompletableType } from '../utils/dbTypes';

function styles(theme: Theme) {
  return createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexGrow: {
      flexGrow: 1,
    },
    card: {
      flexGrow: 1,
      padding: theme.spacing(1),
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    nested: {
      marginLeft: theme.spacing(2),
    },
    checkbox: {
      paddingRight: 0,
    },
  });
}

export interface CompletableDetailsProps extends WithStyles<typeof styles> {
  completableType: CompletableType;
  completableId: string;
}

function CompletableDetailsRoute(props: CompletableDetailsProps) {
  const { completableType, completableId } = props;

  const [completable, setCompletable] = useState(
    UserData.getCompletable(completableType, completableId)
  );

  const [open, setOpen] = useState(false);

  const listenerId = `${completableId}.CompletableDetails`;

  useEffect(() => {
    UserData.addCompletableListener(
      completableType,
      completableId,
      listenerId,
      updatedCompletable => {
        if (updatedCompletable !== null) {
          if (completable === updatedCompletable) {
            // eslint-disable-next-line
            console.log(
              'Caution: Completable did not re-render because ' +
                'it is equal to the updated completable. You may want to make ' +
                'sure that the updated completable is an entirely new object.'
            );
          }
          // eslint-disable-next-line
          console.log(
            'Completable with ID: ',
            updatedCompletable._id,
            ' updated'
          );
          setCompletable(updatedCompletable);
        }
      }
    );

    // This will be ran when the compoennt is unmounted
    return function cleanup() {
      UserData.removeCompletableListener(
        completableType,
        completableId,
        listenerId
      );
    };
  }, []);

  function subtasksClickHandler() {
    setOpen(!open);
  }

  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon>
            <CompletedCheckbox
              completableType={completableType}
              completable={completable}
            />
          </ListItemIcon>
          <SimpleTextInput
            label={
              completableType === 'project' ? 'Project Title' : 'Task Title'
            }
            completableType={completableType}
            completableId={completableId}
            completablePropertyName="title"
            fullWidth
          />
        </ListItem>
        <ListItem>
          <DateInput
            completablePropertyName="startDate"
            completableId={completableId}
            completableType={completableType}
            label="Start Date"
          />
        </ListItem>
        <ListItem>
          <DateInput
            completablePropertyName="dueDate"
            completableId={completableId}
            completableType={completableType}
            label="Due Date"
          />
        </ListItem>
        <ListItem>
          <PriorityButton
            completableType={completableType}
            completableId={completableId}
          />
        </ListItem>
        <ListItem>
          <NoteInput
            completableId={completableId}
            completableType={completableType}
            label="Note"
          />
        </ListItem>
        <ListItem button onClick={subtasksClickHandler}>
          <ListItemText primary="Subtasks" />
          {open ? <ChevronLeft /> : <ExpandMore />}
        </ListItem>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ProjectTable
          rootCompletableId={completableId}
          rootCompletableType={completableType}
        />
      </Collapse>
    </>
  );
}

export default withStyles(styles, { withTheme: true })(CompletableDetailsRoute);
