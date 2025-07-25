'use client';
// Chakra imports
import { Flex, Box } from '@chakra-ui/react';

import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  return (
    <Flex alignItems="center" flexDirection="column">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="100%"
        py="20px"
        px="20px"
        h="60px"
      >
        <img
          src="/img/snaps-logo.png"
          alt="Snaps Logo"
          style={{
            height: '40px',
            width: 'auto',
            maxWidth: '150px',
            objectFit: 'contain'
          }}
        />
      </Box>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
