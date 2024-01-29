import React, {useCallback, useState} from 'react';
import {
  Tag,
  Thumbnail,
  useIndexResourceState,
  Box,
  useHoverCardActivatorWrapperProps,
  Badge,
  IndexTable,
  Icon,
  Link,
  Text,
  BlockStack,
  InlineStack,
  Card,
} from '@shopify/polaris';
import {
  DeliveryIcon,
  LocationIcon,
  OrderIcon,
  ImageIcon,
} from '@shopify/polaris-icons';
import {withPolarisExample} from '../../src/components/PolarisExampleWrapper';

export function HoverCardWithDynamicActivator() {
  interface CustomerDetailPreview {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    orders: number;
  }

  interface LineItem {
    quantity: number;
    title: string;
    imageSrc?: string;
    variant?: string;
    skuNumber?: string;
  }

  interface OrderDetailPreview {
    location?: string;
    deliveryMethod: string;
    fulfillmentStatus: React.ReactNode;
    items: LineItem[];
  }

  const orders = [
    {
      id: '1020',
      title: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          #1020
        </Text>
      ),
      date: 'Jul 20 at 4:34pm',
      customer: {
        id: '4102',
        email: 'yo@superduperkid.co',
        phone: '+19171111111',
        name: 'Colm Dillane',
        location: 'Brooklyn, NY, USA',
        orders: 27,
      },
      channel: 'Online Store',
      total: '$969.44',
      paymentStatus: (
        <Badge progress="partiallyComplete" tone="warning">
          Partially paid
        </Badge>
      ),
      fulfillmentStatus: <Badge progress="complete">Fulfilled</Badge>,
      items: [
        {
          quantity: 40,
          title: 'Perforated Driving Glove - Lavender/White',
          imageSrc:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/3D_render_product_image_of_classic_two-tone_per_2d730775-1987-49ec-8571-3756d83ef508.png?v=1704767232',
          variant: 'Size - S (8.5)',
          skuNumber: '178988',
        },
        {
          quantity: 56,
          title: 'Perforated Driving Glove - Lavender/White',
          imageSrc:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/3D_render_product_image_of_classic_two-tone_per_2d730775-1987-49ec-8571-3756d83ef508.png?v=1704767232',
          variant: 'Size - M (9)',
          skuNumber: '178988',
        },
        {
          quantity: 79,
          title: 'Perforated Driving Glove - Lavender/White',
          imageSrc:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/3D_render_product_image_of_classic_two-tone_per_2d730775-1987-49ec-8571-3756d83ef508.png?v=1704767232',
          variant: 'Size - L (9.5)',
          skuNumber: '178988',
        },
        {
          quantity: 56,
          title: 'Perforated Driving Glove - Lavender/White',
          imageSrc:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/3D_render_product_image_of_classic_two-tone_per_2d730775-1987-49ec-8571-3756d83ef508.png?v=1704767232',
          variant: 'Size - XL (10)',
          skuNumber: '178988',
        },
      ],
      deliveryStatus: 'Complete',
      deliveryMethod: 'Local Pickup',
      location: 'Ridgewood Factory',
      tags: ['VIP', 'wholesale', 'Net 30', 'pickup', 'priority'],
    },
    {
      id: '1019',
      title: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          #1019
        </Text>
      ),
      date: 'Jul 20 at 3:46pm',
      customer: {
        id: '2564',
        name: 'Al Chemist',
        email: 'foodvillain@idontwantthat.com',
        phone: '+12122222222',
        location: 'Los Angeles, CA, USA',
        orders: 19,
      },
      channel: 'Online Store',
      total: '$701.19',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: (
        <Badge progress="incomplete" tone="attention">
          Unfulfilled
        </Badge>
      ),
      items: [
        {
          quantity: 1,
          title: 'Perforated Motocross Glove - Brown/Cognac/White',
          imageSrc:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/3D_render_product_image_for_luxury_keyhole_5_fi_0b5f3b16-fb54-47b6-855d-c19097586c8b.png?v=1704767257',
          variant: 'Size - L (9.5)',
          skuNumber: '176400',
        },
      ],
      deliveryStatus: 'Tracking added',
      deliveryMethod: 'UPS 2 Day Air',
      location: 'BK Warehouse - Williamsburg',
      tags: ['VIP'],
    },
    {
      id: '1018',
      title: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          #1018
        </Text>
      ),
      date: 'Jul 20 at 3.44pm',
      customer: {
        id: '2563',
        name: 'Larry June',
        email: 'yeehee@unclelarry.com',
        phone: '+1415NUMBERS',
        location: 'San Francisco, CA, USA',
        orders: 22,
      },
      channel: 'Instagram',
      total: '$798.24',
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: (
        <Badge progress="incomplete" tone="attention">
          Unfulfilled
        </Badge>
      ),
      items: [
        {
          quantity: 1,
          title: 'Perforated Motocross Glove - Brown/Cognac/White',
          imageSrc:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/3D_render_product_image_for_luxury_keyhole_5_fi_0b5f3b16-fb54-47b6-855d-c19097586c8b.png?v=1704767257',
          variant: 'Size - XL (10)',
          skuNumber: '176400',
        },
      ],
      deliveryStatus: 'Tracking added',
      deliveryMethod: 'UPS Ground',
      location: 'BK Warehouse - Williamsburg',
      tags: ['VIP'],
    },
  ];

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} =
    useIndexResourceState(orders);

  const [activeHoverCard, setActiveHoverCard] = useState<{
    customer?: CustomerDetailPreview | null;
    order?: OrderDetailPreview | null;
  }>({
    customer: null,
    order: null,
  });

  const renderCustomerCellPreview = (customer: CustomerDetailPreview) => {
    const {name, phone, email, location, orders} = customer;

    return (
      <Box padding="400" maxWidth="288px">
        <BlockStack gap="400">
          <BlockStack gap="0">
            <Text as="span" variant="headingSm">
              <Link removeUnderline>{name}</Link>
            </Text>
            <Text as="span" variant="bodyMd">
              <Link url={`mailto:${email}`}>{email}</Link>
            </Text>
            <Text as="p" variant="bodyMd">
              <Link url={`tel:${phone}`}>{phone}</Link>
            </Text>
          </BlockStack>
          <Box width="100%">
            <BlockStack gap="100">
              <InlineStack wrap={false} gap="100" align="start">
                <Box>
                  <Icon tone="subdued" source={LocationIcon} />
                </Box>
                <Text tone="subdued" as="p">
                  {location}
                </Text>
              </InlineStack>
              <InlineStack wrap={false} gap="100" align="start">
                <Box>
                  <Icon tone="subdued" source={OrderIcon} />
                </Box>
                <Text tone="subdued" as="p">
                  {`${orders} Orders`}
                </Text>
              </InlineStack>
            </BlockStack>
          </Box>
        </BlockStack>
      </Box>
    );
  };

  const renderItemsCellPreview = (order: OrderDetailPreview) => {
    const {location, deliveryMethod, fulfillmentStatus, items} = order;

    return (
      <Box padding="400" maxWidth="416px">
        <BlockStack gap="200">
          <InlineStack>{fulfillmentStatus}</InlineStack>
          <Box
            borderRadius="300"
            borderWidth="025"
            borderColor="border-secondary"
          >
            <Box
              id="FulfillmentDetails"
              background="bg-surface-secondary"
              padding="300"
              borderStartStartRadius="300"
              borderStartEndRadius="300"
            >
              <BlockStack gap="300">
                <BlockStack gap="100">
                  <InlineStack gap="100" align="start" blockAlign="center">
                    <div style={{marginLeft: '-4px'}}>
                      <Icon source={LocationIcon} tone="subdued" />
                    </div>
                    <Text as="p" tone="subdued" variant="bodySm">
                      Location
                    </Text>
                  </InlineStack>
                  <Text as="p" variant="bodySm">
                    {location}
                  </Text>
                </BlockStack>
                <BlockStack gap="100">
                  <InlineStack gap="100" align="start" blockAlign="center">
                    <div style={{marginLeft: '-4px'}}>
                      <Icon source={DeliveryIcon} tone="subdued" />
                    </div>
                    <Text as="p" tone="subdued" variant="bodySm">
                      Delivery method
                    </Text>
                  </InlineStack>
                  <Text as="p" variant="bodySm">
                    {deliveryMethod}
                  </Text>
                </BlockStack>
              </BlockStack>
            </Box>
            {items.map(
              ({quantity, title, imageSrc, variant, skuNumber}, index) => (
                <Box
                  key={`LineItem-${skuNumber}-${index}`}
                  id={`LineItem-${skuNumber}-${index}`}
                  borderBlockStartWidth="025"
                  borderColor="border-secondary"
                  paddingInline="300"
                  paddingBlockStart="500"
                  paddingBlockEnd="300"
                >
                  <InlineStack gap="500" wrap={false} blockAlign="start">
                    <div
                      style={{
                        position: 'relative',
                        display: 'block',
                      }}
                    >
                      {imageSrc ? (
                        <Thumbnail source={imageSrc} size="small" alt={title} />
                      ) : (
                        <div
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--p-border-radius-200)',
                            boxShadow: 'var(--p-shadow-border-inset)',
                            borderColor: 'var(--p-border-secondary)',
                          }}
                        >
                          <Icon tone="subdued" source={ImageIcon} />
                        </div>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          zIndex: 100,
                          top: '-30%',
                          right: '-30%',
                          display: 'flex',
                        }}
                      >
                        <Box
                          background="bg-surface"
                          padding="025"
                          borderRadius="500"
                        >
                          <Box
                            borderColor="border-brand"
                            borderRadius="500"
                            background="bg-fill-secondary"
                            paddingInline="150"
                          >
                            <Text
                              as="span"
                              variant="bodyXs"
                            >{`${quantity}`}</Text>
                          </Box>
                        </Box>
                      </div>
                    </div>
                    <BlockStack gap="100">
                      <Link url="#" monochrome removeUnderline>
                        <Text as="p" variant="bodySm">
                          {title}
                        </Text>
                      </Link>
                      <Text as="p" tone="subdued" variant="bodySm">
                        {variant}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                </Box>
              ),
            )}
          </Box>
        </BlockStack>
      </Box>
    );
  };

  const rowMarkup = orders.map(
    (
      {
        id,
        title,
        date,
        customer,
        channel,
        total,
        paymentStatus,
        fulfillmentStatus,
        items,
        deliveryStatus,
        deliveryMethod,
        location,
        tags,
      },
      index,
    ) => {
      return (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>{title}</IndexTable.Cell>
          <IndexTable.Cell>{date}</IndexTable.Cell>
          <IndexTable.Cell flush preview={renderCustomerCellPreview(customer)}>
            <div style={{minHeight: '100%', padding: 'var(--p-space-150)'}}>
              <Link monochrome removeUnderline url="#">
                {customer.name}
              </Link>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>{channel}</IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" alignment="end" numeric>
              {total}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
          <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
          <IndexTable.Cell
            flush
            preview={renderItemsCellPreview({
              location,
              deliveryMethod,
              fulfillmentStatus,
              items,
            })}
          >
            <div style={{minHeight: '100%', padding: 'var(--p-space-150)'}}>
              <Link monochrome removeUnderline url="#">
                {`${items.length} items`}
              </Link>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>{deliveryStatus}</IndexTable.Cell>
          <IndexTable.Cell>{deliveryMethod}</IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack wrap={false} gap="100">
              {tags.map((tag, index) => (
                <Tag key={`Tag-${index}-${tag}`}>{tag}</Tag>
              ))}
            </InlineStack>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    },
  );

  return (
    <Card padding="0">
      <IndexTable
        hasCellPreviews
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
          {title: 'Delivery status'},
          {title: 'Delivery method'},
          {title: 'Tags'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}

export default withPolarisExample(HoverCardWithDynamicActivator);
