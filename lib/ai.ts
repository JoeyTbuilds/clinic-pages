import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface TreatmentPageContent {
  title: string
  metaDescription: string
  metaKeywords: string
  heroHeadline: string
  heroSubheadline: string
  heroCTA: string
  trustBarItems: Array<{ icon: string; text: string }>
  reasonsTitle: string
  reasonsIntro: string
  reasons: Array<{ icon: string; title: string; description: string }>
  procedureTitle: string
  procedureSteps: Array<{ step: number; title: string; description: string; duration?: string }>
  pricingTitle: string
  pricingSubtitle: string
  advantagesTitle: string
  advantages: Array<{ icon: string; title: string; description: string }>
  faqTitle: string
  faqItems: Array<{ question: string; answer: string }>
  contactTitle: string
  contactSubtitle: string
  footerTagline: string
}

export interface GeneratePageInput {
  treatmentName: string
  treatmentCategory: string
  description?: string
  benefits?: string[]
  procedureSteps?: string[]
  duration?: string
  recovery?: string
  anesthesia?: string
  startingPrice?: string
  clinicName: string
  location?: string
  yearsExperience?: string
  patientCount?: string
  rating?: string
  language: 'en' | 'de'
}

export async function generatePageContent(input: GeneratePageInput): Promise<TreatmentPageContent> {
  const langInstr = input.language === 'de' 
    ? 'Generate ALL content in German (Deutsch). Use formal "Sie" address.' 
    : 'Generate ALL content in English.'

  const prompt = `You are an expert medical copywriter specializing in aesthetic clinic landing pages. 
${langInstr}

Generate conversion-optimized landing page content for the following treatment:

Treatment: ${input.treatmentName}
Category: ${input.treatmentCategory}
Clinic: ${input.clinicName}
Location: ${input.location || 'Europe'}
Description: ${input.description || 'N/A'}
Benefits: ${input.benefits?.join(', ') || 'To be determined'}
Procedure Steps: ${input.procedureSteps?.join(', ') || 'Standard procedure'}
Duration: ${input.duration || 'Varies by case'}
Recovery: ${input.recovery || 'Minimal downtime'}
Anesthesia: ${input.anesthesia || 'Local or general'}
Starting Price: ${input.startingPrice || 'On consultation'}
Years Experience: ${input.yearsExperience || '15+'}
Patient Count: ${input.patientCount || '3,000+'}
Rating: ${input.rating || '4.9'}

Write empathetic, professional copy that:
- Addresses the patient's emotional concerns first
- Builds trust through expertise and experience
- Uses specific numbers and social proof
- Drives action without being pushy
- Feels medical/clinical but warm and approachable
- Never sounds like a startup or tech company

Return ONLY valid JSON matching this exact structure (no markdown, no commentary):
{
  "title": "SEO page title (60 chars max)",
  "metaDescription": "Meta description (155 chars max)",
  "metaKeywords": "comma,separated,keywords",
  "heroHeadline": "H1 headline",
  "heroSubheadline": "Supporting subheading (1-2 sentences)",
  "heroCTA": "CTA button text",
  "trustBarItems": [{"icon": "emoji", "text": "trust signal"}],
  "reasonsTitle": "Section title",
  "reasonsIntro": "2-3 sentence intro",
  "reasons": [{"icon": "emoji", "title": "reason title", "description": "2-3 sentences"}],
  "procedureTitle": "Section title",
  "procedureSteps": [{"step": 1, "title": "step title", "description": "explanation", "duration": "X minutes"}],
  "pricingTitle": "Section title",
  "pricingSubtitle": "1-2 sentences about transparent pricing",
  "advantagesTitle": "Section title",
  "advantages": [{"icon": "emoji", "title": "advantage", "description": "explanation"}],
  "faqTitle": "Section title",
  "faqItems": [{"question": "Q?", "answer": "A."}],
  "contactTitle": "Section title",
  "contactSubtitle": "Reassuring message about consultation",
  "footerTagline": "Short brand tagline"
}

Generate 4 trustBarItems, 4 reasons, 5 procedureSteps, 4 advantages, 8 faqItems.`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  
  // Strip any markdown code fences if present
  const jsonText = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  
  try {
    return JSON.parse(jsonText) as TreatmentPageContent
  } catch (e) {
    console.error('Failed to parse AI response:', text)
    throw new Error('AI response was not valid JSON')
  }
}

export async function generateAIReviews(
  treatmentName: string,
  clinicName: string,
  language: 'en' | 'de',
  count = 5
): Promise<Array<{ name: string; rating: number; text: string; treatment: string }>> {
  const langInstr = language === 'de' ? 'Write in German (Deutsch).' : 'Write in English.'
  
  const prompt = `Generate ${count} realistic, positive patient reviews for ${treatmentName} at ${clinicName}.
${langInstr}
These are AI-generated reviews for demonstration purposes.

Rules:
- Use realistic German/Swiss/Austrian names if German, English names if English
- Mix of 4 and 5 star reviews (mostly 5)
- Specific, believable experiences
- Mention real emotions, outcomes, staff kindness
- 3-5 sentences each
- NOT generic ("great service!")

Return ONLY valid JSON array:
[{"name": "First Last", "rating": 5, "text": "Review text...", "treatment": "${treatmentName}"}]`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
  const jsonText = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  
  try {
    return JSON.parse(jsonText)
  } catch {
    return []
  }
}
