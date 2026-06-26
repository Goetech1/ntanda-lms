import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:local_auth_android/local_auth_android.dart';
import 'package:local_auth_darwin/local_auth_darwin.dart';

class AuthService {
  final LocalAuthentication auth = LocalAuthentication();

  Future<bool> checkBiometrics() async {
    try {
      final bool canAuthenticateWithBiometrics = await auth.canCheckBiometrics;
      final bool canAuthenticate = canAuthenticateWithBiometrics || await auth.isDeviceSupported();
      return canAuthenticate;
    } on PlatformException catch (e) {
      print(e);
      return false;
    }
  }

  Future<bool> authenticate() async {
    try {
      final bool didAuthenticate = await auth.authenticate(
        localizedReason: 'Please authenticate to log into Ntanda',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
        authMessages: const <AuthMessages>[
          AndroidAuthMessages(
            signInTitle: 'Biometric login for Ntanda',
            biometricHint: 'Touch sensor',
          ),
          IOSAuthMessages(
            cancelButton: 'No thanks',
          ),
        ],
      );
      return didAuthenticate;
    } on PlatformException catch (e) {
      print(e);
      return false;
    }
  }
}
