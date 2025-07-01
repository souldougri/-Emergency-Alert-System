# Police Logo Integration

## Instructions for Adding the Police Logo

1. **Replace the placeholder file** `police_logo.png` with the actual police logo image
2. **Recommended specifications:**
   - Format: PNG (with transparency support)
   - Size: 512x512 pixels or higher
   - Quality: High resolution for crisp display on all devices
   - Background: Transparent or white

## Current Integration

The police logo is now integrated into:

### Home Screen (Main Interface)
- Displayed prominently above the police message
- Circular frame with shadow effect
- Size: 80x80 pixels
- Includes official text: "Direction Générale de la Police Nationale"

### Registration Screen
- Displayed at the top during user onboarding
- Circular frame with shadow effect  
- Size: 100x100 pixels
- Professional appearance for credibility

## Fallback Behavior

If the image fails to load, the app will automatically fall back to:
- Security icon on registration screen
- Police icon on home screen
- Maintains app functionality even without the image

## File Structure
```
mobile_app/
├── assets/
│   └── images/
│       ├── police_logo.png  ← Replace this file
│       └── README.md
└── lib/
    └── screens/
        ├── home_screen.dart      ← Logo integrated
        └── registration_screen.dart ← Logo integrated
```

## Next Steps

1. Replace `police_logo.png` with the actual logo file
2. Run `flutter pub get` to refresh assets
3. Test the app to ensure proper display
4. The logo will appear automatically in both screens
