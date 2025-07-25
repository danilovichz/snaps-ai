'use client';
import { Box, Skeleton, SkeletonText, SimpleGrid, useColorModeValue } from '@chakra-ui/react';

export const CardSkeleton = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      p={6}
      bg={cardBg}
      borderRadius="xl"
      shadow="lg"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Skeleton height="200px" borderRadius="lg" mb={4} />
      <Skeleton height="24px" mb={2} />
      <SkeletonText noOfLines={2} spacing="2" />
      <Skeleton height="40px" mt={4} borderRadius="md" />
    </Box>
  );
};

export const GridSkeleton = () => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {Array.from({ length: 9 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </SimpleGrid>
  );
};

export const PageSkeleton = () => {
  return (
    <Box>
      <Box mb={8}>
        <Skeleton height="40px" width="60%" mb={4} />
        <Skeleton height="20px" width="80%" />
      </Box>
      <GridSkeleton />
    </Box>
  );
}; 