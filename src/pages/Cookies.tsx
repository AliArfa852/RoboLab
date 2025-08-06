import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings, Eye } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>What Are Cookies</span>
              </CardTitle>
              <CardDescription>
                Understanding how RoboLabPK uses cookies to enhance your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                enabling certain functionality.
              </p>
              <p className="text-foreground/80">
                RoboLabPK uses cookies responsibly and in compliance with privacy regulations. 
                We are committed to being transparent about what data we collect and how we use it.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Types of Cookies We Use</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                  <p className="text-foreground/80 mb-2">
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc pl-6 text-foreground/80 space-y-1">
                    <li>Authentication and session management</li>
                    <li>Security and fraud prevention</li>
                    <li>Basic website functionality</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Functional Cookies</h3>
                  <p className="text-foreground/80 mb-2">
                    These cookies enable enhanced functionality and personalization, such as remembering your 
                    preferences and settings.
                  </p>
                  <ul className="list-disc pl-6 text-foreground/80 space-y-1">
                    <li>User preferences and settings</li>
                    <li>Language selection</li>
                    <li>Theme preferences (dark/light mode)</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Performance Cookies</h3>
                  <p className="text-foreground/80 mb-2">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                  <ul className="list-disc pl-6 text-foreground/80 space-y-1">
                    <li>Website analytics and usage statistics</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking and debugging</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Managing Your Cookie Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                You have the right to control how cookies are used on your device. Here are your options:
              </p>
              
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-foreground/80">
                    Most web browsers allow you to control cookies through their settings. You can typically:
                  </p>
                  <ul className="list-disc pl-6 text-foreground/80 mt-2 space-y-1">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are being set</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Account Settings</h3>
                  <p className="text-foreground/80">
                    When you're logged into your RoboLabPK account, you can manage certain preferences 
                    from your account settings page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80">
                RoboLabPK may use third-party services that set their own cookies. These include:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-1">
                <li>Analytics providers for website usage insights</li>
                <li>Authentication services for secure login</li>
                <li>Content delivery networks for improved performance</li>
              </ul>
              <p className="text-foreground/80">
                These third-party services have their own privacy policies and cookie practices, 
                which we encourage you to review.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Questions About Our Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                If you have any questions about our use of cookies or this policy, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold">RoboLabPK Support</p>
                <p className="text-foreground/80">Email: privacy@robolabpk.com</p>
                <p className="text-foreground/80">Website: www.robolabpk.com</p>
              </div>
              <p className="text-sm text-foreground/60 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cookies;