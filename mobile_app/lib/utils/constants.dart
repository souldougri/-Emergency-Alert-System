import 'package:flutter/material.dart';

class AppConstants {
  // App Information
  static const String appName = 'Alerte d\'Urgence';
  static const String policeMessage = 'La Police au service du peuple';
  
  // Colors
  static const Color primaryColor = Color(0xFF1976D2); // Blue
  static const Color emergencyColor = Color(0xFFD32F2F); // Red
  static const Color successColor = Color(0xFF388E3C); // Green
  static const Color warningColor = Color(0xFFF57C00); // Orange
  static const Color backgroundColor = Color(0xFFF5F5F5); // Light gray
  static const Color cardColor = Colors.white;
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  
  // Spacing
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;
  static const double paddingXLarge = 32.0;
  
  // Border Radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 12.0;
  static const double radiusLarge = 16.0;
  static const double radiusXLarge = 24.0;
  
  // SOS Button
  static const double sosButtonSize = 120.0;
  static const double sosButtonElevation = 8.0;
  
  // Animation Durations
  static const Duration animationFast = Duration(milliseconds: 200);
  static const Duration animationMedium = Duration(milliseconds: 300);
  static const Duration animationSlow = Duration(milliseconds: 500);
  
  // Text Styles
  static const TextStyle headingLarge = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: textPrimary,
  );
  
  static const TextStyle headingMedium = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w600,
    color: textPrimary,
  );
  
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: textPrimary,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: textSecondary,
  );
  
  static const TextStyle buttonText = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );
  
  // Validation
  static const int minNameLength = 2;
  static const int maxNameLength = 50;
  static const int minPhoneLength = 8;
  static const int maxPhoneLength = 15;
  
  // Messages
  static const String registrationSuccessMessage = 'Inscription réussie!';
  static const String emergencyRequestSentMessage = 'Demande d\'urgence envoyée avec succès!';
  static const String noInternetMessage = 'Pas de connexion Internet. Veuillez vérifier votre réseau.';
  static const String locationErrorMessage = 'Impossible d\'obtenir votre localisation. Veuillez vérifier les autorisations.';
  static const String serverErrorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
}
