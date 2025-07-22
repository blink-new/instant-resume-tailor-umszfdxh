import { useState } from 'react'
import { ArrowLeft, ArrowRight, Linkedin, Briefcase, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

interface ResumeBuilderProps {
  onBack: () => void
  onNext: () => void
}

export function ResumeBuilder({ onBack, onNext }: ResumeBuilderProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<{ linkedin?: string; job?: string }>({})

  const validateUrls = () => {
    const newErrors: { linkedin?: string; job?: string } = {}
    
    if (!linkedinUrl.trim()) {
      newErrors.linkedin = 'LinkedIn URL is required'
    } else if (!linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL'
    }
    
    if (!jobUrl.trim()) {
      newErrors.job = 'Job posting URL is required'
    } else if (!jobUrl.startsWith('http')) {
      newErrors.job = 'Please enter a valid URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerate = async () => {
    if (!validateUrls()) return
    
    setIsProcessing(true)
    setProgress(0)
    
    // Simulate AI processing with progress updates
    const steps = [
      { message: 'Analyzing LinkedIn profile...', progress: 20 },
      { message: 'Parsing job requirements...', progress: 40 },
      { message: 'Matching skills and experience...', progress: 60 },
      { message: 'Generating tailored content...', progress: 80 },
      { message: 'Finalizing resume...', progress: 100 }
    ]
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProgress(step.progress)
    }
    
    setIsProcessing(false)
    onNext()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">Build Your Resume</h1>
            <p className="text-muted-foreground">Step 1 of 4</p>
          </div>
          
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={25} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                Input Your Details
              </CardTitle>
              <CardDescription>
                Provide your LinkedIn profile and the job you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                  LinkedIn Profile URL
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className={errors.linkedin ? 'border-destructive' : ''}
                />
                {errors.linkedin && (
                  <p className="text-sm text-destructive">{errors.linkedin}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job" className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-primary" />
                  Job Posting URL
                </Label>
                <Input
                  id="job"
                  placeholder="https://company.com/jobs/position"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className={errors.job ? 'border-destructive' : ''}
                />
                {errors.job && (
                  <p className="text-sm text-destructive">{errors.job}</p>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-4">
                  <Progress value={progress} className="h-3" />
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing your information...
                  </div>
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    Generate My Resume
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Find Your LinkedIn URL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">1</div>
                  <p>Go to your LinkedIn profile page</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">2</div>
                  <p>Copy the URL from your browser's address bar</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-xs">3</div>
                  <p>Paste it in the field above</p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy Note:</strong> We only extract publicly available information from your LinkedIn profile. 
                Your data is processed securely and never stored permanently.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>AI analyzes your LinkedIn profile and extracts key information</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>Job posting is parsed for requirements and keywords</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>Your experience is matched and tailored to the job</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>Professional resume content is generated</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}