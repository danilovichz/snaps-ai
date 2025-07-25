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
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { 
  MdImage,
  MdFolder,
  MdFilterList,
  MdSearch,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const LibraryContent = () => {
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
        {/* Header */}
        <Box>
          <Text
            color={textColor}
            fontSize="2xl"
            fontWeight="700"
            mb="8px"
          >
            {t('nav.library')}
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            Manage and organize your processed images and project history.
          </Text>
        </Box>

        {/* Coming Soon Card */}
        <Card>
          <VStack spacing="24px" align="center" py="60px">
            <Icon
              as={MdFolder}
              w="64px"
              h="64px"
              color={gray}
            />
            <VStack spacing="8px" textAlign="center">
              <Text color={textColor} fontSize="xl" fontWeight="600">
                {t('nav.library')} {t('button.comingSoon')}
              </Text>
              <Text color={gray} fontSize="md" maxW="400px">
                This feature will allow you to browse, organize, and manage all your processed images with advanced filtering and search capabilities.
              </Text>
            </VStack>
            
            <HStack spacing="16px" mt="24px">
              <VStack spacing="8px" align="center">
                <Icon as={MdImage} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Browse Processed Images
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdFilterList} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Filter by Template
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdSearch} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Smart Search
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

export default function ImageLibrary() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LibraryContent />
    </Suspense>
  );
} 