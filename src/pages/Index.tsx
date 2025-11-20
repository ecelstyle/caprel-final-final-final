import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, FileCheck, Users, TrendingUp, ChevronDown, Mail, Phone, CheckCircle2, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Caprel LocalSecure</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                Testimonials
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-accent-light rounded-full">
              <span className="text-accent text-sm font-semibold">Secure · Trusted · Audit-Ready</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
              Secure workspace for{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                clients · credit · orders · messages
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Zero-Trust architecture with encrypted data, comprehensive audit trails, and role-based access control.
              Manage your business securely.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                Discover Platform
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                Learn More
              </Button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Zero-Trust</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <Card className="shadow-lg border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Secure Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email / Username
                </label>
                <Input
                  id="email"
                  type="text"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">Remember this device</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Link to="/dashboard">
                <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-md" size="lg">
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In Securely
                </Button>
              </Link>
              <div className="pt-4 border-t border-border">
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Security Notice:</strong> Enable MFA for enhanced protection. Access restricted to
                    Finance/Sales/Support roles only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-accent-light/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Caprel LocalSecure?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security meets intuitive design for seamless business management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Zero-Trust Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every request is authenticated and authorized. No implicit trust, maximum protection for your
                  sensitive data.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileCheck className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Comprehensive Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete activity logs with timestamps, user tracking, and change history. Always audit-ready for
                  compliance.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Granular permissions for Finance, Sales, and Support teams. Each role sees only what they need.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Machine learning system with 147K+ training records to predict inspection outcomes with high accuracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center">Latest Updates</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-xs text-muted-foreground mb-2">November 18, 2025</div>
              <CardTitle className="text-lg">Enhanced Credit Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time alerts for credit limit breaches with automated notifications to finance teams.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-xs text-muted-foreground mb-2">November 10, 2025</div>
              <CardTitle className="text-lg">Multi-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                New MFA options including SMS, authenticator apps, and biometric verification now available.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-xs text-muted-foreground mb-2">November 1, 2025</div>
              <CardTitle className="text-lg">API v2.0 Released</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Faster, more secure API with webhook support and improved documentation for developers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-accent-light/30 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">What Our Clients Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <CardTitle className="text-lg">Outstanding Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic mb-4">
                  "Caprel LocalSecure transformed how we manage credit. The audit trail saved us during compliance
                  review."
                </p>
                <p className="text-sm font-semibold">— Sarah M., CFO at TechCorp</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <CardTitle className="text-lg">Intuitive & Powerful</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic mb-4">
                  "Easy onboarding, powerful features. Our sales team adapted instantly. Credit monitoring is a
                  game-changer."
                </p>
                <p className="text-sm font-semibold">— James K., Sales Director</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <CardTitle className="text-lg">Best Support Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic mb-4">
                  "24/7 support that actually responds. Migration was seamless, and the team guided us every step."
                </p>
                <p className="text-sm font-semibold">— Aisha B., Operations Manager</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="security" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How secure is Caprel LocalSecure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We implement Zero-Trust architecture with end-to-end encryption, MFA, role-based access control, and
                complete audit trails. All data is encrypted at rest and in transit. We're GDPR compliant and ISO
                27001 certified.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="credit" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How does credit monitoring work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Real-time tracking of credit exposure per client with customizable limits. Automatic alerts when
                thresholds are reached. Visual dashboards show exposure by client, city, and time period. Automated
                notifications to finance teams.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="onboarding" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What's the onboarding process?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Typical onboarding takes 2-3 days. We provide dedicated support, data migration assistance, user
                training sessions, and custom configuration. Most clients are fully operational within a week.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">What are the pricing plans?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Flexible pricing based on users and features. Starter plan includes core features for small teams.
                Professional adds advanced reporting and integrations. Enterprise includes dedicated support, custom
                features, and SLA guarantees. Contact sales for custom quotes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="integrations" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What integrations are available?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                REST API for custom integrations. Pre-built connectors for major ERP systems, accounting software, and
                CRMs. Webhooks for real-time events. SFTP for batch data exchange. Full documentation and SDK
                available.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Partners & Certifications */}
      <section className="bg-accent-light/30 py-12">
        <div className="container mx-auto px-4">
          <h4 className="text-center text-sm font-semibold text-muted-foreground mb-6">
            TRUSTED BY LEADING ORGANIZATIONS
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="px-6 py-3 bg-background rounded-lg border">
              <span className="font-bold text-lg">ISO 27001</span>
            </div>
            <div className="px-6 py-3 bg-background rounded-lg border">
              <span className="font-bold text-lg">GDPR</span>
            </div>
            <div className="px-6 py-3 bg-background rounded-lg border">
              <span className="font-bold text-lg">SOC 2 Type II</span>
            </div>
            <div className="px-6 py-3 bg-background rounded-lg border">
              <span className="font-bold text-lg">PCI DSS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold">Need Help or Have Questions?</h3>
          <p className="text-xl text-muted-foreground">
            Our team is available 24/7 to assist you with onboarding, technical support, or any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
            <Button size="lg" variant="outline" className="border-2">
              <Phone className="mr-2 h-4 w-4" />
              Call Sales
            </Button>
          </div>
          <div className="pt-8">
            <a
              href="https://docs.caprel.com"
              className="text-primary hover:underline inline-flex items-center"
            >
              View Documentation
              <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-accent-light/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold">Caprel LocalSecure</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Caprel LocalSecure. All rights reserved. | Privacy Policy | Terms of Service
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
