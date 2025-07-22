import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { LandingPage } from '@/components/pages/LandingPage'
import { ResumeBuilder } from '@/components/pages/ResumeBuilder'
import { Toaster } from '@/components/ui/toaster'
import { blink } from '@/blink/client'
import type { AppStep } from '@/types'

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('input')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleGetStarted = () => {
    setCurrentStep('input')
  }

  const handleBack = () => {
    setCurrentStep('input')
  }

  const handleNext = () => {
    // This will be expanded as we add more steps
    console.log('Moving to next step...')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {currentStep === 'input' && !user && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {currentStep === 'input' && user && (
        <ResumeBuilder onBack={handleBack} onNext={handleNext} />
      )}
      
      <Toaster />
    </div>
  )
}

export default App