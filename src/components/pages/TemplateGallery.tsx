import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ResumeTemplatePreview } from '@/components/ui/resume-template-preview'

interface TemplateGalleryProps {
  onBack: () => void
  onNext: (selectedTemplate: string) => void
}

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design perfect for tech and creative roles',
    preview: '/api/placeholder/300/400',
    features: ['ATS-Friendly', 'Clean Layout', 'Modern Typography'],
    color: 'blue'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout ideal for senior management positions',
    preview: '/api/placeholder/300/400',
    features: ['Professional', 'Leadership Focus', 'Premium Design'],
    color: 'slate'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching design for designers, marketers, and creative professionals',
    preview: '/api/placeholder/300/400',
    features: ['Visual Impact', 'Creative Layout', 'Portfolio Ready'],
    color: 'purple'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, elegant design that focuses on content over decoration',
    preview: '/api/placeholder/300/400',
    features: ['Minimalist', 'Content Focus', 'Versatile'],
    color: 'green'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format preferred by conservative industries',
    preview: '/api/placeholder/300/400',
    features: ['Traditional', 'Conservative', 'Time-tested'],
    color: 'amber'
  }
]

export function TemplateGallery({ onBack, onNext }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      onNext(selectedTemplate)
    }
  }

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
            <h1 className="text-2xl font-bold">Choose Your Template</h1>
            <p className="text-muted-foreground">Step 2 of 4</p>
          </div>
          
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={50} className="h-2" />
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="relative">
                  {/* Template Preview */}
                  <div className="aspect-[3/4] mb-3">
                    <ResumeTemplatePreview 
                      template={template.id as 'modern' | 'executive' | 'creative' | 'minimal' | 'classic'} 
                      className="h-full"
                    />
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedTemplate}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8"
          >
            Continue with {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Selected Template'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Template Info */}
        {selectedTemplate && (
          <div className="mt-8 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-2" />
                  {templates.find(t => t.id === selectedTemplate)?.name} Template Selected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {templates.find(t => t.id === selectedTemplate)?.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>ATS Compatible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Mobile Optimized</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span>Print Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}