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
  SimpleGrid,
  Badge,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  MdPlayArrow,
  MdPause,
  MdStop,
  MdCheckCircle,
  MdError,
  MdAccessTime,
  MdRefresh,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import type { ProcessingTemplate } from './TemplateSelector';

export interface ProcessingFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  processedPreview?: string;
  processingTime?: number;
  errorMessage?: string;
}

interface BatchProcessorProps {
  files: ProcessingFile[];
  template: ProcessingTemplate;
  onProcessingComplete: (files: ProcessingFile[]) => void;
  onFilesUpdate: (files: ProcessingFile[]) => void;
}

export default function BatchProcessor({ 
  files, 
  template, 
  onProcessingComplete, 
  onFilesUpdate 
}: BatchProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');

  const completedFiles = files.filter(f => f.status === 'completed').length;
  const failedFiles = files.filter(f => f.status === 'failed').length;
  const totalFiles = files.length;
  const overallProgress = (completedFiles / totalFiles) * 100;

  const startProcessing = async () => {
    setIsProcessing(true);
    setIsPaused(false);
    
    // Process files one by one
    for (let i = currentProcessingIndex; i < files.length; i++) {
      if (isPaused) break;
      
      const file = files[i];
      if (file.status !== 'pending') continue;

      setCurrentProcessingIndex(i);
      
      // Update file status to processing
      const updatedFiles = files.map(f => 
        f.id === file.id 
          ? { ...f, status: 'processing' as const, progress: 0 }
          : f
      );
      onFilesUpdate(updatedFiles);

      // Simulate processing with progress updates
      await simulateProcessing(file.id);
    }
    
    setIsProcessing(false);
    if (!isPaused) {
      onProcessingComplete(files);
    }
  };

  const simulateProcessing = async (fileId: string) => {
    const processingTime = Math.random() * 3000 + 2000; // 2-5 seconds
    const steps = 20;
    const stepTime = processingTime / steps;

    for (let step = 0; step <= steps; step++) {
      if (isPaused) break;

      await new Promise(resolve => setTimeout(resolve, stepTime));
      
      const progress = (step / steps) * 100;
      const isComplete = step === steps;
      
      // 95% success rate simulation
      const isSuccess = Math.random() > 0.05;
      
      const updatedFiles = files.map(f => {
        if (f.id === fileId) {
          if (isComplete) {
            return {
              ...f,
              status: isSuccess ? 'completed' as const : 'failed' as const,
              progress: 100,
              processedPreview: isSuccess ? `processed_${f.preview}` : undefined,
              processingTime: processingTime,
              errorMessage: !isSuccess ? 'Processing failed due to image quality' : undefined
            };
          } else {
            return { ...f, progress };
          }
        }
        return f;
      });
      
      onFilesUpdate(updatedFiles);
    }
  };

  const pauseProcessing = () => {
    setIsPaused(true);
    setIsProcessing(false);
  };

  const resumeProcessing = () => {
    startProcessing();
  };

  const stopProcessing = () => {
    setIsProcessing(false);
    setIsPaused(false);
    setCurrentProcessingIndex(0);
    
    // Reset all pending/processing files
    const resetFiles = files.map(f => 
      ['pending', 'processing'].includes(f.status)
        ? { ...f, status: 'pending' as const, progress: 0 }
        : f
    );
    onFilesUpdate(resetFiles);
  };

  const retryFailed = () => {
    const retryFiles = files.map(f => 
      f.status === 'failed'
        ? { ...f, status: 'pending' as const, progress: 0, errorMessage: undefined }
        : f
    );
    onFilesUpdate(retryFiles);
  };

  const getStatusIcon = (status: ProcessingFile['status']) => {
    switch (status) {
      case 'completed':
        return { icon: MdCheckCircle, color: 'green.500' };
      case 'failed':
        return { icon: MdError, color: 'red.500' };
      case 'processing':
        return { icon: MdAccessTime, color: 'orange.500' };
      default:
        return { icon: MdAccessTime, color: gray };
    }
  };

  return (
    <Card>
      <VStack spacing="24px" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack spacing="4px" align="start">
            <Text color={textColor} fontSize="lg" fontWeight="600">
              Batch Processing
            </Text>
            <Text color={gray} fontSize="sm">
              Template: {template.name} • {totalFiles} images
            </Text>
          </VStack>
          
          <Badge
            colorScheme={
              isProcessing ? 'orange' : 
              completedFiles === totalFiles ? 'green' : 
              'gray'
            }
            variant="subtle"
            px="12px"
            py="4px"
          >
            {isProcessing ? 'Processing...' : 
             completedFiles === totalFiles ? 'Complete' : 
             'Ready'}
          </Badge>
        </Flex>

        {/* Overall Progress */}
        <Box>
          <Flex justify="space-between" align="center" mb="8px">
            <Text color={textColor} fontSize="sm" fontWeight="600">
              Overall Progress
            </Text>
            <Text color={gray} fontSize="sm">
              {completedFiles}/{totalFiles} completed
              {failedFiles > 0 && (
                <Text as="span" color="red.500" ml="8px">
                  ({failedFiles} failed)
                </Text>
              )}
            </Text>
          </Flex>
          <Progress
            value={overallProgress}
            colorScheme="brand"
            size="lg"
            borderRadius="full"
          />
        </Box>

        {/* Control Buttons */}
        <HStack spacing="12px">
          {!isProcessing && !isPaused && (
            <Button
              variant="primary"
              leftIcon={<Icon as={MdPlayArrow} />}
              onClick={startProcessing}
              isDisabled={completedFiles === totalFiles}
            >
              Start Processing
            </Button>
          )}
          
          {isProcessing && (
            <Button
              variant="light"
              leftIcon={<Icon as={MdPause} />}
              onClick={pauseProcessing}
            >
              Pause
            </Button>
          )}
          
          {isPaused && (
            <Button
              variant="primary"
              leftIcon={<Icon as={MdPlayArrow} />}
              onClick={resumeProcessing}
            >
              Resume
            </Button>
          )}
          
          {(isProcessing || isPaused) && (
            <Button
              variant="light"
              leftIcon={<Icon as={MdStop} />}
              onClick={stopProcessing}
            >
              Stop
            </Button>
          )}
          
          {failedFiles > 0 && !isProcessing && (
            <Button
              variant="light"
              leftIcon={<Icon as={MdRefresh} />}
              onClick={retryFailed}
            >
              Retry Failed ({failedFiles})
            </Button>
          )}
        </HStack>

        {/* Processing Queue */}
        <Box>
          <Text color={textColor} fontSize="md" fontWeight="600" mb="16px">
            Processing Queue
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="16px">
            {files.map((file, index) => {
              const statusInfo = getStatusIcon(file.status);
              const isCurrentlyProcessing = isProcessing && index === currentProcessingIndex;
              
              return (
                <Box
                  key={file.id}
                  p="16px"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="10px"
                  bg={cardBg}
                  position="relative"
                >
                  <VStack spacing="12px" align="stretch">
                    {/* Image Preview */}
                    <Box
                      h="80px"
                      bgImage={`url(${file.preview})`}
                      bgSize="cover"
                      bgPosition="center"
                      borderRadius="6px"
                      position="relative"
                    >
                      {/* Status Overlay */}
                      <Box
                        position="absolute"
                        top="4px"
                        right="4px"
                        bg={statusInfo.color}
                        borderRadius="full"
                        p="4px"
                      >
                        <Icon as={statusInfo.icon} color="white" w="12px" h="12px" />
                      </Box>
                      
                      {/* Processing Overlay */}
                      {file.status === 'processing' && (
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          w="100%"
                          h="100%"
                          bg="blackAlpha.600"
                          borderRadius="6px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CircularProgress
                            value={file.progress}
                            color="brand.500"
                            size="40px"
                          >
                            <CircularProgressLabel fontSize="10px" color="white">
                              {Math.round(file.progress)}%
                            </CircularProgressLabel>
                          </CircularProgress>
                        </Box>
                      )}
                    </Box>

                    {/* File Info */}
                    <VStack spacing="4px" align="stretch">
                      <Text
                        color={textColor}
                        fontSize="xs"
                        fontWeight="500"
                        noOfLines={1}
                      >
                        {file.file.name}
                      </Text>
                      
                      <HStack justify="space-between">
                        <Text color={gray} fontSize="xs">
                          {(file.file.size / (1024 * 1024)).toFixed(1)} MB
                        </Text>
                        
                        {file.status === 'completed' && file.processingTime && (
                          <Text color="green.500" fontSize="xs">
                            {(file.processingTime / 1000).toFixed(1)}s
                          </Text>
                        )}
                        
                        {file.status === 'failed' && (
                          <Text color="red.500" fontSize="xs">
                            Failed
                          </Text>
                        )}
                      </HStack>
                      
                      {file.errorMessage && (
                        <Text color="red.500" fontSize="xs" noOfLines={1}>
                          {file.errorMessage}
                        </Text>
                      )}
                    </VStack>

                    {/* Progress Bar */}
                    {file.status === 'processing' && (
                      <Progress
                        value={file.progress}
                        colorScheme="brand"
                        size="sm"
                        borderRadius="full"
                      />
                    )}
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </VStack>
    </Card>
  );
} 