import StandardLayout from '@/components/StandardLayout';

export default function AboutPage() {
  return (
    <StandardLayout>
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-3d mb-6">
              About Nefer Kali Healing
            </h1>
            <p className="text-xl text-cosmic-light/80 max-w-3xl mx-auto">
              Embark on a transformative journey of spiritual awakening and cosmic healing 
              through ancient wisdom and modern practices.
            </p>
          </div>

          {/* Mission Section */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Our Mission</h2>
            <p className="text-cosmic-light/90 text-lg leading-relaxed mb-6">
              At Nefer Kali Healing, we bridge the ancient wisdom of spiritual traditions 
              with contemporary healing modalities to guide souls on their path to 
              enlightenment and wholeness.
            </p>
            <p className="text-cosmic-light/90 text-lg leading-relaxed">
              Our mission is to create a sacred space where individuals can explore their 
              cosmic connection, heal from within, and awaken to their highest potential 
              through personalized spiritual education and transformative healing experiences.
            </p>
          </div>

          {/* Founder Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="cosmic-card">
              <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Meet the Founder</h2>
              <p className="text-cosmic-light/90 text-lg leading-relaxed mb-4">
                Nefer Kali is a dedicated spiritual teacher and healer with over two decades 
                of experience in ancient wisdom traditions, energy healing, and consciousness 
                expansion.
              </p>
              <p className="text-cosmic-light/90 text-lg leading-relaxed mb-4">
                Drawing from Egyptian mysteries, Vedic astrology, chakra healing, and modern 
                quantum consciousness principles, Nefer Kali offers a unique approach to 
                spiritual growth and healing.
              </p>
              <p className="text-cosmic-light/90 text-lg leading-relaxed">
                Her work focuses on helping individuals reconnect with their cosmic essence 
                and unlock their innate healing abilities through personalized guidance and 
                transformative practices.
              </p>
            </div>
            
            <div className="cosmic-card">
              <h3 className="text-2xl font-bold text-spiritual-purple mb-4">Certifications & Training</h3>
              <ul className="space-y-3 text-cosmic-light/90">
                <li className="flex items-start">
                  <span className="text-spiritual-gold mr-2">✦</span>
                  Certified Reiki Master Teacher
                </li>
                <li className="flex items-start">
                  <span className="text-spiritual-gold mr-2">✦</span>
                  Advanced Vedic Astrology Practitioner
                </li>
                <li className="flex items-start">
                  <span className="text-spiritual-gold mr-2">✦</span>
                  Egyptian Mystery School Initiate
                </li>
                <li className="flex items-start">
                  <span className="text-spiritual-gold mr-2">✦</span>
                  Chakra Healing Specialist
                </li>
                <li className="flex items-start">
                  <span className="text-spiritual-gold mr-2">✦</span>
                  Quantum Consciousness Facilitator
                </li>
                <li className="flex items-start">
                  <span className="text-spiritual-gold mr-2">✦</span>
                  Crystal Healing Practitioner
                </li>
              </ul>
            </div>
          </div>

          {/* Approach Section */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Our Approach</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Holistic Healing</h3>
                <p className="text-cosmic-light/80">
                  Addressing mind, body, and spirit through integrated healing modalities 
                  that honor the whole person.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🔮</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Ancient Wisdom</h3>
                <p className="text-cosmic-light/80">
                  Drawing from time-tested spiritual traditions and mystery school 
                  teachings to guide modern seekers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Personal Growth</h3>
                <p className="text-cosmic-light/80">
                  Empowering individuals to discover their unique path and unlock 
                  their highest potential through personalized guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="cosmic-card">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Our Core Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Authenticity</h3>
                <p className="text-cosmic-light/80 mb-6">
                  We honor the authentic self and encourage genuine spiritual expression 
                  without judgment or dogma.
                </p>
                
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Compassion</h3>
                <p className="text-cosmic-light/80">
                  Every interaction is guided by deep compassion and understanding for 
                  each individual's unique journey.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Empowerment</h3>
                <p className="text-cosmic-light/80 mb-6">
                  We believe in empowering individuals to become their own healers and 
                  spiritual guides through education and practice.
                </p>
                
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Sacred Service</h3>
                <p className="text-cosmic-light/80">
                  Our work is a sacred service to the collective awakening and healing 
                  of humanity and our planet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StandardLayout>
  );
}