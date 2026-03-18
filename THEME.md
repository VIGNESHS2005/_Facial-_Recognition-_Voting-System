# 🎨 Theme Documentation

## Overview
This voting system uses a modern, professional blue-purple gradient theme that conveys trust, authority, and energy - perfect for student council elections.

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` - Trust & Authority
- **Secondary Purple**: `#8b5cf6` - Energy & Innovation
- **Success Green**: `#10b981` - Confirmation
- **Warning Amber**: `#f59e0b` - Alerts
- **Destructive Red**: `#ef4444` - Delete/Cancel

### Neutral Colors
- **Background**: `#ffffff` (Light) / `#0f172a` (Dark)
- **Foreground**: `#0f172a` (Light) / `#f8fafc` (Dark)
- **Muted**: `#f1f5f9` (Light) / `#334155` (Dark)
- **Border**: `#e2e8f0` (Light) / `#334155` (Dark)

### Chart Colors
1. **Chart 1**: Blue `#3b82f6`
2. **Chart 2**: Purple `#8b5cf6`
3. **Chart 3**: Green `#10b981`
4. **Chart 4**: Amber `#f59e0b`
5. **Chart 5**: Pink `#ec4899`

## Custom Gradient Utilities

You can use these custom classes anywhere in your components:

### Gradient Backgrounds
```tsx
// Primary gradient (Blue to Purple)
<div className="gradient-primary">Content</div>

// Success gradient
<div className="gradient-success">Content</div>

// Card gradient
<div className="gradient-card">Content</div>

// Subtle overlay
<div className="gradient-overlay">Content</div>
```

### Text Gradients
```tsx
<h1 className="text-gradient">Gradient Text</h1>
```

### Glass Effects
```tsx
// Light glass
<div className="glass">Content</div>

// Dark glass
<div className="glass-dark">Content</div>
```

### Shadow Effects
```tsx
// Primary shadow (blue)
<button className="shadow-primary">Button</button>

// Secondary shadow (purple)
<button className="shadow-secondary">Button</button>

// Success shadow (green)
<button className="shadow-success">Button</button>
```

## Usage Examples

### Modern Card with Gradient Header
```tsx
<Card className="shadow-xl border-border/50">
  <div className="gradient-primary p-6 rounded-t-xl">
    <h2 className="text-white text-2xl font-bold">Election Stats</h2>
  </div>
  <CardContent className="p-6">
    <p>Your content here</p>
  </CardContent>
</Card>
```

### Gradient Button
```tsx
<Button className="gradient-primary text-white shadow-primary">
  Vote Now
</Button>
```

### Glass Card
```tsx
<div className="glass p-6 rounded-xl">
  <h3>Transparent Card</h3>
  <p>Beautiful frosted glass effect</p>
</div>
```

### Icon with Gradient Background
```tsx
<div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl shadow-primary">
  <Vote className="h-8 w-8 text-white" />
</div>
```

## Typography

### Headings
- **h1**: 2.25rem (36px), font-weight: 700
- **h2**: 1.875rem (30px), font-weight: 700
- **h3**: 1.5rem (24px), font-weight: 600
- **h4**: 1.25rem (20px), font-weight: 600

### Body Text
- **p**: 1rem (16px), font-weight: 400
- **label**: 0.875rem (14px), font-weight: 500
- **button**: 0.875rem (14px), font-weight: 600

## Border Radius
- **Small**: `--radius-sm` = 0.375rem (6px)
- **Medium**: `--radius-md` = 0.625rem (10px)
- **Large**: `--radius-lg` = 0.75rem (12px)
- **Extra Large**: `--radius-xl` = 1rem (16px)

## Dark Mode

Dark mode is automatically supported! All colors have dark mode variants defined in `/src/styles/theme.css`.

To enable dark mode, add the `dark` class to your root element:
```html
<html class="dark">
```

## Best Practices

### 1. Use Gradient Backgrounds Sparingly
```tsx
// ✅ Good - Hero sections, CTAs, headers
<div className="gradient-primary p-8">Hero Content</div>

// ❌ Avoid - Body text, forms
<input className="gradient-primary" /> // Too much!
```

### 2. Combine Shadows with Gradients
```tsx
// ✅ Great combination
<Button className="gradient-primary shadow-primary">
  Primary Action
</Button>
```

### 3. Use Text Gradients for Headlines
```tsx
// ✅ Eye-catching titles
<h1 className="text-4xl font-bold">
  <span className="text-gradient">Amazing Title</span>
</h1>
```

### 4. Glass Effects on Overlays
```tsx
// ✅ Perfect for modals, tooltips
<div className="fixed inset-0 bg-black/50">
  <div className="glass p-8 rounded-2xl">
    Modal Content
  </div>
</div>
```

## Component Examples

### Login Card
```tsx
<Card className="shadow-xl border-border/50">
  <CardHeader>
    <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl shadow-primary mb-4">
      <Lock className="h-8 w-8 text-white" />
    </div>
    <CardTitle className="text-xl">Login</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Form content */}
  </CardContent>
</Card>
```

### Stats Card
```tsx
<Card className="border-2 hover:shadow-primary transition-all">
  <CardContent className="p-6">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center">
        <CheckCircle className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gradient">1,234</p>
        <p className="text-sm text-muted-foreground">Total Votes</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### CTA Section
```tsx
<div className="gradient-primary p-12 rounded-2xl shadow-primary text-white text-center">
  <h2 className="text-3xl font-bold mb-4">Ready to Vote?</h2>
  <p className="mb-6 opacity-90">Join thousands of students</p>
  <Button size="lg" variant="secondary">
    Get Started
  </Button>
</div>
```

## Customization

To customize the theme, edit `/src/styles/theme.css`:

1. **Change Primary Color**: Modify `--primary` variable
2. **Add New Gradients**: Add to `@layer utilities`
3. **Adjust Shadows**: Modify shadow utilities
4. **Update Typography**: Change font sizes and weights in `@layer base`

## References

- Theme CSS: `/src/styles/theme.css`
- Tailwind Config: Using Tailwind v4 inline config
- Example Pages: 
  - HomePage: `/src/app/pages/HomePage.tsx`
  - AdminLogin: `/src/app/pages/AdminLogin.tsx`
  - VoterLogin: `/src/app/pages/VoterLogin.tsx`
