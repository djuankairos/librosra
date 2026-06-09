# DESIGN.md — Reinita Amarilla Librería

## Color Strategy: Committed (brand default)

El amarillo principal (#F5C800) carga 30-60% de las superficies del hero. El resto del sitio es crema cálida. El negro profundo actúa como stage para el amarillo.

## Colors (OKLCH)

```
--color-amarillo:       oklch(82% 0.18 85);     /* #F5C800 — primario, titulares, hero */
--color-amarillo-claro: oklch(92% 0.13 90);     /* #FDE96A — fondos cálidos */
--color-naranja:        oklch(67% 0.19 47);     /* #F07020 — CTAs, badges, énfasis */
--color-naranja-claro:  oklch(76% 0.14 52);     /* #F9A05A — hover states */
--color-negro:          oklch(16% 0.005 270);   /* #1A1A1A — texto, fondos oscuros */
--color-verde:          oklch(65% 0.16 145);    /* #5AAB4B — acciones positivas, eco */
--color-crema:          oklch(98% 0.022 88);    /* #FFF8E7 — fondo de página, tarjetas */
--color-blanco-calido:  oklch(99% 0.01 90);     /* cálido, no puro #fff */
```

**AZUL LOGO #2E9CCA — exclusivo del logo. Nunca usar en UI.**

## Typography

| Rol | Familia | Pesos | Uso |
|-----|---------|-------|-----|
| Display | Playfair Display | 700, 900 | H1, H2, nombres de publicaciones |
| Technical | Space Mono | 400, 700 | Labels, precios, categorías, códigos, metadata |
| Body | Lato | 300, 400, 700, 900 | Párrafos, descripciones, botones, UI general |

Fuente: Google Fonts. Nunca sustituir con fuentes del sistema.

Longitud de línea cuerpo: máximo 68ch. Line-height cuerpo: 1.6.

## Escala Tipográfica

- H1 Display: clamp(2.5rem, 5vw, 4.5rem), Playfair Display 900
- H2 Sección: clamp(1.8rem, 3.5vw, 3rem), Playfair Display 700
- H3 Título: 1.25rem, Playfair Display 700
- Body: 1rem (min 16px), Lato 400
- Label/UI: 0.75rem, Space Mono 400, tracking 0.05em, uppercase
- Precio: 1.25rem, Space Mono 700

## Button Variants

| Variante | Fondo | Texto | Uso |
|----------|-------|-------|-----|
| Primary | #1A1A1A | #FFF8E7 | Acción principal en fondo claro |
| Primary-hero | #F5C800 | #1A1A1A | Acción principal en fondo oscuro |
| Secondary | #F07020 | #FFFEF7 | Acción secundaria, énfasis |
| Outline | transparente, borde #1A1A1A | #1A1A1A | Acción terciaria |
| Outline-hero | transparente, borde #F5C800 | #F5C800 | Acción terciaria en fondo oscuro |
| WhatsApp | #25D366 | #FFFEF7 | Solo para CTAs de WhatsApp |

Todos los botones: `cursor-pointer`, `transition-colors duration-200`, `hover` visible.

## Badge System

| Tipo | BG | Texto | Contenido |
|------|----|-------|-----------|
| NUEVO | #1A1A1A | #F5C800 | "NUEVO" |
| MEJOR PRECIO | #5AAB4B | #FFFEF7 | "MEJOR PRECIO" |
| EN OFERTA | #F07020 | #FFFEF7 | "EN OFERTA" |
| AGOTADO | #9E9E9E | #1A1A1A | "AGOTADO" |
| Categoría | color de categoría | ver contraste | label uppercase |
| Año | #FFF8E7, borde | #1A1A1A | 4 dígitos |
| Idioma | #FFF8E7, borde | #1A1A1A | "ES" / "EN" |

Fuente: Space Mono, 0.6875rem, tracking 0.05em, UPPERCASE.

## Price Display

Regular: Space Mono 700, 1.25rem, #1A1A1A
En oferta: 
- Precio original: tachado, Space Mono 400, 0.875rem, #9E9E9E
- Precio nuevo: Space Mono 700, 1.25rem, #F07020

Símbolo: ₡ (colón costarricense). Formato: ₡35.000 (punto como separador de miles en locale es-CR).

## 10 Categorías — Colores e identidad

| Categoría | Hex | Texto sobre BG | Emoji |
|-----------|-----|----------------|-------|
| Avifauna | #F07020 | #1A1A1A (oscuro) | 🦅 |
| Herpetofauna | #5AAB4B | #1A1A1A (oscuro) | 🦎 |
| Mamíferos | #A0704A | #FFFEF7 (claro) | 🦙 |
| Botánica | #4CAF50 | #1A1A1A (oscuro) | 🌿 |
| Fungi | #BC8A50 | #1A1A1A (oscuro) | 🍄 |
| Artrópoda | #CE93D8 | #1A1A1A (oscuro) | 🦋 |
| Peces | #2196F3 | #FFFEF7 (claro) | 🐟 |
| Underwater | #00BCD4 | #1A1A1A (oscuro) | 🤿 |
| Niños | #FF5722 | #1A1A1A (oscuro) | 📚 |
| Colorear | #9E9E9E | #1A1A1A (oscuro) | 🎨 |

## Absolute Bans (Impeccable)

- Sin `border-left` decorativo en cards de libros
- Sin gradient text (`background-clip: text`) en títulos
- Sin glassmorphism decorativo
- Sin grilla idéntica icon+heading+text (las categorías son bloques de color)
- Sin modales para detalles de libros (enlace directo a WhatsApp)
- Sin `#000` o `#fff` puros — usar `#1A1A1A` y `#FFFEF7`

## Spacing Rhythm

Secciones: py-16 sm:py-24 (ritmo, no mismo padding en todas partes)
Hero: min-h-screen, padding generoso (py-20+)
Cards: gap-6 a gap-8

## Logo Usage

- Mínimo digital: 60px; Header: 100px; Hero: 180-200px
- Zona libre: ½ ancho del logo en todos los lados
- Fondos aprobados: blanco, crema (#FFF8E7), negro (#1A1A1A), amarillo (#F5C800)
- Nunca distorsionar, recortar, agregar sombras o efectos
