'use client';
import React, { ReactNode } from 'react';
import '@/styles/App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import theme from '@/theme/theme';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ChakraProvider>
  );
}
