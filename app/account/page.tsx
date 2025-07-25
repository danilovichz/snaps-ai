'use client';

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
  MdOutlineManageAccounts,
  MdSettings,
  MdPayment,
  MdApi,
} from 'react-icons/md';
import Card from '@/components/card/Card';

export default function Account() {
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
            Account Settings
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            Manage your profile, billing, usage limits, and API configuration.
          </Text>
        </Box>

        <Card>
          <VStack spacing="24px" align="center" py="60px">
            <Icon
              as={MdOutlineManageAccounts}
              w="64px"
              h="64px"
              color={gray}
            />
            <VStack spacing="8px" textAlign="center">
              <Text color={textColor} fontSize="xl" fontWeight="600">
                Account Management Coming Soon
              </Text>
              <Text color={gray} fontSize="md" maxW="400px">
                Configure your account settings, manage billing and subscriptions, monitor usage, and set up API access.
              </Text>
            </VStack>
            
            <HStack spacing="16px" mt="24px">
              <VStack spacing="8px" align="center">
                <Icon as={MdSettings} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Profile Settings
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdPayment} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Billing & Usage
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdApi} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  API Configuration
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
} 