import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../utils/app_state.dart';
import '../utils/constants.dart';
import '../services/location_service.dart';
import '../services/api_service.dart';
import '../services/connectivity_service.dart';
import '../models/emergency_request.dart';
import '../widgets/sos_button.dart';
import '../widgets/connectivity_banner.dart';
import '../widgets/loading_overlay.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  bool _isLoading = false;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _pulseController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _sendEmergencyRequest() async {
    final appState = Provider.of<AppState>(context, listen: false);

    if (appState.user == null) {
      _showErrorSnackBar('Erreur: Utilisateur non trouvé');
      return;
    }

    // Check connectivity
    final isConnected = await ConnectivityService.isConnected();
    if (!isConnected) {
      _showErrorSnackBar(AppConstants.noInternetMessage);
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Get current location
      final locationResult = await LocationService.getCurrentLocation();

      if (!locationResult.isSuccess) {
        setState(() {
          _isLoading = false;
        });
        _showLocationErrorDialog(locationResult.error!);
        return;
      }

      // Create emergency request
      final emergencyRequest = EmergencyRequest(
        fullName: appState.user!.fullName,
        phoneNumber: appState.user!.phoneNumber,
        location: locationResult.location!,
      );

      // Send to backend
      final apiResponse = await ApiService.sendEmergencyRequest(
        emergencyRequest,
      );

      setState(() {
        _isLoading = false;
      });

      if (apiResponse.isSuccess) {
        _showSuccessDialog();
      } else {
        _showErrorSnackBar(
          apiResponse.error ?? AppConstants.serverErrorMessage,
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showErrorSnackBar('Erreur inattendue: ${e.toString()}');
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        icon: const Icon(
          Icons.check_circle,
          color: AppConstants.successColor,
          size: 48,
        ),
        title: const Text('Demande envoyée'),
        content: const Text(
          'Votre demande d\'urgence a été envoyée avec succès. Les secours ont été alertés.',
          textAlign: TextAlign.center,
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppConstants.successColor,
            ),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showLocationErrorDialog(String error) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        icon: const Icon(
          Icons.location_off,
          color: AppConstants.emergencyColor,
          size: 48,
        ),
        title: const Text('Erreur de localisation'),
        content: Text(error),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              LocationService.openAppSettings();
            },
            child: const Text('Paramètres'),
          ),
        ],
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppConstants.emergencyColor,
        action: SnackBarAction(
          label: 'OK',
          textColor: Colors.white,
          onPressed: () {},
        ),
      ),
    );
  }

  void _showUserInfo() {
    final appState = Provider.of<AppState>(context, listen: false);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Informations utilisateur'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Nom: ${appState.user?.fullName ?? 'N/A'}'),
            const SizedBox(height: 8),
            Text('Téléphone: ${appState.user?.phoneNumber ?? 'N/A'}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Fermer'),
          ),
          if (appState.user != null)
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _confirmClearData();
              },
              child: const Text(
                'Réinitialiser',
                style: TextStyle(color: AppConstants.emergencyColor),
              ),
            ),
        ],
      ),
    );
  }

  void _confirmClearData() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmer la réinitialisation'),
        content: const Text(
          'Êtes-vous sûr de vouloir supprimer vos données? Vous devrez vous réinscrire.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              Provider.of<AppState>(context, listen: false).clearUserData();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppConstants.emergencyColor,
            ),
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConstants.appName),
        actions: [
          IconButton(icon: const Icon(Icons.person), onPressed: _showUserInfo),
        ],
      ),
      body: LoadingOverlay(
        isLoading: _isLoading,
        child: Column(
          children: [
            // Connectivity Banner
            const ConnectivityBanner(),

            // Main Content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.paddingLarge),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Police Message with Official Logo
                    Card(
                      elevation: 4,
                      child: Padding(
                        padding: const EdgeInsets.all(
                          AppConstants.paddingLarge,
                        ),
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
                                        color: AppConstants.primaryColor
                                            .withValues(alpha: 0.1),
                                      ),
                                      child: Icon(
                                        Icons.local_police,
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
                              AppConstants.policeMessage,
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

                    const SizedBox(height: AppConstants.paddingXLarge * 2),

                    // SOS Button
                    AnimatedBuilder(
                      animation: _pulseAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _pulseAnimation.value,
                          child: SOSButton(
                            onPressed: _isLoading
                                ? null
                                : _sendEmergencyRequest,
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: AppConstants.paddingLarge),

                    // Instructions
                    Text(
                      'Appuyez sur le bouton SOS en cas d\'urgence',
                      style: AppConstants.bodyMedium,
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: AppConstants.paddingSmall),

                    Text(
                      'Votre localisation sera automatiquement envoyée aux services d\'urgence',
                      style: AppConstants.bodyMedium.copyWith(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
