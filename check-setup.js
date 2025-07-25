const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del Virtual Try-On...\n');

// Verificar archivos de configuración
console.log('📋 Archivos de configuración:');
const envExists = fs.existsSync('.env.local');
console.log(`  ✅ .env.local: ${envExists ? 'Existe' : '❌ No encontrado'}`);

if (envExists) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://niattjpmdyownffusrsq.supabase.co');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your_anon_key_here');
  const hasFalKey = envContent.includes('FAL_KEY=');
  const hasFalKeyConfigured = hasFalKey && !envContent.includes('your_fal_api_key_here');
  
  console.log(`     - Supabase URL: ${hasSupabaseUrl ? '✅' : '❌'}`);
  console.log(`     - Supabase Key: ${hasSupabaseKey ? '✅' : '❌'}`);
  console.log(`     - Fal.ai Key: ${hasFalKey ? '✅ Presente' : '❌ No encontrada'}`);
  console.log(`     - Fal.ai Configurada: ${hasFalKeyConfigured ? '✅' : '⚠️ Necesita configuración'}`);
}

// Verificar estructura de carpetas
console.log('\n📁 Estructura de carpetas:');
const folders = [
  'public/examples',
  'public/examples/models',
  'public/examples/garments',
  'public/examples/garments/upper_body',
  'public/examples/garments/lower_body',
  'public/examples/garments/dresses'
];

folders.forEach(folder => {
  const exists = fs.existsSync(folder);
  console.log(`  ${exists ? '✅' : '❌'} ${folder}`);
});

// Verificar imágenes de ejemplo
console.log('\n🖼️ Imágenes de ejemplo:');

const requiredModels = [
  'public/examples/models/man-casual.jpg',
  'public/examples/models/woman-business.jpg',
  'public/examples/models/man-young.jpg',
  'public/examples/models/woman-fashion.jpg'
];

const requiredGarments = [
  'public/examples/garments/upper_body/tshirt-white.jpg',
  'public/examples/garments/upper_body/shirt-blue.jpg',
  'public/examples/garments/upper_body/hoodie-gray.jpg',
  'public/examples/garments/lower_body/jeans-blue.jpg',
  'public/examples/garments/lower_body/pants-black.jpg',
  'public/examples/garments/lower_body/shorts-khaki.jpg',
  'public/examples/garments/dresses/dress-summer.jpg',
  'public/examples/garments/dresses/dress-evening.jpg'
];

console.log('  Modelos:');
let modelsCount = 0;
requiredModels.forEach(img => {
  const exists = fs.existsSync(img);
  if (exists) modelsCount++;
  console.log(`    ${exists ? '✅' : '❌'} ${path.basename(img)}`);
});

console.log('  Prendas:');
let garmentsCount = 0;
requiredGarments.forEach(img => {
  const exists = fs.existsSync(img);
  if (exists) garmentsCount++;
  const category = path.dirname(img).split('/').pop();
  console.log(`    ${exists ? '✅' : '❌'} ${category}/${path.basename(img)}`);
});

// Verificar archivos de la aplicación
console.log('\n🚀 Archivos de la aplicación:');
const appFiles = [
  'app/virtual-tryon/page.tsx',
  'app/api/virtual-tryon/route.ts',
  'app/api/virtual-tryon/status/[requestId]/route.ts',
  'app/sign-in/page.tsx',
  'app/register/page.tsx'
];

appFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar dependencias
console.log('\n📦 Dependencias:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = packageJson.dependencies || {};

const requiredDeps = {
  '@fal-ai/client': 'fal.ai client',
  '@chakra-ui/react': 'Chakra UI',
  '@supabase/supabase-js': 'Supabase client'
};

Object.keys(requiredDeps).forEach(dep => {
  const installed = dependencies[dep] !== undefined;
  console.log(`  ${installed ? '✅' : '❌'} ${dep} (${requiredDeps[dep]})`);
});

// Resumen final
console.log('\n📊 RESUMEN:');
console.log(`  • Modelos de ejemplo: ${modelsCount}/4`);
console.log(`  • Prendas de ejemplo: ${garmentsCount}/8`);

const totalImages = modelsCount + garmentsCount;
const allImagesReady = totalImages === 12;

console.log('\n🎯 ESTADO GENERAL:');
if (allImagesReady && envExists) {
  console.log('  🎉 ¡TODO LISTO! El sistema está completamente configurado.');
  console.log('  🚀 Puedes usar el Virtual Try-On en: http://localhost:3000/virtual-tryon');
} else {
  console.log('  ⚠️ Configuración pendiente:');
  if (!allImagesReady) {
    console.log(`     - Agregar ${12 - totalImages} imágenes de ejemplo`);
    console.log('     - Ver: INSTRUCCIONES-IMAGENES-EJEMPLO.md');
  }
  if (!envExists || fs.readFileSync('.env.local', 'utf8').includes('your_fal_api_key_here')) {
    console.log('     - Configurar FAL_KEY en .env.local');
    console.log('     - Obtener clave gratis en: https://fal.ai');
  }
}

console.log('\n📚 Documentación:');
console.log('  • VIRTUAL-TRYON-RESUMEN.md - Resumen completo');
console.log('  • INSTRUCCIONES-IMAGENES-EJEMPLO.md - Guía de imágenes');
console.log('  • SNAPS-SETUP-INSTRUCTIONS.md - Setup de base de datos'); 