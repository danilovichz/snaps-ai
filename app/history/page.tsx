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
  MdHistory,
  MdTrendingUp,
  MdAssessment,
  MdSchedule,
} from 'react-icons/md';
import Card from '@/components/card/Card';

export default function ProcessingHistory() {
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
            Processing History
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            Track your image processing activity, usage analytics, and performance metrics.
          </Text>
        </Box>

        <Card>
          <VStack spacing="24px" align="center" py="60px">
            <Icon
              as={MdHistory}
              w="64px"
              h="64px"
              color={gray}
            />
            <VStack spacing="8px" textAlign="center">
              <Text color={textColor} fontSize="xl" fontWeight="600">
                Processing History Coming Soon
              </Text>
              <Text color={gray} fontSize="md" maxW="400px">
                View detailed analytics of your image processing sessions, track usage over time, and analyze performance metrics.
              </Text>
            </VStack>
            
            <HStack spacing="16px" mt="24px">
              <VStack spacing="8px" align="center">
                <Icon as={MdTrendingUp} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Usage Analytics
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdAssessment} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Performance Reports
                </Text>
              </VStack>
              
              <VStack spacing="8px" align="center">
                <Icon as={MdSchedule} w="24px" h="24px" color={brandColor} />
                <Text color={gray} fontSize="sm" textAlign="center">
                  Session Timeline
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