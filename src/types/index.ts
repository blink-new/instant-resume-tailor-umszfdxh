export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedinUrl: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string[]
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
  skills: string[]
}

export interface JobPosting {
  title: string
  company: string
  description: string
  requirements: string[]
  skills: string[]
}

export interface ResumeTemplate {
  id: string
  name: string
  preview: string
  description: string
}

export type AppStep = 'input' | 'processing' | 'templates' | 'preview' | 'payment' | 'download'