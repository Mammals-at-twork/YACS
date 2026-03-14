# 🚀 YACS Installer

Instalador interactivo para los YACS Skills. Permite seleccionar qué skills instalar y dónde instalarlos.

Basado en [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) para una experiencia interactiva fluida.

## 📋 Características

- ✨ Interfaz CLI interactiva con Inquirer.js
- ☑️ Selecciona skills con checkboxes navegables
- 📍 Instala en tu home (`~/.claude/skills`) o en un proyecto personalizado
- 🎨 Colores y formatos legibles en terminal
- ✅ Revisión antes de instalar
- 🗂️ Organización por categorías

## 🛠️ Requisitos

- Node.js 14 o superior
- Acceso a terminal/CMD

## 🚀 Instalación y uso

### Primer uso: Instalar dependencias

```bash
cd cli
npm install
```

### Opción 1: Ejecutar directamente desde el repo

```bash
cd cli
npm start
# o
node install.js
```

### Opción 2: Instalar como comando global

```bash
cd cli
npm install -g .
yacs
```

## 📖 Uso

El instalador te guiará a través de estos pasos:

1. **Selecciona dónde instalar:**
   - Usa ↑↓ para navegar entre las opciones
   - Presiona Enter para seleccionar
   - Opciones: Home directory (`~/.claude/skills`) o ruta personalizada

2. **Selecciona los skills:**
   - Usa ↑↓ para navegar por la lista de skills
   - Presiona ESPACIO para marcar/desmarcar checkboxes
   - Presiona Enter cuando tengas tus selecciones listas

3. **Revisa tu selección:**
   - Se mostrará un resumen de los skills seleccionados
   - Confirma con Yes/No para proceder

4. **¡Los skills se instalarán automáticamente!**
   - Se copiarán todos los archivos a la ruta elegida
   - Se mantiene la estructura original de carpetas

## 📂 Estructura de instalación

Los skills se copiarán mantiendo la estructura original:

```
~/.claude/skills/  (o tu ruta personalizada)
├── analisis-design-architecture/
│   ├── adr-writer/
│   ├── architecture-spark/
│   └── pattern-finder/
├── quality-and-security/
│   ├── llm-safety-checks/
│   ├── owasp-guardian/
│   ├── quality-spark/
│   └── task-flow-planner/
└── ... más categorías
```

## 🎯 Ejemplo de uso

```
🚀 INSTALADOR DE YACS SKILLS

Skills disponibles: 17
Categorías: 5

═══════════════════════════════════════════════════════════
  📍 SELECCIONA DÓNDE INSTALAR
═══════════════════════════════════════════════════════════

? Dónde deseas instalar los skills: (Use arrow keys)
❯ Home directory (~/.claude/skills)
  Proyecto/repositorio (ruta personalizada)

═══════════════════════════════════════════════════════════
  🎯 SELECCIONA LOS SKILLS A INSTALAR
═══════════════════════════════════════════════════════════

Usa ↑↓ para navegar, ESPACIO para marcar/desmarcar

? Selecciona los skills a instalar: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ adr-writer (analisis-design-architecture) - Generador de ADRs
 ○ architecture-spark (analisis-design-architecture)
 ◉ pattern-finder (analisis-design-architecture) - Identificador de patrones
 ○ llm-safety-checks (quality-and-security)
 ◉ owasp-guardian (quality-and-security) - Validación de seguridad OWASP
 ○ quality-spark (quality-and-security)
 ○ task-flow-planner (quality-and-security)
 ...
(Move up and down to reveal more choices)

═══════════════════════════════════════════════════════════
  📋 REVISIÓN DE LA INSTALACIÓN
═══════════════════════════════════════════════════════════

Destino: /Users/usuario/.claude/skills
Total de skills a instalar: 3

analisis-design-architecture
  • adr-writer
  • pattern-finder

quality-and-security
  • owasp-guardian

? ¿Proceder con la instalación? (Y/n)

═══════════════════════════════════════════════════════════
  ⚙️  INSTALANDO SKILLS
═══════════════════════════════════════════════════════════

✓ analisis-design-architecture/adr-writer
✓ analisis-design-architecture/pattern-finder
✓ quality-and-security/owasp-guardian

═══════════════════════════════════════════════════════════
  ✨ ¡INSTALACIÓN COMPLETADA!
═══════════════════════════════════════════════════════════

Los skills han sido instalados en:
  /Users/usuario/.claude/skills

ℹ Para usar los skills en Claude Code:
  1. Abre tu proyecto en Claude Code
  2. Usa "/" + nombre del skill en cualquier conversación
  3. Los skills estarán disponibles automáticamente
```

## 🔧 Cómo funciona

1. **Lee la estructura de skills** desde la carpeta `/skills`
2. **Organiza por categorías** automáticamente
3. **Muestra una interfaz interactiva** en terminal
4. **Copia los skills seleccionados** a la ruta elegida
5. **Confirma la instalación** con un resumen

## 📝 Notas

- Si la ruta de destino no existe, se creará automáticamente
- Si un skill ya existe en la ruta de destino, será sobrescrito
- Los skills mantienen su estructura original completa (SKILL.md, tools/, etc.)
- Todos los archivos se copian tal cual, sin modificaciones

## 🤝 Contribuir

Para agregar nuevos skills:

1. Crea una carpeta en `skills/<categoria>/<skill-name>/`
2. Incluye un archivo `SKILL.md` con la descripción
3. Añade cualquier archivo necesario (scripts, tools, etc.)
4. El instalador detectará automáticamente el nuevo skill

## 📄 Licencia

MIT
