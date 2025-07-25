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
  Progress,
  Badge,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  MdDownload,
  MdFolder,
  MdImage,
  MdCheckCircle,
  MdFileDownload,
  MdSettings,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import type { ProcessingFile } from './BatchProcessor';

interface ExportSystemProps {
  approvedFiles: ProcessingFile[];
  onExportComplete: () => void;
  onStartOver: () => void;
}

interface ExportSettings {
  format: 'jpg' | 'png' | 'webp';
  quality: number;
  naming: 'original' | 'processed' | 'custom';
  customPrefix?: string;
}

export default function ExportSystem({ 
  approvedFiles, 
  onExportComplete,
  onStartOver 
}: ExportSystemProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'jpg',
    quality: 85,
    naming: 'processed',
  });

  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const successBg = useColorModeValue('green.50', 'green.900');

  const totalSize = approvedFiles.reduce((acc, file) => acc + file.file.size, 0);
  const formattedSize = (totalSize / (1024 * 1024)).toFixed(1);

  const simulateExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    // Simulate file download
    const zipName = `processed_images_${new Date().toISOString().split('T')[0]}.zip`;
    
    // Create a mock download
    const link = document.createElement('a');
    link.href = '#'; // In real implementation, this would be the ZIP blob URL
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    
    toast({
      title: 'Export Successful!',
      description: `Downloaded ${approvedFiles.length} processed images as ${zipName}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    onExportComplete();
  };

  const downloadIndividual = (file: ProcessingFile) => {
    const fileName = `processed_${file.file.name}`;
    
    // Create mock download
    const link = document.createElement('a');
    link.href = file.processedPreview || file.preview;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download Started',
      description: `Downloading ${fileName}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Card>
      <VStack spacing="24px" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack spacing="4px" align="start">
            <Text color={textColor} fontSize="lg" fontWeight="600">
              Export Ready
            </Text>
            <Text color={gray} fontSize="sm">
              Download your processed images in high quality
            </Text>
          </VStack>
          
          <Badge
            colorScheme="green"
            variant="subtle"
            px="12px"
            py="4px"
          >
            {approvedFiles.length} Images Ready
          </Badge>
        </Flex>

        {/* Export Summary */}
        <Box
          bg={successBg}
          p="20px"
          borderRadius="12px"
          border="1px solid"
          borderColor={useColorModeValue('green.200', 'green.600')}
        >
          <VStack spacing="16px" align="stretch">
            <HStack justify="space-between">
              <VStack spacing="2px" align="start">
                <Text color="green.600" fontSize="sm" fontWeight="600">
                  Ready for Download
                </Text>
                <Text color={gray} fontSize="xs">
                  All approved images processed successfully
                </Text>
              </VStack>
              <Icon as={MdCheckCircle} color="green.500" w="24px" h="24px" />
            </HStack>

            <HStack spacing="24px">
              <VStack spacing="2px" align="start">
                <Text color={textColor} fontSize="2xl" fontWeight="700">
                  {approvedFiles.length}
                </Text>
                <Text color={gray} fontSize="xs">
                  Images
                </Text>
              </VStack>
              
              <VStack spacing="2px" align="start">
                <Text color={textColor} fontSize="2xl" fontWeight="700">
                  {formattedSize} MB
                </Text>
                <Text color={gray} fontSize="xs">
                  Total Size
                </Text>
              </VStack>
              
              <VStack spacing="2px" align="start">
                <Text color={textColor} fontSize="2xl" fontWeight="700">
                  JPG
                </Text>
                <Text color={gray} fontSize="xs">
                  Format
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Export Options */}
        <VStack spacing="16px" align="stretch">
          <Text color={textColor} fontSize="md" fontWeight="600">
            Download Options
          </Text>
          
          <VStack spacing="12px" align="stretch">
            {/* Bulk Download */}
            <Box
              p="16px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="10px"
              bg={cardBg}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing="12px">
                  <Box
                    bg={useColorModeValue('brand.50', 'whiteAlpha.100')}
                    p="8px"
                    borderRadius="8px"
                  >
                    <Icon as={MdFolder} color={brandColor} w="20px" h="20px" />
                  </Box>
                  <VStack spacing="2px" align="start">
                    <Text color={textColor} fontSize="sm" fontWeight="600">
                      Download as ZIP Archive
                    </Text>
                    <Text color={gray} fontSize="xs">
                      Get all {approvedFiles.length} images in a single ZIP file
                    </Text>
                  </VStack>
                </HStack>
                
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Icon as={MdDownload} />}
                  onClick={simulateExport}
                  isLoading={isExporting}
                  loadingText="Preparing..."
                >
                  Download ZIP
                </Button>
              </HStack>
              
              {isExporting && (
                <Box mt="12px">
                  <Text color={gray} fontSize="xs" mb="4px">
                    Preparing download... {exportProgress}%
                  </Text>
                  <Progress
                    value={exportProgress}
                    colorScheme="brand"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              )}
            </Box>

            {/* Individual Downloads */}
            <Box
              p="16px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="10px"
              bg={cardBg}
            >
              <HStack justify="space-between" align="center" mb="12px">
                <HStack spacing="12px">
                  <Box
                    bg={useColorModeValue('orange.50', 'whiteAlpha.100')}
                    p="8px"
                    borderRadius="8px"
                  >
                    <Icon as={MdImage} color="orange.500" w="20px" h="20px" />
                  </Box>
                  <VStack spacing="2px" align="start">
                    <Text color={textColor} fontSize="sm" fontWeight="600">
                      Download Individual Images
                    </Text>
                    <Text color={gray} fontSize="xs">
                      Download specific images one by one
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
              
              <VStack spacing="8px" align="stretch">
                {approvedFiles.slice(0, 5).map((file) => (
                  <HStack key={file.id} justify="space-between" align="center">
                    <HStack spacing="8px">
                      <Box
                        w="32px"
                        h="32px"
                        bgImage={`url(${file.processedPreview || file.preview})`}
                        bgSize="cover"
                        bgPosition="center"
                        borderRadius="4px"
                      />
                      <VStack spacing="0" align="start">
                        <Text color={textColor} fontSize="xs" fontWeight="500" noOfLines={1}>
                          processed_{file.file.name}
                        </Text>
                        <Text color={gray} fontSize="xs">
                          {(file.file.size / (1024 * 1024)).toFixed(1)} MB
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Button
                      variant="light"
                      size="xs"
                      leftIcon={<Icon as={MdFileDownload} />}
                      onClick={() => downloadIndividual(file)}
                    >
                      Download
                    </Button>
                  </HStack>
                ))}
                
                {approvedFiles.length > 5 && (
                  <Text color={gray} fontSize="xs" textAlign="center" mt="8px">
                    and {approvedFiles.length - 5} more images...
                  </Text>
                )}
              </VStack>
            </Box>
          </VStack>
        </VStack>

        <Divider />

        {/* Action Buttons */}
        <HStack spacing="12px" justify="space-between">
          <Button
            variant="light"
            leftIcon={<Icon as={MdSettings} />}
            onClick={onStartOver}
          >
            Process New Batch
          </Button>
          
          <HStack spacing="12px">
            <Text color={gray} fontSize="sm">
              Need to process more images?
            </Text>
            <Button
              variant="primary"
              onClick={onStartOver}
            >
              Start Over
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Card>
  );
} 