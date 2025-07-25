'use client';
import React, { Suspense, useState, useCallback } from 'react';
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
  Progress,
  SimpleGrid,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@chakra-ui/react';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MdCloudUpload, 
  MdImage,
  MdDelete,
  MdCheckCircle,
  MdSettings,
  MdPlayArrow,
  MdDownload,
  MdAutoAwesome,
  MdStyle,
  MdPalette,
} from 'react-icons/md';
import Card from '@/components/card/Card';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
}

type WorkflowStep = 'upload' | 'template' | 'processing' | 'review' | 'export';

// Simple template interface for demo
interface ProcessingTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Note: Templates will be created inside component to access translations

const ProcessorContent = () => {
  const { t } = useLanguage();
  
  // Template definitions with translations
  const templates: ProcessingTemplate[] = [
    {
      id: 'bg-remove',
      name: t('template.bgRemoval'),
      description: t('template.bgRemovalDesc'),
      category: t('template.ecommerce')
    },
    {
      id: 'bg-change',
      name: t('template.bgChange'),
      description: t('template.bgChangeDesc'),
      category: t('template.creative')
    },
    {
      id: 'enhance',
      name: t('template.enhance'),
      description: t('template.enhanceDesc'),
      category: t('template.professional')
    }
  ];
  
  // Main workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProcessingTemplate>();
  const [isDragOver, setIsDragOver] = useState(false);

  const toast = useToast();

  // Color mode values
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bgColor = useColorModeValue('gray.50', 'navy.800');
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');

  // Step configuration
  const steps = [
    { id: 'upload', title: t('workflow.upload'), description: t('workflow.upload.desc') },
    { id: 'template', title: t('workflow.template'), description: t('workflow.template.desc') },
    { id: 'processing', title: t('workflow.processing'), description: t('workflow.processing.desc') },
    { id: 'review', title: t('workflow.review'), description: t('workflow.review.desc') },
    { id: 'export', title: t('workflow.export'), description: t('workflow.export.desc') },
  ];

  const getStepIndex = (step: WorkflowStep) => {
    return steps.findIndex(s => s.id === step);
  };

  // Upload handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );

         if (validFiles.length !== files.length) {
       toast({
         title: t('processing.invalidFiles'),
         description: t('processing.invalidFilesDesc'),
         status: 'warning',
         duration: 3000,
         isClosable: true,
       });
     }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(fileData => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'uploaded', progress: 100 }
              : f
          )
        );
      }, 2000);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

     const handleTemplateSelect = (template: ProcessingTemplate) => {
     setSelectedTemplate(template);
     toast({
       title: t('processing.templateSelected'),
       description: `${template.name} ${t('processing.templateSelectedDesc')}`,
       status: 'success',
       duration: 3000,
       isClosable: true,
     });
   };

  const startProcessing = () => {
    if (!selectedTemplate) return;
    setCurrentStep('processing');
    
    // Simulate processing
         setTimeout(() => {
       setCurrentStep('review');
       toast({
         title: t('processing.complete'),
         description: `${uploadedFiles.length} ${t('common.images')} ${t('processing.completeDesc')}`,
         status: 'success',
         duration: 5000,
         isClosable: true,
       });
     }, 3000);
  };

     const approveAndExport = () => {
     setCurrentStep('export');
     toast({
       title: t('processing.exportComplete'),
       description: t('processing.exportCompleteDesc'),
       status: 'success',
       duration: 5000,
       isClosable: true,
     });
   };

  const startOver = () => {
    uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setUploadedFiles([]);
    setSelectedTemplate(undefined);
    setCurrentStep('upload');
    
         toast({
       title: t('common.startOver'),
       description: t('processing.startOverDesc'),
       status: 'info',
       duration: 3000,
       isClosable: true,
     });
  };

  const uploadedCount = uploadedFiles.filter(f => f.status === 'uploaded').length;
  const totalFiles = uploadedFiles.length;

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
            {t('home.title')}
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            {t('home.subtitle')}
          </Text>
        </Box>

        {/* Progress Stepper */}
        <Card>
          <Stepper index={getStepIndex(currentStep)} colorScheme="brand">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Card>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <Card>
            <VStack spacing="20px" align="stretch">
              {/* Drag and Drop Zone */}
              <Box
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                border="2px dashed"
                borderColor={isDragOver ? brandColor : borderColor}
                borderRadius="14px"
                p="40px"
                textAlign="center"
                bg={isDragOver ? useColorModeValue('brand.50', 'whiteAlpha.50') : 'transparent'}
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  borderColor: brandColor,
                  bg: useColorModeValue('brand.50', 'whiteAlpha.50'),
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <VStack spacing="16px">
                  <Icon
                    as={MdCloudUpload}
                    w="48px"
                    h="48px"
                    color={isDragOver ? brandColor : gray}
                  />
                  <VStack spacing="8px">
                    <Text
                      color={textColor}
                      fontSize="lg"
                      fontWeight="600"
                    >
                      {t('upload.title')}
                    </Text>
                    <Text color={gray} fontSize="sm">
                      {t('upload.subtitle')}
                    </Text>
                    <Text color={gray} fontSize="xs">
                      {t('upload.formats')}
                    </Text>
                  </VStack>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Icon as={MdImage} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file-input')?.click();
                    }}
                  >
                    {t('upload.choose')}
                  </Button>
                </VStack>
                
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileInput}
                />
              </Box>

              {/* Upload Progress */}
              {totalFiles > 0 && (
                <Box>
                  <Flex justify="space-between" align="center" mb="8px">
                    <Text color={textColor} fontSize="sm" fontWeight="600">
                      {t('upload.progress')}
                    </Text>
                    <Badge 
                      colorScheme={uploadedCount === totalFiles ? 'green' : 'blue'}
                      variant="subtle"
                    >
                      {uploadedCount}/{totalFiles} {t('upload.complete')}
                    </Badge>
                  </Flex>
                  <Progress
                    value={(uploadedCount / totalFiles) * 100}
                    colorScheme="brand"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              )}

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <VStack spacing="16px" align="stretch">
                                     <Flex justify="space-between" align="center">
                     <Text color={textColor} fontSize="md" fontWeight="600">
                       {t('processing.uploadedImages')} ({uploadedFiles.length})
                     </Text>
                    <Button
                      variant="light"
                      size="sm"
                      leftIcon={<Icon as={MdDelete} />}
                      onClick={() => {
                        uploadedFiles.forEach(f => URL.revokeObjectURL(f.preview));
                        setUploadedFiles([]);
                      }}
                    >
                      {t('upload.clearAll')}
                    </Button>
                  </Flex>

                  <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing="16px">
                    {uploadedFiles.map((fileData) => (
                      <Box
                        key={fileData.id}
                        position="relative"
                        borderRadius="10px"
                        overflow="hidden"
                        bg={cardBg}
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{ transform: 'scale(1.02)' }}
                        transition="all 0.2s"
                      >
                        <Box
                          w="100%"
                          h="120px"
                          bgImage={`url(${fileData.preview})`}
                          bgSize="cover"
                          bgPosition="center"
                          position="relative"
                        >
                          {fileData.status === 'uploading' && (
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              w="100%"
                              h="100%"
                              bg="blackAlpha.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexDirection="column"
                            >
                              <Text color="white" fontSize="xs" mb="4px">
                                {t('upload.uploading')}
                              </Text>
                              <Progress
                                value={fileData.progress}
                                size="sm"
                                colorScheme="brand"
                                w="80%"
                              />
                            </Box>
                          )}
                          
                          {fileData.status === 'uploaded' && (
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
                          )}

                          <Box
                            position="absolute"
                            top="4px"
                            left="4px"
                            bg="red.500"
                            borderRadius="full"
                            p="4px"
                            cursor="pointer"
                            _hover={{ bg: 'red.600' }}
                            onClick={() => removeFile(fileData.id)}
                          >
                            <Icon as={MdDelete} color="white" w="12px" h="12px" />
                          </Box>
                        </Box>

                        <Box p="8px">
                          <Text
                            color={textColor}
                            fontSize="xs"
                            fontWeight="500"
                            noOfLines={1}
                            title={fileData.file.name}
                          >
                            {fileData.file.name}
                          </Text>
                          <Text color={gray} fontSize="xs">
                            {(fileData.file.size / (1024 * 1024)).toFixed(1)} {t('common.mb')}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>

                  {uploadedCount > 0 && uploadedCount === totalFiles && (
                    <Button
                      variant="primary"
                      size="lg"
                      leftIcon={<Icon as={MdPlayArrow} />}
                      onClick={() => setCurrentStep('template')}
                    >
                      {t('upload.continue')} ({uploadedCount} {t('common.images')})
                    </Button>
                  )}
                </VStack>
              )}
            </VStack>
          </Card>
        )}

        {currentStep === 'template' && (
          <VStack spacing="20px" align="stretch">
            <Card>
              <VStack spacing="20px" align="stretch">
                                 <Text color={textColor} fontSize="lg" fontWeight="600">
                   {t('processing.chooseTemplate')}
                 </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing="16px">
                  {templates.map((template) => (
                    <Box
                      key={template.id}
                      p="16px"
                      border="2px solid"
                      borderColor={selectedTemplate?.id === template.id ? brandColor : borderColor}
                      borderRadius="12px"
                      cursor="pointer"
                      bg={selectedTemplate?.id === template.id ? useColorModeValue('brand.50', 'whiteAlpha.50') : 'transparent'}
                      _hover={{ borderColor: brandColor }}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <VStack spacing="8px" align="start">
                        <Badge colorScheme="blue" variant="subtle">
                          {template.category}
                        </Badge>
                        <Text color={textColor} fontSize="md" fontWeight="600">
                          {template.name}
                        </Text>
                        <Text color={gray} fontSize="sm">
                          {template.description}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </Card>
            
            {selectedTemplate && (
              <Card>
                <HStack justify="space-between" align="center">
                  <VStack spacing="4px" align="start">
                    <Text color={textColor} fontSize="md" fontWeight="600">
                      {t('template.ready')}
                    </Text>
                    <Text color={gray} fontSize="sm">
                      {uploadedCount} {t('template.willProcess')} {selectedTemplate.name}
                    </Text>
                  </VStack>
                  
                  <HStack spacing="12px">
                    <Button
                      variant="light"
                      onClick={() => setCurrentStep('upload')}
                    >
                      {t('template.back')}
                    </Button>
                    <Button
                      variant="primary"
                      leftIcon={<Icon as={MdSettings} />}
                      onClick={startProcessing}
                    >
                      {t('template.start')}
                    </Button>
                  </HStack>
                </HStack>
              </Card>
            )}
          </VStack>
        )}

        {currentStep === 'processing' && (
          <Card>
                         <VStack spacing="20px" align="center" py="40px">
               <Icon as={MdSettings} w="48px" h="48px" color={brandColor} />
               <Text color={textColor} fontSize="xl" fontWeight="600">
                 {t('processing.enhancing')}
               </Text>
               <Text color={gray} fontSize="md">
                 {t('processing.enhancingDesc')} {uploadedFiles.length} {t('common.images')}
               </Text>
              <Progress size="lg" colorScheme="brand" isIndeterminate w="300px" />
            </VStack>
          </Card>
        )}

        {currentStep === 'review' && (
          <Card>
                         <VStack spacing="20px" align="center" py="40px">
               <Icon as={MdCheckCircle} w="48px" h="48px" color="green.500" />
               <Text color={textColor} fontSize="xl" fontWeight="600">
                 {t('processing.complete')}
               </Text>
               <Text color={gray} fontSize="md">
                 {uploadedFiles.length} {t('common.images')} {t('processing.completeDesc')}
               </Text>
               <Button
                 variant="primary"
                 size="lg"
                 leftIcon={<Icon as={MdDownload} />}
                 onClick={approveAndExport}
               >
                 {t('processing.downloadProcessed')}
               </Button>
            </VStack>
          </Card>
        )}

        {currentStep === 'export' && (
          <Card>
                         <VStack spacing="20px" align="center" py="40px">
               <Icon as={MdDownload} w="48px" h="48px" color="green.500" />
               <Text color={textColor} fontSize="xl" fontWeight="600">
                 {t('processing.exportComplete')}
               </Text>
               <Text color={gray} fontSize="md">
                 {t('processing.exportCompleteDesc')}
               </Text>
              <Button
                variant="primary"
                size="lg"
                onClick={startOver}
              >
                {t('common.startOver')}
              </Button>
            </VStack>
          </Card>
                 )}

         {/* Examples Section - Show after workflow is complete or as inspiration */}
         {(currentStep === 'upload' && uploadedFiles.length === 0) && (
           <VStack spacing="24px" align="stretch">
             <Box>
               <Text color={textColor} fontSize="xl" fontWeight="600" mb="8px">
                 {t('examples.title')}
               </Text>
               <Text color={gray} fontSize="sm">
                 {t('examples.subtitle')}
               </Text>
             </Box>

             <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing="16px">
               <Card>
                 <VStack spacing="12px" align="start" p="16px">
                   <HStack spacing="8px">
                     <Box bg={useColorModeValue('purple.50', 'whiteAlpha.100')} p="8px" borderRadius="8px">
                       <Icon as={MdImage} w="16px" h="16px" color="purple.500" />
                     </Box>
                     <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                       {t('template.ecommerce')}
                     </Badge>
                   </HStack>
                   <Text color={textColor} fontSize="sm" fontWeight="600">
                     {t('template.bgRemoval')}
                   </Text>
                   <Text color={gray} fontSize="xs" noOfLines={2}>
                     {t('template.bgRemovalDesc')}
                   </Text>
                   <Box w="100%" h="2px" bg="purple.500" borderRadius="full" />
                 </VStack>
               </Card>

               <Card>
                 <VStack spacing="12px" align="start" p="16px">
                   <HStack spacing="8px">
                     <Box bg={useColorModeValue('blue.50', 'whiteAlpha.100')} p="8px" borderRadius="8px">
                       <Icon as={MdAutoAwesome} w="16px" h="16px" color="blue.500" />
                     </Box>
                     <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                       {t('template.creative')}
                     </Badge>
                   </HStack>
                   <Text color={textColor} fontSize="sm" fontWeight="600">
                     {t('template.bgChange')}
                   </Text>
                   <Text color={gray} fontSize="xs" noOfLines={2}>
                     {t('template.bgChangeDesc')}
                   </Text>
                   <Box w="100%" h="2px" bg="blue.500" borderRadius="full" />
                 </VStack>
               </Card>

               <Card>
                 <VStack spacing="12px" align="start" p="16px">
                   <HStack spacing="8px">
                     <Box bg={useColorModeValue('green.50', 'whiteAlpha.100')} p="8px" borderRadius="8px">
                       <Icon as={MdStyle} w="16px" h="16px" color="green.500" />
                     </Box>
                     <Badge colorScheme="green" variant="subtle" fontSize="xs">
                       {t('template.professional')}
                     </Badge>
                   </HStack>
                   <Text color={textColor} fontSize="sm" fontWeight="600">
                     {t('template.enhance')}
                   </Text>
                   <Text color={gray} fontSize="xs" noOfLines={2}>
                     {t('template.enhanceDesc')}
                   </Text>
                   <Box w="100%" h="2px" bg="green.500" borderRadius="full" />
                 </VStack>
               </Card>

               <Card>
                 <VStack spacing="12px" align="start" p="16px">
                   <HStack spacing="8px">
                     <Box bg={useColorModeValue('orange.50', 'whiteAlpha.100')} p="8px" borderRadius="8px">
                       <Icon as={MdPalette} w="16px" h="16px" color="orange.500" />
                     </Box>
                     <Badge colorScheme="orange" variant="subtle" fontSize="xs">
                       {t('button.comingSoon')}
                     </Badge>
                   </HStack>
                   <Text color={textColor} fontSize="sm" fontWeight="600">
                     {t('tool.smartShadows')}
                   </Text>
                   <Text color={gray} fontSize="xs" noOfLines={2}>
                     {t('tool.smartShadowsDesc')}
                   </Text>
                   <Box w="100%" h="2px" bg="orange.500" borderRadius="full" />
                 </VStack>
               </Card>
             </SimpleGrid>

             <Button
               variant="light"
               size="sm"
               alignSelf="center"
               rightIcon={<Icon as={MdPlayArrow} />}
               onClick={() => window.location.href = '/examples'}
             >
               {t('examples.viewExamples')}
             </Button>
           </VStack>
         )}
       </VStack>
     </Flex>
   );
 };

export default function ImageProcessor() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProcessorContent />
    </Suspense>
  );
}
