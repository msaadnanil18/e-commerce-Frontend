import { Tag, TagColorScheme } from '@/components/appComponets/tag/Tag';
import { IProduct } from '@/types/products';
import React, { FC, useState } from 'react';
import { MdHistory } from 'react-icons/md';
import TmgDrawer from '@/components/appComponets/Drawer/TmgDrawer';
import StatusLog from './StatusLog';

interface ProductStatusTagProps {
  product: IProduct;
}

const ProductStatusTag: FC<ProductStatusTagProps> = ({ product }) => {
  const [open, setOpen] = useState<boolean>(false);
  const statusColorMap: Record<string, TagColorScheme> = {
    pending: 'yellow',
    approved: 'green',
    restricted: 'orange',
    suspended: 'red',
    rejected: 'gray',
  };

  return (
    <>
      <TmgDrawer
        forceRemoveScrollEnabled
        showCloseButton
        title='Status Logs'
        open={open}
        onOpenChange={setOpen}
        // snapPoints={[90, 60, 30]}
      >
        <StatusLog product={product} />
      </TmgDrawer>
      <Tag
        style={{ height: 25, borderRadius: 5 }}
        width='$10'
        icon={<MdHistory size={18} onClick={() => setOpen(true)} />}
        className=' cursor-pointer'
        iconPosition='right'
        colorScheme={statusColorMap[product.status]}
        textProps={{
          fontSize: '$3',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
      >
        {product.status}
      </Tag>
    </>
  );
};

export default ProductStatusTag;
