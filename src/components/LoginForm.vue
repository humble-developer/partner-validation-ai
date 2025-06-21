<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <!-- Hero Section -->
    <div class="relative">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          
          <!-- Left Content -->
          <div class="space-y-8">
            <!-- Brand Header -->
            <div class="space-y-6">
              <div class="flex items-center space-x-4 group">
                <div class="relative">
                  <div class="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl">
                    <Shield class="w-7 h-7 text-white" />
                  </div>
                  <div class="absolute -inset-1 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  PartnerAI
                </h1>
              </div>

              <div class="space-y-6">
                <h2 class="text-5xl lg:text-6xl font-bold leading-tight">
                  <span class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Intelligent Partner</span>
                  <span class="block bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">Validation Platform</span>
                </h2>
                <p class="text-xl text-gray-600 leading-relaxed max-w-lg font-medium">
                  Transform your partner onboarding with AI-powered validation, automated workflows, and intelligent decision-making.
                </p>
              </div>
            </div>

            <!-- Quick Benefits -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="group relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div class="relative flex items-center space-x-3 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/90 transition-all duration-300">
                  <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Target class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-gray-800 font-semibold">95% Validation Accuracy</span>
                </div>
              </div>
              <div class="group relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div class="relative flex items-center space-x-3 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/90 transition-all duration-300">
                  <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Zap class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-gray-800 font-semibold">80% Faster Processing</span>
                </div>
              </div>
              <div class="group relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div class="relative flex items-center space-x-3 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/90 transition-all duration-300">
                  <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Users class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-gray-800 font-semibold">Human-AI Collaboration</span>
                </div>
              </div>
              <div class="group relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div class="relative flex items-center space-x-3 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/90 transition-all duration-300">
                  <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-gray-800 font-semibold">Enterprise Security</span>
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2 text-blue-600 group cursor-pointer" @click="openPresentation">
                <span class="font-medium">View our hackathon presentation</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <div class="flex items-center space-x-2 text-purple-600 group cursor-pointer">
                <span class="font-medium">Learn more about our platform</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <!-- Right side - Login Form -->
          <div class="flex justify-center lg:justify-end">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <Card class="relative w-full max-w-2xl p-12 bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl">
                <div class="space-y-8">
                  <div class="text-center space-y-3">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <Shield class="w-8 h-8 text-white" />
                    </div>
                    <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Welcome Back</h3>
                    <p class="text-gray-600 font-medium">Sign in to your PartnerAI account</p>
                  </div>

                  <form @submit="handleSubmit" class="space-y-6">
                    <div class="space-y-2">
                      <label class="text-sm font-semibold text-gray-700">Email Address</label>
                      <div class="relative">
                        <Input
                          type="email"
                          v-model="email"
                          placeholder="Enter your email"
                          class="h-14 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 backdrop-blur-sm rounded-xl text-base font-medium placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-semibold text-gray-700">Password</label>
                      <div class="relative">
                        <Input
                          type="password"
                          v-model="password"
                          placeholder="Enter your password"
                          class="h-14 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/70 backdrop-blur-sm rounded-xl text-base font-medium placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      class="w-full h-14 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-[1.02]"
                    >
                      Sign In
                    </Button>
                  </form>

                  <!-- Divider -->
                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                      <span class="px-4 bg-white/90 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>

                  <!-- Google Sign-In Button -->
                  <div class="space-y-4">
                    <Button
                      type="button"
                      @click="handleGoogleSignIn"
                      :disabled="isGoogleLoading"
                      class="w-full h-14 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-white font-semibold text-base border-2 border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                    >
                      <svg v-if="!isGoogleLoading" class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <div v-if="isGoogleLoading" class="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      <span>{{ isGoogleLoading ? 'Signing in...' : 'Sign in with Google' }}</span>
                    </Button>
                    <!-- Hidden div for Google Sign-In button rendering -->
                    <div id="google-signin-button" class="hidden"></div>
                  </div>

                  <div class="text-center">
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Cards Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center space-y-4 mb-12">
          <h3 class="text-3xl font-bold text-gray-900">Powerful Features</h3>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how PartnerAI revolutionizes partner onboarding with cutting-edge technology and intelligent automation.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="group relative"
          >
            <!-- Keep card background blur for all cards -->
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <Card class="relative p-8 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl hover:bg-white transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl"
          >
            <div class="space-y-6">
              <div class="relative">
                <div :class="`w-14 h-14 rounded-xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-all duration-500 shadow-lg`">
                  <component :is="feature.icon" class="w-7 h-7" />
                </div>
                <!-- Remove icon blur layer for all cards for consistency -->
                <!-- <div :class="`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-500 ${feature.color.replace('bg-', 'bg-gradient-to-br from-').replace('text-', 'to-')}`"></div> -->
              </div>

              <div class="space-y-3">
                <h4 class="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">{{ feature.title }}</h4>
                <p class="text-gray-600 text-sm leading-relaxed font-medium">{{ feature.description }}</p>
              </div>
            </div>
          </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom CTA Section -->
    <div class="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-20 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div class="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-6 text-center">
        <div class="space-y-8">
          <h4 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your
            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Partner Onboarding?</span>
          </h4>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Join thousands of businesses that trust PartnerAI to streamline their partner validation process with intelligent automation.
          </p>
          <div class="flex justify-center items-center mt-10">
            <Button variant="outline" class="border-2 border-slate-400 text-slate-300 hover:bg-white/10 hover:border-slate-300 px-10 py-4 text-lg font-semibold backdrop-blur-sm rounded-xl transition-all duration-300">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Card from '@/components/ui/card.vue'
