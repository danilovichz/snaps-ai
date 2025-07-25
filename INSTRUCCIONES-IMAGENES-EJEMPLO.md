# 📸 Instrucciones para Agregar Imágenes de Ejemplo

## 📁 Estructura de Carpetas Creada

Se han creado las siguientes carpetas para organizar las imágenes de ejemplo:

```
public/examples/
├── models/                     # Modelos de personas
│   ├── man-casual.jpg         # Hombre casual
│   ├── woman-business.jpg     # Mujer de negocios
│   ├── man-young.jpg          # Hombre joven
│   └── woman-fashion.jpg      # Mujer de moda
│
└── garments/                  # Prendas de ropa
    ├── upper_body/            # Parte superior
    │   ├── tshirt-white.jpg   # Camiseta blanca
    │   ├── shirt-blue.jpg     # Camisa azul
    │   └── hoodie-gray.jpg    # Sudadera gris
    │
    ├── lower_body/            # Parte inferior  
    │   ├── jeans-blue.jpg     # Jeans azules
    │   ├── pants-black.jpg    # Pantalones negros
    │   └── shorts-khaki.jpg   # Shorts caqui
    │
    └── dresses/               # Vestidos
        ├── dress-summer.jpg   # Vestido de verano
        └── dress-evening.jpg  # Vestido de noche
```

## 🎯 Especificaciones para Imágenes de Modelos

### Modelos de Personas (`public/examples/models/`)

**Requisitos:**
- **Resolución**: Mínimo 512x768px, recomendado 768x1024px
- **Formato**: JPG o PNG
- **Posición**: Persona de pie, frontal, brazos a los costados
- **Fondo**: Preferiblemente neutro (blanco, gris claro)
- **Iluminación**: Uniforme, sin sombras marcadas
- **Ropa**: Ropa simple que permita ver claramente la silueta

**Archivos necesarios:**
- `man-casual.jpg` - Hombre casual, edad 25-35
- `woman-business.jpg` - Mujer profesional, edad 25-35  
- `man-young.jpg` - Hombre joven, edad 18-25
- `woman-fashion.jpg` - Mujer elegante, edad 25-35

## 👔 Especificaciones para Prendas

### ✅ Lo que FUNCIONA MEJOR:

1. **Imagen frontal** de la prenda
2. **Buena iluminación** uniforme
3. **Superficie plana** (cama, mesa)
4. **Vista desde arriba**
5. **Sin arrugas** ni pliegues
6. **Fondo neutro** sin distracciones
7. **Prenda completamente visible**

### ❌ Lo que debes EVITAR:

1. **Mala iluminación** o sombras marcadas
2. **Mangas dobladas** o pliegues
3. **Tomas en ángulo** lateral
4. **Fondos desordenados** o con patrones
5. **Sombras pronunciadas**
6. **Prendas colgadas** en perchas
7. **Imágenes borrosas** o de baja calidad

### Parte Superior (`public/examples/garments/upper_body/`)

**Requisitos específicos:**
- **Resolución**: Mínimo 512x512px
- **Tipo de prendas**: Camisetas, camisas, sudaderas, chaquetas
- **Posición**: Completamente extendida, sin pliegues

**Archivos necesarios:**
- `tshirt-white.jpg` - Camiseta blanca básica
- `shirt-blue.jpg` - Camisa azul de vestir
- `hoodie-gray.jpg` - Sudadera gris con capucha

### Parte Inferior (`public/examples/garments/lower_body/`)

**Requisitos específicos:**
- **Resolución**: Mínimo 512x768px  
- **Tipo de prendas**: Jeans, pantalones, shorts
- **Posición**: Completamente extendidos, piernas separadas

**Archivos necesarios:**
- `jeans-blue.jpg` - Jeans azul clásico
- `pants-black.jpg` - Pantalones negros formales
- `shorts-khaki.jpg` - Shorts beige/caqui

### Vestidos (`public/examples/garments/dresses/`)

**Requisitos específicos:**
- **Resolución**: Mínimo 512x768px
- **Tipo de prendas**: Vestidos casuales y formales
- **Posición**: Completamente extendido, forma natural

**Archivos necesarios:**
- `dress-summer.jpg` - Vestido casual de verano
- `dress-evening.jpg` - Vestido formal de noche

## 🚀 Cómo Agregar Tus Imágenes

### Opción 1: Usar tus archivos existentes

1. **Copia tus archivos** a las carpetas correspondientes en `public/examples/`
2. **Renómbralos** según los nombres especificados arriba
3. **Asegúrate** de que cumplan con las especificaciones de calidad

### Opción 2: Crear placeholder temporales

Si no tienes las imágenes listas, puedes usar imágenes placeholder temporalmente:

```bash
# Navegar a la carpeta del proyecto
cd public/examples

# Crear imágenes placeholder (puedes usar cualquier herramienta)
# O simplemente buscar imágenes gratuitas en:
# - Unsplash.com
# - Pexels.com  
# - Freepik.com
```

## 🔧 Integración con la API

El sistema está configurado para usar estos archivos automáticamente:

- **Modelos**: Se muestran en el modal de selección de modelos
- **Prendas**: Se filtran automáticamente según el tipo seleccionado
- **URLs**: Se generan automáticamente basadas en los nombres de archivo

## ✅ Lista de Verificación

- [ ] Crear/obtener imágenes de modelos (4 archivos)
- [ ] Crear/obtener imágenes de prendas superiores (3 archivos)  
- [ ] Crear/obtener imágenes de prendas inferiores (3 archivos)
- [ ] Crear/obtener imágenes de vestidos (2 archivos)
- [ ] Verificar que todas las imágenes cumplan especificaciones
- [ ] Probar la funcionalidad en el frontend
- [ ] Obtener clave de API de fal.ai
- [ ] Configurar variable de entorno FAL_KEY

## 🎨 Consejos para Mejores Resultados

1. **Consistencia**: Usa el mismo estilo de iluminación para todas las prendas
2. **Calidad**: Prioriza calidad sobre cantidad 
3. **Diversidad**: Incluye diferentes estilos y colores
4. **Actualización**: Actualiza las imágenes regularmente con tendencias nuevas

## 🔗 API de fal.ai

Recuerda configurar tu clave de API en el archivo `.env.local`:

```bash
FAL_KEY=tu_clave_de_api_aqui
```

¡Una vez que agregues las imágenes, el sistema estará listo para usar! 🎉 