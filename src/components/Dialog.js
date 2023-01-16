import * as React from 'react';
import { Button, Dialog, Text } from 'react-native-paper';

const DialogBox = ({title="",visible=false,onDismiss=()=>{},onAgree=()=>{},onCancel=()=>{},dialogText="",successBtnTitle,cancelBtnTitle}) => {

  return (
          <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{dialogText}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              {successBtnTitle && <Button onPress={onAgree}>{successBtnTitle}</Button>}
              {cancelBtnTitle && <Button onPress={onCancel}>{cancelBtnTitle}</Button>}
            </Dialog.Actions>
          </Dialog>
  );
};

export default DialogBox;