import { Shield, CheckCircle, Brain, Zap, Users, Globe, ArrowRight, Target, Clock, MapPin, Monitor } from 'lucide-vue-next'
import { useToast } from '@/composables/use-toast'
import { useGoogleAuth } from '@/composables/use-google-auth'

export default {
  name: 'LoginForm',
  components: {
    Button,
    Input,
    Card,
    Shield,
    CheckCircle,
    Brain,
    Zap,
    Users,
    Globe,
    ArrowRight,
    Target,
    Clock,
    MapPin,
    Monitor
  },
  setup() {
    const router = useRouter()
    const { toast } = useToast()
    const { isLoading: isGoogleLoading, handleGoogleSignIn } = useGoogleAuth()
    const email = ref('')
    const password = ref('')

    const handleSubmit = (e) => {
      e.preventDefault()

      // Simple validation - in real app, you'd validate against a backend
      if (email.value && password.value) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email.value)
        localStorage.setItem('authProvider', 'email')

        toast({
          title: "Login Successful",
          description: "Welcome to PartnerAI Dashboard!",
        })

        // Redirect to dashboard
        router.push('/')
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive"
        })
      }
    }

    const openPresentation = () => {
      // Open presentation in a new window
      window.open('/presentation.html', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
    }

    const features = [
      {
        icon: Brain,
        title: "AI-Powered Validation",
        description: "Advanced machine learning algorithms automatically verify partner credentials and business information with 95% accuracy.",
        color: "bg-blue-50 text-blue-600"
      },
      {
        icon: Zap,
        title: "Lightning Fast Processing",
        description: "Complete partner onboarding in minutes, not days. Our streamlined workflow reduces processing time by 80%.",
        color: "bg-green-50 text-green-600"
      },
      {
        icon: Users,
        title: "Human-AI Collaboration",
        description: "Seamless integration between AI automation and human oversight for complex validation scenarios.",
        color: "bg-purple-50 text-purple-600"
      },
      {
        icon: Globe,
        title: "Global Compliance",
        description: "Built-in compliance checks for international regulations and local business requirements across 50+ countries.",
        color: "bg-orange-50 text-orange-600"
      }
    ]

    return {
      email,
      password,
      handleSubmit,
      handleGoogleSignIn,
      isGoogleLoading,
      openPresentation,
      features
    }
  }
}
</script>
