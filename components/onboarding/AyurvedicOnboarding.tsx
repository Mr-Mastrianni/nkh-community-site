'use client';

import { useState } from 'react';

interface AyurvedicOnboardingProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const AyurvedicOnboarding = ({ onNext, onBack }: AyurvedicOnboardingProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      title: 'Physical Characteristics',
      questions: [
        { id: 'body_frame', text: 'My body frame is generally:', options: ['Thin/Light (Vata)', 'Medium/Muscular (Pitta)', 'Large/Heavy (Kapha)'] },
        { id: 'skin_texture', text: 'My skin is usually:', options: ['Dry/Rough (Vata)', 'Warm/Oily (Pitta)', 'Cool/Moist (Kapha)'] },
        { id: 'hair_type', text: 'My hair is typically:', options: ['Dry/Brittle (Vata)', 'Fine/Oily (Pitta)', 'Thick/Lustrous (Kapha)'] },
        { id: 'eyes', text: 'My eyes are:', options: ['Small/Active (Vata)', 'Medium/Penetrating (Pitta)', 'Large/Calm (Kapha)'] },
        { id: 'appetite', text: 'My appetite is:', options: ['Variable/Irregular (Vata)', 'Strong/Regular (Pitta)', 'Slow/Steady (Kapha)'] }
      ]
    },
    {
      title: 'Mental & Emotional Traits',
      questions: [
        { id: 'learning_style', text: 'I learn best by:', options: ['Quick grasp, forget easily (Vata)', 'Good comprehension, moderate retention (Pitta)', 'Slow to learn, excellent retention (Kapha)'] },
        { id: 'decision_making', text: 'When making decisions, I:', options: ['Change my mind frequently (Vata)', 'Make decisions quickly (Pitta)', 'Take time to decide (Kapha)'] },
        { id: 'emotional_response', text: 'Emotionally, I tend to be:', options: ['Anxious/Worried (Vata)', 'Irritable/Intense (Pitta)', 'Calm/Steady (Kapha)'] },
        { id: 'stress_reaction', text: 'Under stress, I become:', options: ['Anxious/Scattered (Vata)', 'Angry/Critical (Pitta)', 'Withdrawn/Lethargic (Kapha)'] },
        { id: 'communication', text: 'My communication style is:', options: ['Fast/Talkative (Vata)', 'Sharp/Articulate (Pitta)', 'Slow/Thoughtful (Kapha)'] }
      ]
    },
    {
      title: 'Behavioral Patterns',
      questions: [
        { id: 'daily_routine', text: 'I prefer my daily routine to be:', options: ['Flexible/Varied (Vata)', 'Organized/Structured (Pitta)', 'Steady/Consistent (Kapha)'] },
        { id: 'exercise_tolerance', text: 'My exercise preference is:', options: ['Light/Variable (Vata)', 'Moderate/Competitive (Pitta)', 'Slow/Steady (Kapha)'] },
        { id: 'weather_preference', text: 'I prefer weather that is:', options: ['Warm/Humid (Vata)', 'Cool/Dry (Pitta)', 'Warm/Dry (Kapha)'] },
        { id: 'sleep_pattern', text: 'My sleep is typically:', options: ['Light/Restless (Vata)', 'Moderate/Sound (Pitta)', 'Deep/Long (Kapha)'] },
        { id: 'spending_habits', text: 'With money, I tend to:', options: ['Spend impulsively (Vata)', 'Spend on quality items (Pitta)', 'Save and spend carefully (Kapha)'] }
      ]
    }
  ];

  const handleResponse = (questionId: string, optionIndex: number) => {
    setResponses({
      ...responses,
      [questionId]: optionIndex
    });
  };

  const calculatePrakriti = () => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    
    Object.values(responses).forEach(response => {
      if (response === 0) scores.vata++;
      else if (response === 1) scores.pitta++;
      else if (response === 2) scores.kapha++;
    });
    
    const total = scores.vata + scores.pitta + scores.kapha;
    const percentages = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100)
    };
    
    // Determine primary constitution
    let primaryDosha = 'vata';
    if (scores.pitta > scores.vata && scores.pitta > scores.kapha) {
      primaryDosha = 'pitta';
    } else if (scores.kapha > scores.vata && scores.kapha > scores.pitta) {
      primaryDosha = 'kapha';
    }
    
    return {
      scores,
      percentages,
      primaryDosha,
      constitution: `${primaryDosha.charAt(0).toUpperCase() + primaryDosha.slice(1)} dominant`
    };
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const prakritiResult = calculatePrakriti();
      
      const ayurvedicData = {
        responses,
        prakriti: prakritiResult,
        recommendations: generateRecommendations(prakritiResult.primaryDosha)
      };
      
      onNext(ayurvedicData);
    } catch (error) {
      console.error('Error processing Ayurvedic assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (primaryDosha: string) => {
    const recommendations = {
      vata: {
        diet: ['Warm, cooked foods', 'Sweet, sour, and salty tastes', 'Regular meal times'],
        lifestyle: ['Regular routine', 'Adequate rest', 'Gentle, grounding exercises'],
        herbs: ['Ashwagandha', 'Brahmi', 'Jatamansi']
      },
      pitta: {
        diet: ['Cool, fresh foods', 'Sweet, bitter, and astringent tastes', 'Avoid spicy foods'],
        lifestyle: ['Moderate activity', 'Cool environment', 'Stress management'],
        herbs: ['Amalaki', 'Shatavari', 'Brahmi']
      },
      kapha: {
        diet: ['Light, warm foods', 'Pungent, bitter, and astringent tastes', 'Smaller portions'],
        lifestyle: ['Regular exercise', 'Active lifestyle', 'Stimulating activities'],
        herbs: ['Trikatu', 'Guggulu', 'Punarnava']
      }
    };
    
    return recommendations[primaryDosha as keyof typeof recommendations];
  };

  const currentQuestions = sections[currentSection].questions;
  const sectionProgress = Object.keys(responses).filter(key => 
    currentQuestions.some(q => q.id === key)
  ).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">
          <i className="fas fa-leaf text-spiritual-sage"></i>
        </div>
        <h2 className="text-2xl font-bold text-3d mb-2">
          Ayurvedic Constitution Assessment
        </h2>
        <p className="text-cosmic-light/80">
          Discover your unique mind-body type through Prakriti analysis
        </p>
      </div>

      {/* Section progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-cosmic-light">
            {sections[currentSection].title}
          </h3>
          <span className="text-sm text-cosmic-light/60">
            {sectionProgress}/{currentQuestions.length} answered
          </span>
        </div>
        
        <div className="w-full bg-cosmic-light/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-spiritual-sage to-spiritual-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${(sectionProgress / currentQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="cosmic-card p-6">
            <h4 className="text-lg font-medium text-cosmic-light mb-4">
              {index + 1}. {question.text}
            </h4>
            
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    responses[question.id] === optionIndex
                      ? 'bg-spiritual-purple/30 border-spiritual-purple'
                      : 'bg-cosmic-deep/30 border-cosmic-light/20 hover:bg-cosmic-light/10'
                  } border`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={optionIndex}
                    checked={responses[question.id] === optionIndex}
                    onChange={() => handleResponse(question.id, optionIndex)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    responses[question.id] === optionIndex
                      ? 'border-spiritual-purple bg-spiritual-purple'
                      : 'border-cosmic-light/40'
                  }`}>
                    {responses[question.id] === optionIndex && (
                      <div className="w-2 h-2 rounded-full bg-cosmic-light"></div>
                    )}
                  </div>
                  <span className="text-cosmic-light">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-4 border border-cosmic-light/20 rounded-lg text-cosmic-light hover:bg-cosmic-light/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={sectionProgress < currentQuestions.length || loading}
          className="flex-1 cosmic-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Analyzing Constitution...
            </span>
          ) : currentSection === sections.length - 1 ? (
            'Complete Assessment'
          ) : (
            'Next Section'
          )}
        </button>
      </div>

      {/* Section indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSection
                ? 'bg-spiritual-gold'
                : index < currentSection
                ? 'bg-spiritual-sage'
                : 'bg-cosmic-light/20'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AyurvedicOnboarding;