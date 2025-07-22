import { blink } from '@/blink/client'

export interface LinkedInProfile {
  name: string
  headline: string
  location: string
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    location?: string
    description: string
    skills: string[]
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    duration: string
    gpa?: string
    honors?: string[]
  }>
  skills: string[]
  certifications: Array<{
    name: string
    issuer: string
    date: string
    credentialId?: string
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
  }>
  volunteering: Array<{
    organization: string
    role: string
    duration: string
    description: string
  }>
  awards: Array<{
    name: string
    issuer: string
    date: string
    description?: string
  }>
}

export interface JobPosting {
  title: string
  company: string
  location: string
  employmentType: string
  experienceLevel: string
  description: string
  requirements: {
    required: string[]
    preferred: string[]
    education: string[]
    experience: string[]
    skills: string[]
    certifications: string[]
  }
  responsibilities: string[]
  benefits: string[]
  salary?: {
    min?: number
    max?: number
    currency: string
    period: string
  }
  keywords: string[]
  industryTerms: string[]
}

export interface TailoringInsights {
  skillsMatch: Array<{
    skill: string
    fromProfile: boolean
    addedForJob: boolean
    relevanceScore: number
    explanation: string
  }>
  experienceAlignment: Array<{
    originalTitle: string
    tailoredTitle: string
    originalDescription: string
    tailoredDescription: string
    keywordsAdded: string[]
    explanation: string
  }>
  keywordOptimization: Array<{
    original: string
    optimized: string
    jobKeyword: string
    context: string
  }>
  summaryChanges: {
    original: string
    tailored: string
    keywordsIntegrated: string[]
    explanation: string
  }
  educationEnhancements: Array<{
    field: string
    enhancement: string
    relevanceToJob: string
  }>
  newSections: Array<{
    section: string
    content: string
    reason: string
  }>
}

