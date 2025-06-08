'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store/user';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  Clock, 
  Users,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Zap,
  Brain,
  Home
} from 'lucide-react';

export default function CrisisSupport() {
  const [isEmergency, setIsEmergency] = useState(false);
  
  // Get user from user store
  const { user } = useUserStore();
  
  // Get UI actions from app store
  const { setCurrentView } = useAppStore();

  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 free and confidential support',
      available: '24/7'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text',
      available: '24/7'
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'For immediate life-threatening emergencies',
      available: '24/7'
    }
  ];

  const copingStrategies = [
    {
      title: 'Breathing Exercise',
      description: '4-7-8 breathing technique',
      icon: <Zap className="h-5 w-5" />,
      action: 'Try Now'
    },
    {
      title: 'Grounding Technique',
      description: '5-4-3-2-1 sensory grounding',
      icon: <Brain className="h-5 w-5" />,
      action: 'Start'
    },
    {
      title: 'Safe Person',
      description: 'Call someone you trust',
      icon: <Users className="h-5 w-5" />,
      action: 'Contact'
    },
    {
      title: 'Safe Space',
      description: 'Go to your safe place',
      icon: <Home className="h-5 w-5" />,
      action: 'Go'
    }
  ];

  const resources = [
    {
      title: 'Mental Health America',
      description: 'Comprehensive mental health resources',
      url: 'https://mhanational.org'
    },
    {
      title: 'National Alliance on Mental Illness',
      description: 'Support and education for mental health',
      url: 'https://nami.org'
    },
    {
      title: 'Crisis Prevention Institute',
      description: 'Crisis prevention and intervention',
      url: 'https://crisisprevention.com'
    }
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
                size="sm"
                onClick={() => setCurrentView('dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold text-gray-900">Crisis Support</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alert */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">
              <strong>If you are in immediate danger or having thoughts of self-harm, please call 911 or go to your nearest emergency room immediately.</strong>
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Crisis Assessment */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">How are you feeling right now?</CardTitle>
              <CardDescription>Your safety is our priority. Let us help you get the right support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant={isEmergency ? "destructive" : "outline"}
                  onClick={() => setIsEmergency(true)}
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                >
                  <AlertTriangle className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">I need immediate help</div>
                    <div className="text-xs opacity-75">Thoughts of self-harm or suicide</div>
                  </div>
                </Button>
                
                <Button
                  variant={!isEmergency ? "default" : "outline"}
                  onClick={() => setIsEmergency(false)}
                  className="h-auto py-4 flex flex-col items-center space-y-2"
                >
                  <Heart className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">I'm struggling but safe</div>
                    <div className="text-xs opacity-75">Looking for coping strategies</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {isEmergency ? (
            /* Emergency Resources */
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-900 flex items-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>{contact.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold text-red-800">{contact.number}</div>
                    <p className="text-red-700 text-sm">{contact.description}</p>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      <Clock className="h-3 w-3 mr-1" />
                      {contact.available}
                    </Badge>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Coping Strategies */
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Immediate Coping Strategies</CardTitle>
                  <CardDescription>Try these techniques to help manage difficult moments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {copingStrategies.map((strategy, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {strategy.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{strategy.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          {strategy.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Support Resources */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>24/7 Support Lines</CardTitle>
                    <CardDescription>Free confidential support available anytime</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Crisis Text Line</div>
                          <div className="text-sm text-gray-600">Text HOME to 741741</div>
                        </div>
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Text
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Suicide Prevention Lifeline</div>
                          <div className="text-sm text-gray-600">Call 988</div>
                        </div>
                        <Button size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                    <CardDescription>Learn more about mental health support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{resource.title}</div>
                          <div className="text-sm text-gray-600">{resource.description}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Safety Plan Reminder */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">Create a Safety Plan</h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Having a safety plan can help you stay safe during difficult times. Work with a mental health professional to create one.
                  </p>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Learn About Safety Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 