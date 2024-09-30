// @ts-nocheck
import React, {useRef, useState, useCallback} from 'react';
import {
  ChartVerticalIcon,
  AppsIcon,
  PersonIcon,
  DiscountIcon,
  HomeIcon,
  TargetIcon,
  OrderIcon,
  ProductIcon,
  SettingsIcon,
  SearchIcon,
} from '@shopify/polaris-icons';

import type {
  TabProps,
  IndexFiltersProps,
  FilterInterface,
  AppliedFilterInterface,
  BadgeProps,
} from '../src';
import {
  Tag,
  Avatar,
  Box,
  Icon,
  InlineStack,
  KeyboardKey,
  ThemeProvider,
  useBreakpoints,
  Frame,
  Layout,
  Navigation,
  Page,
  FooterHelp,
  Link,
  ChoiceList,
  useIndexResourceState,
  IndexTable,
  IndexFilters,
  Card,
  Button,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  Badge,
  Text,
  TextField,
} from '../src';

import {orders} from './orders';
import type {Order} from './orders';
import styles from './DetailsPage.module.css';

export const OrdersPage = {
  tags: ['skip-tests'],
  render() {
    const skipToContentRef = useRef<HTMLAnchorElement>(null);
    const [navItemActive, setNavItemActive] = useState('orders');

    const contextControlMarkup = (
      <div className={styles.ContextControl}>
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26.8956 8.39159C26.876 8.25021 26.751 8.17175 26.6473 8.16321C26.5443 8.15466 24.5277 8.12436 24.5277 8.12436C24.5277 8.12436 22.8411 6.50548 22.6745 6.3408C22.5079 6.17611 22.1825 6.22583 22.056 6.26312C22.0544 6.26389 21.7392 6.36022 21.2087 6.52257C21.1199 6.23826 20.9895 5.88869 20.8032 5.53757C20.2028 4.40498 19.3233 3.80605 18.2608 3.8045C18.2592 3.8045 18.2584 3.8045 18.2568 3.8045C18.183 3.8045 18.1099 3.81149 18.036 3.8177C18.0046 3.78042 17.9731 3.74391 17.9401 3.70817C17.4772 3.21878 16.8838 2.9803 16.1726 3.00127C14.8004 3.04011 13.4337 4.01968 12.3255 5.75974C11.5459 6.984 10.9525 8.52209 10.7843 9.71295C9.20858 10.1954 8.10673 10.5325 8.08237 10.5403C7.28702 10.7873 7.26187 10.8114 7.15813 11.5524C7.08111 12.1125 5 28.0186 5 28.0186L22.4403 31L29.9992 29.1426C29.9992 29.1426 26.9153 8.53297 26.8956 8.39159ZM20.3356 6.7898C19.934 6.91253 19.4774 7.05236 18.9822 7.20384C18.972 6.51714 18.8895 5.56165 18.5657 4.7359C19.607 4.93088 20.1195 6.09532 20.3356 6.7898ZM18.0698 7.48349C17.1558 7.76315 16.1584 8.06843 15.158 8.3745C15.4393 7.30949 15.973 6.24913 16.6284 5.55388C16.8721 5.29521 17.2131 5.00701 17.6171 4.84232C17.9967 5.62535 18.0792 6.73387 18.0698 7.48349ZM16.2001 3.90393C16.5223 3.89694 16.7935 3.96685 17.0253 4.11755C16.6544 4.30787 16.296 4.58131 15.9596 4.93787C15.088 5.86228 14.42 7.29706 14.1536 8.68134C13.3229 8.93536 12.5102 9.18472 11.762 9.4131C12.2344 7.23414 14.0821 3.96452 16.2001 3.90393Z"
            fill="#95BF47"
          />
          <path
            d="M26.6482 8.16418C26.5452 8.15564 24.5286 8.12534 24.5286 8.12534C24.5286 8.12534 22.842 6.50646 22.6754 6.34178C22.6133 6.28041 22.5292 6.24856 22.4412 6.23535L22.4419 30.9994L30.0001 29.1428C30.0001 29.1428 26.9162 8.53395 26.8965 8.39257C26.8769 8.25119 26.7511 8.17273 26.6482 8.16418Z"
            fill="#5E8E3E"
          />
          <path
            d="M18.2512 12.0055L17.3734 15.2518C17.3734 15.2518 16.3941 14.8113 15.2333 14.8836C13.531 14.99 13.5129 16.0511 13.5302 16.3176C13.623 17.7695 17.4873 18.0864 17.7042 21.4873C17.8748 24.1626 16.2684 25.9928 13.9538 26.1373C11.1756 26.3105 9.64624 24.6909 9.64624 24.6909L10.2349 22.2159C10.2349 22.2159 11.7745 23.3641 13.0068 23.2872C13.8116 23.2367 14.0992 22.5896 14.0702 22.132C13.9491 20.2382 10.8023 20.35 10.6035 17.2381C10.4361 14.6195 12.1761 11.9659 16.0153 11.7266C17.4944 11.6326 18.2512 12.0055 18.2512 12.0055Z"
            fill="white"
          />
        </svg>
        <p className={styles.ShopName}>Spectrally yours</p>
      </div>
    );

    // ---- Navigation ----
    const navigationMarkup = (
      <Navigation location="/" contextControl={contextControlMarkup}>
        <Navigation.Section
          fill
          items={[
            {
              label: 'Home',
              icon: HomeIcon,
              matches: navItemActive === 'home',
              disabled: true,
              url: '#',
            },
            {
              label: 'Orders',
              icon: OrderIcon,
              matches: navItemActive === 'orders',
              url: '#',
              onClick: () => {
                setNavItemActive('orders');
              },
              subNavigationItems: [
                {
                  label: 'All orders',
                  matches: navItemActive.includes('orders'),
                  url: '#',
                },
                {
                  url: '#',
                  label: 'Drafts',
                  matches: navItemActive === 'drafts',
                  disabled: true,
                },
                {
                  url: '#',
                  label: 'Abandoned checkouts',
                  matches: navItemActive === 'abandoned',
                  disabled: true,
                },
              ],
            },
            {
              label: 'Products',
              icon: ProductIcon,
              matches: navItemActive === 'products',
              disabled: true,
              url: '#',
              onClick: () => {
                setNavItemActive('products');
              },
              subNavigationItems: [
                {
                  label: 'All products',
                  matches: navItemActive.includes('products'),
                  url: '#',
                },
                {
                  url: '#',
                  label: 'Inventory',
                  disabled: true,
                  matches: navItemActive === 'inventory',
                },
                {
                  url: '#',
                  label: 'Transfers',
                  disabled: true,
                  matches: navItemActive === 'transfers',
                },
              ],
            },
            {
              label: 'Customers',
              icon: PersonIcon,
              disabled: true,
              matches: navItemActive === 'customers',
              url: '#',
            },
            {
              label: 'Analytics',
              icon: ChartVerticalIcon,
              disabled: true,
              matches: navItemActive === 'analytics',
              url: '#',
            },
            {
              label: 'Marketing',
              disabled: true,
              icon: TargetIcon,
              matches: navItemActive === 'marketing',
              url: '#',
            },
            {
              label: 'Discounts',
              disabled: true,
              icon: DiscountIcon,
              matches: navItemActive === 'discounts',
              url: '#',
            },
            {
              label: 'Apps',
              disabled: true,
              icon: AppsIcon,
              matches: navItemActive === 'apps',
              url: '#',
            },
          ]}
        />

        <Navigation.Section
          items={[
            {
              icon: SettingsIcon,
              label: 'Settings',
              disabled: true,
            },
          ]}
        />
      </Navigation>
    );

    // ---- Skip to content target ----
    const skipToContentTarget = (
      <Text as="span" visuallyHidden>
        <a
          href="#SkipToContent"
          id="SkipToContentTarget"
          ref={skipToContentRef}
          tabIndex={-1}
        >
          Page content
        </a>
      </Text>
    );

    // ---- Page markup ----
    const pageMarkup = (
      <Page
        fullWidth
        title="Orders"
        primaryAction={{
          content: 'Add order',
          disabled: true,
        }}
        secondaryActions={[
          {content: 'Export', disabled: true},
          {content: 'import', disabled: true},
        ]}
      >
        <Layout>
          {skipToContentTarget}
          <Layout.Section>
            <OrdersIndexTableWithFilters orders={orders} />
          </Layout.Section>
        </Layout>
      </Page>
    );

    return (
      <Frame
        topBar={<TopBarPlaceholder />}
        navigation={navigationMarkup}
        skipToContentTarget={skipToContentRef}
      >
        {pageMarkup}

        <FooterHelp>
          Learn more about{' '}
          <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
            fulfilling orders
          </Link>
        </FooterHelp>
      </Frame>
    );
  },
};

