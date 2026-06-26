import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ntanda/screens/onboarding/onboarding_screen.dart';
import 'package:ntanda/theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NtandaApp());
}

class NtandaApp extends StatelessWidget {
  const NtandaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ntanda LMS',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const OnboardingScreen(),
    );
  }
}
