import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { resetTimer } from '../../../utils/savingTimer';
import UserData from '../../../clientData/UserData';
import { CompletableType } from '../../../utils/dbTypes';

export type SimpleTextInputProps = {
  completableType: CompletableType;
  completableId: string;
  completablePropertyName: string;
  label: string;
  className?: string;
};

function SimpleTextInput(props: SimpleTextInputProps): JSX.Element {
  const {
    label,
    className,
    completableId,
    completableType,
    completablePropertyName,
  } = props;
  const [value, setValue] = useState(
    UserData.getCompletable(completableType, completableId)[
      completablePropertyName
    ]
  );
  const [disabled, setDisabled] = useState(
    UserData.getCompletable(completableType, completableId).completed
  );

  /**
   * The ID for this listener when set on some property or completable.
   */
  const listenerId = `${completableId}.SimpleTextInput.${completablePropertyName}`;

  /**
   * Add the property listener for the completed value so that it disables
   * the text input when the completable is completed.
   */
  useEffect(() => {
    UserData.addCompletablePropertyListener(
      completableType,
      completableId,
      listenerId,
      'completed',
      updatedValue => {
        setDisabled(updatedValue as boolean);
      }
    );

    // This will be ran when the component is unmounted
    return function cleanup() {
      UserData.removeCompletablePropertyListener(
        completableType,
        completableId,
        listenerId,
        'completed'
      );
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
    resetTimer();
  }

  function handleLoseFocus(): void {
    if (
      UserData.getCompletable(completableType, completableId)[
        completablePropertyName
      ] !== value
    ) {
      UserData.setAndSaveCompletableProperty(
        completableType,
        completableId,
        completablePropertyName,
        value
      );
    }
  }

  return (
    <TextField
      className={className}
      disabled={disabled}
      size="small"
      fullWidth
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleLoseFocus}
    />
  );
}

export default SimpleTextInput;
