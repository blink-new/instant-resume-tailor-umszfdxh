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
          Extract ONLY the factual information that is explicitly stated in this LinkedIn profile content.
          DO NOT infer, assume, or add any information that is not clearly present.
          
          CRITICAL RULES:
          1. Extract ONLY what is explicitly written in the profile
          2. Do NOT make assumptions about skills or experience not mentioned
          3. Do NOT add generic or placeholder content
          4. If information is missing, leave those fields empty or minimal
          5. Preserve the exact job titles, company names, and descriptions as written
          
          LinkedIn Content:
          ${markdown}
          
          Extract the following information ONLY if it's clearly stated:
          - Personal details (name, headline, location, summary/about section)
          - Work experience (exact titles, companies, dates, descriptions as written)
          - Education (schools, degrees, fields of study, dates)
          - Skills (only those explicitly listed or clearly mentioned)
          - Certifications (only if specifically listed)
          - Projects (only if there's a dedicated projects section)
          - Volunteer work (only if explicitly mentioned)
          - Awards (only if specifically listed)
          - Languages (only if there's a languages section)
          
          Be accurate and factual. Do not embellish or add content that isn't there.
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
      // Step 1: Generate the tailored profile first
      const { object: tailoredProfile } = await blink.ai.generateObject({
        prompt: `
          You are an expert resume writer. Your job is to optimize the candidate's EXISTING experience and background for a specific job posting.
          
          CRITICAL RULES:
          1. NEVER change the candidate's actual job titles, companies, or core background
          2. NEVER invent experience the candidate doesn't have
          3. NEVER change their industry or field unless it's clearly transferable
          4. ONLY optimize descriptions, keywords, and emphasis to highlight relevant aspects
          5. The candidate's fundamental career path and expertise MUST remain accurate
          
          LinkedIn Profile (ACTUAL CANDIDATE DATA - DO NOT CHANGE CORE FACTS):
          ${JSON.stringify(profile, null, 2)}
          
          Job Posting (TARGET ROLE):
          ${JSON.stringify(job, null, 2)}
          
          Your task is to OPTIMIZE, not FABRICATE:
          1. Keep all job titles, companies, dates, and education exactly as they are
          2. Rewrite job descriptions to emphasize aspects relevant to the target role
          3. Adjust the professional summary to highlight relevant strengths from their ACTUAL background
          4. Prioritize skills they actually have that match the job requirements
          5. Use keywords from the job posting naturally in descriptions of their REAL experience
          
          Example: If they're a salesperson applying for a sales role, emphasize their sales achievements.
          If they're a salesperson applying for a marketing role, emphasize the marketing aspects of their sales work.
          But NEVER make a salesperson into a software engineer!
          
          Focus on:
          - Highlighting transferable skills from their actual experience
          - Using job posting keywords to describe their real accomplishments
          - Quantifying their actual achievements where possible
          - Emphasizing relevant aspects of their true background
          - Maintaining complete factual accuracy about their career history
          
          Return the optimized profile that stays true to who they are while positioning them for the target role.
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

      // Validation: Ensure the tailored profile maintains the original person's background
      const originalJobTitles = profile.experience.map(exp => exp.title.toLowerCase())
      const tailoredJobTitles = (tailoredProfile as LinkedInProfile).experience.map(exp => exp.title.toLowerCase())
      
      // Check if the AI completely changed the person's background
      const hasSignificantTitleChanges = originalJobTitles.some((originalTitle, index) => {
        const tailoredTitle = tailoredJobTitles[index]
        if (!tailoredTitle) return false
        
        // Allow minor wording changes but not complete career changes
        const originalWords = originalTitle.split(' ')
        const tailoredWords = tailoredTitle.split(' ')
        const commonWords = originalWords.filter(word => 
          tailoredWords.some(tWord => tWord.includes(word) || word.includes(tWord))
        )
        
        // If less than 30% of words are similar, it's likely a hallucination
        return commonWords.length < originalWords.length * 0.3
      })
      
      if (hasSignificantTitleChanges) {
        console.warn('AI may have hallucinated job titles, using original profile with minimal changes')
        console.log('Original titles:', originalJobTitles)
        console.log('Tailored titles:', tailoredJobTitles)
        
        // Use original profile with just summary and description optimizations
        const safeProfile = {
          ...profile,
          summary: (tailoredProfile as LinkedInProfile).summary || profile.summary,
          experience: profile.experience.map((exp, index) => ({
            ...exp,
            // Keep original title and company, only optimize description
            description: (tailoredProfile as LinkedInProfile).experience[index]?.description || exp.description
          }))
        }
        tailoredProfile = safeProfile as any
      } else {
        console.log('Job titles validation passed - no significant changes detected')
      }

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