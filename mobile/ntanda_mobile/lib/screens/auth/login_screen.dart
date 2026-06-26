import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:ntanda/services/auth_service.dart';
import 'package:ntanda/screens/auth/forgot_password_screen.dart';

class LoginScreen extends StatefulWidget {
  final String tenantName;
  final Color primaryColor;

  const LoginScreen({
    super.key, 
    required this.tenantName, 
    required this.primaryColor
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isEmailLogin = true;
  final AuthService _authService = AuthService();
  bool _canCheckBiometrics = false;

  @override
  void initState() {
    super.initState();
    _checkBiometrics();
  }

  Future<void> _checkBiometrics() async {
    final canCheck = await _authService.checkBiometrics();
    if (mounted) {
      setState(() => _canCheckBiometrics = canCheck);
    }
  }

  Future<void> _handleBiometricLogin() async {
    final authenticated = await _authService.authenticate();
    if (authenticated) {
      // Mock success
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Biometric Authentication Success!')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: widget.primaryColor.withOpacity(0.05),
        elevation: 0,
        leading: const BackButton(color: Colors.black87),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
              child: Text(
                widget.tenantName,
                style: TextStyle(
                  color: widget.primaryColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Branded Header
            FadeInDown(
              child: Container(
                height: 220,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: widget.primaryColor.withOpacity(0.05),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(60),
                  ),
                ),
                child: Center(
                  child: Icon(
                    Icons.school_rounded,
                    size: 100,
                    color: widget.primaryColor,
                  ),
                ),
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeInLeft(
                    child: const Text(
                      'Welcome Back',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1C1B1F),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  FadeInLeft(
                    delay: const Duration(milliseconds: 200),
                    child: Text(
                      'Sign in to your account at ${widget.tenantName}',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.black54,
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                  
                  // Login Toggle
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _isEmailLogin = true),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: _isEmailLogin ? Colors.white : Colors.transparent,
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: _isEmailLogin ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  )
                                ] : null,
                              ),
                              child: Center(
                                child: Text(
                                  'Email',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: _isEmailLogin ? widget.primaryColor : Colors.black45,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _isEmailLogin = false),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: !_isEmailLogin ? Colors.white : Colors.transparent,
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: !_isEmailLogin ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  )
                                ] : null,
                              ),
                              child: Center(
                                child: Text(
                                  'Phone',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: !_isEmailLogin ? widget.primaryColor : Colors.black45,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  // Fields
                  TextField(
                    decoration: InputDecoration(
                      labelText: _isEmailLogin ? 'Email Address' : 'Phone Number',
                      prefixIcon: Icon(_isEmailLogin ? Icons.email_outlined : Icons.phone_outlined),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: widget.primaryColor, width: 2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: const Icon(Icons.visibility_off_outlined),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: widget.primaryColor, width: 2),
                      ),
                    ),
                  ),
                  
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ForgotPasswordScreen(primaryColor: widget.primaryColor),
                          ),
                        );
                      },
                      style: TextButton.styleFrom(foregroundColor: widget.primaryColor),
                      child: const Text('Forgot Password?'),
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: widget.primaryColor),
                    child: const Text('Sign In'),
                  ),
                  if (_canCheckBiometrics) ...[
                    const SizedBox(height: 16),
                    Center(
                      child: IconButton(
                        icon: Icon(Icons.fingerprint, size: 48, color: widget.primaryColor),
                        onPressed: _handleBiometricLogin,
                        tooltip: 'Login with Biometrics',
                      ),
                    ),
                  ],
                  const SizedBox(height: 40),
                  
                  Center(
                    child: Column(
                      children: [
                        const Text(
                          'Wrong school?',
                          style: TextStyle(color: Colors.black45),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          style: TextButton.styleFrom(foregroundColor: widget.primaryColor),
                          child: const Text('Switch Institution'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
