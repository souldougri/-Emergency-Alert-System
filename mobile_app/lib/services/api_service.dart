import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/emergency_request.dart';

class ApiService {
  // Update this URL to match your backend server
  static const String baseUrl = 'http://localhost:5000/api';
  
  // For Android emulator, use: http://10.0.2.2:5000/api
  // For iOS simulator, use: http://localhost:5000/api
  // For physical device, use your computer's IP: http://192.168.x.x:5000/api
  
  static const Duration timeoutDuration = Duration(seconds: 30);

  /// Send emergency request to the backend
  static Future<ApiResponse<Map<String, dynamic>>> sendEmergencyRequest(
    EmergencyRequest request,
  ) async {
    try {
      final uri = Uri.parse('$baseUrl/emergency/request');
      
      final response = await http.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(request.toJson()),
      ).timeout(timeoutDuration);

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 201) {
        return ApiResponse.success(responseData['data']);
      } else {
        final errorMessage = responseData['error'] ?? 'Unknown error occurred';
        return ApiResponse.error(errorMessage);
      }
    } on SocketException {
      return ApiResponse.error(
        'No internet connection. Please check your network and try again.',
      );
    } on HttpException {
      return ApiResponse.error(
        'Server error. Please try again later.',
      );
    } on FormatException {
      return ApiResponse.error(
        'Invalid response from server. Please try again.',
      );
    } catch (e) {
      return ApiResponse.error(
        'An unexpected error occurred: ${e.toString()}',
      );
    }
  }

  /// Check if the backend server is reachable
  static Future<bool> checkServerHealth() async {
    try {
      final uri = Uri.parse('$baseUrl/health');
      
      final response = await http.get(uri).timeout(
        const Duration(seconds: 10),
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

/// Generic API response wrapper
class ApiResponse<T> {
  final bool isSuccess;
  final T? data;
  final String? error;

  ApiResponse._({
    required this.isSuccess,
    this.data,
    this.error,
  });

  factory ApiResponse.success(T data) {
    return ApiResponse._(
      isSuccess: true,
      data: data,
    );
  }

  factory ApiResponse.error(String error) {
    return ApiResponse._(
      isSuccess: false,
      error: error,
    );
  }
}
