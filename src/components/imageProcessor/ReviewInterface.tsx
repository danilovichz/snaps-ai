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
  Switch,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { 
  MdCheckCircle,
  MdCancel,
  MdCompare,
  MdDownload,
  MdSelectAll,
  MdClear,
  MdZoomIn,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import type { ProcessingFile } from './BatchProcessor';

interface ReviewInterfaceProps {
  files: ProcessingFile[];
  onApproval: (approvedFiles: ProcessingFile[]) => void;
  onReprocess: (files: ProcessingFile[]) => void;
}

interface ApprovalState {
  [fileId: string]: boolean;
}

export default function ReviewInterface({ 
  files, 
  onApproval, 
  onReprocess 
}: ReviewInterfaceProps) {
  const [approvalState, setApprovalState] = useState<ApprovalState>({});
  const [showBeforeAfter, setShowBeforeAfter] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ProcessingFile | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const successBg = useColorModeValue('green.50', 'green.900');
  const errorBg = useColorModeValue('red.50', 'red.900');

  const completedFiles = files.filter(f => f.status === 'completed');
  const failedFiles = files.filter(f => f.status === 'failed');
  
  const approvedCount = Object.values(approvalState).filter(Boolean).length;
  const totalReviewableFiles = completedFiles.length;

  const toggleApproval = (fileId: string) => {
    setApprovalState(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const selectAll = () => {
    const newState: ApprovalState = {};
    completedFiles.forEach(file => {
      newState[file.id] = true;
    });
    setApprovalState(newState);
  };

  const clearAll = () => {
    setApprovalState({});
  };

  const handleApproveSelected = () => {
    const approvedFiles = completedFiles.filter(file => approvalState[file.id]);
    onApproval(approvedFiles);
  };

  const handleReprocessFailed = () => {
    onReprocess(failedFiles);
  };

  const openImageModal = (file: ProcessingFile) => {
    setSelectedImage(file);
    onOpen();
  };

  return (
    <>
      <Card>
        <VStack spacing="24px" align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack spacing="4px" align="start">
              <Text color={textColor} fontSize="lg" fontWeight="600">
                Review & Approval
              </Text>
              <Text color={gray} fontSize="sm">
                Review processed images and approve them for download
              </Text>
            </VStack>
            
            <HStack spacing="12px">
              <Text color={gray} fontSize="sm">
                Show comparison:
              </Text>
              <Switch
                colorScheme="brand"
                isChecked={showBeforeAfter}
                onChange={(e) => setShowBeforeAfter(e.target.checked)}
              />
            </HStack>
          </Flex>

          {/* Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px">
            <Box
              p="16px"
              bg={successBg}
              borderRadius="10px"
              textAlign="center"
            >
              <Text color="green.500" fontSize="2xl" fontWeight="700">
                {completedFiles.length}
              </Text>
              <Text color={gray} fontSize="sm">
                Completed
              </Text>
            </Box>
            
            <Box
              p="16px"
              bg={errorBg}
              borderRadius="10px"
              textAlign="center"
            >
              <Text color="red.500" fontSize="2xl" fontWeight="700">
                {failedFiles.length}
              </Text>
              <Text color={gray} fontSize="sm">
                Failed
              </Text>
            </Box>
            
            <Box
              p="16px"
              bg={useColorModeValue('brand.50', 'whiteAlpha.100')}
              borderRadius="10px"
              textAlign="center"
            >
              <Text color={brandColor} fontSize="2xl" fontWeight="700">
                {approvedCount}
              </Text>
              <Text color={gray} fontSize="sm">
                Approved
              </Text>
            </Box>
            
            <Box
              p="16px"
              bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
              borderRadius="10px"
              textAlign="center"
            >
              <Text color={textColor} fontSize="2xl" fontWeight="700">
                {totalReviewableFiles - approvedCount}
              </Text>
              <Text color={gray} fontSize="sm">
                Pending Review
              </Text>
            </Box>
          </SimpleGrid>

          {/* Bulk Actions */}
          <HStack spacing="12px" wrap="wrap">
            <Button
              variant="light"
              size="sm"
              leftIcon={<Icon as={MdSelectAll} />}
              onClick={selectAll}
            >
              Select All ({totalReviewableFiles})
            </Button>
            
            <Button
              variant="light"
              size="sm"
              leftIcon={<Icon as={MdClear} />}
              onClick={clearAll}
            >
              Clear Selection
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Icon as={MdDownload} />}
              onClick={handleApproveSelected}
              isDisabled={approvedCount === 0}
            >
              Approve Selected ({approvedCount})
            </Button>
            
            {failedFiles.length > 0 && (
              <Button
                variant="light"
                size="sm"
                leftIcon={<Icon as={MdCancel} />}
                onClick={handleReprocessFailed}
              >
                Reprocess Failed ({failedFiles.length})
              </Button>
            )}
          </HStack>

          {/* Image Grid */}
          <Box>
            <Text color={textColor} fontSize="md" fontWeight="600" mb="16px">
              Completed Images ({completedFiles.length})
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="20px">
              {completedFiles.map((file) => {
                const isApproved = approvalState[file.id] || false;
                
                return (
                  <Box
                    key={file.id}
                    border="2px solid"
                    borderColor={isApproved ? 'green.400' : borderColor}
                    borderRadius="12px"
                    p="16px"
                    bg={cardBg}
                    transition="all 0.2s"
                  >
                    <VStack spacing="16px" align="stretch">
                      {/* Header */}
                      <HStack justify="space-between">
                        <Checkbox
                          colorScheme="green"
                          isChecked={isApproved}
                          onChange={() => toggleApproval(file.id)}
                        >
                          <Text color={textColor} fontSize="sm" fontWeight="500">
                            Approve
                          </Text>
                        </Checkbox>
                        
                        <Badge
                          colorScheme="green"
                          variant="subtle"
                        >
                          Processed
                        </Badge>
                      </HStack>

                      {/* Image Comparison */}
                      {showBeforeAfter ? (
                        <HStack spacing="8px">
                          {/* Before */}
                          <VStack spacing="4px" flex="1">
                            <Text color={gray} fontSize="xs" fontWeight="500">
                              Before
                            </Text>
                            <Box
                              h="120px"
                              w="100%"
                              bgImage={`url(${file.preview})`}
                              bgSize="cover"
                              bgPosition="center"
                              borderRadius="8px"
                              cursor="pointer"
                              _hover={{ transform: 'scale(1.02)' }}
                              transition="transform 0.2s"
                              onClick={() => openImageModal(file)}
                            />
                          </VStack>
                          
                          {/* Divider */}
                          <Box w="2px" h="120px" bg={borderColor} />
                          
                          {/* After */}
                          <VStack spacing="4px" flex="1">
                            <Text color={gray} fontSize="xs" fontWeight="500">
                              After
                            </Text>
                            <Box
                              h="120px"
                              w="100%"
                              bgImage={`url(${file.processedPreview || file.preview})`}
                              bgSize="cover"
                              bgPosition="center"
                              borderRadius="8px"
                              cursor="pointer"
                              position="relative"
                              _hover={{ transform: 'scale(1.02)' }}
                              transition="transform 0.2s"
                              onClick={() => openImageModal(file)}
                            >
                              {/* Enhanced badge */}
                              <Box
                                position="absolute"
                                top="4px"
                                right="4px"
                                bg="green.500"
                                borderRadius="full"
                                p="2px"
                              >
                                <Icon as={MdCheckCircle} color="white" w="12px" h="12px" />
                              </Box>
                            </Box>
                          </VStack>
                        </HStack>
                      ) : (
                        /* Single processed image */
                        <Box
                          h="160px"
                          w="100%"
                          bgImage={`url(${file.processedPreview || file.preview})`}
                          bgSize="cover"
                          bgPosition="center"
                          borderRadius="8px"
                          cursor="pointer"
                          position="relative"
                          _hover={{ transform: 'scale(1.02)' }}
                          transition="transform 0.2s"
                          onClick={() => openImageModal(file)}
                        >
                          <Box
                            position="absolute"
                            top="4px"
                            right="4px"
                            bg="green.500"
                            borderRadius="full"
                            p="2px"
                          >
                            <Icon as={MdCheckCircle} color="white" w="12px" h="12px" />
                          </Box>
                        </Box>
                      )}

                      {/* File Info */}
                      <VStack spacing="4px" align="stretch">
                        <Text
                          color={textColor}
                          fontSize="sm"
                          fontWeight="500"
                          noOfLines={1}
                        >
                          {file.file.name}
                        </Text>
                        
                        <HStack justify="space-between">
                          <Text color={gray} fontSize="xs">
                            {(file.file.size / (1024 * 1024)).toFixed(1)} MB
                          </Text>
                          
                          {file.processingTime && (
                            <Text color="green.500" fontSize="xs">
                              {(file.processingTime / 1000).toFixed(1)}s
                            </Text>
                          )}
                        </HStack>
                      </VStack>

                      {/* Actions */}
                      <HStack spacing="8px">
                        <Button
                          variant="light"
                          size="xs"
                          leftIcon={<Icon as={MdZoomIn} />}
                          onClick={() => openImageModal(file)}
                          flex="1"
                        >
                          View Full
                        </Button>
                        
                        <Button
                          variant="light"
                          size="xs"
                          leftIcon={<Icon as={MdCompare} />}
                          onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                          flex="1"
                        >
                          Compare
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>

          {/* Failed Images */}
          {failedFiles.length > 0 && (
            <Box>
              <Text color="red.500" fontSize="md" fontWeight="600" mb="16px">
                Failed Images ({failedFiles.length})
              </Text>
              
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing="16px">
                {failedFiles.map((file) => (
                  <Box
                    key={file.id}
                    border="2px solid"
                    borderColor="red.400"
                    borderRadius="10px"
                    p="12px"
                    bg={errorBg}
                  >
                    <VStack spacing="8px">
                      <Box
                        h="80px"
                        w="100%"
                        bgImage={`url(${file.preview})`}
                        bgSize="cover"
                        bgPosition="center"
                        borderRadius="6px"
                        opacity="0.7"
                      />
                      
                      <Text
                        color="red.500"
                        fontSize="xs"
                        fontWeight="500"
                        noOfLines={1}
                        textAlign="center"
                      >
                        {file.file.name}
                      </Text>
                      
                      <Text
                        color="red.400"
                        fontSize="xs"
                        noOfLines={2}
                        textAlign="center"
                      >
                        {file.errorMessage}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Card>

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Image Comparison - {selectedImage?.file.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="24px">
            {selectedImage && (
              <HStack spacing="20px" align="stretch">
                <VStack spacing="8px" flex="1">
                  <Text color={textColor} fontSize="md" fontWeight="600">
                    Original
                  </Text>
                  <Box
                    h="400px"
                    w="100%"
                    bgImage={`url(${selectedImage.preview})`}
                    bgSize="contain"
                    bgRepeat="no-repeat"
                    bgPosition="center"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="8px"
                  />
                </VStack>
                
                <VStack spacing="8px" flex="1">
                  <Text color={textColor} fontSize="md" fontWeight="600">
                    Processed
                  </Text>
                  <Box
                    h="400px"
                    w="100%"
                    bgImage={`url(${selectedImage.processedPreview || selectedImage.preview})`}
                    bgSize="contain"
                    bgRepeat="no-repeat"
                    bgPosition="center"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="8px"
                  />
                </VStack>
              </HStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 