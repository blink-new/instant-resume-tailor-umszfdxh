import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { LandingPage } from '@/components/pages/LandingPage'
import { ResumeBuilder } from '@/components/pages/ResumeBuilder'
import { TemplateGallery } from '@/components/pages/TemplateGallery'
import { ResumePreview } from '@/components/pages/ResumePreview'
import { Toaster } from '@/components/ui/toaster'
import type { AppStep } from '@/types'
import type { LinkedInProfile, JobPosting, TailoringInsights } from '@/services/parsing'

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [resumeData, setResumeData] = useState<{
    profile: LinkedInProfile
    job: JobPosting
    insights: TailoringInsights
  } | null>(null)

  const handleGetStarted = () => {
    setCurrentStep('input')
  }

  const handleBack = () => {
    setCurrentStep('landing')
  }

  const handleNext = (data: { profile: LinkedInProfile; job: JobPosting; insights: TailoringInsights }) => {
    // Store the parsed data and move to template selection step
    setResumeData(data)
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

      {currentStep === 'preview' && resumeData && (
        <ResumePreview 
          onBack={() => setCurrentStep('templates')} 
          onNext={() => setCurrentStep('payment')}
          selectedTemplate={selectedTemplate}
          profile={resumeData.profile}
          job={resumeData.job}
          insights={resumeData.insights}
        />
      )}
      
      <Toaster />
    </div>
  )
}

export default App