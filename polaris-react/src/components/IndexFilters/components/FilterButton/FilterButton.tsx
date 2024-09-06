import React from 'react';
import {FilterIcon} from '@shopify/polaris-icons';

import {Tooltip} from '../../../Tooltip';
import {Text} from '../../../Text';
import {Button} from '../../../Button';
import {Box} from '../../../Box';
import {classNames} from '../../../../utilities/css';

import styles from './FilterButton.module.css';

export interface FilterButtonProps {
  label: string;
  disabled?: boolean;
  pressed?: boolean;
  tooltipContent: string;
  disclosureZIndexOverride?: number;
  hasAppliedFilters?: boolean;
  onClick: () => void;
}

export function FilterButton({
  onClick,
  label,
  disabled,
  pressed,
  tooltipContent,
  disclosureZIndexOverride,
}: FilterButtonProps) {
  const className = classNames(styles.FilterButton, pressed && styles.pressed);

  const activator = (
    <div className={className}>
      <Button
        size="slim"
        onClick={onClick}
        disabled={disabled}
        pressed={pressed}
        icon={FilterIcon}
        accessibilityLabel={label}
        ariaExpanded={pressed}
      />
    </div>
  );

  const content = (
    <Text as="span" variant="bodyMd" alignment="center">
      {tooltipContent}
    </Text>
  );

  return (
    <Tooltip
      content={content}
      preferredPosition="above"
      hoverDelay={400}
      zIndexOverride={disclosureZIndexOverride}
    >
      {activator}
    </Tooltip>
  );
}
