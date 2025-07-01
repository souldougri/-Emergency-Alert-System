class EmergencyRequest {
  final String fullName;
  final String phoneNumber;
  final Location location;
  final String? address;

  EmergencyRequest({
    required this.fullName,
    required this.phoneNumber,
    required this.location,
    this.address,
  });

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'phoneNumber': phoneNumber,
      'location': location.toJson(),
      if (address != null) 'address': address,
    };
  }

  factory EmergencyRequest.fromJson(Map<String, dynamic> json) {
    return EmergencyRequest(
      fullName: json['fullName'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      location: Location.fromJson(json['location'] ?? {}),
      address: json['address'],
    );
  }
}

class Location {
  final String type;
  final List<double> coordinates; // [longitude, latitude]

  Location({
    this.type = 'Point',
    required this.coordinates,
  });

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'coordinates': coordinates,
    };
  }

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      type: json['type'] ?? 'Point',
      coordinates: List<double>.from(json['coordinates'] ?? [0.0, 0.0]),
    );
  }

  double get longitude => coordinates.isNotEmpty ? coordinates[0] : 0.0;
  double get latitude => coordinates.length > 1 ? coordinates[1] : 0.0;
}
