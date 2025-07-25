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
  Link,
  useColorModeValue,
  useToast,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { MdEmail, MdArrowForward } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { signIn, user, loading: authLoading } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      // Success is handled by AuthContext
      setIsRedirecting(true);
      router.push('/');
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
            {isRedirecting ? 'Welcome back! Redirecting...' : 'Loading...'}
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
        maxW="500px"
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
                Welcome back
              </Text>
              <Text fontSize="lg" color="gray.600" fontWeight="500">
                Sign in to your Snaps account
              </Text>
            </VStack>
          </VStack>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                  Email Address
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <FormControl>
                <FormLabel color={textColor} fontSize="sm" fontWeight="600" mb={3}>
                  Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Forgot Password */}
              <Flex justify="flex-end" w="full">
                <Link
                  href="/forgot-password"
                  color={brandColor}
                  fontSize="sm"
                  fontWeight="600"
                  _hover={{ textDecoration: 'underline', color: 'brand.600' }}
                >
                  Forgot password?
                </Link>
              </Flex>

              {/* Sign In Button */}
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
                loadingText="Signing in..."
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
                Sign In
              </Button>
            </VStack>
          </form>



          {/* Sign Up Link */}
          <Text textAlign="center" fontSize="md" color="gray.600" fontWeight="500">
            Don't have an account?{' '}
            <Link
              href="/register"
              color={brandColor}
              fontWeight="700"
              _hover={{ textDecoration: 'underline', color: 'brand.600' }}
            >
              Create one now
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
} 