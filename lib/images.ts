/**
 * AI Image Generation via Google Gemini
 * Generates hero background + before/after photo pairs for clinic landing pages
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '***REMOVED***'
const GEMINI_MODEL = 'gemini-3.1-flash-image-preview'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

export interface BeforeAfterPair {
  before: string  // data URL
  after: string   // data URL
  label: string
}

export interface GeneratedImages {
  hero: string | null
  beforeAfter: BeforeAfterPair[]
}

/**
 * Call Gemini API and extract the first image from the response
 */
async function callGeminiForImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[images] Gemini API error:', response.status, errText)
      return null
    }

    const data = await response.json()
    const parts = data?.candidates?.[0]?.content?.parts || []

    for (const part of parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png'
        return `data:${mimeType};base64,${part.inlineData.data}`
      }
    }

    console.warn('[images] No image found in Gemini response')
    return null
  } catch (err) {
    console.error('[images] Gemini fetch error:', err)
    return null
  }
}

/**
 * Split a side-by-side image into left/right halves using sharp
 */
async function splitSideBySide(dataUrl: string): Promise<{ left: string; right: string } | null> {
  try {
    // Dynamically import sharp (it's a native module)
    const sharp = (await import('sharp')).default

    // Convert data URL to Buffer
    const base64 = dataUrl.split(',')[1]
    const mimeType = dataUrl.split(';')[0].split(':')[1]
    const buffer = Buffer.from(base64, 'base64')

    // Get image metadata
    const metadata = await sharp(buffer).metadata()
    const width = metadata.width || 0
    const height = metadata.height || 0

    if (!width || !height) return null

    const halfWidth = Math.floor(width / 2)

    // Extract left half (before)
    const leftBuffer = await sharp(buffer)
      .extract({ left: 0, top: 0, width: halfWidth, height })
      .resize(600, 720, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Extract right half (after)
    const rightBuffer = await sharp(buffer)
      .extract({ left: halfWidth, top: 0, width: width - halfWidth, height })
      .resize(600, 720, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toBuffer()

    return {
      left: `data:image/jpeg;base64,${leftBuffer.toString('base64')}`,
      right: `data:image/jpeg;base64,${rightBuffer.toString('base64')}`,
    }
  } catch (err) {
    console.error('[images] Sharp split error:', err)
    return null
  }
}

/**
 * Generate a dark moody hero background image for the treatment
 */
export async function generateHeroImage(treatmentName: string, treatmentCategory: string): Promise<string | null> {
  // Map category to body area for prompt
  const bodyAreaMap: Record<string, string> = {
    Face: 'face profile',
    Body: 'body silhouette',
    Eyes: 'eye close-up',
    Breast: 'chest silhouette tasteful',
    'Skin & Laser': 'skin texture close-up',
    Nose: 'nose profile silhouette',
    Lips: 'lips close-up',
    Hair: 'hair silhouette',
    Intimate: 'abstract body curves tasteful',
    Anti_Aging: 'face profile elegant',
  }

  const bodyArea = bodyAreaMap[treatmentCategory] || 'aesthetic treatment silhouette'

  const prompt = `Dark moody ${bodyArea} aesthetic medical clinic photograph, dark background, high contrast black and white, tasteful artistic composition, no nudity, wide landscape format 16:9, cinematic lighting, luxury aesthetic clinic atmosphere. Treatment: ${treatmentName}. Professional photography style, elegant and sophisticated.`

  console.log('[images] Generating hero image for:', treatmentName)
  return callGeminiForImage(prompt)
}

/**
 * Generate before/after photo pairs for the treatment
 * Uses the side-by-side technique: one landscape image split in half
 */
export async function generateBeforeAfterPairs(
  treatmentName: string,
  treatmentCategory: string,
  count: number = 3,
): Promise<BeforeAfterPair[]> {
  const pairs: BeforeAfterPair[] = []

  // Vary subjects for diversity
  const subjects = [
    'a woman in her 40s',
    'a woman in her 50s',
    'a man in his 40s',
    'a woman in her 35s',
    'a man in her 55s',
    'a woman in her 30s',
  ]

  for (let i = 0; i < count; i++) {
    const subject = subjects[i % subjects.length]
    const label = `Patient ${i + 1}`

    const prompt = `Create a single clinical documentation photograph showing a BEFORE and AFTER comparison of ${treatmentName} aesthetic treatment, side by side in ONE landscape image — left half BEFORE treatment, right half AFTER treatment results. Subject: ${subject}. Same person in both halves. Smooth uniform medium gray studio background. Realistic clinical photography style. Professional medical documentation. Tasteful, no nudity. Clear visible improvement in results. Do NOT add any text labels or watermarks. High quality clinical photography.`

    console.log(`[images] Generating B&A pair ${i + 1}/${count} for:`, treatmentName)

    try {
      const fullImage = await callGeminiForImage(prompt)

      if (fullImage) {
        const halves = await splitSideBySide(fullImage)
        if (halves) {
          pairs.push({
            before: halves.left,
            after: halves.right,
            label,
          })
          continue
        }
        // If split failed, use the full image for both (fallback)
        pairs.push({ before: fullImage, after: fullImage, label })
      }
    } catch (err) {
      console.error(`[images] B&A pair ${i + 1} failed:`, err)
    }
  }

  return pairs
}

/**
 * Generate all images for a clinic page
 * Returns hero + before/after pairs
 * Gracefully degrades if generation fails
 */
export async function generatePageImages(
  treatmentName: string,
  treatmentCategory: string,
): Promise<GeneratedImages> {
  const result: GeneratedImages = {
    hero: null,
    beforeAfter: [],
  }

  try {
    // Generate hero first (quick)
    result.hero = await generateHeroImage(treatmentName, treatmentCategory)
  } catch (err) {
    console.error('[images] Hero image generation failed:', err)
  }

  // Generate 3 B&A pairs (not all 6 to keep under 60s)
  try {
    result.beforeAfter = await generateBeforeAfterPairs(treatmentName, treatmentCategory, 3)
  } catch (err) {
    console.error('[images] Before/after generation failed:', err)
  }

  return result
}
