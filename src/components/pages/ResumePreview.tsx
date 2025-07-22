import { useState } from 'react'
import { ArrowLeft, ArrowRight, Download, CreditCard, Sparkles, Target, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { LinkedInProfile, JobPosting, TailoringInsights } from '@/services/parsing'

interface ResumePreviewProps {
  onBack: () => void
  onNext: () => void
  selectedTemplate: string
  profile: LinkedInProfile
  job: JobPosting
  insights: TailoringInsights
}



export function ResumePreview({ onBack, onNext, selectedTemplate, profile, job, insights }: ResumePreviewProps) {
  const [showWatermark, setShowWatermark] = useState(true)

  const ResumeContent = () => (
    <div className="bg-white p-6 shadow-lg relative overflow-hidden text-sm leading-tight">
      {/* Watermark Overlay */}
      {showWatermark && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-10">
          <div className="text-6xl font-bold text-gray-300/30 rotate-45 select-none">
            PREVIEW
          </div>
        </div>
      )}

      {/* Resume Header - Compact */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h1>
        <h2 className="text-base text-blue-600 mb-2">{profile.headline}</h2>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
          <span>{profile.name.toLowerCase().replace(' ', '.')}@email.com</span>
          <span>(555) 123-4567</span>
          <span>{profile.location}</span>
          <span>linkedin.com/in/{profile.name.toLowerCase().replace(' ', '')}</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Professional Summary - Compact */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Professional Summary</h3>
        <p className="text-gray-700 text-xs leading-relaxed">{profile.summary}</p>
      </div>

      {/* Skills - Compact */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Core Skills</h3>
        <div className="flex flex-wrap gap-1">
          {profile.skills.slice(0, 12).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Experience - Compact */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Professional Experience</h3>
        {profile.experience.map((exp, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{exp.title}</h4>
                <p className="text-blue-600 text-xs">{exp.company}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{exp.duration}</span>
            </div>
            <div className="text-gray-700 text-xs leading-relaxed">
              <p>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Education - Compact */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Education</h3>
        {profile.education.map((edu, index) => (
          <div key={index} className="flex justify-between mb-1">
            <div>
              <h4 className="font-semibold text-gray-900 text-xs">{edu.degree} in {edu.field}</h4>
              <p className="text-gray-600 text-xs">{edu.school}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{edu.duration}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">Resume Preview</h1>
            <p className="text-muted-foreground">Step 3 of 4</p>
          </div>
          
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={75} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Preview - Left Side */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Tailored Resume</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWatermark(!showWatermark)}
                className="flex items-center gap-2"
              >
                {showWatermark ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showWatermark ? 'Hide Watermark' : 'Show Watermark'}
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <ResumeContent />
            </div>

            {/* Watermark Notice */}
            {showWatermark && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Preview Mode</h4>
                    <p className="text-sm text-amber-700">
                      This is a preview with watermark protection. Complete your purchase to download the high-resolution, watermark-free PDF.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tailoring Insights - Right Side */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Tailoring Insights
                </CardTitle>
                <CardDescription>
                  Here's how we customized your resume for this specific job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Match */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm">Skills Match</h4>
                  </div>
                  <ul className="space-y-2">
                    {insights.skillsMatch.slice(0, 3).map((skill, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{skill.explanation}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="mt-4" />
                </div>

                {/* Experience Alignment */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm">Experience Alignment</h4>
                  </div>
                  <ul className="space-y-2">
                    {insights.experienceAlignment.slice(0, 3).map((exp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{exp.explanation}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="mt-4" />
                </div>

                {/* Keywords Optimization */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm">Keywords Optimization</h4>
                  </div>
                  <ul className="space-y-2">
                    {insights.keywordOptimization.slice(0, 3).map((keyword, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Optimized "{keyword.original}" to "{keyword.optimized}" for better ATS matching</span>
                      </li>
                    ))}
                  </ul>
                  {insights.summaryChanges && (
                    <>
                      <Separator className="mt-4" />
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Summary Enhancement:</span> {insights.summaryChanges.explanation}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Template Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template: {selectedTemplate}</CardTitle>
                <CardDescription>
                  Professional design optimized for your industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>ATS Compatible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Mobile Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Print Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase CTA */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Get Your Resume
                </CardTitle>
                <CardDescription>
                  Download high-quality, watermark-free PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">$9.99</div>
                    <div className="text-sm text-muted-foreground">One-time payment</div>
                  </div>
                  
                  <Button 
                    onClick={onNext}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Purchase & Download
                  </Button>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Stripe
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}