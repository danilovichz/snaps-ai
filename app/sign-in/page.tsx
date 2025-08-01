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
  useToast,
  Spinner,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
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
      setIsRedirecting(true);
      router.push('/');
    }
    
    setIsLoading(false);
  };

  if (authLoading || isRedirecting) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="white">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600" fontWeight="600" fontSize="lg">
            {isRedirecting ? 'Welcome back! Redirecting...' : 'Loading...'}
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" direction={{ base: 'column', lg: 'row' }}>
      {/* Left side - Login Form */}
      <Box
        flex="1"
        maxW={{ base: '100%', lg: '50%' }}
        bg="white"
        p={{ base: 8, md: 12, lg: 16 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box w="full" maxW="400px">
          <VStack spacing={8} align="stretch">
            {/* Logo and Header */}
            <VStack spacing={6} textAlign="left" align="flex-start">
              <img
                src="/img/snaps-logo.png"
                alt="Snaps Logo"
                style={{
                  height: '60px',
                  width: 'auto',
                  maxWidth: '200px',
                  objectFit: 'contain'
                }}
              />
              <VStack spacing={2} align="flex-start">
                <Text fontSize="2xl" fontWeight="600" color="gray.900">
                  Comienza tu experiencia
                </Text>
                <Text fontSize="md" color="gray.600" fontWeight="400">
                  Inicia sesión para reservar o gestionar tus sesiones fotográficas
                </Text>
              </VStack>
            </VStack>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm" fontWeight="500" mb={2}>
                    Correo electrónico
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@email.com"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="lg"
                    fontSize="md"
                    h="48px"
                    _hover={{ 
                      borderColor: "blue.400"
                    }}
                    _focus={{ 
                      borderColor: "blue.500",
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontSize="sm" fontWeight="500" mb={2}>
                    Contraseña
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="lg"
                      fontSize="md"
                      h="48px"
                      _hover={{ 
                        borderColor: "blue.400"
                      }}
                      _focus={{ 
                        borderColor: "blue.500",
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      }}
                    />
                    <InputRightElement h="48px">
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                        color="gray.400"
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  w="full"
                  h="48px"
                  bg="blue.500"
                  color="white"
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="lg"
                  isLoading={isLoading}
                  loadingText="Iniciando sesión..."
                  _hover={{
                    bg: "blue.600"
                  }}
                  _active={{
                    bg: "blue.700"
                  }}
                >
                  Iniciar sesión
                </Button>
              </VStack>
            </form>

            {/* Divider */}
            <HStack spacing={4}>
              <Divider />
              <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
                O CONTINÚA CON
              </Text>
              <Divider />
            </HStack>

            {/* Social Login Buttons */}
            <VStack spacing={3}>
              <Button
                w="full"
                h="48px"
                variant="outline"
                borderColor="gray.300"
                borderRadius="lg"
                leftIcon={<Icon as={FaGoogle} color="red.500" />}
                _hover={{ bg: "gray.50" }}
              >
                Google
              </Button>
              <Button
                w="full"
                h="48px"
                variant="outline"
                borderColor="gray.300"
                borderRadius="lg"
                leftIcon={<Icon as={FaFacebook} color="blue.600" />}
                _hover={{ bg: "gray.50" }}
              >
                Facebook
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Box>

      {/* Right side - Gradient Background */}
      <Box
        flex="1"
        minW={{ base: '100%', lg: '50%' }}
        minH={{ base: '200px', lg: '100vh' }}
        bgImage="url('/img/auth-bg-gradient.jpg')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display={{ base: 'none', lg: 'block' }}
      />
    </Flex>
  );
} 