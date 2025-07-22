import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { LandingPage } from '@/components/pages/LandingPage'
import { ResumeBuilder } from '@/components/pages/ResumeBuilder'
import { TemplateGallery } from '@/components/pages/TemplateGallery'
import { ResumePreview } from '@/components/pages/ResumePreview'
import { Toaster } from '@/components/ui/toaster'
import type { AppStep } from '@/types'

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const handleGetStarted = () => {
    setCurrentStep('input')
  }

  const handleBack = () => {
    setCurrentStep('landing')
  }

  const handleNext = () => {
    // Move to template selection step
    setCurrentStep('templates')
  }

  const handleTemplateNext = (template: string) => {
    // Store selected template and move to preview step
    setSelectedTemplate(template)
    setCurrentStep('preview')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {currentStep === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {currentStep === 'input' && (
        <ResumeBuilder onBack={handleBack} onNext={handleNext} />
      )}

      {currentStep === 'templates' && (
        <TemplateGallery 
          onBack={() => setCurrentStep('input')} 
          onNext={handleTemplateNext} 
        />
      )}

      {currentStep === 'preview' && (
        <ResumePreview 
          onBack={() => setCurrentStep('templates')} 
          onNext={() => setCurrentStep('payment')}
          selectedTemplate={selectedTemplate}
        />
      )}
      
      <Toaster />
    </div>
  )
}

export default App