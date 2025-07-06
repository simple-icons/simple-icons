# 🎨 Icon Theme Generator

The Icon Theme Generator is a powerful tool that allows you to create themed versions of Simple Icons with different visual styles. This feature enables developers to generate consistent icon sets that match their project's design system.

## Features

- **6 Theme Types**: Monochrome, Outlined, Inverted, Gradient, High Contrast, and Brand Variants
- **Batch Processing**: Generate themes for all icons, specific icons, or random samples
- **CLI Interface**: Easy-to-use command-line interface with interactive prompts
- **Customizable Options**: Each theme type supports customizable parameters
- **Consistent Output**: All themed icons maintain the original SVG structure and metadata

## Usage

### Basic Usage

```bash
# Using npm script
npm run generate-theme

# Or directly with Node.js
node scripts/theme-generator.js
```

### Command Line Interface

The CLI will guide you through the following steps:

1. **Select Theme Type**: Choose from 6 available theme types
2. **Configure Options**: Set theme-specific parameters
3. **Select Icons**: Choose which icons to theme
4. **Generate**: Create themed icons

## Theme Types

### 1. Monochrome 🎯
Convert icons to single-color versions.

**Options:**
- `color`: Target color (default: #000000)

**Example:**
```bash
# Creates black monochrome versions
color: #000000

# Creates blue monochrome versions  
color: #0066CC
```

### 2. Outlined 📐
Create stroke-only versions with customizable width.

**Options:**
- `strokeWidth`: Stroke width (default: 1.5)
- `color`: Stroke color (default: #000000)

**Example:**
```bash
strokeWidth: 2.0
color: #333333
```

### 3. Inverted 🔄
Background/foreground color inverted versions.

**Options:**
- `backgroundColor`: Background color (default: #FFFFFF)

**Example:**
```bash
backgroundColor: #000000  # Creates white icons on black background
```

### 4. Gradient 🌈
Apply gradient color schemes to icons.

**Options:**
- `startColor`: Gradient start color (default: #FF0000)
- `endColor`: Gradient end color (default: #0000FF)  
- `direction`: Gradient direction (default: linear)

**Example:**
```bash
startColor: #FF6B6B
endColor: #4ECDC4
direction: linear
```

### 5. High Contrast ♿
Generate high-contrast versions for accessibility.

**Options:**
- `contrastRatio`: Minimum contrast ratio (default: 4.5)

**Example:**
```bash
contrastRatio: 7.0  # For AAA accessibility compliance
```

### 6. Brand Variant 🏢
Create light/dark theme variations based on original brand colors.

**Options:**
- `variant`: Theme variant - 'light' or 'dark' (default: dark)

**Example:**
```bash
variant: light  # Lightens the original brand color
variant: dark   # Darkens the original brand color
```

## Icon Selection Options

### All Icons
Generate themes for all 3,000+ icons in the library.

### Specific Icons
Target specific icons by name or slug:
```bash
# Single icon
github

# Multiple icons (comma-separated)
github, react, nodejs

# Partial matches work too
google, microsoft, facebook
```

### Random Sample
Generate a random sample for testing:
```bash
# Random sample size
10   # Generates themes for 10 random icons
50   # Generates themes for 50 random icons
```

## Output

Themed icons are saved to the `themed-icons/` directory with the following naming convention:
```
{icon-slug}-{theme-name}.svg
```

**Examples:**
- `github-monochrome.svg`
- `react-outlined.svg`
- `nodejs-gradient.svg`

## Examples

### Generate Black Monochrome Icons
```bash
npm run generate-theme
# Select: Monochrome
# Color: #000000
# Icons: All icons
```

### Generate Blue Outlined Icons for Popular Frameworks
```bash
npm run generate-theme
# Select: Outlined
# Stroke width: 2.0
# Color: #0066CC
# Icons: Specific icons
# Enter: react, vue, angular, svelte
```

### Generate High Contrast Icons for Accessibility
```bash
npm run generate-theme
# Select: High Contrast
# Contrast ratio: 7.0
# Icons: All icons
```

### Generate Brand Light Variants for Sample
```bash
npm run generate-theme
# Select: Brand Variant
# Variant: light
# Icons: Random sample
# Size: 20
```

## Integration

### Using Themed Icons in Projects

After generation, you can use the themed icons in your projects:

```html
<!-- HTML -->
<img src="themed-icons/github-monochrome.svg" alt="GitHub">

<!-- As background image -->
<div style="background-image: url('themed-icons/react-outlined.svg')"></div>
```

```css
/* CSS */
.icon-github {
  background-image: url('themed-icons/github-monochrome.svg');
  width: 24px;
  height: 24px;
}
```

```javascript
// JavaScript/React
import githubIcon from './themed-icons/github-monochrome.svg';

function MyComponent() {
  return <img src={githubIcon} alt="GitHub" />;
}
```

### Programmatic Usage

You can also use the theme generator programmatically:

```javascript
import { generateThemedIcon, applyTheme } from './scripts/theme-generator.js';

// Generate themed version of an icon
const result = await generateThemedIcon(iconData, {
  name: 'Monochrome',
  type: 'monochrome',
  options: { color: '#FF0000' }
});

// Apply theme to SVG content
const themedSvg = applyTheme(svgContent, 'monochrome', { color: '#FF0000' }, iconData);
```

## Best Practices

### Color Selection
- Use colors that match your brand or design system
- Consider accessibility and contrast ratios
- Test colors on different backgrounds

### Theme Consistency
- Use the same theme type across related icons
- Maintain consistent colors within a theme
- Document your theme choices for team collaboration

### Performance
- Generate themes in batches rather than individually
- Consider file sizes when using gradients or complex themes
- Optimize SVGs after generation if needed

### Accessibility
- Use high contrast themes for better visibility
- Test with screen readers and accessibility tools
- Follow WCAG guidelines for color contrast

## Advanced Usage

### Custom Theme Development
To add new theme types, modify the `THEME_TYPES` object in `scripts/theme-generator.js`:

```javascript
const THEME_TYPES = {
  // ... existing themes
  myCustomTheme: {
    name: 'My Custom Theme',
    description: 'Description of my custom theme',
    options: {
      customOption: {
        type: 'string', 
        default: 'default-value', 
        description: 'Option description'
      }
    }
  }
};
```

Then implement the theme application function:

```javascript
const applyMyCustomTheme = (svgContent, options) => {
  // Your custom theme logic here
  return transformedSvgContent;
};
```

### Batch Scripts
Create batch scripts for common theme generation tasks:

```bash
#!/bin/bash
# generate-brand-themes.sh

# Generate dark variants for all icons
npm run generate-theme -- --theme brandVariant --variant dark --icons all

# Generate light variants for all icons  
npm run generate-theme -- --theme brandVariant --variant light --icons all
```

## Troubleshooting

### Common Issues

**Icons not generating:**
- Check that the original SVG files exist in `icons/`
- Verify icon names match the slugs in `data/simple-icons.json`
- Ensure you have write permissions to the output directory

**Theme not applying correctly:**
- Verify the SVG structure matches expected format
- Check that the theme options are valid
- Test with a simple icon first

**Performance issues:**
- Generate themes in smaller batches
- Use specific icon selection instead of "all icons"
- Consider running the process in the background
 