import React, {useMemo, useEffect, useCallback, useRef, useState} from 'react';
import {Transition} from 'react-transition-group';

import {useI18n} from '../../utilities/i18n';
import {classNames} from '../../utilities/css';
import {useEventListener} from '../../utilities/use-event-listener';
import {useToggle} from '../../utilities/use-toggle';
import {useOnValueChange} from '../../utilities/use-on-value-change';
import {InlineStack} from '../InlineStack';
import {Spinner} from '../Spinner';
import {Filters} from '../Filters';
import type {FiltersProps} from '../Filters';
import {Tabs} from '../Tabs';
import type {TabsProps} from '../Tabs';
import {TextField} from '../TextField';
import {useBreakpoints} from '../../utilities/breakpoints';

import {useIsSticky} from './hooks';
import {
  Container,
  SortButton,
  SearchField,
  FilterButton,
  UpdateButtons,
  EditColumnsButton,
} from './components';
import type {
  IndexFiltersPrimaryAction,
  IndexFiltersCancelAction,
  SortButtonChoice,
} from './types';
import {IndexFiltersMode} from './types';
import styles from './IndexFilters.module.css';

const DEFAULT_IGNORED_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];

const TRANSITION_DURATION = 150;

const defaultStyle = {
  transition: `opacity ${TRANSITION_DURATION}ms var(--p-motion-ease)`,
  opacity: 0,
};

const transitionStyles = {
  entering: {opacity: 1},
  entered: {opacity: 1},
  exiting: {opacity: 0},
  exited: {opacity: 0},
  unmounted: {opacity: 0},
};

type ExecutedCallback = (name: string) => Promise<boolean>;

type ActionableIndexFiltersMode = Exclude<
  IndexFiltersMode,
  IndexFiltersMode.Default
>;

export interface IndexFiltersProps
  extends Omit<
      FiltersProps,
      'focused' | 'children' | 'disableQueryField' | 'disableFilters'
    >,
    Pick<TabsProps, 'tabs' | 'onSelect' | 'selected'> {
  /** The available sorting choices. If not present, the sort button will not show */
  sortOptions?: SortButtonChoice[];
  /** The currently selected sort choice. Required if using sorting */
  sortSelected?: string[];
  /** Optional callback invoked when a merchant changes the sort order. Required if using sorting */
  onSort?: (value: string[]) => void;
  /** Optional callback when using saved views and changing the sort key */
  onSortKeyChange?: (value: string) => void;
  /** Optional callback when using saved views and changing the sort direction */
  onSortDirectionChange?: (value: string) => void;
  /** Callback when the add filter button is clicked, to be passed to Filters. */
  onAddFilterClick?: () => void;
  /** The primary action to display  */
  primaryAction?: IndexFiltersPrimaryAction;
  /** The cancel action to display */
  cancelAction?: IndexFiltersCancelAction;
  /** Optional callback invoked when a merchant begins to edit a view */
  onEditStart?: (mode: ActionableIndexFiltersMode) => void;
  /** The current mode of the IndexFilters component. Used to determine which view to show */
  mode: IndexFiltersMode;
  /** Override z-index of popovers and tooltips */
  disclosureZIndexOverride?: number;
  /** Callback to set the mode of the IndexFilters component */
  setMode: (mode: IndexFiltersMode) => void;
  /** Will disable all the elements within the IndexFilters component */
  disabled?: boolean;
  /** Will disable just the query field */
  disableQueryField?: boolean;
  /** If true, the sticky interaction on smaller devices will be disabled */
  disableStickyMode?: boolean;
  /** If the component should go flush to the top of the page when sticking */
  isFlushWhenSticky?: boolean;
  /** Whether the index supports creating new views */
  canCreateNewView?: boolean;
  /** Callback invoked when a merchant creates a new view */
  onCreateNewView?: (name: string) => Promise<boolean>;
  /** Optional override to the default aria-label for the button that toggles the filtering mode */
  filteringAccessibilityLabel?: string;
  /** Optional override to the default Tooltip message for the button that toggles the filtering mode */
  filteringAccessibilityTooltip?: string;
  /** Whether the filter should close when clicking inside another Popover. */
  closeOnChildOverlayClick?: boolean;
  /** Optional override to the default keyboard shortcuts available. Should be set to true for all instances
   * of this component not controlling a root-level index */
  disableKeyboardShortcuts?: boolean;
  /** Whether to display the edit columns button with the other default mode filter actions */
  showEditColumnsButton?: boolean;
  /** Whether or not to auto-focus the search field when it renders */
  autoFocusSearchField?: boolean;
}

