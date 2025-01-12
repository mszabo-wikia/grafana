import React, { useCallback, useState } from 'react';

import { config } from '@grafana/runtime';

import { NestedFolderPicker, NestedFolderPickerProps } from '../NestedFolderPicker/NestedFolderPicker';

import { OldFolderPicker } from './OldFolderPicker';

interface FolderPickerProps extends NestedFolderPickerProps {
  // These props are only used by the old folder picker, and should be removed when old picker is removed

  /** @deprecated */
  initialTitle?: string;

  /** @deprecated */
  dashboardId?: number | string;

  /** @deprecated */
  enableCreateNew?: boolean;
}

// Temporary wrapper component to switch between the NestedFolderPicker and the old flat
// FolderPicker depending on feature flags
export function FolderPicker(props: FolderPickerProps) {
  const nestedEnabled = config.featureToggles.nestedFolders && config.featureToggles.nestedFolderPicker;
  const { initialTitle, dashboardId, enableCreateNew, ...newFolderPickerProps } = props;

  return nestedEnabled ? <NestedFolderPicker {...newFolderPickerProps} /> : <OldFolderPickerWrapper {...props} />;
}

// Converts new NestedFolderPicker props to old non-nested folder picker props
// Seperate component so the hooks aren't created if not used
function OldFolderPickerWrapper({
  value,
  showRootFolder,
  onChange,
  initialTitle,
  dashboardId,
  enableCreateNew,
}: FolderPickerProps) {
  const [initialFolderUID] = useState(value);

  const handleOnChange = useCallback(
    (newFolder: { title: string; uid: string }) => {
      if (onChange) {
        onChange(newFolder.uid, newFolder.title);
      }
    },
    [onChange]
  );

  return (
    <OldFolderPicker
      onChange={handleOnChange}
      showRoot={showRootFolder}
      initialFolderUid={initialFolderUID}
      initialTitle={initialTitle}
      dashboardId={dashboardId}
      enableCreateNew={enableCreateNew}
    />
  );
}