function Table({orders}: {orders: Order[]}) {
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    // @ts-expect-error -- I don't expect an error here, you're doing too much
    useIndexResourceState(orders);

  const mapStatusToBadgeProps = (status: string) => {
    let tone: BadgeProps['tone'];
    let progress: BadgeProps['progress'];

    if (status === 'Partially fulfilled' || status === 'Payment pending') {
      tone = 'warning';
      progress = 'partiallyComplete';
    } else if (status === 'Unfulfilled') {
      tone = 'attention';
      progress = 'incomplete';
    } else if (status === 'Overdue') {
      tone = 'critical';
    } else {
      progress = 'complete';
    }

    return {tone, progress};
  };

  const rowMarkup = orders.map(
    (
      {
        id,
        date,
        customer,
        channel,
        total,
        paymentStatus,
        fulfillmentStatus,
        items,
        deliveryMethod,
        tags,
      },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {`#${id}`}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>{channel}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric variant="bodyMd">
            {total}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack wrap={false} gap="100">
            {paymentStatus.map((status) => (
              <Badge key={status} {...mapStatusToBadgeProps(status)}>
                {status}
              </Badge>
            ))}
          </InlineStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack wrap={false} gap="100">
            {fulfillmentStatus.map((status) => (
              <Badge key={status} {...mapStatusToBadgeProps(status)}>
                {status}
              </Badge>
            ))}
          </InlineStack>
        </IndexTable.Cell>
        <IndexTable.Cell>{`${items} items`}</IndexTable.Cell>
        <IndexTable.Cell>{deliveryMethod}</IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack wrap={false} gap="100">
            {tags.split(',').map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </InlineStack>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={orders.length}
      selectedItemsCount={
        allResourcesSelected ? 'All' : selectedResources.length
      }
      onSelectionChange={handleSelectionChange}
      headings={[
        {title: 'Order'},
        {title: 'Date'},
        {title: 'Customer'},
        {title: 'Channel'},
        {title: 'Total', alignment: 'end'},
        {title: 'Payment status'},
        {title: 'Fulfillment status'},
        {title: 'Items'},
        {title: 'Delivery method'},
        {title: 'Tags'},
      ]}
    >
      {rowMarkup}
    </IndexTable>
  );
}

type SavedViewFilter = Pick<AppliedFilterInterface, 'key' | 'label' | 'value'>;

function OrdersIndexTableWithFilters(
  props?: Partial<IndexFiltersProps> & {
    withFilteringByDefault?: boolean;
    orders: Order[];
  },
) {
  const sortOptions: IndexFiltersProps['sortOptions'] = [
    {label: 'Order', value: 'order desc', directionLabel: 'Ascending'},
    {label: 'Order', value: 'order desc', directionLabel: 'Descending'},
    {label: 'Customer', value: 'customer desc', directionLabel: 'A-Z'},
    {label: 'Customer', value: 'customer desc', directionLabel: 'Z-A'},
    {label: 'Date', value: 'date desc', directionLabel: 'A-Z'},
    {label: 'Date', value: 'date desc', directionLabel: 'Z-A'},
    {label: 'Total', value: 'total desc', directionLabel: 'Ascending'},
    {label: 'Total', value: 'total desc', directionLabel: 'Descending'},
  ];

  const [viewNames, setViewNames] = useState([
    'All',
    'Unfulfilled',
    'Unpaid',
    'Open',
    'Archived',
  ]);
  const [selectedView, setSelectedView] = useState(0);
  const [sortSelected, setSortSelected] = useState(['order desc']);
  const [queryValue, setQueryValue] = useState('');
  const [contains, setContains] = useState<string>('');
  const [status, setStatus] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string[]>([]);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [tempPersistedSearch, setTempPersistedSearch] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);

  const [savedViewFilters, setSavedViewFilters] = useState<SavedViewFilter[][]>(
    [
      [],
      [
        {
          key: 'status',
          label: 'Status',
          value: ['Open'],
        },
        {
          key: 'fulfillmentStatus',
          label: 'Fulfillment status',
          value: ['Unfulfilled', 'Partially fulfilled'],
        },
      ],
      [
        {
          key: 'status',
          label: 'Status',
          value: ['Open'],
        },
        {
          key: 'paymentStatus',
          label: 'Payment status',
          value: ['Payment pending', 'Overdue'],
        },
      ],
      [
        {
          key: 'status',
          label: 'Status',
          value: ['Open'],
        },
      ],
      [
        {
          key: 'status',
          label: 'Status',
          value: ['Archived'],
        },
      ],
    ],
  );

  const [savedSortSelected, setSavedSortSelected] = useState([
    'order desc',
    'order desc',
    'order desc',
    'order desc',
    'order desc',
  ]);

  const {mode, setMode} = useSetIndexFiltersMode();

  const preProcessText = (input: string) => {
    // Insert a space between numbers and letters if they are adjacent
    return input
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      .replace(/([a-zA-Z])(\d)/g, '$1 $2');
  };

  const escapeSpecialChars = (text: string) => {
    return text.replace(/[.,*+?^${}()#|[\]\\]/g, ' ');
  };

  const getSearchRegex = (input: string) => {
    const terms = escapeSpecialChars(input).split(/\s+/);
    const regexParts = terms.map((term) => `(?=.*${term})`);
    const regexPattern = regexParts.join('');
    return new RegExp(regexPattern, 'i');
  };

  const hasTextValueMatches = (inputText: string, order: Order) => {
    const regex = getSearchRegex(inputText);
    const combinedFields = [
      order.id,
      order.customer,
      order.channel,
      order.deliveryMethod,
      order.total,
      order.tags,
    ].join(' ');

    return regex.test(combinedFields);
  };

  const hasArrayValueMatches = (
    orderValue: Set<string>,
    filterValue: Set<string>,
  ) => {
    if (filterValue.size > 0) {
      // @ts-expect-error -- It exists
      return orderValue.intersection(filterValue).size > 0;
    }

    return true;
  };

  const handleFilterOrders = (nextFilters: {
    contains?: string;
    queryValue?: string;
    paymentStatus?: string[];
    fulfillmentStatus?: string[];
    status?: string[];
  }) => {
    setLoading(true);
    const nextQueryValue =
      nextFilters.queryValue !== undefined
        ? nextFilters.queryValue
        : queryValue;

    const nextContains =
      nextFilters.contains !== undefined ? nextFilters.contains : contains;
    const nextStatus =
      nextFilters.status !== undefined ? nextFilters.status : status;
    const nextPaymentStatus =
      nextFilters.paymentStatus !== undefined
        ? nextFilters.paymentStatus
        : paymentStatus;
    const nextFulfillmentStatus =
      nextFilters.fulfillmentStatus !== undefined
        ? nextFilters.fulfillmentStatus
        : fulfillmentStatus;

    const containsSet = new Set(nextContains);
    const statusSet = new Set(nextStatus);
    const paymentStatusSet = new Set(nextPaymentStatus);
    const fulfillmentStatusSet = new Set(nextFulfillmentStatus);
    const result = orders.filter((order) => {
      const matchesQueryValue = hasTextValueMatches(nextQueryValue, order);
      const matchesContains = hasTextValueMatches(
        preProcessText(nextContains),
        order,
      );

      const matchesStatus = hasArrayValueMatches(
        new Set([order.status]),
        statusSet,
      );

      const matchesPaymentStatus = hasArrayValueMatches(
        new Set(order.paymentStatus),
        paymentStatusSet,
      );

      const matchesFulfillmentStatus = hasArrayValueMatches(
        new Set(order.fulfillmentStatus),
        fulfillmentStatusSet,
      );

      setLoading(false);
      return (
        matchesQueryValue &&
        matchesContains &&
        matchesPaymentStatus &&
        matchesFulfillmentStatus &&
        matchesStatus
      );
    });

    setFilteredOrders(result);
  };

  // ---- Filter input event handlers  ----

  const handleQueryValueChange = (value: string) => {
    const processedInput = preProcessText(value);
    setQueryValue(processedInput);
    handleFilterOrders({queryValue: processedInput});
  };

  const handleQueryValueRemove = () => {
    setQueryValue('');
    handleFilterOrders({queryValue: ''});
  };

  const handleContainsChange = (value: string) => {
    setContains(value);
    handleFilterOrders({contains: value});
  };

  const handleContainsRemove = (value: string[]) => {
    setContains('');
    handleFilterOrders({contains: ''});
  };

  const handlePaymentStatusChange = (value: string[]) => {
    setPaymentStatus(value);
    handleFilterOrders({paymentStatus: value});
  };

  const handlePaymentStatusRemove = () => {
    setPaymentStatus([]);
    handleFilterOrders({paymentStatus: []});
  };

  const handleFulfillmentStatusChange = (value: string[]) => {
    setFulfillmentStatus(value);
    handleFilterOrders({fulfillmentStatus: value});
  };

  const handleFulfillmentStatusRemove = () => {
    setFulfillmentStatus([]);
    handleFilterOrders({fulfillmentStatus: []});
  };

  const handleStatusChange = (value: string[]) => {
    setStatus(value);
    handleFilterOrders({status: value});
  };

  const handleStatusRemove = () => {
    setStatus([]);
    handleFilterOrders({status: []});
  };

  const handlers = {
    queryValue: {
      set: setQueryValue,
      change: handleQueryValueChange,
      remove: handleQueryValueRemove,
      emptyValue: '',
      label: 'Include',
    },
    contains: {
      set: setContains,
      change: handleContainsChange,
      remove: handleContainsRemove,
      emptyValue: '',
      label: 'Include',
    },
    status: {
      set: setStatus,
      change: handleStatusChange,
      remove: handleStatusRemove,
      label: 'Status',
      emptyValue: [],
    },
    paymentStatus: {
      set: setPaymentStatus,
      change: handlePaymentStatusChange,
      remove: handlePaymentStatusRemove,
      label: 'Payment status',
      emptyValue: [],
    },
    fulfillmentStatus: {
      set: setFulfillmentStatus,
      change: handleFulfillmentStatusChange,
      remove: handleFulfillmentStatusRemove,
      label: 'Fulfillment status',
      emptyValue: [],
    },
  };

  // ----  Applied filter event handlers ----

  function isEmpty(value: string | string[]) {
    return Array.isArray(value) ? value.length === 0 : value === '';
  }

  const isUnsaved = (
    value?: string | string[],
    savedValue?: string | string[],
  ) => {
    if (value === undefined) return false;
    if (value.length && savedValue === undefined) return true;

    const isArray = Array.isArray(value) && Array.isArray(status);
    const isString =
      typeof value === 'string' && typeof savedValue === 'string';

    if (isString) return value !== savedValue;
    if (isArray)
      return !(
        savedValue?.length &&
        value.length === savedValue.length &&
        value.every((status) => savedValue.indexOf(status) > -1)
      );
  };

  const handleChangeFilters = (nextFilterValues: {
    contains?: string;
    queryValue?: string;
    paymentStatus?: string[];
    fulfillmentStatus?: string[];
    status?: string[];
  }) => {
    for (const key in nextFilterValues) {
      if (key in handlers) {
        handlers[key].set(nextFilterValues[key]);
      }
    }

    handleFilterOrders(nextFilterValues);
  };

  const handleResetToSavedFilters = (view: number) => {
    const nextFilters: {
      contains: string;
      queryValue: string;
      paymentStatus: string[];
      fulfillmentStatus: string[];
      status: string[];
    } = {
      contains: '',
      queryValue: '',
      paymentStatus: [],
      fulfillmentStatus: [],
      status: [],
    };
    console.log('VIEW RESETTING TO: ', view);
    savedViewFilters[view]?.forEach(({key, value}) => {
      nextFilters[key] = value;
    });

    console.log(
      `resetting to ---
        `,
      nextFilters,
      [savedSortSelected[view]],
    );

    setSortSelected([savedSortSelected[view]]);

    return handleChangeFilters(nextFilters);
  };

  const handleClearFilters = () => {
    handleChangeFilters({
      contains: '',
      queryValue: '',
      paymentStatus: [],
      fulfillmentStatus: [],
      status: [],
    });
  };

  const getHumanReadableValue = (label: string, value: string | string[]) => {
    if (isEmpty(value)) return '';
    if (!Array.isArray(value)) {
      return `${label}: ${value}`;
    }

    let humanReadableValue: string;

    if (value.length === 1) {
      humanReadableValue = value[0];
    } else if (value.length === 2) {
      humanReadableValue = `${value[0]} or ${value[1]}`;
    } else {
      humanReadableValue = value
        .map((text, index) => {
          return index !== value.length - 1 ? text : `or ${text}`;
        })
        .join(', ');
    }

    return `${label}: ${humanReadableValue}`;
  };

  // ---- Filters

  const filters: FilterInterface[] = [
    {
      key: 'contains',
      label: handlers.contains.label,
      filter: (
        <TextField
          autoFocus
          labelHidden
          type="text"
          autoComplete="off"
          label={handlers.contains.label}
          value={contains}
          onChange={handleContainsChange}
        />
      ),
    },
    {
      key: 'paymentStatus',
      value: paymentStatus,
      label: handlers.paymentStatus.label,
      filter: (
        <ChoiceList
          title="Payment status"
          titleHidden
          allowMultiple
          choices={[
            {label: 'Paid', value: 'Paid'},
            {label: 'Payment pending', value: 'Payment pending'},
            {label: 'Overdue', value: 'Overdue'},
            {label: 'Refunded', value: 'Refunded'},
          ]}
          selected={paymentStatus}
          onChange={handlePaymentStatusChange}
        />
      ),
    },
    {
      key: 'fulfillmentStatus',
      value: fulfillmentStatus,
      label: handlers.fulfillmentStatus.label,
      filter: (
        <ChoiceList
          title="Fulfillment status"
          titleHidden
          allowMultiple
          choices={[
            {label: 'Unfulfilled', value: 'Unfulfilled'},
            {label: 'Partially fulfilled', value: 'Partially fulfilled'},
            {label: 'Fulfilled', value: 'Fulfilled'},
          ]}
          selected={fulfillmentStatus}
          onChange={handleFulfillmentStatusChange}
        />
      ),
    },
    {
      key: 'status',
      value: status,
      label: handlers.status.label,
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          allowMultiple
          choices={[
            {label: 'Open', value: 'Open'},
            {label: 'Canceled', value: 'Canceled'},
            {label: 'Archived', value: 'Archived'},
          ]}
          selected={status}
          onChange={handleStatusChange}
        />
      ),
    },
  ];

  const appliedFilters: AppliedFilterInterface[] = [];

  Object.entries({
    contains,
    queryValue,
    status,
    paymentStatus,
    fulfillmentStatus,
  }).forEach(([key, value]) => {
    if (isEmpty(value)) return;

    const savedValue = savedViewFilters[selectedView]?.find(
      (filter) => filter.key === key,
    )?.value;

    appliedFilters.push({
      key,
      value,
      label: getHumanReadableValue(handlers[key].label, value),
      unsavedChanges: selectedView === 0 ? true : isUnsaved(value, savedValue),
      onRemove: handlers[key].remove,
    });
  });

  // const appliedFiltersWithQuery = [
  //   ...appliedFilters,
  //   {
  //     key: 'queryValue',
  //     value: queryValue,
  //     label: handlers.queryValue.label,
  //     onRemove: handlers.queryValue.remove,
  //   },
  // ];

  const appliedFiltersWithoutQuery = appliedFilters.filter(
    ({key}) => key !== 'queryValue',
  );

  const savedViewFiltersWithoutQuery = savedViewFilters.filter(
    ({key}) => key !== 'queryValue',
  );

  const appliedFilterMatchesSavedFilter = (
    appliedFilter: AppliedFilterInterface,
  ) => {
    const savedFilter = savedViewFiltersWithoutQuery[selectedView]?.find(
      (savedFilter) => savedFilter.key === appliedFilter.key,
    );

    if (!savedFilter) {
      return false;
    } else if (typeof appliedFilter.value === 'string') {
      return appliedFilter.value === savedFilter.value;
    } else if (Array.isArray(appliedFilter.value)) {
      const hasSameArrayValue =
        new Set(savedFilter.value).difference(new Set(appliedFilter.value))
          .size === 0;
      return hasSameArrayValue;
    } else {
      return true;
    }
  };

  const hasUnsavedSortChange =
    (selectedView === 0 && sortSelected[0] !== 'order desc') ||
    sortSelected[0] !== savedSortSelected[selectedView];

  const isAllViewAndFiltersAreApplied =
    selectedView === 0 && appliedFiltersWithoutQuery.length > 0;

  const appliedFilterCountDoesNotEqualSavedFilterCount =
    appliedFiltersWithoutQuery.length !==
    savedViewFiltersWithoutQuery[selectedView]?.length;

  const appliedFiltersDoNotMatchSavedFilters =
    !appliedFiltersWithoutQuery.every(appliedFilterMatchesSavedFilter);

  const hasUnsavedFilterChange =
    isAllViewAndFiltersAreApplied ||
    (selectedView > 0 &&
      (appliedFilterCountDoesNotEqualSavedFilterCount ||
        appliedFiltersDoNotMatchSavedFilters));

  console.table({
    hasUnsavedFilterChange,
    isAllViewAndFiltersAreApplied,
    countDoesNotEqual:
      selectedView > 0 && appliedFilterCountDoesNotEqualSavedFilterCount,
    filtersDoNotMatch: selectedView > 0 && appliedFiltersDoNotMatchSavedFilters,
  });

  console.table(savedViewFilters[selectedView]);

  const hasUnsavedChanges = hasUnsavedSortChange || hasUnsavedFilterChange;

  // ---- View event handlers
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getFiltersToSave = () => {
    return Object.entries({
      contains,
      queryValue,
      status,
      paymentStatus,
      fulfillmentStatus,
    })
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        return {key, value, label: handlers[key].label};
      });
  };

  const handleSelectView = async (view: number) => {
    const previousView = selectedView;
    const previousSortSelected = sortSelected[0];
    let nextFilters;

    if ((previousView === 0 && hasUnsavedChanges) || queryValue) {
      nextFilters = getFiltersToSave();
    }

    setQueryValue('');
    setSelectedView(view);
    setLoading(true);
    handleResetToSavedFilters(view);
    if (nextFilters) {
      await handleSaveViewFilters(
        previousView,
        nextFilters,
        previousSortSelected,
      );
    } else await sleep(250);
    setLoading(false);
  };

  const handleDeleteView = (index: number) => async () => {
    const nextViewNames = [...viewNames];
    const nextTempPersistedSearch = [...tempPersistedSearch];
    const nextSavedViewFilters = [...savedViewFilters];
    nextViewNames.splice(index, 1);
    nextTempPersistedSearch.splice(index, 1);
    nextSavedViewFilters.splice(index, 1);
    setSavedViewFilters(nextSavedViewFilters);
    setViewNames(nextViewNames);
    await sleep(250);
    handleClearFilters();
    return true;
  };

  const handleRenameView = (index: number) => async (newName: string) => {
    const nextViewNames = [...viewNames];
    nextViewNames[index] = newName;
    await sleep(250);
    setViewNames(nextViewNames);
    return true;
  };

  const handleDuplicateView = (index: number) => async (name: string) => {
    setLoading(true);
    const duplicateViewIndex = viewNames.length;
    const duplicateViewFilters = [...savedViewFilters[index]];
    setSavedViewFilters((filters) => [...filters, duplicateViewFilters]);
    const nextAppliedFilters = {
      queryValue: '',
      contains: '',
      status: [],
      paymentStatus: [],
      fulfillmentStatus: [],
    };

    duplicateViewFilters.forEach(({key, value}) => {
      nextAppliedFilters[key] = value;
    });

    setViewNames((names) => [...names, name]);
    setSavedSortSelected((currentSavedSortSelected) => [
      ...currentSavedSortSelected,
      'order desc',
    ]);
    await sleep(250);
    setSelectedView(duplicateViewIndex);
    setLoading(false);
    return true;
  };

  const handleSaveViewFilters = async (
    index: number,
    nextFilters?: SavedViewFilter[],
    nextSortSelected?: string,
  ) => {
    const nextSavedFilters = [...savedViewFilters];
    const nextSavedSortSelected = [...savedSortSelected];
    nextSavedSortSelected[index] = nextSortSelected
      ? nextSortSelected
      : sortSelected[0];
    nextSavedFilters[index] = nextFilters
      ? nextFilters
      : appliedFilters.map(({key, value, label}) => ({
          key,
          value,
          label,
        }));

    setSavedSortSelected(nextSavedSortSelected);
    setSavedViewFilters(nextSavedFilters);
    await sleep(300);
    return true;
  };

  const handleCreateNewView = async (name: string) => {
    setViewNames((names) => [...names, name]);
    const newViewIndex = viewNames.length;
    const shouldSaveAppliedFiltersAsNew =
      selectedView === 0 &&
      (queryValue ||
        paymentStatus.length > 0 ||
        fulfillmentStatus.length > 0 ||
        status.length > 0 ||
        sortSelected[0] !== savedSortSelected[0]);

    const nextFilters = shouldSaveAppliedFiltersAsNew
      ? getFiltersToSave()
      : {
          contains: '',
          queryValue: '',
          status: [],
          paymentStatus: [],
          fulfillmentStatus: [],
        };

    if (shouldSaveAppliedFiltersAsNew) {
      handleSaveViewFilters(newViewIndex, nextFilters);
    } else {
      handleClearFilters();
      setSavedViewFilters((filters) => [...filters, []]);
      setSavedSortSelected((currentSavedSortSelected) => [
        ...currentSavedSortSelected,
        'order desc',
      ]);
    }

    handleFilterOrders(nextFilters);
    await sleep(250);
    setSelectedView(newViewIndex);
    return true;
  };

  const handleSaveViewAs = async (index: number, name: string) => {
    setViewNames((names) => [...names, name]);
    setSelectedView(index);
    const nextFilters = getFiltersToSave();
    const nextSortSelected = sortSelected[0];
    await handleSaveViewFilters(0, []);
    return handleSaveViewFilters(index, nextFilters, nextSortSelected);
  };

  const handleSave = async (name: string) => {
    let saved = false;
    const index = !name ? selectedView : viewNames.indexOf(name);
    setLoading(true);

    if (index <= 0) {
      saved = await handleSaveViewAs(viewNames.length, name);
    } else {
      saved = await handleSaveViewFilters(index);
    }

    setLoading(false);
    return saved;
  };

  const handleCancel = () => {
    if (!hasUnsavedChanges) {
      console.log('cancelled -- no unsaved changes');
    } else if (selectedView === 0) {
      console.log('cancelled -- clearing all');
      const nextSavedSortSelected = [...savedSortSelected];
      nextSavedSortSelected[0] = 'order desc';
      handleClearFilters();
      setSortSelected(['order desc']);
      setSavedSortSelected(nextSavedSortSelected);
    } else {
      handleResetToSavedFilters(selectedView);
      console.log('cancelled -- resetting to saved');
    }

    setQueryValue('');
  };

  const tabs: TabProps[] = viewNames.map((name, index) => {
    return {
      index,
      id: `${name}-${index}`,
      content: name,
      isLocked: index === 0,
      actions:
        index === 0
          ? []
          : [
              {
                type: 'rename',
                onPrimaryAction: handleRenameView(index),
              },
              {
                type: 'duplicate',
                onPrimaryAction: handleDuplicateView(index),
              },
              {
                type: 'delete',
                onPrimaryAction: handleDeleteView(index),
              },
            ],
      onAction: () => {},
    };
  });

  const primaryAction: IndexFiltersProps['primaryAction'] = {
    type: selectedView === 0 ? 'save-as' : 'save',
    onAction: handleSave,
    disabled: !hasUnsavedChanges,
    loading: false,
  };

  const cancelAction: IndexFiltersProps['cancelAction'] = {
    onAction: handleCancel,
    disabled: !hasUnsavedChanges,
  };

  const queryPlaceholder = `Search ${viewNames[selectedView]?.toLowerCase()}`;

  return (
    <Card padding="0">
      <IndexFilters
        {...props}
        canCreateNewView
        onCreateNewView={handleCreateNewView}
        loading={loading}
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder={queryPlaceholder}
        onQueryChange={handleQueryValueChange}
        onQueryClear={handleQueryValueRemove}
        onSort={setSortSelected}
        primaryAction={primaryAction}
        cancelAction={cancelAction}
        tabs={tabs}
        selected={selectedView}
        onSelect={handleSelectView}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleClearFilters}
        mode={mode}
        setMode={setMode}
        sortUnsaved={hasUnsavedSortChange}
      />
      <Table orders={filteredOrders} />
    </Card>
  );
}

