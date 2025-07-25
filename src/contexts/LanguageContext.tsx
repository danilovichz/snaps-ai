'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Image Processor',
    'nav.library': 'Image Library',
    'nav.history': 'Processing History',
    'nav.templates': 'Templates',
    'nav.examples': 'Examples Gallery',
    'nav.virtualTryOn': 'Virtual Try-On',
    'nav.account': 'Account',
    'nav.pages': 'Pages',
    
    // Home page
    'home.title': 'AI-Powered Image Processing Studio',
    'home.subtitle': 'Professional bulk image enhancement for ecommerce, marketing, and content creation',
    
    // Tools
    'tool.backgroundChanger.title': 'Background Changer',
    'tool.backgroundChanger.desc': 'Change background of your images as simple as a click',
    
    'tool.backgroundRemover.title': 'Background Remover',
    'tool.backgroundRemover.desc': 'Remove backgrounds of images with powerful AI models',
    
    'tool.imageInpainting.title': 'Image Inpainting',
    'tool.imageInpainting.desc': 'Image inpainting for more advanced image editing',
    
    'tool.bulkRemover.title': 'Bulk Remove Background',
    'tool.bulkRemover.desc': 'Remove backgrounds of multiple images at once',
    
    'tool.smartShadows.title': 'Smart Shadows',
    'tool.smartShadows.desc': 'Add photorealistic shadows to images automatically',
    
    'tool.productVariations.title': 'Product Variations',
    'tool.productVariations.desc': 'Generate product variations from an image',
    
    'tool.imageGeneration.title': 'Image Generation',
    'tool.imageGeneration.desc': 'Generate photorealistic images based on a prompt',
    
    'tool.virtualModels.title': 'Virtual Models',
    'tool.virtualModels.desc': 'Incorporate your garments on virtual models',
    
    'tool.customModel.title': 'Custom AI Model',
    'tool.customModel.desc': 'Generate a personalized virtual model',
    
    // Buttons
    'button.tryNow': 'Try Now',
    'button.comingSoon': 'Coming Soon',
    'button.download': 'Download',
    'button.reset': 'Clear Images',
    'button.clearImages': 'Clear Images',
    
    // Smart Shadows
    'tool.smartShadows': 'Smart Shadows',
    'tool.smartShadowsDesc': 'Add photorealistic shadows automatically',
    
    // Virtual Try-On
    'virtualTryOn.title': 'Virtual Try-On',
    'virtualTryOn.subtitle': 'See how clothing looks on models using AI-powered virtual try-on technology.',
    'virtualTryOn.humanImage': 'Model Image',
    'virtualTryOn.garmentImage': 'Clothing Item',
    'virtualTryOn.dragDropHuman': 'Drag & drop a model photo or click to browse',
    'virtualTryOn.dragDropGarment': 'Drag & drop a clothing item or click to browse',
    'virtualTryOn.uploadImages': 'Upload Images',
    'virtualTryOn.processing': 'Processing',
    'virtualTryOn.result': 'Your Result',
    'virtualTryOn.startTryOn': 'Start Virtual Try-On',
    'virtualTryOn.uploading': 'Uploading Images...',
    'virtualTryOn.uploadingDesc': 'Preparing your images for processing',
    'virtualTryOn.processingDesc': 'Our AI is creating your virtual try-on result. This may take 30-60 seconds.',
    'virtualTryOn.queuePosition': 'Queue Position',
    'virtualTryOn.resultReady': 'Your virtual try-on result has been downloaded!',
    'virtualTryOn.tryAnother': 'Try New Images',
    'virtualTryOn.downloadSuccess': 'Success! Your image has been downloaded.',
    'virtualTryOn.downloadManual': 'Download Again',
    'virtualTryOn.pleaseUploadBoth': 'Please upload both a model image and a clothing item.',
    'virtualTryOn.tipsTitle': 'Tips for Best Results',
    'virtualTryOn.tipsDescription': 'Use clear, high-quality images with good lighting. The model should be facing forward, and the clothing item should be clearly visible against a neutral background.',
    
    // Error messages
    'error.missingImages': 'Missing Images',
    'error.fileTooLarge': 'File Too Large',
    'error.maxSize10MB': 'Please select a file smaller than 10MB.',
    'error.pleaseUploadImage': 'Please upload a valid image file.',
    'error.invalidFile': 'Invalid File',
    'error.processingFailed': 'Processing Failed',
    'error.tryAgain': 'Please try again later',
    'error.connectionError': 'Connection Error',
    'error.checkConnection': 'Please check your internet connection and try again',
    'error.downloadFailed': 'Download Failed',
    
    // Loading
    'loading.text': 'Loading...',
    
    // Workflow
    'workflow.upload': 'Upload',
    'workflow.upload.desc': 'Add your images',
    'workflow.template': 'Template',
    'workflow.template.desc': 'Choose processing style',
    'workflow.processing': 'Process',
    'workflow.processing.desc': 'AI enhancement',
    'workflow.review': 'Review',
    'workflow.review.desc': 'Approve results',
    'workflow.export': 'Export',
    'workflow.export.desc': 'Download images',
    
    'upload.title': 'Drag and drop your images here',
    'upload.subtitle': 'or click to browse files',
    'upload.formats': 'Supports JPG, PNG, WEBP • Max 50 images per batch',
    'upload.choose': 'Choose Files',
    'upload.progress': 'Upload Progress',
    'upload.complete': 'Complete',
    'upload.uploading': 'Uploading...',
    'upload.clearAll': 'Clear All',
    'upload.continue': 'Continue to Template Selection',
    
    'template.ready': 'Ready to Process',
    'template.willProcess': 'images will be processed using',
    'template.back': 'Back to Upload',
    'template.start': 'Start Processing',
    
    'common.startOver': 'Start Over',
    'common.images': 'images',
    'common.mb': 'MB',
    
    // Processing & Templates
    'processing.chooseTemplate': 'Choose Processing Template',
    'processing.invalidFiles': 'Invalid Files Detected',
    'processing.invalidFilesDesc': 'Only JPG, PNG, and WEBP images are supported',
    'processing.templateSelected': 'Template Selected',
    'processing.templateSelectedDesc': 'template selected for processing',
    'processing.complete': 'Processing Complete!',
    'processing.completeDesc': 'processed successfully',
    'processing.enhancing': 'Processing Images...',
    'processing.enhancingDesc': 'AI is enhancing your',
    'processing.uploadedImages': 'Uploaded Images',
    'processing.downloadProcessed': 'Download Processed Images',
    'processing.exportComplete': 'Export Complete!',
    'processing.exportCompleteDesc': 'Your processed images have been downloaded successfully',
    'processing.startOverDesc': 'Ready for a new batch of images',
    
    // Template names
    'template.bgRemoval': 'Background Removal',
    'template.bgRemovalDesc': 'Remove backgrounds from product images',
    'template.bgChange': 'Background Change',
    'template.bgChangeDesc': 'Replace backgrounds with AI-generated ones',
    'template.enhance': 'Image Enhancement',
    'template.enhanceDesc': 'Improve quality and lighting',
    'template.ecommerce': 'E-commerce',
    'template.creative': 'Creative',
    'template.professional': 'Professional',
    
    // Examples page
    'examples.title': 'Examples Gallery',
    'examples.subtitle': 'See real before-and-after results from our AI-powered image processing templates.',
    'examples.imagesProcessed': 'Images Processed',
    'examples.qualityImprovement': 'Quality Improvement',
    'examples.avgProcessing': 'Average Processing',
    'examples.templateCategories': 'Template Categories',
    'examples.processingByCategory': 'Processing Examples by Category',
    'examples.clothingFashion': 'Clothing & Fashion',
    'examples.clothingDesc': 'Perfect white backgrounds, color correction, and professional styling',
    'examples.electronicsTech': 'Electronics & Tech',
    'examples.electronicsDesc': 'Clean backgrounds, proper lighting, and glare reduction',
    'examples.furnitureHome': 'Furniture & Home',
    'examples.furnitureDesc': 'Room removal, perspective correction, and size standardization',
    'examples.generalProducts': 'General Products',
    'examples.generalDesc': 'Universal cleanup, consistent dimensions, and color balance',
    'examples.enhanced': 'Enhanced',
    'examples.viewExamples': 'View 3 Examples',
    'examples.readyToProcess': 'Ready to Process Your Images?',
    'examples.joinThousands': 'Join thousands of businesses using Fotin AI to create professional product images in seconds.',
    'examples.startProcessing': 'Start Processing Images',
    'examples.browseTemplates': 'Browse Templates',
    
    // Example items
    'examples.tshirtEnhancement': 'T-Shirt Enhancement',
    'examples.dressPhotography': 'Dress Photography',
    'examples.shoeProductShot': 'Shoe Product Shot',
    'examples.smartphoneStudio': 'Smartphone Studio',
    'examples.laptopProfessional': 'Laptop Professional',
    'examples.headphonesClean': 'Headphones Clean',
    'examples.chairIsolation': 'Chair Isolation',
    'examples.tableEnhancement': 'Table Enhancement',
    'examples.sofaProfessional': 'Sofa Professional',
    'examples.kitchenAppliance': 'Kitchen Appliance',
    'examples.beautyProduct': 'Beauty Product',
    'examples.sportsEquipment': 'Sports Equipment',
    
    // Footer
    'footer.copyright': '© 2024 Snaps AI. All rights reserved.',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    
    // Account
    'account.profile': 'Profile',
    'account.settings': 'Settings',
    'account.billing': 'Billing',
    'account.usage': 'Usage'
  },
  es: {
    // Navigation
    'nav.home': 'Procesador de Imágenes',
    'nav.library': 'Biblioteca de Imágenes',
    'nav.history': 'Historial de Procesamiento',
    'nav.templates': 'Plantillas',
    'nav.examples': 'Galería de Ejemplos',
    'nav.virtualTryOn': 'Prueba Virtual',
    'nav.account': 'Cuenta',
    'nav.pages': 'Páginas',
    
    // Home page
    'home.title': 'Estudio de Procesamiento de Imágenes con IA',
    'home.subtitle': 'Mejora profesional de imágenes en lote para ecommerce, marketing y creación de contenido',
    
    // Tools
    'tool.backgroundChanger.title': 'Cambiar Fondo',
    'tool.backgroundChanger.desc': 'Cambia el fondo de tus imágenes tan simple como un clic',
    
    'tool.backgroundRemover.title': 'Eliminar Fondo',
    'tool.backgroundRemover.desc': 'Elimina fondos de imágenes con potentes modelos de IA',
    
    'tool.imageInpainting.title': 'Relleno de Imagen',
    'tool.imageInpainting.desc': 'Relleno de imagen para edición de imagen más avanzada',
    
    'tool.bulkRemover.title': 'Eliminar Fondo Masivo',
    'tool.bulkRemover.desc': 'Elimina fondos de múltiples imágenes a la vez',
    
    'tool.smartShadows.title': 'Sombras Inteligentes',
    'tool.smartShadows.desc': 'Agrega sombras fotorealistas a imágenes de manera automática',
    
    'tool.productVariations.title': 'Variaciones de Producto',
    'tool.productVariations.desc': 'Genera variaciones de un producto a partir de una imagen',
    
    'tool.imageGeneration.title': 'Generación de Imágenes',
    'tool.imageGeneration.desc': 'Genera imágenes fotorealistas basadas en un prompt',
    
    'tool.virtualModels.title': 'Modelos Virtuales',
    'tool.virtualModels.desc': 'Incorpora tus prendas en modelos virtuales',
    
    'tool.customModel.title': 'Modelo IA Personalizado',
    'tool.customModel.desc': 'Genera un modelo virtual personalizado',
    
    // Buttons
    'button.tryNow': 'Probar Ahora',
    'button.comingSoon': 'Próximamente',
    'button.download': 'Descargar',
    'button.reset': 'Limpiar Imágenes',
    'button.clearImages': 'Limpiar Imágenes',
    
    // Smart Shadows
    'tool.smartShadows': 'Sombras Inteligentes',
    'tool.smartShadowsDesc': 'Agrega sombras fotorealistas automáticamente',
    
    // Virtual Try-On
    'virtualTryOn.title': 'Prueba Virtual',
    'virtualTryOn.subtitle': 'Ve cómo se ve la ropa en modelos usando tecnología de prueba virtual con IA.',
    'virtualTryOn.humanImage': 'Imagen del Modelo',
    'virtualTryOn.garmentImage': 'Prenda de Vestir',
    'virtualTryOn.dragDropHuman': 'Arrastra y suelta una foto del modelo o haz clic para explorar',
    'virtualTryOn.dragDropGarment': 'Arrastra y suelta una prenda de vestir o haz clic para explorar',
    'virtualTryOn.uploadImages': 'Subir Imágenes',
    'virtualTryOn.processing': 'Procesando',
    'virtualTryOn.result': 'Tu Resultado',
    'virtualTryOn.startTryOn': 'Iniciar Prueba Virtual',
    'virtualTryOn.uploading': 'Subiendo Imágenes...',
    'virtualTryOn.uploadingDesc': 'Preparando tus imágenes para el procesamiento',
    'virtualTryOn.processingDesc': 'Nuestra IA está creando tu resultado de prueba virtual. Esto puede tomar 30-60 segundos.',
    'virtualTryOn.queuePosition': 'Posición en Cola',
    'virtualTryOn.resultReady': '¡Tu resultado de prueba virtual ha sido descargado!',
    'virtualTryOn.tryAnother': 'Probar Nuevas Imágenes',
    'virtualTryOn.downloadSuccess': '¡Éxito! Tu imagen ha sido descargada.',
    'virtualTryOn.downloadManual': 'Descargar Nuevamente',
    'virtualTryOn.pleaseUploadBoth': 'Por favor sube tanto una imagen del modelo como una prenda de vestir.',
    'virtualTryOn.tipsTitle': 'Consejos para Mejores Resultados',
    'virtualTryOn.tipsDescription': 'Usa imágenes claras y de alta calidad con buena iluminación. El modelo debe estar mirando hacia adelante, y la prenda debe ser claramente visible contra un fondo neutro.',
    
    // Error messages
    'error.missingImages': 'Imágenes Faltantes',
    'error.fileTooLarge': 'Archivo Muy Grande',
    'error.maxSize10MB': 'Por favor selecciona un archivo menor a 10MB.',
    'error.pleaseUploadImage': 'Por favor sube un archivo de imagen válido.',
    'error.invalidFile': 'Archivo Inválido',
    'error.processingFailed': 'Procesamiento Fallido',
    'error.tryAgain': 'Por favor intenta de nuevo más tarde',
    'error.connectionError': 'Error de Conexión',
    'error.checkConnection': 'Por favor verifica tu conexión a internet e intenta de nuevo',
    'error.downloadFailed': 'Descarga Fallida',
    
    // Loading
    'loading.text': 'Cargando...',
    
    // Workflow
    'workflow.upload': 'Subir',
    'workflow.upload.desc': 'Agregar tus imágenes',
    'workflow.template': 'Plantilla',
    'workflow.template.desc': 'Elegir estilo de procesamiento',
    'workflow.processing': 'Procesar',
    'workflow.processing.desc': 'Mejora con IA',
    'workflow.review': 'Revisar',
    'workflow.review.desc': 'Aprobar resultados',
    'workflow.export': 'Exportar',
    'workflow.export.desc': 'Descargar imágenes',
    
    'upload.title': 'Arrastra y suelta tus imágenes aquí',
    'upload.subtitle': 'o haz clic para explorar archivos',
    'upload.formats': 'Soporta JPG, PNG, WEBP • Máximo 50 imágenes por lote',
    'upload.choose': 'Elegir Archivos',
    'upload.progress': 'Progreso de Subida',
    'upload.complete': 'Completo',
    'upload.uploading': 'Subiendo...',
    'upload.clearAll': 'Limpiar Todo',
    'upload.continue': 'Continuar a Selección de Plantilla',
    
    'template.ready': 'Listo para Procesar',
    'template.willProcess': 'imágenes serán procesadas usando',
    'template.back': 'Volver a Subida',
    'template.start': 'Iniciar Procesamiento',
    
    'common.startOver': 'Empezar de Nuevo',
    'common.images': 'imágenes',
    'common.mb': 'MB',
    
    // Processing & Templates
    'processing.chooseTemplate': 'Elegir Plantilla de Procesamiento',
    'processing.invalidFiles': 'Archivos Inválidos Detectados',
    'processing.invalidFilesDesc': 'Solo se soportan imágenes JPG, PNG y WEBP',
    'processing.templateSelected': 'Plantilla Seleccionada',
    'processing.templateSelectedDesc': 'plantilla seleccionada para procesamiento',
    'processing.complete': '¡Procesamiento Completo!',
    'processing.completeDesc': 'procesadas exitosamente',
    'processing.enhancing': 'Procesando Imágenes...',
    'processing.enhancingDesc': 'IA está mejorando tus',
    'processing.uploadedImages': 'Imágenes Subidas',
    'processing.downloadProcessed': 'Descargar Imágenes Procesadas',
    'processing.exportComplete': '¡Exportación Completa!',
    'processing.exportCompleteDesc': 'Tus imágenes procesadas han sido descargadas exitosamente',
    'processing.startOverDesc': 'Listo para un nuevo lote de imágenes',
    
    // Template names
    'template.bgRemoval': 'Eliminación de Fondo',
    'template.bgRemovalDesc': 'Eliminar fondos de imágenes de productos',
    'template.bgChange': 'Cambio de Fondo',
    'template.bgChangeDesc': 'Reemplazar fondos con otros generados por IA',
    'template.enhance': 'Mejora de Imagen',
    'template.enhanceDesc': 'Mejorar calidad e iluminación',
    'template.ecommerce': 'E-commerce',
    'template.creative': 'Creativo',
    'template.professional': 'Profesional',
    
    // Examples page
    'examples.title': 'Galería de Ejemplos',
    'examples.subtitle': 'Ve resultados reales de antes y después de nuestras plantillas de procesamiento de imágenes con IA.',
    'examples.imagesProcessed': 'Imágenes Procesadas',
    'examples.qualityImprovement': 'Mejora de Calidad',
    'examples.avgProcessing': 'Procesamiento Promedio',
    'examples.templateCategories': 'Categorías de Plantillas',
    'examples.processingByCategory': 'Ejemplos de Procesamiento por Categoría',
    'examples.clothingFashion': 'Ropa y Moda',
    'examples.clothingDesc': 'Fondos blancos perfectos, corrección de color y estilismo profesional',
    'examples.electronicsTech': 'Electrónicos y Tecnología',
    'examples.electronicsDesc': 'Fondos limpios, iluminación adecuada y reducción de reflejos',
    'examples.furnitureHome': 'Muebles y Hogar',
    'examples.furnitureDesc': 'Eliminación de habitaciones, corrección de perspectiva y estandarización de tamaños',
    'examples.generalProducts': 'Productos Generales',
    'examples.generalDesc': 'Limpieza universal, dimensiones consistentes y balance de color',
    'examples.enhanced': 'Mejorado',
    'examples.viewExamples': 'Ver 3 Ejemplos',
    'examples.readyToProcess': '¿Listo para Procesar tus Imágenes?',
    'examples.joinThousands': 'Únete a miles de empresas que usan Fotin AI para crear imágenes profesionales de productos en segundos.',
    'examples.startProcessing': 'Comenzar a Procesar Imágenes',
    'examples.browseTemplates': 'Explorar Plantillas',
    
    // Example items
    'examples.tshirtEnhancement': 'Mejora de Camiseta',
    'examples.dressPhotography': 'Fotografía de Vestido',
    'examples.shoeProductShot': 'Foto de Producto Zapato',
    'examples.smartphoneStudio': 'Estudio de Smartphone',
    'examples.laptopProfessional': 'Laptop Profesional',
    'examples.headphonesClean': 'Audífonos Limpios',
    'examples.chairIsolation': 'Aislamiento de Silla',
    'examples.tableEnhancement': 'Mejora de Mesa',
    'examples.sofaProfessional': 'Sofá Profesional',
    'examples.kitchenAppliance': 'Electrodoméstico Cocina',
    'examples.beautyProduct': 'Producto de Belleza',
    'examples.sportsEquipment': 'Equipo Deportivo',
    
    // Footer
    'footer.copyright': '© 2024 Snaps AI. Todos los derechos reservados.',
    'footer.terms': 'Términos de Servicio',
    'footer.privacy': 'Política de Privacidad',
    'footer.contact': 'Contáctanos',
    
    // Account
    'account.profile': 'Perfil',
    'account.settings': 'Configuración',
    'account.billing': 'Facturación',
    'account.usage': 'Uso'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 