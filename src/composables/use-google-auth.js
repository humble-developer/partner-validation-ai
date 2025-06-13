import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/use-toast'

export function useGoogleAuth() {
  const router = useRouter()
  const { toast } = useToast()
  const isLoading = ref(false)

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'

  // Debug logging
  console.log('Google Client ID:', GOOGLE_CLIENT_ID)
  console.log('Environment check:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Found' : 'Not found')

  const initializeGoogleSignIn = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not defined'))
        return
      }

      // Check if Google Sign-In script is already loaded
      if (window.google && window.google.accounts) {
        resolve(window.google)
        return
      }

      // Load Google Sign-In script
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        if (window.google && window.google.accounts) {
          resolve(window.google)
        } else {
          reject(new Error('Google Sign-In failed to load'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Sign-In script'))
      }
      
      document.head.appendChild(script)
    })
  }

  const handleGoogleSignIn = async () => {
    try {
      isLoading.value = true

      // Check if Client ID is configured
      if (GOOGLE_CLIENT_ID === 'your-google-client-id' || !GOOGLE_CLIENT_ID) {
        throw new Error('Google Client ID not configured. Please check your .env file.')
      }

      console.log('Initializing Google Sign-In with Client ID:', GOOGLE_CLIENT_ID)

      const google = await initializeGoogleSignIn()

      // Initialize Google Sign-In
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })

      console.log('Google Sign-In initialized successfully')

      // Prompt the user to sign in
      google.accounts.id.prompt((notification) => {
        console.log('Google Sign-In prompt notification:', notification)
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Prompt not displayed, trying popup method')
          // Fallback to popup if prompt is not displayed
          google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: (response) => {
              console.log('OAuth2 response:', response)
              if (response.access_token) {
                // Get user info using the access token
                fetchGoogleUserInfo(response.access_token)
              }
            }
          }).requestAccessToken()
        }
      })

    } catch (error) {
      console.error('Google Sign-In initialization error:', error)
      toast({
        title: "Sign-In Error",
        description: error.message || "Failed to initialize Google Sign-In. Please try again.",
        variant: "destructive"
      })
    } finally {
      isLoading.value = false
    }
  }

  const handleCredentialResponse = (response) => {
    try {
      // Decode the JWT token to get user information
      const userInfo = parseJwt(response.credential)
      
      if (userInfo) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', userInfo.email)
        localStorage.setItem('userName', userInfo.name)
        localStorage.setItem('userPicture', userInfo.picture || '')
        localStorage.setItem('authProvider', 'google')

        toast({
          title: "Login Successful",
          description: `Welcome ${userInfo.name}! You've signed in with Google.`,
        })

        // Redirect to dashboard
        router.push('/')
      } else {
        throw new Error('Failed to parse user information')
      }
    } catch (error) {
      console.error('Google Sign-In error:', error)
      toast({
        title: "Sign-In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      })
    }
  }

  const fetchGoogleUserInfo = async (accessToken) => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
      const userInfo = await response.json()

      if (userInfo.email) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', userInfo.email)
        localStorage.setItem('userName', userInfo.name || userInfo.email)
        localStorage.setItem('userPicture', userInfo.picture || '')
        localStorage.setItem('authProvider', 'google')

        toast({
          title: "Login Successful",
          description: `Welcome ${userInfo.name || userInfo.email}! You've signed in with Google.`,
        })

        // Redirect to dashboard
        router.push('/')
      } else {
        throw new Error('Failed to get user information from Google')
      }
    } catch (error) {
      console.error('Error fetching Google user info:', error)
      toast({
        title: "Sign-In Failed",
        description: "Failed to get user information from Google. Please try again.",
        variant: "destructive"
      })
    }
  }

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error parsing JWT:', error)
      return null
    }
  }

  const signOut = async () => {
    try {
      const google = await initializeGoogleSignIn()
      
      // Sign out from Google
      if (google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect()
      }

      // Clear local storage
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('userPicture')
      localStorage.removeItem('authProvider')

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      })

      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return {
    isLoading,
    handleGoogleSignIn,
    signOut,
    initializeGoogleSignIn
  }
}
