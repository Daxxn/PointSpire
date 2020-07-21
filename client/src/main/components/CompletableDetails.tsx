/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import CompletedCheckbox from './CompletableRow/CompletedCheckbox';
import ClientData from '../logic/ClientData/ClientData';
import SimpleTextInput from './SimpleTextInput';
import NoteInput from './CompletableRow/NoteInput';
import DateInput from './CompletableRow/DateInput';
import PriorityButton from './PriorityButton/PriorityButton';
import ProjectTable from './ProjectTable';

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

export type CompletableDetailsRouteProps = WithStyles<typeof styles>;

function CompletableDetailsRoute() {
  const { completableType, completableId } = useParams();

  const [completable, setCompletable] = useState(
    ClientData.getCompletable(completableType, completableId)
  );

  const [open, setOpen] = useState(false);

  const listenerId = `${completableId}.CompletableDetails`;

  useEffect(() => {
    ClientData.addCompletableListener(
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
      ClientData.removeCompletableListener(
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
            rows={5}
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
