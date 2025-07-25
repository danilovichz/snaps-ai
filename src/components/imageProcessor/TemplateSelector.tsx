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
  Badge,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  MdCheckCircle,
  MdStyle,
  MdComputer,
  MdChair,
  MdCategory,
} from 'react-icons/md';
import Card from '@/components/card/Card';

export interface ProcessingTemplate {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: any;
  preview: string;
  category: 'clothing' | 'electronics' | 'furniture' | 'general';
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: ProcessingTemplate) => void;
  selectedTemplate?: ProcessingTemplate;
}

const templates: ProcessingTemplate[] = [
  {
    id: 'clothing',
    name: 'Clothing & Fashion',
    description: 'Perfect for apparel, accessories, and fashion items',
    features: [
      'White background removal',
      'Centered product positioning', 
      'Color correction & enhancement',
      'Shadow & lighting optimization',
      'Fabric texture enhancement'
    ],
    icon: MdStyle,
    preview: '/img/templates/clothing-preview.jpg',
    category: 'clothing'
  },
  {
    id: 'electronics',
    name: 'Electronics & Tech',
    description: 'Optimized for gadgets, devices, and electronic products',
    features: [
      'Clean background removal',
      'Proper lighting adjustment',
      'Screen glare reduction',
      'Shadow removal & enhancement',
      'Product dimension standardization'
    ],
    icon: MdComputer,
    preview: '/img/templates/electronics-preview.jpg',
    category: 'electronics'
  },
  {
    id: 'furniture',
    name: 'Furniture & Home',
    description: 'Ideal for furniture, home decor, and large items',
    features: [
      'Room background removal',
      'Size standardization',
      'Perspective correction',
      'Material texture enhancement',
      'Professional staging'
    ],
    icon: MdChair,
    preview: '/img/templates/furniture-preview.jpg',
    category: 'furniture'
  },
  {
    id: 'general',
    name: 'General Products',
    description: 'Universal template for all other product types',
    features: [
      'Basic cleanup & enhancement',
      'Consistent dimensions',
      'Background optimization',
      'Color balance correction',
      'Universal compatibility'
    ],
    icon: MdCategory,
    preview: '/img/templates/general-preview.jpg',
    category: 'general'
  }
];

export default function TemplateSelector({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const selectedBorderColor = useColorModeValue('brand.500', 'brand.400');

  return (
    <Card>
      <VStack spacing="24px" align="stretch">
        <Box>
          <Text color={textColor} fontSize="lg" fontWeight="600" mb="8px">
            Choose Processing Template
          </Text>
          <Text color={gray} fontSize="sm">
            Select the template that best matches your product type for optimal AI processing results.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
          {templates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            
            return (
              <Box
                key={template.id}
                position="relative"
                border="2px solid"
                borderColor={isSelected ? selectedBorderColor : borderColor}
                borderRadius="14px"
                p="20px"
                cursor="pointer"
                bg={cardBg}
                transition="all 0.2s"
                _hover={{
                  borderColor: selectedBorderColor,
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                onClick={() => onTemplateSelect(template)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <Box
                    position="absolute"
                    top="12px"
                    right="12px"
                    bg="green.500"
                    borderRadius="full"
                    p="4px"
                  >
                    <Icon as={MdCheckCircle} color="white" w="16px" h="16px" />
                  </Box>
                )}

                <VStack spacing="16px" align="stretch">
                  {/* Header */}
                  <HStack spacing="12px">
                    <Box
                      bg={useColorModeValue('brand.50', 'whiteAlpha.100')}
                      p="10px"
                      borderRadius="10px"
                    >
                      <Icon 
                        as={template.icon} 
                        w="24px" 
                        h="24px" 
                        color={brandColor}
                      />
                    </Box>
                    <VStack spacing="2px" align="start">
                      <Text color={textColor} fontSize="md" fontWeight="600">
                        {template.name}
                      </Text>
                      <Text color={gray} fontSize="xs">
                        {template.description}
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Preview Image */}
                  <Box
                    h="120px"
                    bg={useColorModeValue('gray.100', 'whiteAlpha.100')}
                    borderRadius="8px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                  >
                    <Text color={gray} fontSize="sm" textAlign="center">
                      Preview Image
                      <br />
                      <Text as="span" fontSize="xs">
                        Before → After
                      </Text>
                    </Text>
                  </Box>

                  {/* Features */}
                  <VStack spacing="8px" align="stretch">
                    <Text color={textColor} fontSize="sm" fontWeight="500">
                      Key Features:
                    </Text>
                    <VStack spacing="4px" align="stretch">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <HStack key={index} spacing="8px">
                          <Box
                            w="6px"
                            h="6px"
                            bg={brandColor}
                            borderRadius="full"
                            mt="2px"
                          />
                          <Text color={gray} fontSize="xs">
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                      {template.features.length > 3 && (
                        <Text color={gray} fontSize="xs" fontStyle="italic">
                          +{template.features.length - 3} more features
                        </Text>
                      )}
                    </VStack>
                  </VStack>

                  {/* Select Button */}
                  <Button
                    variant={isSelected ? "primary" : "light"}
                    size="sm"
                    w="100%"
                  >
                    {isSelected ? 'Selected' : 'Select Template'}
                  </Button>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>

        {selectedTemplate && (
          <Box
            bg={useColorModeValue('brand.50', 'whiteAlpha.100')}
            p="16px"
            borderRadius="10px"
            border="1px solid"
            borderColor={useColorModeValue('brand.200', 'brand.400')}
          >
            <HStack spacing="8px" mb="8px">
              <Icon as={MdCheckCircle} color="green.500" w="16px" h="16px" />
              <Text color={textColor} fontSize="sm" fontWeight="600">
                Template Selected: {selectedTemplate.name}
              </Text>
            </HStack>
            <Text color={gray} fontSize="xs">
              All your images will be processed using the {selectedTemplate.name.toLowerCase()} template with optimized settings for this product category.
            </Text>
          </Box>
        )}
      </VStack>
    </Card>
  );
}

export { templates }; 