function TopBarPlaceholder({onClickMobileMenu}: {onClickMobileMenu?(): void}) {
  const {mdUp} = useBreakpoints();

  const logoMarkup = (
    <div
      id="shopify-logo"
      style={{
        padding: '0 var(--p-space-500)',
        height: '3.5rem',
        width: '15rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        style={{
          flexShrink: '0',
          cursor: 'pointer',
          transition:
            'transform var(--p-motion-duration-200), filter var(--p-motion-duration-300)',
          filter: 'grayscale(100%)',
          width: '1.3125rem',
        }}
        alt="Shopify"
        src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/shopify-glyph-white-DZNyE9BvHIk-.svg"
      />

      <img
        style={{
          width: '3.875rem',
          flexShrink: '0',
          marginTop: '0.325rem',
          marginLeft: '0.1875rem',
          position: 'relative',
        }}
        alt="Shopify"
        src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/shopify-wordmark-monochrome-CpVsfBAAmxEP.svg"
      />
    </div>
  );

  const mobileMenuActivator = (
    <div style={{marginInline: '0.75rem', display: 'flex'}}>
      <Button
        variant="monochromePlain"
        icon="menu"
        accessibilityLabel="Toggle menu"
        onClick={onClickMobileMenu}
      />
    </div>
  );

  const rightSlotMarkup = (
    <div id="right-slot" style={{}}>
      {mdUp ? logoMarkup : mobileMenuActivator}
    </div>
  );

  const centerSlotMarkup = (
    <div
      id="search-bar-placeholder"
      style={{
        display: 'flex',
        margin: '0 -0.875rem',
        maxWidth: '40rem',
        padding: 'calc((3.5rem - 2.25rem)/2) 0.875rem',
        width: '100%',
        whiteSpace: 'nowrap',
      }}
    >
      <Box width="100%">
        <Card padding="200" roundedAbove="xs">
          <InlineStack gap="500" align="space-between" wrap={false}>
            <InlineStack wrap={false}>
              <div
                style={{
                  alignItems: 'center',
                  color: 'var(--p-color-text-secondary)',
                  display: 'flex',
                  flex: '1 0 auto',
                  height: '16px',
                  marginInline:
                    'var(--p-space-025) calc(var(--p-space-150) - var(--p-space-025))',
                }}
              >
                <Icon tone="inherit" source={SearchIcon} />
              </div>
              <Text as="span" tone="subdued">
                Search
              </Text>
            </InlineStack>
            <InlineStack wrap={false}>
              <KeyboardKey size="small">⌘</KeyboardKey>
              <KeyboardKey size="small">K</KeyboardKey>
            </InlineStack>
          </InlineStack>
        </Card>
      </Box>
    </div>
  );

  const secondaryMenuMarkup = (
    <div id="secondary-menu-placeholder" style={{marginInlineStart: '1rem'}}>
      <InlineStack>
        <Button
          size="large"
          variant="monochromePlain"
          icon="notification"
          accessibilityLabel="View notifications"
        />
      </InlineStack>
    </div>
  );

  const userMenuMarkup = (
    <div
      id="user-menu-placeholder"
      style={{whiteSpace: 'nowrap', marginRight: mdUp ? '1rem' : '0.75rem'}}
    >
      {mdUp ? (
        <InlineStack gap="100" blockAlign="center" wrap={false}>
          <Avatar initials="UN" name="Fashion Nova" />
          <Text as="span" variant="bodySm">
            Unicorn Trough
          </Text>
        </InlineStack>
      ) : (
        <Avatar initials="UN" name="Fashion Nova" />
      )}
    </div>
  );

  const leftSlotMarkup = (
    <InlineStack gap="400" wrap={false}>
      {secondaryMenuMarkup}
      {userMenuMarkup}
    </InlineStack>
  );

  return (
    <ThemeProvider theme="dark-experimental">
      <Box background="bg" width="100%">
        <InlineStack blockAlign="center" align="space-between" wrap={false}>
          {rightSlotMarkup}
          {centerSlotMarkup}
          {leftSlotMarkup}
        </InlineStack>
      </Box>
    </ThemeProvider>
  );
}
