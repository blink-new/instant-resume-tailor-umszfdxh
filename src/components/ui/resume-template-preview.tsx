import React from 'react'

interface ResumeTemplatePreviewProps {
  template: 'modern' | 'executive' | 'creative' | 'minimal' | 'classic'
  className?: string
}

export const ResumeTemplatePreview: React.FC<ResumeTemplatePreviewProps> = ({ 
  template, 
  className = "" 
}) => {
  const baseClasses = "w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden"

  const ModernTemplate = () => (
    <div className={`${baseClasses} ${className}`}>
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-800 rounded w-32 mb-1"></div>
            <div className="h-2 bg-gray-500 rounded w-24"></div>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex space-x-4 text-xs">
          <div className="h-1.5 bg-blue-400 rounded w-16"></div>
          <div className="h-1.5 bg-blue-400 rounded w-20"></div>
        </div>
        
        {/* Skills Section */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded w-16"></div>
          <div className="flex flex-wrap gap-1">
            <div className="h-1.5 bg-blue-100 rounded w-12"></div>
            <div className="h-1.5 bg-blue-100 rounded w-16"></div>
            <div className="h-1.5 bg-blue-100 rounded w-14"></div>
          </div>
        </div>
        
        {/* Experience */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded w-20"></div>
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-600 rounded w-28"></div>
            <div className="h-1 bg-gray-400 rounded w-24"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const ExecutiveTemplate = () => (
    <div className={`${baseClasses} ${className}`}>
      <div className="p-4 space-y-3">
        {/* Header with line */}
        <div className="text-center space-y-2">
          <div className="h-3 bg-gray-800 rounded w-28 mx-auto"></div>
          <div className="h-1.5 bg-gray-500 rounded w-20 mx-auto"></div>
          <div className="h-0.5 bg-gray-300 w-full"></div>
        </div>
        
        {/* Contact centered */}
        <div className="flex justify-center space-x-3 text-xs">
          <div className="h-1.5 bg-gray-500 rounded w-14"></div>
          <div className="h-1.5 bg-gray-500 rounded w-16"></div>
        </div>
        
        {/* Executive Summary */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded w-24 mx-auto"></div>
          <div className="space-y-1">
            <div className="h-1 bg-gray-400 rounded w-full"></div>
            <div className="h-1 bg-gray-400 rounded w-5/6"></div>
            <div className="h-1 bg-gray-400 rounded w-4/5"></div>
          </div>
        </div>
        
        {/* Professional Experience */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded w-32"></div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-1.5 bg-gray-600 rounded w-24"></div>
              <div className="h-1.5 bg-gray-400 rounded w-16"></div>
            </div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const CreativeTemplate = () => (
    <div className={`${baseClasses} ${className}`}>
      <div className="p-4 space-y-3">
        {/* Creative Header */}
        <div className="relative">
          <div className="h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-t-lg -mx-4 -mt-4 mb-3"></div>
          <div className="absolute top-2 left-4">
            <div className="h-2.5 bg-white rounded w-24"></div>
          </div>
        </div>
        
        {/* Profile section */}
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-purple-200 rounded-lg flex-shrink-0"></div>
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-600 rounded w-20"></div>
            <div className="h-1 bg-gray-400 rounded w-16"></div>
          </div>
        </div>
        
        {/* Creative Skills */}
        <div className="space-y-2">
          <div className="h-2 bg-purple-600 rounded w-16"></div>
          <div className="grid grid-cols-2 gap-1">
            <div className="h-1.5 bg-purple-100 rounded"></div>
            <div className="h-1.5 bg-pink-100 rounded"></div>
            <div className="h-1.5 bg-purple-100 rounded"></div>
            <div className="h-1.5 bg-pink-100 rounded"></div>
          </div>
        </div>
        
        {/* Portfolio/Projects */}
        <div className="space-y-2">
          <div className="h-2 bg-purple-600 rounded w-18"></div>
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-600 rounded w-24"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const MinimalTemplate = () => (
    <div className={`${baseClasses} ${className}`}>
      <div className="p-4 space-y-4">
        {/* Minimal Header */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-900 rounded w-32"></div>
          <div className="h-1.5 bg-gray-600 rounded w-24"></div>
          <div className="flex space-x-4">
            <div className="h-1 bg-gray-400 rounded w-16"></div>
            <div className="h-1 bg-gray-400 rounded w-20"></div>
          </div>
        </div>
        
        {/* Clean sections */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-800 rounded w-20"></div>
            <div className="h-1 bg-gray-400 rounded w-full"></div>
            <div className="h-1 bg-gray-400 rounded w-4/5"></div>
          </div>
          
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-800 rounded w-24"></div>
            <div className="h-1 bg-gray-400 rounded w-28"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          </div>
          
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-800 rounded w-16"></div>
            <div className="flex space-x-2">
              <div className="h-1 bg-gray-400 rounded w-12"></div>
              <div className="h-1 bg-gray-400 rounded w-16"></div>
              <div className="h-1 bg-gray-400 rounded w-14"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ClassicTemplate = () => (
    <div className={`${baseClasses} ${className}`}>
      <div className="p-4 space-y-3">
        {/* Classic Header */}
        <div className="text-center space-y-2 border-b border-gray-300 pb-3">
          <div className="h-3.5 bg-gray-800 rounded w-32 mx-auto"></div>
          <div className="h-1.5 bg-gray-600 rounded w-28 mx-auto"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-1 bg-gray-500 rounded w-16"></div>
            <div className="h-1 bg-gray-500 rounded w-20"></div>
          </div>
        </div>
        
        {/* Objective */}
        <div className="space-y-1">
          <div className="h-2 bg-gray-700 rounded w-20"></div>
          <div className="h-1 bg-gray-400 rounded w-full"></div>
          <div className="h-1 bg-gray-400 rounded w-4/5"></div>
        </div>
        
        {/* Experience */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded w-24"></div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-1.5 bg-gray-600 rounded w-28"></div>
              <div className="h-1.5 bg-gray-500 rounded w-16"></div>
            </div>
            <div className="h-1 bg-gray-400 rounded w-24"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
        
        {/* Education */}
        <div className="space-y-1">
          <div className="h-2 bg-gray-700 rounded w-18"></div>
          <div className="h-1.5 bg-gray-600 rounded w-32"></div>
          <div className="h-1 bg-gray-400 rounded w-20"></div>
        </div>
      </div>
    </div>
  )

  const templates = {
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate,
    classic: ClassicTemplate
  }

  const TemplateComponent = templates[template]
  return <TemplateComponent />
}