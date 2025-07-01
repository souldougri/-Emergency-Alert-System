import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class StorageService {
  static const String _userKey = 'user_data';
  static const String _isRegisteredKey = 'is_registered';

  /// Save user data to local storage
  static Future<bool> saveUser(User user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = jsonEncode(user.toJson());
      
      await prefs.setString(_userKey, userJson);
      await prefs.setBool(_isRegisteredKey, true);
      
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Get user data from local storage
  static Future<User?> getUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(_userKey);
      
      if (userJson != null) {
        final userMap = jsonDecode(userJson);
        return User.fromJson(userMap);
      }
      
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Check if user is registered
  static Future<bool> isUserRegistered() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_isRegisteredKey) ?? false;
    } catch (e) {
      return false;
    }
  }

  /// Clear user data (for testing or logout)
  static Future<bool> clearUserData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_userKey);
      await prefs.remove(_isRegisteredKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
