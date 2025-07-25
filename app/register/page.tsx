'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  HStack,
  Link,
  useColorModeValue,
  useToast,
  Spinner,
  Icon,
  Checkbox,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { MdEmail, MdArrowForward } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { signUp, user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const toast = useToast();
  
  // Color mode values
  const bgOverlay = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.3)');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)');
  const textColor = useColorModeValue('gray.800', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const inputBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(45, 55, 72, 0.9)');
  const borderColor = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(74, 85, 104, 0.8)');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      setIsRedirecting(true);
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!acceptTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, {
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`,
      }
    });
    
    if (!error) {
      // Success message is handled by AuthContext
      // User will need to confirm email before they can sign in
    }
    
    setIsLoading(false);
  };

  if (authLoading || isRedirecting) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgImage="url('/img/auth-bg.jpg')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: bgOverlay,
          backdropFilter: 'blur(20px)',
        }}
      >
        <VStack spacing={4} position="relative" zIndex={1}>
          <Spinner size="xl" color={brandColor} thickness="4px" />
          <Text color="white" fontWeight="600" fontSize="lg">
            {isRedirecting ? 'Welcome! Redirecting...' : 'Loading...'}
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgImage="url('/img/auth-bg.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      px={4}
      py={8}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: bgOverlay,
        backdropFilter: 'blur(20px)',
      }}
    >
      <Box
        position="relative"
        zIndex={1}
        maxW="550px"
        w="full"
        bg={cardBg}
        backdropFilter="blur(40px)"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)"
        rounded="3xl"
        p={12}
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.2)"
      >
        <VStack spacing={8} align="stretch">
          {/* Logo and Header */}
          <VStack spacing={6}>
            <Box
              p={4}
              bg="rgba(255, 255, 255, 0.1)"
              borderRadius="2xl"
              backdropFilter="blur(10px)"
            >
              <img
                src="/img/snaps-logo.png"
                alt="Snaps Logo"
                style={{
                  height: '80px',
                  width: 'auto',
                  maxWidth: '250px',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <VStack spacing={2} textAlign="center">
              <Text fontSize="3xl" fontWeight="800" color={textColor} letterSpacing="-0.02em">
                Create your account
              </Text>
              <Text fontSize="lg" color="gray.600" fontWeight="500">
                Join Snaps and start creating amazing virtual try-ons
              </Text>
            </VStack>
          </VStack>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              {/* Name Fields */}
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                    First Name
                  </FormLabel>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    size="lg"
                    fontSize="md"
                    _hover={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.2)'
                    }}
                    _focus={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                    Last Name
                  </FormLabel>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    size="lg"
                    fontSize="md"
                    _hover={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.2)'
                    }}
                    _focus={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                    }}
                  />
                </FormControl>
              </HStack>

              {/* Email */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                  Email Address
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    fontSize="md"
                    _hover={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.2)'
                    }}
                    _focus={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                    }}
                  />
                  <InputRightElement h="full">
                    <Icon as={MdEmail} color="gray.400" />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Password */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                  Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    fontSize="md"
                    _hover={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.2)'
                    }}
                    _focus={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                    }}
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                      borderRadius="lg"
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Confirm Password */}
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                  Confirm Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    fontSize="md"
                    _hover={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 1px rgba(124, 58, 237, 0.2)'
                    }}
                    _focus={{ 
                      borderColor: brandColor,
                      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
                    }}
                  />
                  <InputRightElement h="full">
                    <Button
                      variant="ghost"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      size="sm"
                      borderRadius="lg"
                    >
                      {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Terms and Conditions */}
              <FormControl>
                <Checkbox
                  isChecked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  colorScheme="brand"
                  size="lg"
                >
                  <Text fontSize="sm" color={textColor} fontWeight="500">
                    I agree to the{' '}
                    <Link color={brandColor} fontWeight="600" _hover={{ textDecoration: 'underline' }}>
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link color={brandColor} fontWeight="600" _hover={{ textDecoration: 'underline' }}>
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox>
              </FormControl>

              {/* Sign Up Button */}
              <Button
                type="submit"
                colorScheme="brand"
                w="full"
                size="lg"
                height="56px"
                fontSize="md"
                fontWeight="700"
                borderRadius="xl"
                isLoading={isLoading}
                loadingText="Creating account..."
                rightIcon={<Icon as={MdArrowForward} />}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                _hover={{
                  bg: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(124, 58, 237, 0.3)"
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
              >
                Create Account
              </Button>
            </VStack>
          </form>

          {/* Info Alert */}
          <Alert 
            status="info" 
            borderRadius="xl" 
            bg="rgba(59, 130, 246, 0.1)" 
            borderColor="rgba(59, 130, 246, 0.3)"
            border="1px solid"
          >
            <AlertIcon color="blue.400" />
            <Text fontSize="sm" fontWeight="500">
              You'll receive an email to verify your account after signing up.
            </Text>
          </Alert>



          {/* Sign In Link */}
          <Text textAlign="center" fontSize="md" color="gray.600" fontWeight="500">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              color={brandColor}
              fontWeight="700"
              _hover={{ textDecoration: 'underline', color: 'brand.600' }}
            >
              Sign in here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
} 