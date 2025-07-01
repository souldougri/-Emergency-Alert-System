import 'package:geolocator/geolocator.dart';
import '../models/emergency_request.dart';

class LocationService {
  /// Check if location services are enabled and permissions are granted
  static Future<LocationPermissionResult> checkLocationPermission() async {
    // Check if location services are enabled
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return LocationPermissionResult.serviceDisabled;
    }

    // Check location permission
    LocationPermission permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return LocationPermissionResult.denied;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return LocationPermissionResult.deniedForever;
    }

    return LocationPermissionResult.granted;
  }

  /// Get current location with high accuracy
  static Future<LocationResult> getCurrentLocation() async {
    try {
      // Check permissions first
      final permissionResult = await checkLocationPermission();
      if (permissionResult != LocationPermissionResult.granted) {
        return LocationResult.error(
          _getPermissionErrorMessage(permissionResult),
        );
      }

      // Get current position with high accuracy
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 15),
      );

      // Create location object (longitude, latitude format for MongoDB)
      final location = Location(
        coordinates: [position.longitude, position.latitude],
      );

      return LocationResult.success(location);
    } catch (e) {
      return LocationResult.error('Failed to get location: ${e.toString()}');
    }
  }

  /// Open app settings for location permissions
  static Future<void> openAppSettings() async {
    await openAppSettings();
  }

  /// Get permission error message
  static String _getPermissionErrorMessage(LocationPermissionResult result) {
    switch (result) {
      case LocationPermissionResult.serviceDisabled:
        return 'Location services are disabled. Please enable location services in your device settings.';
      case LocationPermissionResult.denied:
        return 'Location permission denied. Please grant location permission to send emergency requests.';
      case LocationPermissionResult.deniedForever:
        return 'Location permission permanently denied. Please enable location permission in app settings.';
      case LocationPermissionResult.granted:
        return '';
    }
  }
}

/// Location permission check result
enum LocationPermissionResult {
  granted,
  denied,
  deniedForever,
  serviceDisabled,
}

/// Location service result wrapper
class LocationResult {
  final bool isSuccess;
  final Location? location;
  final String? error;

  LocationResult._({required this.isSuccess, this.location, this.error});

  factory LocationResult.success(Location location) {
    return LocationResult._(isSuccess: true, location: location);
  }

  factory LocationResult.error(String error) {
    return LocationResult._(isSuccess: false, error: error);
  }
}
