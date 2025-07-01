import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectivityService {
  static final Connectivity _connectivity = Connectivity();
  static StreamSubscription? _connectivitySubscription;

  /// Check current connectivity status
  static Future<bool> isConnected() async {
    try {
      final connectivityResult = await _connectivity.checkConnectivity();
      return _isConnectedResult(connectivityResult);
    } catch (e) {
      return false;
    }
  }

  /// Helper method to check if connectivity result indicates connection
  static bool _isConnectedResult(dynamic result) {
    if (result is List) {
      return result.any((r) => 
        r == ConnectivityResult.mobile || 
        r == ConnectivityResult.wifi ||
        r == ConnectivityResult.ethernet
      );
    } else if (result is ConnectivityResult) {
      return result == ConnectivityResult.mobile || 
             result == ConnectivityResult.wifi ||
             result == ConnectivityResult.ethernet;
    }
    return false;
  }

  /// Start listening to connectivity changes
  static void startListening(Function(bool) onConnectivityChanged) {
    _connectivitySubscription = _connectivity.onConnectivityChanged.listen((result) {
      final isConnected = _isConnectedResult(result);
      onConnectivityChanged(isConnected);
    });
  }

  /// Stop listening to connectivity changes
  static void stopListening() {
    _connectivitySubscription?.cancel();
    _connectivitySubscription = null;
  }
}
