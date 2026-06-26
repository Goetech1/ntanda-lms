import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';

class ForgotPasswordScreen extends StatefulWidget {
  final Color primaryColor;

  const ForgotPasswordScreen({super.key, required this.primaryColor});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  bool _isSent = false;

  void _handleReset() async {
    if (_emailController.text.isEmpty) return;
    
    setState(() => _isSent = true);
    // Future: Call backend API to send reset email
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: const BackButton(color: Colors.black87),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            FadeInDown(
              child: Text(
                _isSent ? 'Check your Email' : 'Reset Password',
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1C1B1F),
                ),
              ),
            ),
            const SizedBox(height: 12),
            FadeInDown(
              delay: const Duration(milliseconds: 200),
              child: Text(
                _isSent 
                  ? 'We have sent password recovery instructions to your email.'
                  : 'Enter the email address associated with your account and we\'ll send you a link to reset your password.',
                style: const TextStyle(fontSize: 16, color: Colors.black54),
              ),
            ),
            const SizedBox(height: 48),
            
            if (!_isSent) ...[
              FadeInUp(
                delay: const Duration(milliseconds: 400),
                child: TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: 'Email Address',
                    prefixIcon: const Icon(Icons.email_outlined),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: widget.primaryColor, width: 2),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              FadeInUp(
                delay: const Duration(milliseconds: 600),
                child: ElevatedButton(
                  onPressed: _handleReset,
                  style: ElevatedButton.styleFrom(backgroundColor: widget.primaryColor),
                  child: const Text('Send Instructions'),
                ),
              ),
            ] else ...[
              FadeInUp(
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: widget.primaryColor.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.mark_email_read_outlined, size: 80, color: widget.primaryColor),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              FadeInUp(
                delay: const Duration(milliseconds: 200),
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(backgroundColor: widget.primaryColor),
                  child: const Text('Back to Login'),
                ),
              ),
            ],
            
            const Spacer(),
            if (!_isSent)
              FadeInUp(
                child: Center(
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    style: TextButton.styleFrom(foregroundColor: widget.primaryColor),
                    child: const Text('Remember password? Login'),
                  ),
                ),
              ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