export class ParsingService {
  /**
   * Parse LinkedIn profile from URL using advanced web scraping and AI analysis
   */
  async parseLinkedInProfile(url: string): Promise<LinkedInProfile> {
    try {
      // First, scrape the LinkedIn profile page
      const { markdown, metadata } = await blink.data.scrape(url)
      
      if (!markdown || markdown.trim().length < 100) {
        throw new Error('Unable to extract sufficient content from LinkedIn profile. Please ensure the profile is public and accessible.')
      }
      
      // Use AI to extract structured data from the scraped content
      const { object: profile } = await blink.ai.generateObject({
        prompt: `
          Analyze this LinkedIn profile content and extract comprehensive professional information.
          Focus on extracting detailed work experience, skills, education, and achievements.
          
          LinkedIn Content:
          ${markdown}
          
          Extract all available information including:
          - Personal details (name, headline, location, summary)
          - Work experience with detailed descriptions and quantified achievements
          - Education with degrees, schools, and academic achievements
          - Skills (both listed and mentioned in descriptions)
          - Certifications and licenses
          - Projects and portfolio items
          - Volunteer work and community involvement
          - Awards and recognitions
          - Languages spoken
          
          Be thorough and extract as much relevant professional information as possible.
        `,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            headline: { type: 'string' },
            location: { type: 'string' },
            summary: { type: 'string' },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  duration: { type: 'string' },
                  location: { type: 'string' },
                  description: { type: 'string' },
                  skills: { type: 'array', items: { type: 'string' } }
                },
                required: ['title', 'company', 'duration', 'description']
              }
            },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  school: { type: 'string' },
                  degree: { type: 'string' },
                  field: { type: 'string' },
                  duration: { type: 'string' },
                  gpa: { type: 'string' },
                  honors: { type: 'array', items: { type: 'string' } }
                },
                required: ['school', 'degree', 'field', 'duration']
              }
            },
            skills: { type: 'array', items: { type: 'string' } },
            certifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  issuer: { type: 'string' },
                  date: { type: 'string' },
                  credentialId: { type: 'string' }
                },
                required: ['name', 'issuer', 'date']
              }
            },
            languages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  proficiency: { type: 'string' }
                },
                required: ['name', 'proficiency']
              }
            },
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  technologies: { type: 'array', items: { type: 'string' } },
                  url: { type: 'string' }
                },
                required: ['name', 'description']
              }
            },
            volunteering: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization: { type: 'string' },
                  role: { type: 'string' },
                  duration: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['organization', 'role', 'duration', 'description']
              }
            },
            awards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  issuer: { type: 'string' },
                  date: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['name', 'issuer', 'date']
              }
            }
          },
          required: ['name', 'headline', 'location', 'summary', 'experience', 'education', 'skills']
        }
      })

      // Ensure required arrays are not empty
      const processedProfile = profile as LinkedInProfile
      if (!processedProfile.experience || processedProfile.experience.length === 0) {
        processedProfile.experience = [{
          title: 'Professional Experience',
          company: 'Various Companies',
          duration: 'Multiple Years',
          location: processedProfile.location || 'Various Locations',
          description: 'Professional experience in relevant field',
          skills: processedProfile.skills?.slice(0, 5) || ['Professional Skills']
        }]
      }
      if (!processedProfile.education || processedProfile.education.length === 0) {
        processedProfile.education = [{
          school: 'Educational Institution',
          degree: 'Degree',
          field: 'Relevant Field',
          duration: 'Completed',
          gpa: '',
          honors: []
        }]
      }
      if (!processedProfile.skills || processedProfile.skills.length === 0) {
        processedProfile.skills = ['Professional Skills', 'Communication', 'Problem Solving']
      }

      return processedProfile
    } catch (error) {
      console.error('Error parsing LinkedIn profile:', error)
      throw new Error('Failed to parse LinkedIn profile. Please ensure the URL is accessible and try again.')
    }
  }

  /**
   * Parse job posting from URL using advanced analysis
   */
  async parseJobPosting(url: string): Promise<JobPosting> {
    try {
      // Scrape the job posting page
      const { markdown, metadata } = await blink.data.scrape(url)
      
      if (!markdown || markdown.trim().length < 50) {
        throw new Error('Unable to extract sufficient content from job posting. Please ensure the URL is accessible.')
      }
      
      // Use AI to extract structured job information
      const { object: jobData } = await blink.ai.generateObject({
        prompt: `
          Analyze this job posting and extract comprehensive job requirements and details.
          Focus on identifying specific skills, qualifications, and requirements.
          
          Job Posting Content:
          ${markdown}
          
          Extract all available information including:
          - Job title, company, location, employment type
          - Detailed job description and responsibilities
          - Required vs preferred qualifications
          - Technical skills and soft skills needed
          - Education requirements
          - Experience level and years required
          - Certifications or licenses needed
          - Salary information if available
          - Company benefits and perks
          - Industry-specific keywords and terminology
          
          Categorize requirements as "required" vs "preferred" based on language used.
          Extract all relevant keywords that would be important for ATS systems.
        `,
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            company: { type: 'string' },
            location: { type: 'string' },
            employmentType: { type: 'string' },
            experienceLevel: { type: 'string' },
            description: { type: 'string' },
            requirements: {
              type: 'object',
              properties: {
                required: { type: 'array', items: { type: 'string' } },
                preferred: { type: 'array', items: { type: 'string' } },
                education: { type: 'array', items: { type: 'string' } },
                experience: { type: 'array', items: { type: 'string' } },
                skills: { type: 'array', items: { type: 'string' } },
                certifications: { type: 'array', items: { type: 'string' } }
              },
              required: ['required', 'skills']
            },
            responsibilities: { type: 'array', items: { type: 'string' } },
            benefits: { type: 'array', items: { type: 'string' } },
            salary: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
                currency: { type: 'string' },
                period: { type: 'string' }
              }
            },
            keywords: { type: 'array', items: { type: 'string' } },
            industryTerms: { type: 'array', items: { type: 'string' } }
          },
          required: ['title', 'company', 'location', 'description', 'requirements', 'responsibilities', 'keywords']
        }
      })

      // Ensure required arrays are not empty
      const processedJob = jobData as JobPosting
      if (!processedJob.requirements.required || processedJob.requirements.required.length === 0) {
        processedJob.requirements.required = ['Relevant experience', 'Strong communication skills']
      }
      if (!processedJob.requirements.skills || processedJob.requirements.skills.length === 0) {
        processedJob.requirements.skills = ['Professional skills', 'Problem solving', 'Team collaboration']
      }
      if (!processedJob.responsibilities || processedJob.responsibilities.length === 0) {
        processedJob.responsibilities = ['Execute key responsibilities', 'Collaborate with team members', 'Deliver quality results']
      }
      if (!processedJob.keywords || processedJob.keywords.length === 0) {
        processedJob.keywords = [processedJob.title, processedJob.company, 'professional', 'experience']
      }

      return processedJob
    } catch (error) {
      console.error('Error parsing job posting:', error)
      throw new Error('Failed to parse job posting. Please ensure the URL is accessible and try again.')
    }
  }

  /**
   * Generate tailored resume content and insights
   */
  async generateTailoredResume(
    profile: LinkedInProfile, 
    job: JobPosting
  ): Promise<{ tailoredProfile: LinkedInProfile; insights: TailoringInsights }> {
    try {
      // Step 1: Generate the tailored profile first
      const { object: tailoredProfile } = await blink.ai.generateObject({
        prompt: `
          You are an expert resume writer. Analyze the LinkedIn profile and job posting to create a perfectly tailored resume.
          
          LinkedIn Profile:
          ${JSON.stringify(profile, null, 2)}
          
          Job Posting:
          ${JSON.stringify(job, null, 2)}
          
          Your task:
          1. Tailor the profile to match the job requirements while staying truthful
          2. Optimize keywords for ATS systems
          3. Rewrite job descriptions to highlight relevant achievements
          4. Adjust the professional summary to align with the role
          5. Prioritize and enhance relevant skills
          
          Focus on:
          - Matching job keywords naturally in descriptions
          - Quantifying achievements where possible
          - Highlighting transferable skills
          - Using industry-specific terminology from the job posting
          - Ensuring ATS compatibility
          - Maintaining authenticity while optimizing for the role
          
          Return the complete tailored profile with all sections optimized for this specific job.
        `,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            headline: { type: 'string' },
            location: { type: 'string' },
            summary: { type: 'string' },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company: { type: 'string' },
                  duration: { type: 'string' },
                  location: { type: 'string' },
                  description: { type: 'string' },
                  skills: { type: 'array', items: { type: 'string' } }
                },
                required: ['title', 'company', 'duration', 'description']
              }
            },
            education: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  school: { type: 'string' },
                  degree: { type: 'string' },
                  field: { type: 'string' },
                  duration: { type: 'string' },
                  gpa: { type: 'string' },
                  honors: { type: 'array', items: { type: 'string' } }
                },
                required: ['school', 'degree', 'field', 'duration']
              }
            },
            skills: { type: 'array', items: { type: 'string' } },
            certifications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  issuer: { type: 'string' },
                  date: { type: 'string' },
                  credentialId: { type: 'string' }
                },
                required: ['name', 'issuer', 'date']
              }
            },
            languages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  proficiency: { type: 'string' }
                },
                required: ['name', 'proficiency']
              }
            },
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  technologies: { type: 'array', items: { type: 'string' } },
                  url: { type: 'string' }
                },
                required: ['name', 'description']
              }
            },
            volunteering: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  organization: { type: 'string' },
                  role: { type: 'string' },
                  duration: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['organization', 'role', 'duration', 'description']
              }
            },
            awards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  issuer: { type: 'string' },
                  date: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['name', 'issuer', 'date']
              }
            }
          },
          required: ['name', 'headline', 'location', 'summary', 'experience', 'education', 'skills']
        }
      })

      // Step 2: Generate insights separately (simplified)
      const { object: insights } = await blink.ai.generateObject({
        prompt: `
          Analyze the changes made to tailor the resume for the job. Compare the original profile with the tailored version.
          
          Original Profile Summary: ${profile.summary}
          Tailored Profile Summary: ${tailoredProfile.summary}
          
          Job Requirements: ${JSON.stringify(job.requirements, null, 2)}
          
          Provide insights on what was changed and why, focusing on the most important modifications.
        `,
        schema: {
          type: 'object',
          properties: {
            summaryChanges: {
              type: 'object',
              properties: {
                original: { type: 'string' },
                tailored: { type: 'string' },
                keywordsIntegrated: { type: 'array', items: { type: 'string' } },
                explanation: { type: 'string' }
              },
              required: ['original', 'tailored', 'explanation']
            },
            skillsMatch: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  skill: { type: 'string' },
                  fromProfile: { type: 'boolean' },
                  addedForJob: { type: 'boolean' },
                  relevanceScore: { type: 'number' },
                  explanation: { type: 'string' }
                },
                required: ['skill', 'fromProfile', 'addedForJob', 'relevanceScore', 'explanation']
              }
            },
            keywordOptimization: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  original: { type: 'string' },
                  optimized: { type: 'string' },
                  jobKeyword: { type: 'string' },
                  context: { type: 'string' }
                },
                required: ['original', 'optimized', 'jobKeyword', 'context']
              }
            },
            experienceAlignment: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  originalTitle: { type: 'string' },
                  tailoredTitle: { type: 'string' },
                  originalDescription: { type: 'string' },
                  tailoredDescription: { type: 'string' },
                  keywordsAdded: { type: 'array', items: { type: 'string' } },
                  explanation: { type: 'string' }
                },
                required: ['originalTitle', 'tailoredTitle', 'explanation']
              }
            },
            educationEnhancements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  enhancement: { type: 'string' },
                  relevanceToJob: { type: 'string' }
                },
                required: ['field', 'enhancement', 'relevanceToJob']
              }
            },
            newSections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  section: { type: 'string' },
                  content: { type: 'string' },
                  reason: { type: 'string' }
                },
                required: ['section', 'content', 'reason']
              }
            }
          },
          required: ['summaryChanges', 'skillsMatch']
        }
      })

      // Ensure insights have required data
      const processedInsights = insights as TailoringInsights
      if (!processedInsights.skillsMatch || processedInsights.skillsMatch.length === 0) {
        processedInsights.skillsMatch = [{
          skill: 'Professional Skills',
          fromProfile: true,
          addedForJob: false,
          relevanceScore: 0.8,
          explanation: 'Core professional skills relevant to the position'
        }]
      }
      if (!processedInsights.summaryChanges) {
        processedInsights.summaryChanges = {
          original: profile.summary,
          tailored: tailoredProfile.summary,
          keywordsIntegrated: [],
          explanation: 'Summary optimized for job requirements'
        }
      }

      return {
        tailoredProfile: tailoredProfile as LinkedInProfile,
        insights: processedInsights
      }
    } catch (error) {
      console.error('Error generating tailored resume:', error)
      throw new Error('Failed to generate tailored resume. Please try again.')
    }
  }

  /**
   * Validate URL format
   */
  validateLinkedInUrl(url: string): boolean {
    const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    return linkedinPattern.test(url)
  }

  /**
   * Validate job posting URL (supports multiple job sites)
   */
  validateJobUrl(url: string): boolean {
    const jobSitePatterns = [
      /^https?:\/\/(www\.)?linkedin\.com\/jobs\/view\/\d+/,
      /^https?:\/\/(www\.)?indeed\.com\/viewjob/,
      /^https?:\/\/(www\.)?glassdoor\.com\/job-listing/,
      /^https?:\/\/(www\.)?monster\.com\/job-openings/,
      /^https?:\/\/(www\.)?ziprecruiter\.com\/jobs/,
      /^https?:\/\/jobs\.lever\.co/,
      /^https?:\/\/boards\.greenhouse\.io/,
      /^https?:\/\/.*\.workday\.com/,
      /^https?:\/\/careers\./,
      /^https?:\/\/jobs\./
    ]
    
    return jobSitePatterns.some(pattern => pattern.test(url)) || url.includes('job') || url.includes('career')
  }
}

export const parsingService = new ParsingService()