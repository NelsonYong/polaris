import {Button, Modal, LegacyStack} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import {withPolarisExample} from '../../src/components/PolarisExampleWrapper';

function ModalWithPrimaryActionExample() {
  const [active, setActive] = useState(true);

  const toggleModal = useCallback(() => setActive((active) => !active), []);

  const activator = <Button onClick={toggleModal}>Open</Button>;

  return (
    <div style={{height: '500px'}}>
      <Modal
        activator={activator}
        open={active}
        onClose={toggleModal}
        title="Get a shareable link"
        primaryAction={{
          content: 'Close',
          onAction: toggleModal,
        }}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <p>
                You can share this discount link with your customers via email
                or social media. Your discount will be automatically applied at
                checkout.
              </p>
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default withPolarisExample(ModalWithPrimaryActionExample);
