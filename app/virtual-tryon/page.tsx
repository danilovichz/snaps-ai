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
  Radio,
  RadioGroup,
  Stack,
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
            Virtual Try-On con IA
          </Text>
          <Text color={gray} fontSize="md" fontWeight="400">
            Prueba ropa virtualmente usando inteligencia artificial avanzada
          </Text>
        </Box>

        {/* Progress Steps */}
        <Card>
          <HStack spacing="16px" justify="center" py="16px">
            <Badge 
              colorScheme={currentStep === 'setup' ? 'blue' : 'gray'}
              variant={currentStep === 'setup' ? 'solid' : 'outline'}
            >
              1. Seleccionar Tipo de Prenda
            </Badge>
            <Badge 
              colorScheme={currentStep === 'upload' ? 'blue' : 'gray'}
              variant={currentStep === 'upload' ? 'solid' : 'outline'}
            >
              2. Subir Imágenes
            </Badge>
            <Badge 
              colorScheme={currentStep === 'processing' ? 'blue' : 'gray'}
              variant={currentStep === 'processing' ? 'solid' : 'outline'}
            >
              3. Procesando
            </Badge>
            <Badge 
              colorScheme={currentStep === 'result' ? 'green' : 'gray'}
              variant={currentStep === 'result' ? 'solid' : 'outline'}
            >
              4. Resultado
            </Badge>
          </HStack>
        </Card>

        {/* Setup Section - Garment Type Selection */}
        {currentStep === 'setup' && (
          <VStack spacing="24px">
            <Card>
              <VStack spacing="20px" align="stretch">
                <Text color={textColor} fontSize="lg" fontWeight="600" textAlign="center">
                  ¿Qué tipo de prenda quieres probar?
                </Text>
                
                <RadioGroup value={garmentType} onChange={(value) => setGarmentType(value as GarmentType)}>
                  <Stack direction="row" spacing="24px" justify="center" wrap="wrap">
                    <Radio value="upper_body" size="lg" colorScheme="blue">
                      <VStack spacing="8px" align="center">
                        <Text fontWeight="600">Parte Superior</Text>
                        <Text fontSize="sm" color={gray}>Camisetas, camisas, sudaderas</Text>
                      </VStack>
                    </Radio>
                    <Radio value="lower_body" size="lg" colorScheme="blue">
                      <VStack spacing="8px" align="center">
                        <Text fontWeight="600">Parte Inferior</Text>
                        <Text fontSize="sm" color={gray}>Pantalones, jeans, shorts</Text>
                      </VStack>
                    </Radio>
                    <Radio value="dresses" size="lg" colorScheme="blue">
                      <VStack spacing="8px" align="center">
                        <Text fontWeight="600">Vestidos</Text>
                        <Text fontSize="sm" color={gray}>Vestidos casuales y formales</Text>
                      </VStack>
                    </Radio>
                  </Stack>
                </RadioGroup>

                <Divider />

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => setCurrentStep('upload')}
                  rightIcon={<Icon as={MdAutoAwesome} />}
                >
                  Continuar con {garmentType === 'upper_body' ? 'Parte Superior' : 
                                garmentType === 'lower_body' ? 'Parte Inferior' : 'Vestidos'}
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
                  <AlertTitle>Lo que funciona mejor:</AlertTitle>
                  <AlertDescription>
                    Imagen frontal de la prenda con buena iluminación, sobre superficie plana, vista desde arriba, sin arrugas
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Alert status="warning" borderRadius="12px">
                <AlertIcon as={MdWarning} />
                <Box>
                  <AlertTitle>Evita:</AlertTitle>
                  <AlertDescription>
                    Mala iluminación, mangas dobladas, tomas en ángulo, fondos desordenados, sombras
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
                        Seleccionar Modelo
                  </Text>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onModelModalOpen}
                    >
                      Ver Ejemplos
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
                          Arrastra una imagen o haz clic para subir
                        </Text>
                        <Text color={gray} fontSize="xs" textAlign="center">
                          O usa uno de nuestros modelos de ejemplo
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
                          Ejemplo
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
                        Seleccionar Prenda
                  </Text>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onGarmentModalOpen}
                    >
                      Ver Ejemplos
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
                          Arrastra una imagen de {garmentType === 'upper_body' ? 'parte superior' : 
                                                   garmentType === 'lower_body' ? 'parte inferior' : 'vestido'}
                        </Text>
                        <Text color={gray} fontSize="xs" textAlign="center">
                          O usa uno de nuestros ejemplos
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
                          Ejemplo
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
                  Volver
                </Button>
                <Button
                  leftIcon={<Icon as={MdAutoAwesome} />}
                  colorScheme="blue"
                  size="lg"
                  isDisabled={!humanImage || !garmentImage}
                  onClick={startTryOn}
                >
                  Comenzar Prueba Virtual
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetTryOn}
                  isDisabled={!humanImage && !garmentImage}
                >
                  Limpiar Todo
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
                {isUploading ? 'Subiendo imágenes...' : 'Procesando con IA...'}
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
                      Posición en cola: {tryOnResult.queuePosition}
                    </Text>
                  )}
                </>
              )}
              
              <Text color={gray} fontSize="sm" textAlign="center" maxW="400px">
                {isUploading ? 
                  'Subiendo tus imágenes a nuestros servidores...' : 
                  'Nuestra IA está procesando las imágenes para crear tu prueba virtual. Esto puede tomar unos minutos.'
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
                      ¡Tu Resultado de Prueba Virtual!
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
                      Tu resultado está listo. ¿Te gusta cómo se ve la prenda?
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
                    Descargar Resultado
                  </Button>
                  <Button
                    leftIcon={<Icon as={MdRefresh} />}
                    variant="outline"
                    size="lg"
                    onClick={resetTryOn}
                  >
                    Probar Otra Prenda
                  </Button>
                </HStack>
              </>
            ) : (
              // Error - Show detailed error information
              <Card>
                <VStack spacing="16px">
                  <Text color="red.500" fontSize="lg" fontWeight="600">
                    Error en Procesamiento
                  </Text>
                  <Text color={textColor} fontSize="md" textAlign="center" maxW="600px">
                    {(tryOnResult as any)?.error?.details || 
                     'Hubo un problema al procesar las imágenes. Esto suele ocurrir con imágenes incompatibles.'}
                  </Text>
                  
                  {(tryOnResult as any)?.error?.suggestions && (
                    <VStack spacing="8px" align="start" maxW="600px">
                      <Text color={textColor} fontSize="sm" fontWeight="600">
                        Sugerencias para mejores resultados:
                      </Text>
                      {((tryOnResult as any).error.suggestions as string[]).map((suggestion: string, index: number) => (
                        <Text key={index} color={gray} fontSize="sm" ml="16px">
                          • {suggestion === 'Try using example images first' ? 'Prueba primero con las imágenes de ejemplo' :
                             suggestion === 'Ensure uploaded images show a clear full-body person' ? 'Asegúrate de que las imágenes muestren claramente a una persona de cuerpo completo' :
                             suggestion === 'Use images with good lighting and contrast' ? 'Usa imágenes con buena iluminación y contraste' :
                             suggestion === 'Avoid images with complex backgrounds' ? 'Evita imágenes con fondos complejos' :
                             suggestion}
                        </Text>
                      ))}
                    </VStack>
                  )}
                  
                  <Text color={gray} fontSize="xs" textAlign="center" maxW="500px" mt="16px">
                    Error técnico: {(tryOnResult as any)?.error?.message || 'Error desconocido'}
                  </Text>
                  
                  <Button
                    leftIcon={<Icon as={MdRefresh} />}
                    colorScheme="blue"
                    size="lg"
                    onClick={resetTryOn}
                    mt="16px"
                  >
                    Intentar de Nuevo
                  </Button>
                </VStack>
              </Card>
            )}
          </VStack>
        )}

        {/* Models Modal */}
        <Modal isOpen={isModelModalOpen} onClose={onModelModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Seleccionar Modelo de Ejemplo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Garments Modal */}
        <Modal isOpen={isGarmentModalOpen} onClose={onGarmentModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Seleccionar Prenda de Ejemplo - {
                garmentType === 'upper_body' ? 'Parte Superior' : 
                garmentType === 'lower_body' ? 'Parte Inferior' : 'Vestidos'
              }
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Flex>
  );
} 