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
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { 
  MdStyle,
  MdComputer,
  MdChair,
  MdCategory,
  MdArrowForward,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ExamplesGallery() {
  const { t } = useLanguage();
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const brandColor = useColorModeValue('brand.500', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const exampleCategories = [
    {
      id: 'clothing',
      name: t('examples.clothingFashion'),
      icon: MdStyle,
      description: t('examples.clothingDesc'),
      examples: [
        { name: t('examples.tshirtEnhancement'), processed: '95%' },
        { name: t('examples.dressPhotography'), processed: '98%' },
        { name: t('examples.shoeProductShot'), processed: '92%' },
      ]
    },
    {
      id: 'electronics',
      name: t('examples.electronicsTech'),
      icon: MdComputer,
      description: t('examples.electronicsDesc'),
      examples: [
        { name: t('examples.smartphoneStudio'), processed: '97%' },
        { name: t('examples.laptopProfessional'), processed: '94%' },
        { name: t('examples.headphonesClean'), processed: '96%' },
      ]
    },
    {
      id: 'furniture',
      name: t('examples.furnitureHome'),
      icon: MdChair,
      description: t('examples.furnitureDesc'),
      examples: [
        { name: t('examples.chairIsolation'), processed: '89%' },
        { name: t('examples.tableEnhancement'), processed: '91%' },
        { name: t('examples.sofaProfessional'), processed: '93%' },
      ]
    },
    {
      id: 'general',
      name: t('examples.generalProducts'),
      icon: MdCategory,
      description: t('examples.generalDesc'),
      examples: [
        { name: t('examples.kitchenAppliance'), processed: '88%' },
        { name: t('examples.beautyProduct'), processed: '95%' },
        { name: t('examples.sportsEquipment'), processed: '90%' },
      ]
    }
  ];

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
            {t('examples.title')}
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            {t('examples.subtitle')}
          </Text>
        </Box>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing="20px">
          <Card>
            <VStack spacing="8px" align="center" py="20px">
              <Text color={brandColor} fontSize="3xl" fontWeight="700">
                500K+
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center">
                {t('examples.imagesProcessed')}
              </Text>
            </VStack>
          </Card>
          
          <Card>
            <VStack spacing="8px" align="center" py="20px">
              <Text color={brandColor} fontSize="3xl" fontWeight="700">
                95%
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center">
                {t('examples.qualityImprovement')}
              </Text>
            </VStack>
          </Card>
          
          <Card>
            <VStack spacing="8px" align="center" py="20px">
              <Text color={brandColor} fontSize="3xl" fontWeight="700">
                2.5s
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center">
                {t('examples.avgProcessing')}
              </Text>
            </VStack>
          </Card>
          
          <Card>
            <VStack spacing="8px" align="center" py="20px">
              <Text color={brandColor} fontSize="3xl" fontWeight="700">
                4
              </Text>
              <Text color={gray} fontSize="sm" textAlign="center">
                {t('examples.templateCategories')}
              </Text>
            </VStack>
          </Card>
        </SimpleGrid>

        {/* Example Categories */}
        <VStack spacing="24px" align="stretch">
          <Text color={textColor} fontSize="xl" fontWeight="600">
            {t('examples.processingByCategory')}
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px">
            {exampleCategories.map((category) => (
              <Card key={category.id}>
                <VStack spacing="20px" align="stretch">
                  {/* Category Header */}
                  <HStack spacing="12px">
                    <Box
                      bg={useColorModeValue('brand.50', 'whiteAlpha.100')}
                      p="12px"
                      borderRadius="12px"
                    >
                      <Icon 
                        as={category.icon} 
                        w="24px" 
                        h="24px" 
                        color={brandColor}
                      />
                    </Box>
                    <VStack spacing="2px" align="start" flex="1">
                      <Text color={textColor} fontSize="md" fontWeight="600">
                        {category.name}
                      </Text>
                      <Text color={gray} fontSize="xs">
                        {category.description}
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Example Previews */}
                  <VStack spacing="12px" align="stretch">
                    {category.examples.map((example, index) => (
                      <HStack 
                        key={index}
                        justify="space-between" 
                        align="center"
                        p="12px"
                        bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                        borderRadius="8px"
                        _hover={{ 
                          bg: useColorModeValue('gray.100', 'whiteAlpha.100'),
                          cursor: 'pointer' 
                        }}
                        transition="all 0.2s"
                      >
                        <VStack spacing="2px" align="start">
                          <Text color={textColor} fontSize="sm" fontWeight="500">
                            {example.name}
                          </Text>
                          <HStack spacing="4px">
                            <Box w="32px" h="20px" bg="gray.300" borderRadius="4px" />
                            <Icon as={MdArrowForward} w="12px" h="12px" color={gray} />
                            <Box w="32px" h="20px" bg={brandColor} borderRadius="4px" />
                          </HStack>
                        </VStack>
                        
                        <Badge 
                          colorScheme="green" 
                          variant="subtle"
                          fontSize="xs"
                        >
                          {example.processed} {t('examples.enhanced')}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>

                  {/* View More Button */}
                  <Button
                    variant="light"
                    size="sm"
                    w="100%"
                    rightIcon={<Icon as={MdArrowForward} />}
                  >
                    {t('examples.viewExamples')}
                  </Button>
                </VStack>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Call to Action */}
        <Card>
          <VStack spacing="24px" align="center" py="40px">
            <VStack spacing="12px" textAlign="center">
              <Text color={textColor} fontSize="xl" fontWeight="600">
                {t('examples.readyToProcess')}
              </Text>
              <Text color={gray} fontSize="md" maxW="500px">
                {t('examples.joinThousands')}
              </Text>
            </VStack>
            
            <HStack spacing="16px">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/'}
              >
                {t('examples.startProcessing')}
              </Button>
              
              <Button
                variant="light"
                size="lg"
                onClick={() => window.location.href = '/templates'}
              >
                {t('examples.browseTemplates')}
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </Flex>
  );
} 