export function IndexFilters({
  tabs,
  selected,
  onSelect,
  onSort,
  onSortKeyChange,
  onSortDirectionChange,
  onAddFilterClick,
  sortOptions,
  sortSelected,
  queryValue = '',
  queryPlaceholder,
  primaryAction,
  cancelAction,
  filters,
  appliedFilters,
  onClearAll,
  onQueryChange,
  onQueryFocus,
  onQueryClear,
  onEditStart,
  disabled,
  disableQueryField,
  hideFilters,
  loading,
  mode,
  setMode,
  disclosureZIndexOverride,
  disableStickyMode,
  isFlushWhenSticky = false,
  canCreateNewView = true,
  onCreateNewView,
  filteringAccessibilityLabel,
  filteringAccessibilityTooltip,
  hideQueryField,
  closeOnChildOverlayClick,
  disableKeyboardShortcuts,
  showEditColumnsButton,
  autoFocusSearchField = true,
}: IndexFiltersProps) {
  const i18n = useI18n();
  const {mdDown} = useBreakpoints();
  const defaultRef = useRef(null);
  const filteringRef = useRef(null);

  const [searchOnlyValue, setSearchOnlyValue] = useState('');
  const [searchFilterValue, setSearchFilterValue] = useState(queryValue);

  useEffect(() => {
    console.log(
      `'${queryValue}', '${searchOnlyValue}', '${searchFilterValue}'`,
    );
    if (queryValue === '') {
      setSearchOnlyValue('');
      setSearchFilterValue('');
    } else if (queryValue.length > 0 && searchOnlyValue.length === 0) {
      setSearchFilterValue(queryValue);
    }
  }, [queryValue, searchOnlyValue, searchFilterValue]);

  const {
    value: filtersFocused,
    setFalse: setFiltersUnFocused,
    setTrue: setFiltersFocused,
  } = useToggle(mode === IndexFiltersMode.Filtering && autoFocusSearchField);

  const handleModeChange = (newMode: IndexFiltersMode) => {
    if (newMode === IndexFiltersMode.Filtering && autoFocusSearchField) {
      setFiltersFocused();
    } else {
      setFiltersUnFocused();
    }
  };

  useOnValueChange(mode, handleModeChange);

  useEventListener('keydown', (event) => {
    const hasNoFiltersOrSearch = hideQueryField && hideFilters;
    if (disableKeyboardShortcuts || hasNoFiltersOrSearch) return;

    const {key} = event;
    const tag = document?.activeElement?.tagName;
    if (mode !== IndexFiltersMode.Default && event.key === 'Escape') {
      onPressEscape();
    }

    if (key === 'f' && mode === IndexFiltersMode.Default) {
      if (tag && DEFAULT_IGNORED_TAGS.includes(tag)) {
        return;
      }
      onPressF();
      event.preventDefault();
    }
  });

  const {intersectionRef, measurerRef, indexFilteringHeight, isSticky} =
    useIsSticky(mode, Boolean(disableStickyMode), isFlushWhenSticky);

  const viewNames = tabs.map(({content}) => content);

  const handleChangeSortButton = useCallback(
    (value: string[]) => {
      onSort?.(value);
    },
    [onSort],
  );

  const useExecutedCallback = (
    action?: ExecutedCallback,
    afterEffect?: () => void,
  ) =>
    useCallback(
      async (name: string) => {
        const hasExecuted = await action?.(name);
        if (hasExecuted) {
          setMode(IndexFiltersMode.Default);
          afterEffect?.();
        }
      },
      [action, afterEffect],
    );

  const onExecutedPrimaryAction = useExecutedCallback(primaryAction?.onAction);

  const onExecutedCancelAction = useCallback(() => {
    cancelAction?.onAction?.();
    // setSearchOnlyValue('');
    // setSearchFilterValue('');
    setMode(IndexFiltersMode.Default);
  }, [cancelAction, setMode]);

  const enhancedPrimaryAction = useMemo(() => {
    return primaryAction
      ? {
          ...primaryAction,
          onAction: onExecutedPrimaryAction,
        }
      : undefined;
  }, [onExecutedPrimaryAction, primaryAction]);

  const enhancedCancelAction = useMemo(() => {
    return cancelAction
      ? {
          ...cancelAction,
          onAction: onExecutedCancelAction,
        }
      : undefined;
  }, [cancelAction, onExecutedCancelAction]);

  const beginEdit = useCallback(
    (mode: ActionableIndexFiltersMode) => {
      setMode(mode);
      onEditStart?.(mode);
    },
    [onEditStart, setMode],
  );

  const updateButtonsMarkup = useMemo(
    () =>
      enhancedCancelAction || enhancedPrimaryAction ? (
        <UpdateButtons
          primaryAction={enhancedPrimaryAction}
          cancelAction={enhancedCancelAction}
          viewNames={viewNames}
          disabled={disabled}
        />
      ) : null,
    [enhancedPrimaryAction, enhancedCancelAction, disabled, viewNames],
  );

  const sortMarkup = useMemo(() => {
    if (!sortOptions?.length) {
      return null;
    }
    return (
      <SortButton
        choices={sortOptions}
        selected={sortSelected!}
        onChange={handleChangeSortButton}
        onChangeKey={onSortKeyChange}
        onChangeDirection={onSortDirectionChange}
        disabled={disabled}
        disclosureZIndexOverride={disclosureZIndexOverride}
      />
    );
  }, [
    handleChangeSortButton,
    onSortDirectionChange,
    onSortKeyChange,
    sortOptions,
    sortSelected,
    disabled,
    disclosureZIndexOverride,
  ]);

  function handleClickEditColumnsButton() {
    beginEdit(IndexFiltersMode.EditingColumns);
  }

  const editColumnsMarkup = showEditColumnsButton ? (
    <EditColumnsButton
      onClick={handleClickEditColumnsButton}
      disabled={disabled}
    />
  ) : null;

  const isActionLoading = primaryAction?.loading || cancelAction?.loading;

  function handleHideFilters() {
    cancelAction?.onAction();
    setMode(IndexFiltersMode.Default);
  }

  const handleShowFilters = useCallback(() => {
    beginEdit(IndexFiltersMode.Filtering);
  }, [beginEdit]);

  function handleClickFilterButton() {
    if (mode === IndexFiltersMode.Filtering) {
      handleHideFilters();
    } else {
      handleShowFilters();
    }
  }

  const searchFilterTooltipLabelId = disableKeyboardShortcuts
    ? 'Polaris.IndexFilters.searchFilterTooltip'
    : 'Polaris.IndexFilters.searchFilterTooltipWithShortcut';

  const searchFilterTooltip =
    filteringAccessibilityTooltip || i18n.translate(searchFilterTooltipLabelId);
  const searchFilterAriaLabel =
    filteringAccessibilityLabel ||
    i18n.translate('Polaris.IndexFilters.searchFilterAccessibilityLabel');

  const isLoading = loading || isActionLoading;

  function onPressEscape() {
    cancelAction?.onAction();
    setMode(IndexFiltersMode.Default);
  }

  const handleQueryChange = useCallback(
    (input: 'searchOnly' | 'searchFilter') => (value: string) => {
      if (input === 'searchOnly') {
        onQueryChange(searchFilterValue ? searchFilterValue + value : value);
        setSearchOnlyValue(value);
      } else {
        onQueryChange(searchOnlyValue ? `${value},${searchOnlyValue}` : value);
        setSearchFilterValue(value);
      }
    },
    [searchFilterValue, searchOnlyValue, onQueryChange],
  );

  const handleAddAsFilter = useCallback(() => {
    if (mode !== IndexFiltersMode.Filtering) {
      handleShowFilters();
    }
    if (searchOnlyValue) {
      const augmentedQuery = searchFilterValue
        ? `${searchFilterValue},${searchOnlyValue}`
        : searchOnlyValue;
      onQueryChange(augmentedQuery);
      setSearchFilterValue(augmentedQuery);
      setSearchOnlyValue('');
    }
  }, [
    mode,
    searchFilterValue,
    searchOnlyValue,
    onQueryChange,
    handleShowFilters,
  ]);

  const handleQueryClear = useCallback(
    (input: 'searchOnly' | 'searchFilter') => () => {
      if (input === 'searchOnly') {
        setSearchOnlyValue('');
        onQueryChange(searchFilterValue);
      } else {
        onQueryClear?.();
        setSearchOnlyValue('');
        setSearchFilterValue('');
      }
    },
    [searchFilterValue, onQueryChange, onQueryClear],
  );

  function handleQueryBlur() {
    setFiltersUnFocused();
  }

  function handleQueryFocus() {
    setFiltersFocused();
    onQueryFocus?.();
  }

  function onPressF() {
    if (mode !== IndexFiltersMode.Default) {
      return;
    }

    handleShowFilters();
  }

  const handleKeyDownEnter = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        onQueryChange(
          searchOnlyValue
            ? searchFilterValue + searchOnlyValue
            : searchFilterValue,
        );
      }
    },
    [searchOnlyValue, searchFilterValue, onQueryChange],
  );

  const searchFilterLabel = i18n.translate(
    'Polaris.IndexFilters.SearchField.defaultPlaceholder',
  );

  const filtersWithSearch = [
    ...filters,
    {
      key: 'appliedSearchFilter',
      label: searchFilterLabel,
      hidden: true,
      filter: (
        <div onKeyDown={handleKeyDownEnter}>
          <TextField
            multiline
            selectTextOnFocus
            type="text"
            autoComplete="off"
            label={i18n.translate(
              'Polaris.IndexFilters.SearchField.editSearchFilter',
            )}
            value={searchFilterValue}
            onChange={handleQueryChange('searchFilter')}
          />
        </div>
      ),
    },
  ];

  const getAppliedFilters = useMemo(() => {
    let searchFilter;

    // const supportsSavedFilters =
    //   !hideQueryField &&
    //   !hideFilters &&
    //   primaryAction &&
    //   (primaryAction.type === 'save' || primaryAction.type === 'save-as');

    if (queryValue && searchFilterValue) {
      searchFilter = {
        key: 'appliedSearchFilter',
        label: `${searchFilterLabel}: ${searchFilterValue}`,
        value: searchFilterValue,
        unsavedChanges: appliedFilters?.find(
          ({key}) => key.includes('search') || key.includes('query'),
        )?.unsavedChanges,
        onRemove: handleQueryClear('searchFilter'),
      };
    }

    if (searchFilter) {
      return Array.isArray(appliedFilters)
        ? [...appliedFilters, searchFilter]
        : [searchFilter];
    }

    return appliedFilters;
  }, [
    queryValue,
    // hideFilters,
    // hideQueryField,
    // primaryAction,
    appliedFilters,
    searchFilterValue,
    searchFilterLabel,
    handleQueryClear,
  ]);

  return (
    <div
      className={styles.IndexFiltersWrapper}
      style={{height: indexFilteringHeight}}
    >
      <div ref={intersectionRef} />
      <div
        className={classNames(
          styles.IndexFilters,
          isSticky && styles.IndexFiltersSticky,
          isSticky && isFlushWhenSticky && styles.IndexFiltersStickyFlush,
        )}
        ref={measurerRef}
      >
        <div ref={defaultRef}>
          <Container>
            <InlineStack
              align="start"
              blockAlign="center"
              gap={{
                xs: '0',
                md: '200',
              }}
              wrap={false}
            >
              <div
                className={classNames(
                  styles.TabsWrapper,
                  mdDown && styles.SmallScreenTabsWrapper,
                  isLoading && styles.TabsWrapperLoading,
                )}
              >
                <div className={styles.TabsInner}>
                  <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={onSelect}
                    disabled={disabled}
                    disclosureZIndexOverride={disclosureZIndexOverride}
                    canCreateNewView={canCreateNewView}
                    onCreateNewView={onCreateNewView}
                  />
                </div>
                {isLoading && mdDown && (
                  <div className={styles.TabsLoading}>
                    <Spinner size="small" />
                  </div>
                )}
              </div>
              <div className={styles.ActionWrap}>
                <SearchField
                  value={searchOnlyValue}
                  placeholder={queryPlaceholder}
                  disabled={disabled || disableQueryField}
                  onChange={handleQueryChange('searchOnly')}
                  onFocus={handleQueryFocus}
                  onBlur={handleQueryBlur}
                  onClear={handleQueryClear('searchOnly')}
                  onKeyDownEnter={handleAddAsFilter}
                />
                {isLoading && !mdDown && (
                  <div className={styles.DesktopLoading}>
                    {isLoading ? <Spinner size="small" /> : null}
                  </div>
                )}

                {hideFilters ? null : (
                  <FilterButton
                    onClick={handleClickFilterButton}
                    label={searchFilterAriaLabel}
                    tooltipContent={searchFilterTooltip}
                    disabled={disabled}
                    pressed={mode === IndexFiltersMode.Filtering}
                    disclosureZIndexOverride={disclosureZIndexOverride}
                  />
                )}
                {editColumnsMarkup}
                {sortMarkup}
                {mode === IndexFiltersMode.EditingColumns
                  ? updateButtonsMarkup
                  : null}
              </div>
            </InlineStack>
          </Container>
        </div>

        <Transition
          nodeRef={filteringRef}
          in={mode === IndexFiltersMode.Filtering}
          timeout={TRANSITION_DURATION}
        >
          {(state) => (
            <div ref={filteringRef}>
              {mode === IndexFiltersMode.Filtering ? (
                <Filters
                  hideQueryField
                  onQueryChange={() => {}}
                  onQueryClear={() => {}}
                  onAddFilterClick={onAddFilterClick}
                  filters={filtersWithSearch}
                  appliedFilters={getAppliedFilters}
                  onClearAll={onClearAll}
                  disableFilters={disabled}
                  hideFilters={hideFilters}
                  loading={loading || isActionLoading}
                  focused={filtersFocused}
                  mountedState={mdDown ? undefined : state}
                  closeOnChildOverlayClick={closeOnChildOverlayClick}
                >
                  <div className={styles.ButtonWrap}>
                    <InlineStack gap="200" align="start" blockAlign="center">
                      <div
                        style={{
                          ...defaultStyle,
                          ...transitionStyles[state],
                        }}
                      >
                        {updateButtonsMarkup}
                      </div>
                      {sortMarkup}
                    </InlineStack>
                  </div>
                </Filters>
              ) : null}
            </div>
          )}
        </Transition>
      </div>
    </div>
  );
}
