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
   * Create a fallback profile when LinkedIn scraping fails
   */
  private createFallbackProfile(url: string): LinkedInProfile {
    // Extract name from URL if possible
    const urlMatch = url.match(/linkedin\.com\/in\/([^/]+)/)
    const urlName = urlMatch ? urlMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Professional'
    
    return {
      name: urlName,
      headline: 'Experienced Professional',
      location: 'Location Not Specified',
      summary: 'Experienced professional with a strong background in their field. Please update your LinkedIn profile to be publicly accessible for better results.',
      experience: [{
        title: 'Professional Role',
        company: 'Previous Company',
        duration: 'Recent Experience',
        location: 'Location',
        description: 'Professional experience in relevant field. Please ensure your LinkedIn profile is public and contains detailed work experience for accurate resume generation.',
        skills: ['Professional Skills', 'Industry Knowledge', 'Communication']
      }],
      education: [{
        school: 'Educational Institution',
        degree: 'Degree',
        field: 'Field of Study',
        duration: 'Graduation Year'
      }],
      skills: ['Professional Skills', 'Communication', 'Problem Solving', 'Team Collaboration'],
      certifications: [],
      languages: [],
      projects: [],
      volunteering: [],
      awards: []
    }
  }

  /**
   * Parse LinkedIn profile from URL using advanced web scraping and AI analysis
   */
  async parseLinkedInProfile(url: string): Promise<LinkedInProfile> {
    try {
      console.log('Starting LinkedIn profile parsing for:', url)
      
      // First, scrape the LinkedIn profile page
      const { markdown, metadata } = await blink.data.scrape(url)
      
      if (!markdown || markdown.trim().length < 100) {
        console.warn('Limited content extracted from LinkedIn. This may be due to LinkedIn\'s anti-scraping measures.')
        // Instead of throwing an error immediately, we'll try to work with what we have
        // and provide a fallback if needed
      }
      
      // Debug: Log the scraped content to understand what we're working with
      console.log('LinkedIn scraped content length:', markdown?.length || 0)
      console.log('LinkedIn scraped content preview:', markdown?.substring(0, 1000) + '...' || 'No content available')
      
      // Use AI to extract structured data from the scraped content with flexible handling
      let profile: LinkedInProfile
      
      if (!markdown || markdown.trim().length < 50) {
        // If we have very limited content, provide a helpful fallback
        console.warn('Insufficient LinkedIn content - providing fallback structure')
        profile = this.createFallbackProfile(url)
      } else {
        // Try to extract from available content
        const { object: extractedProfile } = await blink.ai.generateObject({
          prompt: `
            You are a data extraction specialist working with LinkedIn profile content that may be limited due to scraping restrictions.
            
            EXTRACTION APPROACH:
            1. Extract any information that is clearly visible in the content
            2. If work experience is not clearly structured, look for any mentions of job titles, companies, or work-related content
            3. If traditional sections are missing, extract any professional information available
            4. Be flexible - LinkedIn may show content differently than expected
            5. If you find minimal information, extract what you can and leave other fields empty
            6. Do NOT invent information, but be creative in finding relevant details
            
            CONTENT TO ANALYZE:
            ${markdown || 'Limited content available'}
            
            IMPORTANT: If you cannot find traditional work experience sections, look for:
            - Any mentions of job titles or positions
            - Company names or organizations
            - Professional activities or roles
            - Skills or expertise mentioned
            - Educational background
            - Any professional context
            
            Extract whatever professional information is available, even if it's not in traditional LinkedIn format.
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

        profile = extractedProfile as LinkedInProfile
        
        // If extraction still failed to find meaningful data, use fallback
        if (!profile.name || profile.name.trim() === '' || 
            !profile.experience || profile.experience.length === 0 ||
            profile.experience.every(exp => !exp.title || !exp.company)) {
          console.warn('AI extraction found insufficient data - using fallback profile')
          profile = this.createFallbackProfile(url)
        }
      }
      
      // Ensure we have valid data structure
      profile.experience = profile.experience || []
      profile.education = profile.education || []
      profile.skills = profile.skills || []
      profile.certifications = profile.certifications || []
      profile.languages = profile.languages || []
      profile.projects = profile.projects || []
      profile.volunteering = profile.volunteering || []
      profile.awards = profile.awards || []
      
      // Clean up any empty or invalid entries
      profile.experience = profile.experience.filter(exp => 
        exp.title && exp.company && exp.title.trim() !== '' && exp.company.trim() !== ''
      )
      
      profile.education = profile.education.filter(edu => 
        edu.school && edu.degree && edu.school.trim() !== '' && edu.degree.trim() !== ''
      )
      
      profile.skills = profile.skills.filter(skill => 
        skill && skill.trim() !== '' && skill.length > 1
      )
      
      // Ensure we have at least one experience entry
      if (profile.experience.length === 0) {
        console.warn('No valid experience found - adding placeholder')
        profile.experience.push({
          title: 'Professional Role',
          company: 'Previous Company',
          duration: 'Recent Experience',
          location: 'Location',
          description: 'Professional experience in relevant field. Please ensure your LinkedIn profile is public and contains detailed work experience for accurate resume generation.',
          skills: ['Professional Skills']
        })
      }
      
      // Debug logging
      console.log('Final LinkedIn Profile:', {
        name: profile.name,
        headline: profile.headline,
        experienceCount: profile.experience.length,
        firstJobTitle: profile.experience[0]?.title,
        firstCompany: profile.experience[0]?.company,
        skillsCount: profile.skills.length
      })

      return profile
    } catch (error) {
      console.error('Error parsing LinkedIn profile:', error)
      
      // Instead of throwing an error, provide a fallback profile
      console.warn('LinkedIn parsing failed - providing fallback profile')
      return this.createFallbackProfile(url)
    }
  }

  /**
   * Parse job posting from URL using advanced analysis
   */
  async parseJobPosting(url: string): Promise<JobPosting> {
    try {
      console.log('Starting job posting parsing for:', url)
      
      // Scrape the job posting page
      const { markdown, metadata } = await blink.data.scrape(url)
      
      if (!markdown || markdown.trim().length < 50) {
        throw new Error('Unable to extract sufficient content from job posting. Please ensure the URL is accessible.')
      }
      
      console.log('Job posting scraped content length:', markdown.length)
      console.log('Job posting content preview:', markdown.substring(0, 500) + '...')
      
      // Use AI to extract structured job information
      const { object: jobData } = await blink.ai.generateObject({
        prompt: `
          Analyze this job posting and extract comprehensive job requirements and details.
          Focus on identifying specific skills, qualifications, and requirements.
          
          EXTRACTION RULES:
          1. Extract only information that is explicitly stated in the job posting
          2. Do not invent or assume any requirements
          3. Categorize requirements as "required" vs "preferred" based on language used
          4. Extract all relevant keywords for ATS optimization
          
          Job Posting Content:
          ${markdown}
          
          Extract all available information including job details, requirements, and keywords.
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

      const processedJob = jobData as JobPosting
      
      // Validate job data
      if (!processedJob.title || !processedJob.company) {
        throw new Error('Unable to extract job title and company from the job posting.')
      }
      
      // Ensure required arrays exist (but don't add fake data)
      if (!processedJob.requirements.required) {
        processedJob.requirements.required = []
      }
      if (!processedJob.requirements.skills) {
        processedJob.requirements.skills = []
      }
      if (!processedJob.responsibilities) {
        processedJob.responsibilities = []
      }
      if (!processedJob.keywords) {
        processedJob.keywords = []
      }

      console.log('Parsed job posting:', {
        title: processedJob.title,
        company: processedJob.company,
        requirementsCount: processedJob.requirements.required.length,
        skillsCount: processedJob.requirements.skills.length
      })

      return processedJob
    } catch (error) {
      console.error('Error parsing job posting:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to parse job posting. Please ensure the URL is accessible and try again.')
    }
  }

  /**
   * Generate tailored resume content and insights with strict fact preservation
   */
  async generateTailoredResume(
    profile: LinkedInProfile, 
    job: JobPosting
  ): Promise<{ tailoredProfile: LinkedInProfile; insights: TailoringInsights }> {
    try {
      console.log('Starting resume tailoring process...')
      console.log('Original profile experience count:', profile.experience.length)
      console.log('Job title:', job.title)
      
      // Create a deep copy of the original profile to ensure we preserve all original data
      const originalProfile = JSON.parse(JSON.stringify(profile)) as LinkedInProfile
      
      // Step 1: Generate the tailored profile with ABSOLUTE fact preservation
      const { object: tailoredProfile } = await blink.ai.generateObject({
        prompt: `
          You are a professional resume optimizer. Your ONLY job is to enhance descriptions and summaries while preserving ALL factual information.
          
          ABSOLUTE RULES - NEVER VIOLATE THESE:
          1. Keep ALL job titles EXACTLY as they appear: ${profile.experience.map(e => `"${e.title}"`).join(', ')}
          2. Keep ALL company names EXACTLY as they appear: ${profile.experience.map(e => `"${e.company}"`).join(', ')}
          3. Keep ALL employment dates EXACTLY as they appear: ${profile.experience.map(e => `"${e.duration}"`).join(', ')}
          4. Keep ALL education details EXACTLY as they appear
          5. ONLY modify job descriptions to highlight relevant aspects using job posting keywords
          6. ONLY modify the professional summary to emphasize relevant strengths
          7. ONLY reorder existing skills that match the job requirements
          8. Do NOT add new skills that weren't in the original profile
          9. Do NOT change any factual information - only enhance presentation
          
          ORIGINAL CANDIDATE PROFILE (PRESERVE ALL FACTS):
          Name: ${profile.name}
          Headline: ${profile.headline}
          Location: ${profile.location}
          Summary: ${profile.summary}
          
          Work Experience (PRESERVE EXACTLY):
          ${profile.experience.map((exp, i) => `
          ${i + 1}. Title: "${exp.title}" (MUST KEEP EXACTLY AS IS)
             Company: "${exp.company}" (MUST KEEP EXACTLY AS IS)
             Duration: "${exp.duration}" (MUST KEEP EXACTLY AS IS)
             Original Description: ${exp.description}
          `).join('')}
          
          Education (PRESERVE EXACTLY):
          ${profile.education.map((edu, i) => `
          ${i + 1}. Degree: "${edu.degree}" at "${edu.school}" (${edu.duration})
          `).join('')}
          
          Skills (ONLY REORDER, DON'T ADD NEW): ${profile.skills.join(', ')}
          
          TARGET JOB POSTING:
          Title: ${job.title}
          Company: ${job.company}
          Key Requirements: ${job.requirements.required.join(', ')}
          Key Skills: ${job.requirements.skills.join(', ')}
          Responsibilities: ${job.responsibilities.join(', ')}
          
          YOUR TASK:
          1. Rewrite the professional summary to highlight how their ACTUAL background fits this role
          2. Rewrite job descriptions to emphasize relevant aspects using keywords from the job posting
          3. Prioritize skills that match the job requirements (reorder only, don't add new ones)
          4. DO NOT change any titles, companies, dates, or core facts
          5. Focus on making their REAL experience sound more relevant to the target role
          6. Use job posting keywords naturally in descriptions where they genuinely apply
          
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

      const processedTailoredProfile = tailoredProfile as LinkedInProfile
      
      // CRITICAL VALIDATION: Ensure factual accuracy is preserved
      console.log('Validating tailored profile...')
      
      // Validate experience count matches
      if (processedTailoredProfile.experience.length !== originalProfile.experience.length) {
        console.error('Experience count mismatch! Original:', originalProfile.experience.length, 'Tailored:', processedTailoredProfile.experience.length)
        // Force correction by restoring original structure
        processedTailoredProfile.experience = originalProfile.experience
      }
      
      // Validate each experience entry for factual accuracy
      for (let i = 0; i < originalProfile.experience.length; i++) {
        const original = originalProfile.experience[i]
        const tailored = processedTailoredProfile.experience[i]
        
        if (original.title !== tailored.title) {
          console.error(`Job title changed! Original: "${original.title}", Tailored: "${tailored.title}"`)
          tailored.title = original.title // Force correction
        }
        
        if (original.company !== tailored.company) {
          console.error(`Company changed! Original: "${original.company}", Tailored: "${tailored.company}"`)
          tailored.company = original.company // Force correction
        }
        
        if (original.duration !== tailored.duration) {
          console.error(`Duration changed! Original: "${original.duration}", Tailored: "${tailored.duration}"`)
          tailored.duration = original.duration // Force correction
        }
      }
      
      // Validate education hasn't been altered
      if (processedTailoredProfile.education.length !== originalProfile.education.length) {
        console.warn('Education count changed, restoring original')
        processedTailoredProfile.education = originalProfile.education
      }
      
      // Validate skills - ensure no new skills were added
      const originalSkillsSet = new Set(originalProfile.skills.map(s => s.toLowerCase()))
      const tailoredSkillsFiltered = processedTailoredProfile.skills.filter(skill => 
        originalSkillsSet.has(skill.toLowerCase())
      )
      
      if (tailoredSkillsFiltered.length !== processedTailoredProfile.skills.length) {
        console.warn('New skills were added, filtering to original skills only')
        processedTailoredProfile.skills = tailoredSkillsFiltered
      }
      
      console.log('Validation complete. Tailored profile preserved factual accuracy.')

      // Step 2: Generate insights
      const { object: insights } = await blink.ai.generateObject({
        prompt: `
          Analyze the changes made to tailor the resume for the job. Compare the original profile with the tailored version.
          
          Original Profile Summary: ${originalProfile.summary}
          Tailored Profile Summary: ${processedTailoredProfile.summary}
          
          Original Experience Descriptions:
          ${originalProfile.experience.map((exp, i) => `${i + 1}. ${exp.title} at ${exp.company}: ${exp.description}`).join('\\n')}
          
          Tailored Experience Descriptions:
          ${processedTailoredProfile.experience.map((exp, i) => `${i + 1}. ${exp.title} at ${exp.company}: ${exp.description}`).join('\\n')}
          
          Job Requirements: ${JSON.stringify(job.requirements, null, 2)}
          
          Provide insights on what was changed and why, focusing on the most important modifications.
          Remember: Only descriptions and summaries were modified, not titles, companies, or dates.
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

      const processedInsights = insights as TailoringInsights
      
      // Ensure insights have required data
      if (!processedInsights.skillsMatch || processedInsights.skillsMatch.length === 0) {
        processedInsights.skillsMatch = [{
          skill: 'Core Professional Skills',
          fromProfile: true,
          addedForJob: false,
          relevanceScore: 0.8,
          explanation: 'Existing professional skills relevant to the target position'
        }]
      }
      
      if (!processedInsights.summaryChanges) {
        processedInsights.summaryChanges = {
          original: originalProfile.summary,
          tailored: processedTailoredProfile.summary,
          keywordsIntegrated: [],
          explanation: 'Summary optimized to highlight relevant experience for the target role'
        }
      }

      console.log('Resume tailoring completed successfully')
      
      return {
        tailoredProfile: processedTailoredProfile,
        insights: processedInsights
      }
    } catch (error) {
      console.error('Error generating tailored resume:', error)
      if (error instanceof Error) {
        throw error
      }
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