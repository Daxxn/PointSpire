import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { resetTimer } from '../../../utils/savingTimer';
import { CompletableType } from '../../../utils/dbTypes';
import Completables from '../../../models/Completables';

export type NoteInputProps = {
  completableType: CompletableType;
  completableId: string;
  label: string;
  rows?: number;
};

/**
 * The input for a note in particular. This is a multiline text input that is
 * specified to use `fullWidth` on the `TextField`.
 *
 * @param {NoteInputProps} props the props
 */
function NoteInput(props: NoteInputProps): JSX.Element {
  const { completableId, completableType, label, rows } = props;
  const initialCompletable = Completables.get(completableType, completableId);
  const [note, setNote] = useState(initialCompletable.note);

  function handleNoteChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNote(event.target.value);
    resetTimer();
  }

  function handleLoseFocus(): void {
    if (initialCompletable.note !== note) {
      Completables.setAndSaveProperty(
        completableType,
        completableId,
        'note',
        note
      );
    }
  }

  return (
    <TextField
      size="small"
      multiline
      label={label}
      value={note}
      onChange={handleNoteChange}
      fullWidth
      onBlur={handleLoseFocus}
      rows={rows}
    />
  );
}

export default NoteInput;
