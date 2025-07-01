class User {
  final String fullName;
  final String phoneNumber;

  User({
    required this.fullName,
    required this.phoneNumber,
  });

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'phoneNumber': phoneNumber,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      fullName: json['fullName'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
    );
  }

  @override
  String toString() {
    return 'User(fullName: $fullName, phoneNumber: $phoneNumber)';
  }
}
