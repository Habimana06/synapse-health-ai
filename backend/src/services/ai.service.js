const config = require('../config');

const SYMPTOM_MAP = {
  fever: ['Flu', 'Malaria', 'Respiratory Infection', 'Typhoid'],
  headache: ['Migraine', 'Hypertension', 'Malaria', 'Tension Headache'],
  cough: ['Respiratory Infection', 'Flu', 'Bronchitis', 'COVID-19'],
  nausea: ['Food Poisoning', 'Malaria', 'Gastritis'],
  fatigue: ['Anemia', 'Diabetes', 'Hypothyroidism', 'Malaria'],
  'chest pain': ['Angina', 'Anxiety', 'Respiratory Infection'],
  'joint pain': ['Arthritis', 'Malaria', 'Lyme Disease'],
};

const DRUG_RECOMMENDATIONS = {
  flu: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours' }, { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 8 hours' }],
  malaria: [{ name: 'Artemether/Lumefantrine', dosage: '20/120mg', frequency: 'Twice daily for 3 days' }],
  hypertension: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' }],
  diabetes: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals' }],
  infection: [{ name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily for 7 days' }],
};

const CHAT_RESPONSES = {
  en: {
    default: 'I am Synapse Health AI assistant. Please consult a healthcare professional for medical advice. How can I help you today?',
    paracetamol: 'Paracetamol (500mg) is commonly used for pain and fever. Take as directed. Do not exceed 4g per day. Consult your doctor if symptoms persist.',
    side_effects: 'Common side effects vary by medication. Always read the leaflet and consult your pharmacist or doctor if you experience unusual symptoms.',
  },
  rw: {
    default: 'Ni umufasha wa Synapse Health AI. Baza umuganga wabigenewe inama z\'ubuvuzi. Nshobora kugufasha iki?',
    paracetamol: 'Paracetamol (500mg) ikoreshwa mu kubagwa n\'umuriro. Fata nk\'uko umuganga abivuze. Ntarengere imigere 4g ku munsi.',
    side_effects: 'Ingaruka zishobora kuba zitandukanye. Soma inyandiko cyangwa vugana n\'umuganga niba ufite ibimenyetso bidasanzwe.',
  },
  fr: {
    default: 'Je suis l\'assistant Synapse Health AI. Consultez un professionnel de santé. Comment puis-je vous aider?',
    paracetamol: 'Le paracétamol (500mg) est utilisé pour la douleur et la fièvre. Ne dépassez pas 4g par jour.',
    side_effects: 'Les effets secondaires varient. Consultez votre pharmacien en cas de symptômes inhabituels.',
  },
};

async function callLLM(messages) {
  if (config.groq.apiKey) {
    const res = await fetch(`${config.groq.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.groq.apiKey}`,
      },
      body: JSON.stringify({
        model: config.groq.model,
        messages,
        temperature: 0.3,
        max_tokens: 800,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }
  }

  if (config.openaiApiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 800,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }
  }
  return null;
}

async function analyzeSymptoms({ symptoms, age, gender, existingConditions }) {
  const symptomList = Array.isArray(symptoms) ? symptoms : [symptoms];
  const conditions = new Set();

  symptomList.forEach((s) => {
    const key = s.toLowerCase().trim();
    (SYMPTOM_MAP[key] || ['General illness - consult a doctor']).forEach((c) => conditions.add(c));
  });

  const fallback = {
    possibleConditions: [...conditions].slice(0, 5),
    disclaimer: 'This is decision support only, not a medical diagnosis. Consult a qualified healthcare provider.',
    confidence: 'moderate',
  };

  const ai = await callLLM([
    { role: 'system', content: 'You are a clinical decision support AI. Suggest possible conditions only, never diagnose. Respond in JSON: { possibleConditions: string[], disclaimer: string, confidence: string }' },
    { role: 'user', content: JSON.stringify({ symptoms: symptomList, age, gender, existingConditions }) },
  ]);

  if (ai) {
    try {
      return JSON.parse(ai.replace(/```json\n?|\n?```/g, ''));
    } catch {
      return { ...fallback, aiNote: ai };
    }
  }
  return fallback;
}

async function recommendDrugs({ diagnosis, age, medicalHistory, currentMedications }) {
  const key = diagnosis.toLowerCase();
  let meds = DRUG_RECOMMENDATIONS.infection;

  for (const [k, v] of Object.entries(DRUG_RECOMMENDATIONS)) {
    if (key.includes(k)) { meds = v; break; }
  }

  const fallback = {
    recommendations: meds,
    notes: 'Review patient allergies and current medications before prescribing.',
    disclaimer: 'AI-assisted recommendation. Final decision rests with the prescribing physician.',
  };

  const ai = await callLLM([
    { role: 'system', content: 'Clinical drug recommendation support. JSON: { recommendations: [{name,dosage,frequency}], notes, disclaimer }' },
    { role: 'user', content: JSON.stringify({ diagnosis, age, medicalHistory, currentMedications }) },
  ]);

  if (ai) {
    try {
      return JSON.parse(ai.replace(/```json\n?|\n?```/g, ''));
    } catch {
      return { ...fallback, aiNote: ai };
    }
  }
  return fallback;
}

function assessHealthRisk({ riskType, age, gender, bmi, conditions }) {
  let score = 20;
  if (age > 45) score += 15;
  if (age > 60) score += 15;
  if (bmi > 30) score += 20;
  if (conditions?.length) score += conditions.length * 10;

  const riskScores = {
    diabetes: score + (conditions?.some((c) => /diabet|obes|overweight/i.test(c)) ? 25 : 0),
    hypertension: score + (conditions?.some((c) => /hyper|heart|obes/i.test(c)) ? 25 : 0),
    heart_disease: score + (conditions?.some((c) => /heart|hyper|diabet|smok/i.test(c)) ? 30 : 0),
    kidney_disease: score + (conditions?.some((c) => /diabet|hyper|kidney/i.test(c)) ? 25 : 0),
  };

  const finalScore = Math.min(riskScores[riskType] || score, 95);
  const level = finalScore >= 70 ? 'high' : finalScore >= 45 ? 'moderate' : 'low';

  return {
    riskType,
    riskScore: finalScore,
    riskLevel: level,
    recommendations: level === 'high'
      ? 'Schedule a comprehensive screening with your healthcare provider immediately.'
      : level === 'moderate'
        ? 'Consider lifestyle changes and regular monitoring.'
        : 'Maintain healthy habits and annual check-ups.',
  };
}

async function chatResponse(message, language = 'en') {
  const lang = CHAT_RESPONSES[language] || CHAT_RESPONSES.en;
  const lower = message.toLowerCase();

  if (lower.includes('paracetamol') || lower.includes('paracetamol')) return lang.paracetamol;
  if (lower.includes('side effect')) return lang.side_effects;

  const ai = await callLLM([
    { role: 'system', content: `You are Synapse Health AI assistant. Language: ${language}. Provide helpful health information but always recommend consulting professionals. Keep responses concise.` },
    { role: 'user', content: message },
  ]);

  return ai || lang.default;
}

module.exports = {
  analyzeSymptoms,
  recommendDrugs,
  assessHealthRisk,
  chatResponse,
};
