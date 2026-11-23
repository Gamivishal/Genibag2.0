# Premium Interactive Vertical Timeline - Our Method Section

## Overview
A completely redesigned, premium interactive vertical timeline for your "Our Method" section featuring:

- ✨ **Cinematic dark theme** with orange accents
- 📱 **Fully responsive** design (desktop alternating, mobile timeline on left)
- 🎯 **Scroll-triggered animations** using Intersection Observer
- 🖼️ **Wide photographic cards** for each stage
- 💡 **Animated stage indicators** with pulse effects
- ♿ **Reduced motion support** for accessibility

## Files Created

1. **premium-vertical-timeline-style.html** - Complete CSS for the timeline
2. **premium-vertical-timeline-html.html** - Complete HTML structure with JavaScript
3. **PREMIUM-TIMELINE-README.md** - This documentation

## Implementation Instructions

### Step 1: Replace the Existing CSS
Remove the existing methodology section CSS from your index.html (approximately lines 1772-2518) and replace it with the CSS from `premium-vertical-timeline-style.html`.

### Step 2: Replace the Existing HTML
Remove the existing methodology section HTML (approximately lines 2519-2941) and replace it with the HTML from `premium-vertical-timeline-html.html`.

### Step 3: Add Image Placeholders
The HTML uses these image paths:
- `assets/img/method/discover.jpg`
- `assets/img/method/collect.jpg`
- `assets/img/method/review.jpg`
- `assets/img/method/prioritise.jpg`
- `assets/img/method/report.jpg`
- `assets/img/method/support.jpg`

Add your own premium corporate photography to these locations, or update the paths in the HTML to point to your existing images.

### Step 4: Integration
The JavaScript is included in the HTML file and will automatically:
- Animate stages as they scroll into view
- Activate corresponding stage indicators
- Work with reduced motion settings
- Adapt to all screen sizes

## Design Features

### Color Palette
- **Background**: Deep Midnight Navy (#0B1020 to #0D1321)
- **Accent**: Orange (#FF7048) with gradient variations
- **Text**: Soft white (#F5F6FA) and muted grey (#A5AEC0)
- **Cards**: Dark navy with 80% opacity (#151D32)

### Timeline Features
- **Central line**: Gradient orange line running vertically
- **Pulsing start**: Animated glow at the top
- **Stage indicators**: 20px circular markers with 3px borders
- **Active state**: Orange glow and scale effect when visible
- **Connector lines**: Subtle lines between stages

### Card Features
- **Width**: 50% each (alternating on desktop)
- **Padding**: 28px (20px on mobile)
- **Image**: 140px height (120px on tablet, 100px on mobile)
- **Border radius**: 20px
- **Border**: 1px semi-transparent white
- **Hover effects**: Lift up, brighter border, image zoom

### Typography
- **Eyebrow**: 12px, uppercase, letter-spacing 0.2em, orange
- **Title**: 36px, bold, high contrast
- **Subtitle**: 16px, muted grey
- **Stage number**: 11px, uppercase, orange
- **Card title**: 18px, bold, high contrast
- **Card description**: 14px, line-height 1.6, muted grey

### Responsive Behavior
- **Desktop (>991px)**: Alternating left-right cards with central timeline
- **Tablet (768-991px)**: Stacked cards with smaller spacing
- **Mobile (<575px)**: Timeline on left, all cards on right
- **All screens**: Works smoothly without horizontal scrolling

## Animation Details

### Scroll Animations
- Stages fade in from 30px below (translateY)
- Staggered reveal: 150ms delay between each stage
- Smooth cubic-bezier easing

### Indicator Animations
- Pulse effect when stage becomes active
- Outer ring animation (scale 0.92 → 1.6)
- Opacity fades from 0.85 → 0 → 0.25 → 0

### Hover Effects
- Cards lift 5px
- Image zooms 5%
- Top border gradient appears
- Orange glow intensifies

## Customization Options

### Colors
Modify the CSS variables in the `:root` selector:
```css
:root {
    --method-bg-1: #0B1020;
    --method-bg-2: #0D1321;
    --method-orange: #FF7048;
}
```

### Spacing
Adjust in the corresponding classes:
- Card gap: `.gb-method__timeline { gap: 40px; }`
- Padding: `.gb-method { padding: 100px 0 80px; }`
- Image height: `.gb-method__card-img { height: 140px; }`

### Image Sizing
Update the height in `.gb-method__card-img` and adjust other elements accordingly.

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Works with ES6+ JavaScript

## Accessibility
- Reduced motion support via `prefers-reduced-motion` media query
- Semantic HTML (`<article>`, `<section>`, `<h3>`, `<p>`)
- Keyboard navigation compatible
- Sufficient color contrast ratios

## Performance
- Lightweight CSS with no external dependencies
- Minimal JavaScript (Intersection Observer)
- Efficient animations using transform and opacity
- No layout shifts from animations

## Images
Use high-quality corporate photography for each stage. Recommended:
- Discover: Business meeting, consultants in discussion
- Collect: Organized documents, compliance paperwork
- Review: Professional team reviewing reports
- Prioritise: Strategic planning, project boards
- Report: Executive presentation, analytics dashboard
- Support: Collaboration, implementation guidance

## Testing
Test on all device sizes:
1. Desktop (1920x1080)
2. Tablet (768x1024)
3. Mobile (375x667, 414x896)

Check animations work on:
1. Desktop scroll
2. Mobile scroll
3. Browser refresh
4. Reduced motion enabled

## Notes
- The timeline line stays centered on desktop
- On mobile, timeline moves to left (30px from edge)
- All six stages must have images; consider using gradients if you don't have photos
- JavaScript uses intersection observer which is supported in all modern browsers
- Animations are smooth but can be disabled if preferred motion

## Support
If you need any adjustments to colors, spacing, animations, or functionality, refer to the CSS classes and JavaScript in the generated files.
