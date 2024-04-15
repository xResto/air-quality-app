import { Tooltip } from '@nextui-org/react';
import React from 'react';

const CityHoverTooltip = ({ children, content }) => {
  return (
    <Tooltip
      content={content}
      showArrow={false}
      placement='top'
      offset={-12}
      delay={0}
      closeDelay={0}
      classNames={{
        content: [
          'py-2 px-4 z-[1000]',
          'text-black rounded-2xl bg-blue3 font-medium text-xs',
        ],
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CityHoverTooltip;
