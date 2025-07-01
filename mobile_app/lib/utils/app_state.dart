import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/storage_service.dart';
import '../services/connectivity_service.dart';

class AppState extends ChangeNotifier {
  User? _user;
  bool _isRegistered = false;
  bool _isConnected = true;
  bool _isLoading = false;

  // Getters
  User? get user => _user;
  bool get isRegistered => _isRegistered;
  bool get isConnected => _isConnected;
  bool get isLoading => _isLoading;

  /// Initialize app state
  Future<void> initialize() async {
    _isLoading = true;

    // Check if user is registered
    _isRegistered = await StorageService.isUserRegistered();

    if (_isRegistered) {
      _user = await StorageService.getUser();
    }

    // Check connectivity
    _isConnected = await ConnectivityService.isConnected();

    // Listen to connectivity changes
    ConnectivityService.startListening((connected) {
      _isConnected = connected;
      notifyListeners();
    });

    _isLoading = false;
    notifyListeners();
  }

  /// Register user
  Future<bool> registerUser(String fullName, String phoneNumber) async {
    setLoading(true);

    try {
      final user = User(
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      );

      final success = await StorageService.saveUser(user);

      if (success) {
        _user = user;
        _isRegistered = true;
        notifyListeners();
      }

      setLoading(false);
      return success;
    } catch (e) {
      setLoading(false);
      return false;
    }
  }

  /// Clear user data (for testing)
  Future<void> clearUserData() async {
    setLoading(true);

    await StorageService.clearUserData();
    _user = null;
    _isRegistered = false;

    setLoading(false);
    notifyListeners();
  }

  /// Set loading state
  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  @override
  void dispose() {
    ConnectivityService.stopListening();
    super.dispose();
  }
}
