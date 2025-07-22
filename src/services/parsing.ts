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
      
      // Debug: Log the scraped content to understand what we're working with
      console.log('LinkedIn scraped content preview:', markdown.substring(0, 500) + '...')
      
      // Use AI to extract structured data from the scraped content
      const { object: profile } = await blink.ai.generateObject({
        prompt: `
          You are a precise data extraction specialist. Extract ONLY the factual information that is explicitly written in this LinkedIn profile content.
          
          CRITICAL EXTRACTION RULES:
          1. Copy job titles EXACTLY as written - do not paraphrase or interpret
          2. Copy company names EXACTLY as written
          3. Copy dates/durations EXACTLY as written
          4. Copy descriptions EXACTLY as written - do not summarize or rewrite
          5. If a section is missing or unclear, use empty arrays or minimal placeholder text
          6. Do NOT invent or assume any information not explicitly stated
          7. Preserve all factual details with 100% accuracy
          
          LinkedIn Profile Content:
          ${markdown}
          
          Extract these sections with complete accuracy:
          - Name (exactly as shown)
          - Current headline/title (exactly as shown)
          - Location (exactly as shown)
          - About/Summary section (copy the full text if present)
          - Work Experience: For each job, extract:
            * Job title (EXACT wording)
            * Company name (EXACT wording)
            * Employment dates (EXACT format shown)
            * Job description (EXACT text, preserve bullet points and details)
            * Location if mentioned
          - Education: Extract exactly as shown
          - Skills: Only list skills explicitly mentioned in a skills section
          - Other sections only if clearly present
          
          ACCURACY IS CRITICAL: This person's career depends on factual representation.
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
      
      // Debug logging
      console.log('Parsed LinkedIn Profile:', {
        name: processedProfile.name,
        headline: processedProfile.headline,
        experienceCount: processedProfile.experience?.length || 0,
        firstJobTitle: processedProfile.experience?.[0]?.title,
        skillsCount: processedProfile.skills?.length || 0
      })
      
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
      // Step 1: Generate the tailored profile with strict preservation rules
      let { object: tailoredProfile } = await blink.ai.generateObject({
        prompt: `
          You are a professional resume optimizer. Your ONLY job is to enhance descriptions and summaries while preserving ALL factual information.
          
          ABSOLUTE RULES - NEVER VIOLATE THESE:
          1. Keep ALL job titles EXACTLY as they appear in the original profile
          2. Keep ALL company names EXACTLY as they appear in the original profile  
          3. Keep ALL employment dates EXACTLY as they appear in the original profile
          4. Keep ALL education details EXACTLY as they appear in the original profile
          5. ONLY modify job descriptions to highlight relevant aspects using job posting keywords
          6. ONLY modify the professional summary to emphasize relevant strengths
          7. ONLY reorder or emphasize existing skills that match the job requirements
          
          ORIGINAL CANDIDATE PROFILE (PRESERVE ALL FACTS):
          Name: ${profile.name}
          Headline: ${profile.headline}
          Location: ${profile.location}
          Summary: ${profile.summary}
          
          Experience:
          ${profile.experience.map(exp => `
          - Title: ${exp.title} (KEEP EXACTLY AS IS)
          - Company: ${exp.company} (KEEP EXACTLY AS IS)
          - Duration: ${exp.duration} (KEEP EXACTLY AS IS)
          - Description: ${exp.description}
          `).join('')}
          
          Education:
          ${profile.education.map(edu => `
          - Degree: ${edu.degree} (KEEP EXACTLY AS IS)
          - Field: ${edu.field} (KEEP EXACTLY AS IS)
          - School: ${edu.school} (KEEP EXACTLY AS IS)
          - Duration: ${edu.duration} (KEEP EXACTLY AS IS)
          `).join('')}
          
          Skills: ${profile.skills.join(', ')}
          
          TARGET JOB POSTING:
          Title: ${job.title}
          Company: ${job.company}
          Key Requirements: ${job.requirements.required.join(', ')}
          Key Skills: ${job.requirements.skills.join(', ')}
          
          YOUR TASK:
          1. Rewrite the professional summary to highlight how their ACTUAL background fits this role
          2. Rewrite job descriptions to emphasize relevant aspects using keywords from the job posting
          3. Prioritize skills that match the job requirements
          4. DO NOT change any titles, companies, dates, or core facts
          5. Focus on making their REAL experience sound more relevant to the target role
          
          Return the enhanced profile with ALL original facts preserved.
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

      // Simple validation: Ensure we have the same number of experience entries
      const originalProfile = profile
      const processedTailoredProfile = tailoredProfile as LinkedInProfile
      
      // Ensure we maintain the same structure
      if (processedTailoredProfile.experience.length !== originalProfile.experience.length) {
        console.warn('Experience count mismatch, using original structure with tailored descriptions')
        processedTailoredProfile.experience = originalProfile.experience.map((exp, index) => ({
          ...exp, // Keep all original data
          description: processedTailoredProfile.experience[index]?.description || exp.description // Only update description if available
        }))
      }
      
      // Ensure job titles and companies are preserved (they should be from the prompt, but double-check)
      processedTailoredProfile.experience = processedTailoredProfile.experience.map((exp, index) => ({
        ...exp,
        title: originalProfile.experience[index]?.title || exp.title, // Preserve original title
        company: originalProfile.experience[index]?.company || exp.company, // Preserve original company
        duration: originalProfile.experience[index]?.duration || exp.duration // Preserve original duration
      }))
      
      tailoredProfile = processedTailoredProfile

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