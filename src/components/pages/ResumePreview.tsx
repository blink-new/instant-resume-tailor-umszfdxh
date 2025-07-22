import { useState } from 'react'
import { ArrowLeft, ArrowRight, Download, CreditCard, Sparkles, Target, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ResumePreviewProps {
  onBack: () => void
  onNext: () => void
  selectedTemplate: string
}

// Mock data for demonstration
const mockTailoringInsights = [
  {
    category: "Skills Match",
    icon: <Target className="w-4 h-4" />,
    insights: [
      "Added 'React.js' and 'TypeScript' to match job requirements",
      "Emphasized 'Agile methodology' experience from previous roles",
      "Highlighted 'API development' skills from backend projects"
    ]
  },
  {
    category: "Experience Alignment", 
    icon: <CheckCircle className="w-4 h-4" />,
    insights: [
      "Repositioned 'Team Leadership' experience to match management requirements",
      "Quantified project impact: '25% performance improvement' aligns with efficiency goals",
      "Emphasized 'Cross-functional collaboration' from LinkedIn experience"
    ]
  },
  {
    category: "Keywords Optimization",
    icon: <Sparkles className="w-4 h-4" />,
    insights: [
      "Integrated 'Full-stack development' terminology from job posting",
      "Added 'Scalable solutions' language to match company values",
      "Included 'User experience' focus mentioned in role description"
    ]
  }
]

const mockResumeData = {
  name: "Michael Pevzner",
  title: "Senior Full-Stack Developer",
  email: "michael.pevzner@email.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/michaelpevzner",
  summary: "Experienced full-stack developer with 8+ years building scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering 25% performance improvements through innovative solutions.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      period: "2021 - Present",
      achievements: [
        "Led development of React-based dashboard serving 10K+ users",
        "Implemented TypeScript migration improving code quality by 40%",
        "Collaborated with design team on user experience improvements"
      ]
    },
    {
      title: "Full-Stack Developer", 
      company: "StartupXYZ",
      period: "2019 - 2021",
      achievements: [
        "Built scalable API architecture handling 1M+ requests/day",
        "Mentored junior developers in Agile methodology practices",
        "Delivered cross-functional projects 20% ahead of schedule"
      ]
    }
  ],
  skills: ["React.js", "TypeScript", "Node.js", "API Development", "Agile Methodology", "Team Leadership", "Full-stack Development"],
  education: {
    degree: "B.S. Computer Science",
    school: "University of California, Berkeley",
    year: "2018"
  }
}

export function ResumePreview({ onBack, onNext, selectedTemplate }: ResumePreviewProps) {
  const [showWatermark, setShowWatermark] = useState(true)

  const ResumeContent = () => (
    <div className="bg-white p-8 shadow-lg relative overflow-hidden">
      {/* Watermark Overlay */}
      {showWatermark && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none z-10">
          <div className="text-6xl font-bold text-gray-300/30 rotate-45 select-none">
            PREVIEW
          </div>
        </div>
      )}

      {/* Resume Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockResumeData.name}</h1>
        <h2 className="text-xl text-blue-600 mb-3">{mockResumeData.title}</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span>{mockResumeData.email}</span>
          <span>{mockResumeData.phone}</span>
          <span>{mockResumeData.location}</span>
          <span>{mockResumeData.linkedin}</span>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Professional Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
        <p className="text-gray-700 leading-relaxed">{mockResumeData.summary}</p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {mockResumeData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Experience</h3>
        {mockResumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                <p className="text-blue-600">{exp.company}</p>
              </div>
              <span className="text-sm text-gray-500">{exp.period}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              {exp.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
        <div className="flex justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{mockResumeData.education.degree}</h4>
            <p className="text-gray-600">{mockResumeData.education.school}</p>
          </div>
          <span className="text-sm text-gray-500">{mockResumeData.education.year}</span>
        </div>
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
                {mockTailoringInsights.map((section, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-primary">{section.icon}</div>
                      <h4 className="font-semibold text-sm">{section.category}</h4>
                    </div>
                    <ul className="space-y-2">
                      {section.insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                    {index < mockTailoringInsights.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
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