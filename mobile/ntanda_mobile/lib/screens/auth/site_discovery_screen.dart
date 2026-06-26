import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:ntanda/screens/auth/login_screen.dart';

class SiteDiscoveryScreen extends StatefulWidget {
  const SiteDiscoveryScreen({super.key});

  @override
  State<SiteDiscoveryScreen> createState() => _SiteDiscoveryScreenState();
}

class _SiteDiscoveryScreenState extends State<SiteDiscoveryScreen> {
  final TextEditingController _urlController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  void _connectToSite() async {
    final input = _urlController.text.trim().toLowerCase();
    if (input.isEmpty) {
      setState(() => _errorMessage = 'Please enter your school URL or subdomain');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    // Simulate API call to resolve tenant
    // In a real app, we would call: GET /tenant/resolve?subdomain=input
    await Future.delayed(const Duration(seconds: 2));

    if (input == 'demo' || input == 'university' || input.contains('ntanda.com')) {
      // Success - Navigate to Branded Login
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LoginScreen(
              tenantName: input.toUpperCase(),
              primaryColor: input == 'demo' ? const Color(0xFF004AC6) : const Color(0xFF047857),
            ),
          ),
        );
      }
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = 'We couldn\'t find a school with that URL.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(
              child: const Text(
                'Connect your School',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1C1B1F),
                ),
              ),
            ),
            const SizedBox(height: 12),
            FadeInDown(
              delay: const Duration(milliseconds: 200),
              child: const Text(
                'Enter your institution\'s Ntanda URL or subdomain to get started.',
                style: TextStyle(fontSize: 16, color: Colors.black54),
              ),
            ),
            const SizedBox(height: 48),
            
            FadeInUp(
              delay: const Duration(milliseconds: 400),
              child: TextField(
                controller: _urlController,
                autofocus: true,
                decoration: InputDecoration(
                  labelText: 'School URL or Subdomain',
                  hintText: 'e.g. university.ntanda.com',
                  prefixIcon: const Icon(Icons.language_rounded),
                  errorText: _errorMessage,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  suffixIcon: inputIcon(),
                ),
                onSubmitted: (_) => _connectToSite(),
              ),
            ),
            
            const SizedBox(height: 32),
            
            FadeInUp(
              delay: const Duration(milliseconds: 600),
              child: ElevatedButton(
                onPressed: _isLoading ? null : _connectToSite,
                child: _isLoading 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Connect'),
              ),
            ),
            
            const Spacer(),
            
            FadeInUp(
              child: Center(
                child: Column(
                  children: [
                    const Text('Need help finding your URL?'),
                    TextButton(
                      onPressed: () {},
                      child: const Text('Contact Administrator'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget? inputIcon() {
    return IconButton(
      icon: const Icon(Icons.qr_code_scanner_rounded),
      onPressed: () {
        // Future: Implement QR scanning
      },
    );
  }
}
