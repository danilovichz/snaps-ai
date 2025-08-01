'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  useToast,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,

  Divider,
} from '@chakra-ui/react';
import {
  MdCloudUpload,
  MdPerson,
  MdOutlineCheckroom,
  MdAutoAwesome,
  MdDownload,
  MdRefresh,
  MdCheckCircle,
  MdClose,
  MdInfo,
  MdWarning,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import { useLanguage } from '@/contexts/LanguageContext';

// Custom SVG Icons for Garment Types
const TshirtIcon = ({ color = "currentColor", ...props }: any) => (
  <svg viewBox="0 0 512 512" {...props} style={{ color }}>
    <path 
      d="M314.56,48S291.78,56,256,56s-58.56-8-58.56-8a31.94,31.94,0,0,0-10.57,1.8L32,104l16.63,88,48.88,5.52A24,24,0,0,1,118.8,222.1L112,464H400l-6.8-241.9a24,24,0,0,1,21.29-24.58L463.37,192,480,104,325.13,49.8A31.94,31.94,0,0,0,314.56,48Z" 
      style={{fill:"none", stroke:color, strokeLinecap:"round", strokeLinejoin:"round", strokeWidth:"32px"}}
    />
    <path 
      d="M333.31,52.66a80,80,0,0,1-154.62,0" 
      style={{fill:"none", stroke:color, strokeLinecap:"round", strokeLinejoin:"round", strokeWidth:"32px"}}
    />
  </svg>
);

const DressIcon = ({ color = "currentColor", ...props }: any) => (
  <svg viewBox="0 0 64 64" {...props} style={{ color }}>
    <path d="M53.7861,48.67a83.9378,83.9378,0,0,0-9.9873-16.1528,1,1,0,1,0-1.6,1.2012,84.6157,84.6157,0,0,1,9.41,14.9985,37.5263,37.5263,0,0,1-19.4371,5.2039l-.0014,0c-.0114.001-.03,0-.044.0009a2.4537,2.4537,0,0,1-.2978-.0009l-.0012,0a37.6732,37.6732,0,0,1-19.4363-5.2053c2.9645-6.3487,7.4341-12.49,11.5045-17.7368A.9277.9277,0,0,0,24,31h2.16a29.6034,29.6034,0,0,0-2.1077,4.6836,1,1,0,1,0,1.8964.6328A29.9766,29.9766,0,0,1,28.4634,31h1.1752A13.8417,13.8417,0,0,0,29,34a1,1,0,0,0,2,0,16.5232,16.5232,0,0,1,.73-3h3.7256A18.3891,18.3891,0,0,1,37.06,34.34,1,1,0,1,0,38.94,33.66,20.6867,20.6867,0,0,0,37.7567,31h2.8566a.9944.9944,0,0,0,.3551-.0719.947.947,0,0,0,.1145-.0615.97.97,0,0,0,.1437-.077c.0169-.0133.0244-.0329.04-.047a.9728.9728,0,0,0,.1332-.155.6636.6636,0,0,0,.1593-.3251.9717.9717,0,0,0,.0409-.2031c.0013-.0208.012-.0383.012-.0594a.929.929,0,0,0-.0242-.12.7825.7825,0,0,0-.1328-.3858.9384.9384,0,0,0-.0539-.1081,5.9843,5.9843,0,0,1-1.08-2.5263c.3017-1.2466.8965-3.6206,1.498-5.5157A20.8205,20.8205,0,0,0,43,14.7378V11a3,3,0,0,0-6,0v4.3276a19.5534,19.5534,0,0,0-5,3.3,19.5534,19.5534,0,0,0-5-3.3V11a3,3,0,0,0-6,0l.001,3.7705a20.7612,20.7612,0,0,0,1.18,6.5742c.1943.61.3857,1.2666.5693,1.9224a1,1,0,1,0,1.9258-.5381c-.1895-.6792-.3887-1.3584-.5889-1.9893A18.7781,18.7781,0,0,1,23,14.7378V11a1,1,0,0,1,2,0v5a1,1,0,0,0,.6748.9458,16.8392,16.8392,0,0,1,5.6231,3.7666,1,1,0,0,0,1.4042,0,17.0354,17.0354,0,0,1,5.6231-3.7666A1,1,0,0,0,39,16V11a1,1,0,0,1,2,0l.001,3.7051a18.8372,18.8372,0,0,1-1.0879,6.0342c-.5421,1.7081-1.0673,3.7368-1.44,5.2607H24.6758v.0105a.9937.9937,0,0,0-1,.9216,6.4031,6.4031,0,0,1-1.0772,2.4536C18.2178,35.0156,13.32,41.71,10.2139,48.67a1,1,0,0,0,.3193,1.2124c.3359.2485,8.3291,6.04,21.3184,6.0391.0487,0,.0988,0,.1484-.0005s.0992.0005.1484.0005c12.9883,0,20.9825-5.7906,21.3184-6.0391A1.0006,1.0006,0,0,0,53.7861,48.67ZM38.8984,29H25.1063a8.39,8.39,0,0,0,.3793-1H38.52A7.7919,7.7919,0,0,0,38.8984,29Z" fill={color}/>
  </svg>
);

const PantsIcon = ({ color = "currentColor", ...props }: any) => (
  <svg viewBox="0 0 64 64" {...props} style={{ color }}>
    <path d="M32,33l6.7,28h14.4L47.9,3H16.1l-5.2,58h14.4L32,33z M45.2,14.8c0.4-0.4,1-0.7,1.6-0.8l0.4,4.9c-1.6-0.2-2.9-1.1-2.9-2.3   C44.4,15.9,44.7,15.3,45.2,14.8z M46.1,5l0.5,6.2H17.4L17.9,5H46.1z M17.1,14c0.8,0.1,1.5,0.4,2.1,0.9c0.6,0.5,0.9,1.1,0.9,1.7   c-0.1,1.3-1.6,2.3-3.4,2.3L17.1,14z M13.1,59l3.4-38.1c0.1,0,0.1,0,0.2,0c2.9,0,5.3-1.9,5.4-4.3c0.1-1.3-0.5-2.4-1.6-3.3   c-0.1-0.1-0.2-0.1-0.2-0.2H31V18h2v-4.8h11.2c-0.1,0.1-0.2,0.1-0.2,0.2c-1.1,0.9-1.6,2.1-1.6,3.3c0.1,2.3,2.3,4.1,5.1,4.2L50.9,59   H40.3L32,24.5L23.7,59H13.1z" fill={color}/>
  </svg>
);

// Types
type GarmentType = 'upper_body' | 'lower_body' | 'dresses';

interface UploadedImage {
  file?: File;
  preview: string;
  uploaded?: boolean;
  uploadUrl?: string;
  isExample?: boolean;
}

interface ExampleModel {
  id: string;
  name: string;
  preview: string;
  gender: 'male' | 'female' | 'unisex';
}

interface ExampleGarment {
  id: string;
  name: string;
  preview: string;
  type: GarmentType;
  category: string;
}

interface TryOnResult {
  requestId: string;
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  resultUrl?: string;
  queuePosition?: number;
  error?: {
    message: string;
    details: string;
    suggestions: string[];
  };
}

export default function VirtualTryOnPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const { isOpen: isModelModalOpen, onOpen: onModelModalOpen, onClose: onModelModalClose } = useDisclosure();
  const { isOpen: isGarmentModalOpen, onOpen: onGarmentModalOpen, onClose: onGarmentModalClose } = useDisclosure();
  
  // Color mode values
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const dropzoneColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const successColor = useColorModeValue('green.500', 'green.300');
  const warningColor = useColorModeValue('orange.500', 'orange.300');
  const hoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  
  // State management
  const [garmentType, setGarmentType] = useState<GarmentType>('upper_body');
  const [humanImage, setHumanImage] = useState<UploadedImage | null>(null);
  const [garmentImage, setGarmentImage] = useState<UploadedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'setup' | 'upload' | 'processing' | 'result'>('setup');

  // Example data
  const exampleModels: ExampleModel[] = [
    { id: 'model1', name: 'Casual Man', preview: '/examples/models/man-casual.jpg', gender: 'male' },
    { id: 'model2', name: 'Business Woman', preview: '/examples/models/woman-business.jpg', gender: 'female' },
    { id: 'model3', name: 'Young Man', preview: '/examples/models/man-young.jpg', gender: 'male' },
    { id: 'model4', name: 'Fashion Woman', preview: '/examples/models/woman-fashion.jpg', gender: 'female' },
  ];

  const exampleGarments: ExampleGarment[] = [
    // Upper body
    { id: 'tshirt1', name: 'Camiseta Negra', preview: '/examples/garments/upper_body/black_t-shirt.jpg', type: 'upper_body', category: 'Camisetas' },
    { id: 'tshirt2', name: 'Camiseta Azul', preview: '/examples/garments/upper_body/blue_t-shirt.jpg', type: 'upper_body', category: 'Camisetas' },
    
    // Lower body
    { id: 'shorts1', name: 'Shorts Pequeños', preview: '/examples/garments/lower_body/small_shorts.jpg', type: 'lower_body', category: 'Shorts' },
    { id: 'shorts2', name: 'Shorts Deportivos', preview: '/examples/garments/lower_body/sport_shorts.jpg', type: 'lower_body', category: 'Shorts' },
    { id: 'shorts3', name: 'Shorts Jeans', preview: '/examples/garments/lower_body/jeans_shorts.jpg', type: 'lower_body', category: 'Shorts' },
    
    // Dresses
    { id: 'dress1', name: 'Vestido Elegante', preview: '/examples/garments/dresses/dress.jpg', type: 'dresses', category: 'Vestidos' },
  ];

  const filteredGarments = exampleGarments.filter(garment => garment.type === garmentType);

  // File upload handler
  const handleFileUpload = useCallback((
    files: FileList | null, 
    type: 'human' | 'garment'
  ) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Archivo inválido',
        description: 'Por favor sube una imagen válida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'El tamaño máximo es 10MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const preview = URL.createObjectURL(file);
    const uploadedImage: UploadedImage = { file, preview };
    
    if (type === 'human') {
      setHumanImage(uploadedImage);
    } else {
      setGarmentImage(uploadedImage);
    }
  }, [toast]);

  // Handle example selection
  const handleExampleSelection = (example: ExampleModel | ExampleGarment, type: 'human' | 'garment') => {
    const uploadedImage: UploadedImage = { 
      preview: example.preview,
      isExample: true 
    };
    
    if (type === 'human') {
      setHumanImage(uploadedImage);
      onModelModalClose();
    } else {
      setGarmentImage(uploadedImage);
      onGarmentModalClose();
    }
  };

  // Drag and drop handlers
  const createDropHandler = (type: 'human' | 'garment') => ({
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      handleFileUpload(e.dataTransfer.files, type);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
    }
  });

  const humanDropHandlers = createDropHandler('human');
  const garmentDropHandlers = createDropHandler('garment');

  // Upload images to get URLs (both user uploads and examples need public URLs for fal.ai)
  const uploadImage = async (image: UploadedImage): Promise<string> => {
    if (!image.file && !image.isExample) {
      throw new Error('No file to upload');
    }
    
    let fileToUpload: File;
    
    if (image.isExample && image.preview) {
      // For example images, we need to fetch them and convert to File
      console.log('📤 Uploading example image to get public URL:', image.preview);
      
      try {
        const response = await fetch(image.preview);
        const blob = await response.blob();
        const fileName = image.preview.split('/').pop() || 'example-image.jpg';
        fileToUpload = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
      } catch (error) {
        console.error('Error fetching example image:', error);
        throw new Error('Failed to fetch example image');
      }
    } else if (image.file) {
      fileToUpload = image.file;
    } else {
      throw new Error('No file available to upload');
    }
    
    const formData = new FormData();
    formData.append('file', fileToUpload);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await response.json();
    console.log('✅ Image uploaded successfully:', data.url);
    return data.url;
  };

  // Start virtual try-on process
  const startTryOn = async () => {
    if (!humanImage || !garmentImage) {
      toast({
        title: 'Imágenes faltantes',
        description: 'Por favor selecciona tanto una modelo como una prenda',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    setCurrentStep('processing');
    
    try {
      // Upload both images first
      const [humanImageUrl, garmentImageUrl] = await Promise.all([
        uploadImage(humanImage),
        uploadImage(garmentImage)
      ]);
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // Start virtual try-on process with fal.ai
      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          human_image_url: humanImageUrl,
          garment_image_url: garmentImageUrl,
          garment_type: garmentType,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start virtual try-on');
      }
      
      const result = await response.json();
      setTryOnResult(result);
      
      // Start polling for results
      pollForResult(result.request_id);
      
    } catch (error) {
      console.error('Error starting virtual try-on:', error);
      toast({
        title: 'Error en procesamiento',
        description: 'Hubo un error al procesar las imágenes. Intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsProcessing(false);
      setIsUploading(false);
      setCurrentStep('upload');
    }
  };

  // Poll for result
  const pollForResult = async (requestId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/virtual-tryon/status/${requestId}`);
        const status = await response.json();
        
        setTryOnResult(status);
        
        if (status.status === 'COMPLETED') {
          setIsProcessing(false);
          setCurrentStep('result');
          
          if (status.resultUrl) {
            toast({
              title: 'Procesamiento completo',
              description: 'Tu resultado de prueba virtual está listo',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Error en procesamiento',
              description: status.error?.details || 'Hubo un problema al procesar las imágenes',
              status: 'error',
              duration: 7000,
              isClosable: true,
            });
          }
        } else if (status.status === 'FAILED') {
          setIsProcessing(false);
          setCurrentStep('upload');
          toast({
            title: 'Error en procesamiento',
            description: 'Hubo un error. Intenta de nuevo.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setIsProcessing(false);
        setCurrentStep('upload');
        toast({
          title: 'Error de conexión',
          description: 'Verifica tu conexión a internet',
          status: 'error',
          duration: 8000,
          isClosable: true,
        });
      }
    };
    
    checkStatus();
  };

  // Reset to start over
  const resetTryOn = () => {
    setHumanImage(null);
    setGarmentImage(null);
    setIsProcessing(false);
    setIsUploading(false);
    setTryOnResult(null);
    setCurrentStep('setup');
  };

    // Manual download function
  const downloadResult = async () => {
    if (!tryOnResult?.resultUrl) return;
    
    try {
      const response = await fetch(tryOnResult.resultUrl);
      const blob = await response.blob();
      
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `virtual-tryon-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(blobUrl);
      
      toast({
        title: 'Descarga exitosa',
        description: 'Tu resultado se ha descargado correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error de descarga',
        description: 'No se pudo descargar la imagen. Intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex w="100%" direction="column" position="relative" pt={{ base: '70px', md: '0px' }}>
      <VStack spacing="32px" align="stretch" maxW="1400px" mx="auto">
        {/* Header */}
        <Box>
          <Text color={textColor} fontSize="2xl" fontWeight="700" mb="8px">
            {t('virtualTryOn.aiTitle')}
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            {t('virtualTryOn.aiSubtitle')}
          </Text>
        </Box>

        {/* Progress Steps */}
        <Card>
          <HStack spacing="16px" justify="center" py="16px">
            <Badge 
              colorScheme={currentStep === 'setup' ? 'blue' : 'gray'}
              variant={currentStep === 'setup' ? 'solid' : 'outline'}
              color={currentStep === 'setup' ? 'white' : undefined}
            >
              {t('virtualTryOn.step1')}
            </Badge>
            <Badge 
              colorScheme={currentStep === 'upload' ? 'blue' : 'gray'}
              variant={currentStep === 'upload' ? 'solid' : 'outline'}
              color={currentStep === 'upload' ? 'white' : undefined}
            >
              {t('virtualTryOn.step2')}
            </Badge>
            <Badge 
              colorScheme={currentStep === 'processing' ? 'blue' : 'gray'}
              variant={currentStep === 'processing' ? 'solid' : 'outline'}
              color={currentStep === 'processing' ? 'white' : undefined}
            >
              {t('virtualTryOn.step3')}
            </Badge>
            <Badge 
              colorScheme={currentStep === 'result' ? 'green' : 'gray'}
              variant={currentStep === 'result' ? 'solid' : 'outline'}
              color={currentStep === 'result' ? 'white' : undefined}
            >
              {t('virtualTryOn.step4')}
            </Badge>
          </HStack>
        </Card>

        {/* Setup Section - Garment Type Selection */}
        {currentStep === 'setup' && (
          <VStack spacing="24px">
            <Card>
              <VStack spacing="20px" align="stretch">
                <Text color={textColor} fontSize="lg" fontWeight="600" textAlign="center">
                  {t('virtualTryOn.garmentTypeQuestion')}
                </Text>
                
                <HStack spacing="16px" justify="center" wrap="wrap">
                  {/* Upper Body Option */}
                  <Box
                    p="20px"
                    borderRadius="16px"
                    border="3px solid"
                    borderColor={garmentType === 'upper_body' ? 'blue.500' : borderColor}
                    bg={garmentType === 'upper_body' ? 'blue.500' : cardBg}
                    cursor="pointer"
                    onClick={() => setGarmentType('upper_body')}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      borderColor: 'blue.400'
                    }}
                    transition="all 0.2s"
                    minW="140px"
                    boxShadow="md"
                  >
                    <VStack spacing="12px" align="center">
                      <TshirtIcon 
                        color={garmentType === 'upper_body' ? 'white' : '#2D3748'} 
                        width="48px" 
                        height="48px" 
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                      <Text 
                        fontWeight="700" 
                        fontSize="md" 
                        color={garmentType === 'upper_body' ? 'white' : textColor}
                      >
                        {t('virtualTryOn.upperBody')}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color={garmentType === 'upper_body' ? 'white' : gray} 
                        textAlign="center"
                      >
                        {t('virtualTryOn.upperBodyDesc')}
                      </Text>
                    </VStack>
                  </Box>

                  {/* Lower Body Option */}
                  <Box
                    p="20px"
                    borderRadius="16px"
                    border="3px solid"
                    borderColor={garmentType === 'lower_body' ? 'blue.500' : borderColor}
                    bg={garmentType === 'lower_body' ? 'blue.500' : cardBg}
                    cursor="pointer"
                    onClick={() => setGarmentType('lower_body')}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      borderColor: 'blue.400'
                    }}
                    transition="all 0.2s"
                    minW="140px"
                    boxShadow="md"
                  >
                    <VStack spacing="12px" align="center">
                      <PantsIcon 
                        color={garmentType === 'lower_body' ? 'white' : '#2D3748'} 
                        width="48px" 
                        height="48px" 
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                      <Text 
                        fontWeight="700" 
                        fontSize="md" 
                        color={garmentType === 'lower_body' ? 'white' : textColor}
                      >
                        {t('virtualTryOn.lowerBody')}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color={garmentType === 'lower_body' ? 'white' : gray} 
                        textAlign="center"
                      >
                        {t('virtualTryOn.lowerBodyDesc')}
                      </Text>
                    </VStack>
                  </Box>

                  {/* Dresses Option */}
                  <Box
                    p="20px"
                    borderRadius="16px"
                    border="3px solid"
                    borderColor={garmentType === 'dresses' ? 'blue.500' : borderColor}
                    bg={garmentType === 'dresses' ? 'blue.500' : cardBg}
                    cursor="pointer"
                    onClick={() => setGarmentType('dresses')}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      borderColor: 'blue.400'
                    }}
                    transition="all 0.2s"
                    minW="140px"
                    boxShadow="md"
                  >
                    <VStack spacing="12px" align="center">
                      <DressIcon 
                        color={garmentType === 'dresses' ? 'white' : '#2D3748'} 
                        width="48px" 
                        height="48px" 
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                      <Text 
                        fontWeight="700" 
                        fontSize="md" 
                        color={garmentType === 'dresses' ? 'white' : textColor}
                      >
                        {t('virtualTryOn.dresses')}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color={garmentType === 'dresses' ? 'white' : gray} 
                        textAlign="center"
                      >
                        {t('virtualTryOn.dressesDesc')}
                      </Text>
                    </VStack>
                  </Box>
                </HStack>

                <Divider />

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => setCurrentStep('upload')}
                  rightIcon={<Icon as={MdAutoAwesome} />}
                >
                  {t('virtualTryOn.continueWith')} {
                    garmentType === 'upper_body' ? t('virtualTryOn.upperBody') :
                    garmentType === 'lower_body' ? t('virtualTryOn.lowerBody') :
                    t('virtualTryOn.dresses')
                  }
                </Button>
              </VStack>
            </Card>
          </VStack>
        )}

        {/* Upload Section */}
        {currentStep === 'upload' && (
          <VStack spacing="24px">
            {/* Quick Guidelines */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="16px" w="100%">
              <Alert status="success" borderRadius="12px">
                <AlertIcon as={MdCheckCircle} />
                <Box>
                  <AlertTitle>{t('virtualTryOn.whatWorksBestTitle')}</AlertTitle>
                  <AlertDescription>
                    {t('virtualTryOn.whatWorksBestDescription')}
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Alert status="warning" borderRadius="12px">
                <AlertIcon as={MdWarning} />
                <Box>
                  <AlertTitle>{t('virtualTryOn.avoidTitle')}</AlertTitle>
                  <AlertDescription>
                    {t('virtualTryOn.avoidDescription')}
                  </AlertDescription>
                </Box>
              </Alert>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="24px" w="100%">
              {/* Human Image Selection */}
            <Card>
              <VStack spacing="16px">
                  <HStack spacing="8px" justify="space-between" w="100%">
                    <HStack>
                  <Icon as={MdPerson} w="20px" h="20px" color="blue.500" />
                  <Text color={textColor} fontSize="lg" fontWeight="600">
                        {t('virtualTryOn.selectModel')}
                  </Text>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onModelModalOpen}
                    >
                      {t('virtualTryOn.viewExamples')}
                    </Button>
                </HStack>
                
                {!humanImage ? (
                  <Box
                    {...humanDropHandlers}
                    w="100%"
                    h="300px"
                    border="2px dashed"
                    borderColor={borderColor}
                    borderRadius="12px"
                    bg={dropzoneColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                      _hover={{ bg: hoverBg }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        handleFileUpload(target.files, 'human');
                      };
                      input.click();
                    }}
                  >
                    <VStack spacing="12px">
                      <Icon as={MdCloudUpload} w="32px" h="32px" color={gray} />
                      <Text color={gray} fontSize="sm" textAlign="center">
                          {t('virtualTryOn.dragOrClickToUpload')}
                        </Text>
                        <Text color={gray} fontSize="xs" textAlign="center">
                          {t('virtualTryOn.orUseExample')}
                      </Text>
                    </VStack>
                  </Box>
                ) : (
                  <Box position="relative" w="100%">
                    <Box
                      w="100%"
                      h="300px"
                      backgroundImage={`url(${humanImage.preview})`}
                      backgroundSize="contain"
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor="green.500"
                    />
                    <Button
                      position="absolute"
                      top="8px"
                      right="8px"
                      size="sm"
                      colorScheme="red"
                      onClick={() => setHumanImage(null)}
                    >
                      ×
                    </Button>
                      {humanImage.isExample && (
                        <Badge
                          position="absolute"
                          top="8px"
                          left="8px"
                          colorScheme="blue"
                        >
                          {t('virtualTryOn.exampleBadge')}
                        </Badge>
                      )}
                  </Box>
                )}
              </VStack>
            </Card>

              {/* Garment Image Selection */}
            <Card>
              <VStack spacing="16px">
                  <HStack spacing="8px" justify="space-between" w="100%">
                    <HStack>
                  <Icon as={MdOutlineCheckroom} w="20px" h="20px" color="purple.500" />
                  <Text color={textColor} fontSize="lg" fontWeight="600">
                        {t('virtualTryOn.selectGarment')}
                  </Text>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onGarmentModalOpen}
                    >
                      {t('virtualTryOn.viewExamples')}
                    </Button>
                </HStack>
                
                {!garmentImage ? (
                  <Box
                    {...garmentDropHandlers}
                    w="100%"
                    h="300px"
                    border="2px dashed"
                    borderColor={borderColor}
                    borderRadius="12px"
                    bg={dropzoneColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                      _hover={{ bg: hoverBg }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        handleFileUpload(target.files, 'garment');
                      };
                      input.click();
                    }}
                  >
                    <VStack spacing="12px">
                      <Icon as={MdCloudUpload} w="32px" h="32px" color={gray} />
                      <Text color={gray} fontSize="sm" textAlign="center">
                          {t('virtualTryOn.dragOrClickToUploadGarment')}
                        </Text>
                        <Text color={gray} fontSize="xs" textAlign="center">
                          {t('virtualTryOn.orUseExample')}
                      </Text>
                    </VStack>
                  </Box>
                ) : (
                  <Box position="relative" w="100%">
                    <Box
                      w="100%"
                      h="300px"
                      backgroundImage={`url(${garmentImage.preview})`}
                      backgroundSize="contain"
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor="green.500"
                    />
                    <Button
                      position="absolute"
                      top="8px"
                      right="8px"
                      size="sm"
                      colorScheme="red"
                      onClick={() => setGarmentImage(null)}
                    >
                      ×
                    </Button>
                      {garmentImage.isExample && (
                        <Badge
                          position="absolute"
                          top="8px"
                          left="8px"
                          colorScheme="purple"
                        >
                          {t('virtualTryOn.exampleBadge')}
                        </Badge>
                      )}
                  </Box>
                )}
              </VStack>
            </Card>
          </SimpleGrid>

            {/* Action Buttons */}
            <Card>
              <HStack justify="center" spacing="16px" py="16px">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setCurrentStep('setup')}
                >
                  {t('virtualTryOn.backButton')}
                </Button>
                <Button
                  leftIcon={<Icon as={MdAutoAwesome} />}
                  colorScheme="blue"
                  size="lg"
                  isDisabled={!humanImage || !garmentImage}
                  onClick={startTryOn}
                >
                  {t('virtualTryOn.startVirtualTryOnButton')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetTryOn}
                  isDisabled={!humanImage && !garmentImage}
                >
                  {t('virtualTryOn.clearAllButton')}
                </Button>
              </HStack>
            </Card>
          </VStack>
        )}

        {/* Processing Section */}
        {currentStep === 'processing' && (
          <Card>
            <VStack spacing="24px" py="40px">
              <Icon as={MdAutoAwesome} w="48px" h="48px" color="blue.500" />
              <Text color={textColor} fontSize="xl" fontWeight="600">
                {isUploading ? t('virtualTryOn.uploadingImages') : t('virtualTryOn.processingWithAI')}
              </Text>
              
              {isUploading ? (
                <Progress value={50} size="lg" colorScheme="blue" w="100%" maxW="400px" />
              ) : (
                <>
                  <Progress 
                    isIndeterminate 
                    size="lg" 
                    colorScheme="blue" 
                    w="100%" 
                    maxW="400px" 
                  />
                  {tryOnResult?.queuePosition && (
                    <Text color={gray} fontSize="sm">
                      {t('virtualTryOn.queuePosition')}: {tryOnResult.queuePosition}
                    </Text>
                  )}
                </>
              )}
              
              <Text color={gray} fontSize="sm" textAlign="center" maxW="400px">
                {isUploading ? 
                  t('virtualTryOn.uploadingImagesDescription') : 
                  t('virtualTryOn.aiProcessingDescription')
                }
              </Text>
            </VStack>
          </Card>
        )}

        {/* Result Section */}
        {currentStep === 'result' && (
          <VStack spacing="24px">
            {tryOnResult?.resultUrl ? (
              // Success - Show result
              <>
                <Card>
                  <VStack spacing="16px">
                    <Text color={textColor} fontSize="lg" fontWeight="600">
                      {t('virtualTryOn.virtualTryOnResultTitle')}
                    </Text>
                    <Box
                      w="100%"
                      maxW="500px"
                      borderRadius="12px"
                      overflow="hidden"
                      border="2px solid"
                      borderColor="green.500"
                      boxShadow="lg"
                      key={`result-${tryOnResult.requestId || 'image'}`}
                    >
                      <img 
                        src={tryOnResult.resultUrl} 
                        alt="Virtual Try-On Result"
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                        loading="lazy"
                        key={tryOnResult.resultUrl}
                      />
                    </Box>
                    <Text color={gray} fontSize="sm" textAlign="center" maxW="400px">
                      {t('virtualTryOn.resultReady')}
                    </Text>
                  </VStack>
                </Card>
                
                <HStack spacing="16px">
                  <Button
                    leftIcon={<Icon as={MdDownload} />}
                    colorScheme="green"
                    size="lg"
                    onClick={downloadResult}
                  >
                    {t('virtualTryOn.downloadResultButton')}
                  </Button>
                  <Button
                    leftIcon={<Icon as={MdRefresh} />}
                    variant="outline"
                    size="lg"
                    onClick={resetTryOn}
                  >
                    {t('virtualTryOn.tryAnotherGarmentButton')}
                  </Button>
                </HStack>
              </>
            ) : (
              // Error - Show detailed error information
              <Card>
                <VStack spacing="16px">
                  <Text color="red.500" fontSize="lg" fontWeight="600">
                    {t('virtualTryOn.processingErrorTitle')}
                  </Text>
                  <Text color={textColor} fontSize="md" textAlign="center" maxW="600px">
                    {(tryOnResult as any)?.error?.details || 
                     t('virtualTryOn.processingErrorDescription')}
                  </Text>
                  
                  {(tryOnResult as any)?.error?.suggestions && (
                    <VStack spacing="8px" align="start" maxW="600px">
                      <Text color={textColor} fontSize="sm" fontWeight="600">
                        {t('virtualTryOn.suggestionsTitle')}
                      </Text>
                      {((tryOnResult as any).error.suggestions as string[]).map((suggestion: string, index: number) => (
                        <Text key={index} color={gray} fontSize="sm" ml="16px">
                          • {suggestion === 'Try using example images first' ? t('virtualTryOn.tryExampleImagesFirst') :
                             suggestion === 'Ensure uploaded images show a clear full-body person' ? t('virtualTryOn.ensureFullBodyPerson') :
                             suggestion === 'Use images with good lighting and contrast' ? t('virtualTryOn.useGoodLightingContrast') :
                             suggestion === 'Avoid images with complex backgrounds' ? t('virtualTryOn.avoidComplexBackgrounds') :
                             suggestion}
                        </Text>
                      ))}
                    </VStack>
                  )}
                  
                  <Text color={gray} fontSize="xs" textAlign="center" maxW="500px" mt="16px">
                    {t('virtualTryOn.technicalError')}: {(tryOnResult as any)?.error?.message || t('virtualTryOn.unknownError')}
                  </Text>
                  
                  <Button
                    leftIcon={<Icon as={MdRefresh} />}
                    colorScheme="blue"
                    size="lg"
                    onClick={resetTryOn}
                    mt="16px"
                  >
                    {t('virtualTryOn.tryAgainButton')}
                  </Button>
                </VStack>
              </Card>
            )}
          </VStack>
        )}

        {/* Models Modal */}
        <Modal isOpen={isModelModalOpen} onClose={onModelModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent bg={cardBg} borderRadius="16px">
            <ModalHeader>{t('virtualTryOn.selectModelExampleModalTitle')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody bg={useColorModeValue('white', 'gray.800')} borderRadius="12px" p="24px">
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px">
                {exampleModels.map((model) => (
                  <Box
                    key={model.id}
                    cursor="pointer"
                    onClick={() => handleExampleSelection(model, 'human')}
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                  >
                    <Box
                      w="100%"
                      h="200px"
                      backgroundImage={`url(${model.preview})`}
                      backgroundSize="contain"
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor={borderColor}
                      _hover={{ borderColor: 'blue.500' }}
                    />
                    <Text fontSize="sm" fontWeight="600" mt="8px" textAlign="center">
                      {model.name}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onModelModalClose}>
                {t('virtualTryOn.closeButton')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Garments Modal */}
        <Modal isOpen={isGarmentModalOpen} onClose={onGarmentModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent bg={cardBg} borderRadius="16px">
            <ModalHeader>
              {t('virtualTryOn.selectGarmentExampleModalTitle')} - {
                garmentType === 'upper_body' ? t('virtualTryOn.upperBody') : 
                garmentType === 'lower_body' ? t('virtualTryOn.lowerBody') : t('virtualTryOn.dresses')
              }
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody bg={useColorModeValue('white', 'gray.800')} borderRadius="12px" p="24px">
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing="16px">
                {filteredGarments.map((garment) => (
                  <Box
                    key={garment.id}
                    cursor="pointer"
                    onClick={() => handleExampleSelection(garment, 'garment')}
                    _hover={{ transform: 'scale(1.02)' }}
                    transition="all 0.2s"
                  >
                    <Box
                      w="100%"
                      h="200px"
                      backgroundImage={`url(${garment.preview})`}
                      backgroundSize="contain"
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      borderRadius="12px"
                      border="2px solid"
                      borderColor={borderColor}
                      _hover={{ borderColor: 'purple.500' }}
                    />
                    <Text fontSize="sm" fontWeight="600" mt="8px" textAlign="center">
                      {garment.name}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onGarmentModalClose}>
                {t('virtualTryOn.closeButton')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Flex>
  );
} 