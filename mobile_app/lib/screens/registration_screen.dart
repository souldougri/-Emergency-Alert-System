import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/app_state.dart';
import '../utils/constants.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/loading_overlay.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({super.key});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final appState = Provider.of<AppState>(context, listen: false);

    final success = await appState.registerUser(
      _nameController.text,
      _phoneController.text,
    );

    setState(() {
      _isLoading = false;
    });

    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(AppConstants.registrationSuccessMessage),
            backgroundColor: AppConstants.successColor,
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Erreur lors de l\'inscription. Veuillez réessayer.'),
            backgroundColor: AppConstants.emergencyColor,
          ),
        );
      }
    }
  }

  String? _validateName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Veuillez entrer votre nom complet';
    }
    if (value.trim().length < AppConstants.minNameLength) {
      return 'Le nom doit contenir au moins ${AppConstants.minNameLength} caractères';
    }
    if (value.trim().length > AppConstants.maxNameLength) {
      return 'Le nom ne peut pas dépasser ${AppConstants.maxNameLength} caractères';
    }
    return null;
  }

  String? _validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Veuillez entrer votre numéro de téléphone';
    }

    // Remove spaces and special characters for validation
    final cleanPhone = value.replaceAll(RegExp(r'[^\d+]'), '');

    if (cleanPhone.length < AppConstants.minPhoneLength) {
      return 'Le numéro de téléphone doit contenir au moins ${AppConstants.minPhoneLength} chiffres';
    }
    if (cleanPhone.length > AppConstants.maxPhoneLength) {
      return 'Le numéro de téléphone ne peut pas dépasser ${AppConstants.maxPhoneLength} chiffres';
    }

    // Basic phone number format validation
    if (!RegExp(r'^[\+]?[1-9][\d]{0,15}$').hasMatch(cleanPhone)) {
      return 'Format de numéro de téléphone invalide';
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inscription'),
        automaticallyImplyLeading: false,
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppConstants.paddingLarge),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: AppConstants.paddingXLarge),

                // Police Card (Exactly like main page)
                Card(
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(AppConstants.paddingLarge),
                    child: Column(
                      children: [
                        // Official Police Logo
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.1),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: ClipOval(
                            child: Image.asset(
                              'assets/images/police_logo.png',
                              width: 80,
                              height: 80,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                // Fallback to icon if image fails to load
                                return Container(
                                  width: 80,
                                  height: 80,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AppConstants.primaryColor.withValues(
                                      alpha: 0.1,
                                    ),
                                  ),
                                  child: Icon(
                                    Icons.security,
                                    size: 48,
                                    color: AppConstants.primaryColor,
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: AppConstants.paddingMedium),
                        Text(
                          'La Police au service du peuple',
                          style: AppConstants.headingMedium.copyWith(
                            color: AppConstants.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppConstants.paddingSmall),
                        Text(
                          'Direction Générale de la Police Nationale',
                          style: AppConstants.bodyMedium.copyWith(
                            color: AppConstants.primaryColor.withValues(
                              alpha: 0.8,
                            ),
                            fontSize: 12,
                            fontStyle: FontStyle.italic,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: AppConstants.paddingLarge),

                // Welcome Text
                Text(
                  'Bienvenue',
                  style: AppConstants.headingLarge,
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: AppConstants.paddingSmall),

                Text(
                  'Veuillez vous inscrire pour utiliser le système d\'alerte d\'urgence',
                  style: AppConstants.bodyMedium,
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: AppConstants.paddingXLarge),

                // Name Field
                CustomTextField(
                  controller: _nameController,
                  label: 'Nom complet',
                  hint: 'Entrez votre nom complet',
                  prefixIcon: Icons.person,
                  validator: _validateName,
                  textCapitalization: TextCapitalization.words,
                ),

                const SizedBox(height: AppConstants.paddingMedium),

                // Phone Field
                CustomTextField(
                  controller: _phoneController,
                  label: 'Numéro de téléphone',
                  hint: '+33 6 12 34 56 78',
                  prefixIcon: Icons.phone,
                  validator: _validatePhone,
                  keyboardType: TextInputType.phone,
                ),

                const SizedBox(height: AppConstants.paddingXLarge),

                // Register Button
                ElevatedButton(
                  onPressed: _isLoading ? null : _register,
                  child: const Text('S\'inscrire'),
                ),

                const SizedBox(height: AppConstants.paddingMedium),

                // Info Text
                Text(
                  'Vos informations sont stockées localement et utilisées uniquement pour les demandes d\'urgence.',
                  style: AppConstants.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
