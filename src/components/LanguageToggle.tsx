'use client';
import React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useLanguage } from '@/contexts/LanguageContext';

const flags = {
  en: '🇺🇸',
  es: '🇪🇸',
};

const languageNames = {
  en: 'English',
  es: 'Español',
};

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        size="sm"
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
        _active={{ bg: useColorModeValue('gray.100', 'gray.600') }}
      >
        <HStack spacing={2}>
          <Text fontSize="lg">{flags[language]}</Text>
          <Text fontWeight="medium">{languageNames[language]}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setLanguage('en')}>
          <HStack spacing={3}>
            <Text fontSize="lg">{flags.en}</Text>
            <Text>{languageNames.en}</Text>
          </HStack>
        </MenuItem>
        <MenuItem onClick={() => setLanguage('es')}>
          <HStack spacing={3}>
            <Text fontSize="lg">{flags.es}</Text>
            <Text>{languageNames.es}</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}; 