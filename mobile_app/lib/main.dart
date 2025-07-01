import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'utils/app_state.dart';
import 'utils/app_theme.dart';
import 'utils/constants.dart';
import 'screens/registration_screen.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const EmergencyAlertApp());
}

class EmergencyAlertApp extends StatelessWidget {
  const EmergencyAlertApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => AppState(),
      child: MaterialApp(
        title: AppConstants.appName,
        theme: AppTheme.lightTheme,
        home: const AppInitializer(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class AppInitializer extends StatefulWidget {
  const AppInitializer({super.key});

  @override
  State<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeApp();
    });
  }

  Future<void> _initializeApp() async {
    final appState = Provider.of<AppState>(context, listen: false);
    await appState.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        if (appState.isLoading) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.security,
                    size: 80,
                    color: AppConstants.primaryColor,
                  ),
                  SizedBox(height: AppConstants.paddingLarge),
                  CircularProgressIndicator(color: AppConstants.primaryColor),
                  SizedBox(height: AppConstants.paddingMedium),
                  Text('Initialisation...', style: AppConstants.bodyMedium),
                ],
              ),
            ),
          );
        }

        if (appState.isRegistered) {
          return const HomeScreen();
        } else {
          return const RegistrationScreen();
        }
      },
    );
  }
}
