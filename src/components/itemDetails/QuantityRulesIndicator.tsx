import { IProduct } from '@/types/products';
import React, { FC, Fragment } from 'react';
import { Text } from 'tamagui';

const QuantityRulesIndicator: FC<{ product: IProduct }> = ({ product }) => {
  return (
    <Fragment>
      {(product.quantityRules?.predefined || [])?.length > 0 && (
        <Text color='$green10' fontSize='$3' fontWeight='bold'>
          Available in predefined quantities:{' '}
          {(product.quantityRules.predefined || []).join(', ')}
        </Text>
      )}

      {!product.quantityRules?.predefined?.length &&
        product.quantityRules?.step &&
        ![1, undefined].includes(product.quantityRules.step) && (
          <Text color='$green10' fontSize='$3' fontWeight='bold'>
            Quantity must be a multiple of {product.quantityRules.step}
          </Text>
        )}
    </Fragment>
  );
};

export default QuantityRulesIndicator;
