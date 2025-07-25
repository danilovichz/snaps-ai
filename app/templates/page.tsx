'use client';

import React, { Suspense } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { 
  MdStyle,
  MdComputer,
  MdChair,
  MdCategory,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const TemplatesContent = () => {
  const { t } = useLanguage();
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const brandColor = useColorModeValue('brand.500', 'white');

  return (
    <Flex
      w="100%"
      direction="column"
      position="relative"
      pt={{ base: '70px', md: '0px' }}
    >
      <VStack spacing="32px" align="stretch" maxW="1200px" mx="auto">
        <Box>
          <Text
            color={textColor}
            fontSize="2xl"
            fontWeight="700"
            mb="8px"
          >
            {t('nav.templates')}
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            Manage and customize your image processing templates for different product categories.
          </Text>
        </Box>

        <Card>
          <VStack spacing="24px" align="center" py="60px">
            <Icon
              as={MdCategory}
              w="64px"
              h="64px"
              color={gray}
            />
            <VStack spacing="8px" textAlign="center">
              <Text color={textColor} fontSize="xl" fontWeight="600">
                {t('nav.templates')} {t('button.comingSoon')}
              </Text>
              <Text color={gray} fontSize="md" maxW="400px">
                Create custom templates, adjust processing parameters, and manage presets for different product types and use cases.
              </Text>
            </VStack>
            
            <HStack spacing="16px" mt="24px">
              <VStack spacing="8px" align="center">
                <Icon as={MdStyle} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Clothing Templates
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdComputer} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Electronics Templates
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdChair} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Furniture Templates
                </Text>
              </VStack>
            </HStack>
            
            <Button
              variant="primary"
              mt="24px"
              onClick={() => window.location.href = '/'}
            >
              Start Processing Images
            </Button>
          </VStack>
        </Card>
      </VStack>
    </Flex>
  );
};

export default function Templates() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TemplatesContent />
    </Suspense>
  );
} 