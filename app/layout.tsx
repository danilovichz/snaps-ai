'use client';
import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure, Flex, Spinner, VStack, Text } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/App.css';
import AppWrappers from './AppWrappers';
import Head from 'next/head';

// Inner component that uses translation and auth
function LayoutContent({ children }: { children: ReactNode }): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  // Get the route name and translate it
  const routeName = getActiveRoute(routes, pathname);
  const translatedBrandText = routeName ? t(routeName) : 'Snaps';

  // Check if current path is an auth page
  const isAuthPage = pathname?.includes('register') || pathname?.includes('sign-in');
  
  // Redirect to sign-in if not authenticated and not on auth page
  // This useEffect must be called before any conditional returns
  useEffect(() => {
    if (!authLoading && !user && !isAuthPage) {
      router.push('/sign-in');
    }
  }, [user, authLoading, isAuthPage, router]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Flex>
    );
  }

  // Don't show sidebar/navbar for auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Don't render protected content if user is not authenticated
  if (!user) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.600">Redirecting to sign in...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>Snaps - AI-Powered Virtual Try-On Experience</title>
        <meta name="description" content="Experience the future of fashion with Snaps AI virtual try-on technology" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/img/snaps-logo.png" type="image/png" sizes="192x192" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/snaps-logo.png" />
        <meta name="theme-color" content="#7928CA" />
      </Head>
      <Box>
        <Sidebar routes={routes} />
        <Box
          pt={{ base: '60px', md: '100px' }}
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'Snaps'}
                brandText={translatedBrandText}
                secondary={getActiveNavbar(routes, pathname)}
              />
            </Box>
          </Portal>
          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            {children}
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <AppWrappers>
          <LayoutContent>{children}</LayoutContent>
        </AppWrappers>
      </body>
    </html>
  );
}
