import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Vote, Shield, UserPlus, Scan, Lock, BarChart3, CheckCircle, Sparkles, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Scan,
      title: 'Facial Recognition',
      description: 'Secure biometric authentication ensures only verified students can vote',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Lock,
      title: 'Blockchain Verification',
      description: 'Every vote is recorded with a transaction hash for transparency',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Real-time Results',
      description: 'View live election results and analytics as votes are cast',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'One Vote Per Student',
      description: 'Advanced verification prevents duplicate voting',
      color: 'from-pink-500 to-pink-600'
    },
  ];

  const stats = [
    { label: 'Active Students', value: '2,547', icon: Users, color: 'text-teal-600' },
    { label: 'Elections Held', value: '48', icon: Vote, color: 'text-orange-600' },
    { label: 'Votes Cast', value: '15,234', icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Mesh Gradient */}
      <div className="relative overflow-hidden gradient-mesh">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-orange-500/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-lg mb-4">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-semibold text-gray-700">Secure • Transparent • Modern</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Shape Your Future
              <br />
              <span className="text-gradient">Cast Your Vote</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of student council elections with 
              <span className="font-semibold text-teal-600"> facial recognition </span> 
              and 
              <span className="font-semibold text-orange-600"> blockchain technology</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-10 py-7 gradient-primary shadow-primary hover:shadow-glow text-white border-0 hover-lift"
                onClick={() => navigate('/voter-login')}
              >
                <Vote className="mr-2 h-6 w-6" />
                Vote Now
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-10 py-7 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 hover-lift"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="mr-2 h-6 w-6" />
                Register to Vote
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-lg px-10 py-7 hover:bg-orange-50 text-orange-600 hover-lift"
                onClick={() => navigate('/results')}
              >
                <BarChart3 className="mr-2 h-6 w-6" />
                View Results
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {stats.map((stat) => (
              <Card key={stat.label} className="glass-card border-0 shadow-xl hover-lift">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-10 w-10 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge technology meets user-friendly design to ensure every vote counts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="border-2 hover:shadow-2xl transition-all duration-300 hover-lift group overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              <CardHeader>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-teal-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-teal-50 via-orange-50/30 to-purple-50/30 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure voting in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4 group">
              <div className="relative inline-block">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-primary group-hover:shadow-glow transition-all group-hover:scale-110">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
                <div className="absolute -right-8 top-1/2 hidden md:block">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-teal-500 to-transparent"></div>
                </div>
              </div>
              <h3 className="font-bold text-2xl mt-6">Register</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your voter account with facial recognition enrollment and secure verification
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="relative inline-block">
                <div className="w-24 h-24 gradient-secondary rounded-3xl flex items-center justify-center mx-auto shadow-secondary group-hover:shadow-glow-secondary transition-all group-hover:scale-110">
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
                <div className="absolute -right-8 top-1/2 hidden md:block">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></div>
                </div>
              </div>
              <h3 className="font-bold text-2xl mt-6">Verify & Vote</h3>
              <p className="text-gray-600 leading-relaxed">
                Login with face scan authentication and cast your vote securely for your candidates
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-2xl mt-6">Track Results</h3>
              <p className="text-gray-600 leading-relaxed">
                View real-time results with blockchain verification and transparent vote counting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-secondary rounded-3xl shadow-secondary">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Powerful Admin Dashboard
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Comprehensive tools to manage elections, monitor votes in real-time, 
              and analyze results with detailed insights.
            </p>
            <ul className="space-y-4">
              {[
                'Create and manage multiple elections',
                'Add candidates with rich profiles',
                'Monitor real-time voting activity',
                'Generate detailed analytics reports',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 gradient-success rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg hover-lift"
              onClick={() => navigate('/admin-login')}
            >
              <Shield className="mr-2 h-6 w-6" />
              Admin Login
            </Button>
          </div>

          <Card className="border-gradient-primary shadow-2xl hover-lift overflow-hidden">
            <div className="gradient-mesh p-8">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <BarChart3 className="h-32 w-32 text-teal-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                  Election Management Hub
                </h3>
                <p className="text-center text-gray-600">
                  Complete control over every aspect of your student elections
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { label: 'Elections', value: '12+' },
                    { label: 'Candidates', value: '50+' },
                    { label: 'Reports', value: '100+' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-gradient-primary">{stat.value}</p>
                      <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <Card className="gradient-primary border-0 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent"></div>
          </div>
          <CardContent className="py-16 md:py-20 text-center space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students participating in secure, transparent, 
              and modern democratic elections
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto px-10 py-7 text-lg gradient-secondary text-white border-0 shadow-secondary hover:shadow-glow-secondary hover-lift"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="mr-2 h-6 w-6" />
                Register Now
              </Button>
              <Button
                size="lg"
                className="w-full sm:w-auto px-10 py-7 text-lg bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 backdrop-blur-sm hover-lift"
                onClick={() => navigate('/voter-login')}
              >
                <Vote className="mr-2 h-6 w-6" />
                Login to Vote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
