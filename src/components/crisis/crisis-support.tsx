'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Heart,
  Shield,
  Clock,
  MapPin,
  ExternalLink,
  User,
  Headphones,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useTogethrStore } from '@/lib/store';

export default function CrisisSupport() {
  const [isEmergency, setIsEmergency] = useState(false);
  const { setCurrentView } = useTogethrStore();

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 crisis support for suicidal thoughts',
      availability: '24/7',
      type: 'emergency',
      country: 'US'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Text-based crisis support',
      availability: '24/7',
      type: 'text',
      country: 'US'
    },
    {
      name: 'International Association for Suicide Prevention',
      phone: 'Visit website',
      description: 'Global crisis resources by country',
      availability: '24/7',
      type: 'web',
      country: 'International'
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Mental health and substance abuse help',
      availability: '24/7',
      type: 'phone',
      country: 'US'
    }
  ];

  const coreStrategies = [
    {
      title: 'Breathe Deeply',
      description: 'Take slow, deep breaths. In for 4, hold for 4, out for 6.',
      icon: '🫁',
      timeNeeded: '1-2 minutes'
    },
    {
      title: 'Ground Yourself',
      description: 'Name 5 things you can see, 4 you can touch, 3 you can hear.',
      icon: '🌍',
      timeNeeded: '2-3 minutes'
    },
    {
      title: 'Call Someone',
      description: 'Reach out to a trusted friend, family member, or counselor.',
      icon: '📞',
      timeNeeded: 'As needed'
    },
    {
      title: 'Safe Space',
      description: 'Go to a place where you feel secure and comfortable.',
      icon: '🏠',
      timeNeeded: 'Immediate'
    }
  ];

  const warningSignsPersonal = [
    'Overwhelming sadness or despair',
    'Feeling trapped or hopeless',
    'Thoughts of suicide or self-harm',
    'Extreme mood swings',
    'Loss of interest in activities',
    'Isolating from others',
    'Substance abuse increase',
    'Giving away possessions'
  ];

  const warningSignsOthers = [
    'Talking about death or suicide',
    'Extreme personality changes',
    'Withdrawing from social activities',
    'Risky or self-destructive behavior',
    'Sudden improvement after depression',
    'Making final arrangements',
    'Increased alcohol or drug use',
    'Expressing feelings of being a burden'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-900">Crisis Support</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Emergency Alert */}
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-900 mb-2">
                  If you're in immediate danger, call emergency services
                </h2>
                <p className="text-red-700 mb-4">
                  Your safety is the most important thing. Don't hesitate to reach out for help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call 911 (US)
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call 988 (Suicide Prevention)
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Text Crisis Line
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Crisis Resources */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Crisis Support Resources</span>
                </CardTitle>
                <CardDescription>
                  Professional help is available 24/7. You are not alone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                      <Badge variant={resource.type === 'emergency' ? 'destructive' : 'secondary'}>
                        {resource.availability}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          {resource.type === 'phone' || resource.type === 'emergency' ? (
                            <Phone className="w-4 h-4" />
                          ) : resource.type === 'text' ? (
                            <MessageCircle className="w-4 h-4" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                          <span>{resource.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{resource.country}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Contact Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Immediate Coping Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-green-600" />
                  <span>Immediate Coping Strategies</span>
                </CardTitle>
                <CardDescription>
                  Quick techniques to help you through a difficult moment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {coreStrategies.map((strategy, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{strategy.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{strategy.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {strategy.timeNeeded}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warning Signs Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Warning Signs</span>
                </CardTitle>
                <CardDescription>Recognize when you or others need help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Personal Signs
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {warningSignsPersonal.slice(0, 4).map((sign, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    In Others
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {warningSignsOthers.slice(0, 4).map((sign, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 24/7 Support */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Headphones className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-900 mb-2">Always Available</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Professional counselors are standing by to help you through any crisis.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Connect Now
                </Button>
              </CardContent>
            </Card>

            {/* Self-Care Reminder */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-100">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-green-900 mb-2">You Matter</h3>
                <p className="text-sm text-green-700">
                  Your life has value. You deserve support, care, and hope for a better tomorrow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 