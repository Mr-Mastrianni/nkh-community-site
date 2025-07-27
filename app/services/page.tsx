import StandardLayout from '@/components/StandardLayout';

export default function ServicesPage() {
  return (
    <StandardLayout>
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-3d mb-6">
              Healing & Spiritual Services
            </h1>
            <p className="text-xl text-cosmic-light/80 max-w-3xl mx-auto">
              Transform your life through personalized healing sessions, spiritual guidance, 
              and consciousness expansion practices tailored to your unique journey.
            </p>
          </div>

          {/* Featured Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Reiki Healing */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Reiki Healing</h3>
              <p className="text-cosmic-light/80 mb-4">
                Experience deep healing through universal life force energy. Our Reiki sessions 
                help balance your chakras, release energetic blockages, and promote natural healing.
              </p>
              <ul className="text-sm text-cosmic-light/70 mb-6 space-y-1">
                <li>• 60-minute session: $120</li>
                <li>• 90-minute session: $180</li>
                <li>• Distance healing available</li>
              </ul>
              <button className="w-full cosmic-button">Book Session</button>
            </div>

            {/* Vedic Astrology */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Vedic Astrology Reading</h3>
              <p className="text-cosmic-light/80 mb-4">
                Discover your cosmic blueprint through ancient Vedic astrology. Gain insights 
                into your life purpose, relationships, career, and spiritual path.
              </p>
              <ul className="text-sm text-cosmic-light/70 mb-6 space-y-1">
                <li>• Birth chart reading: $150</li>
                <li>• Relationship compatibility: $200</li>
                <li>• Career guidance: $120</li>
              </ul>
              <button className="w-full cosmic-button">Book Reading</button>
            </div>

            {/* Chakra Balancing */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Chakra Balancing</h3>
              <p className="text-cosmic-light/80 mb-4">
                Restore harmony to your energy centers through specialized chakra healing 
                techniques, crystal therapy, and guided meditation.
              </p>
              <ul className="text-sm text-cosmic-light/70 mb-6 space-y-1">
                <li>• Full chakra assessment: $100</li>
                <li>• Balancing session: $140</li>
                <li>• Crystal healing add-on: $30</li>
              </ul>
              <button className="w-full cosmic-button">Book Session</button>
            </div>

            {/* Spiritual Mentoring */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Spiritual Mentoring</h3>
              <p className="text-cosmic-light/80 mb-4">
                Receive personalized guidance on your spiritual journey through one-on-one 
                mentoring sessions focused on consciousness expansion and inner wisdom.
              </p>
              <ul className="text-sm text-cosmic-light/70 mb-6 space-y-1">
                <li>• Single session: $100</li>
                <li>• 3-month program: $1,200</li>
                <li>• 6-month program: $2,200</li>
              </ul>
              <button className="w-full cosmic-button">Learn More</button>
            </div>

            {/* Crystal Healing */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Crystal Healing</h3>
              <p className="text-cosmic-light/80 mb-4">
                Harness the vibrational power of crystals to promote healing, protection, 
                and spiritual growth through personalized crystal therapy sessions.
              </p>
              <ul className="text-sm text-cosmic-light/70 mb-6 space-y-1">
                <li>• Crystal layout session: $90</li>
                <li>• Personal crystal selection: $60</li>
                <li>• Crystal grid creation: $120</li>
              </ul>
              <button className="w-full cosmic-button">Book Session</button>
            </div>

            {/* Group Workshops */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Group Workshops</h3>
              <p className="text-cosmic-light/80 mb-4">
                Join like-minded souls in transformative group experiences including meditation 
                circles, healing workshops, and spiritual education classes.
              </p>
              <ul className="text-sm text-cosmic-light/70 mb-6 space-y-1">
                <li>• Monthly meditation circle: $25</li>
                <li>• Weekend workshops: $150</li>
                <li>• Online classes: $40</li>
              </ul>
              <button className="w-full cosmic-button">View Schedule</button>
            </div>
          </div>

          {/* Service Packages */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Healing Packages</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-spiritual-gold/30 rounded-lg">
                <h3 className="text-2xl font-bold text-spiritual-purple mb-4">Awakening Package</h3>
                <div className="text-3xl font-bold text-spiritual-gold mb-4">$350</div>
                <ul className="text-cosmic-light/80 space-y-2 mb-6">
                  <li>• Initial consultation</li>
                  <li>• Reiki healing session</li>
                  <li>• Chakra assessment</li>
                  <li>• Personal crystal selection</li>
                </ul>
                <button className="cosmic-button w-full">Choose Package</button>
              </div>

              <div className="text-center p-6 border-2 border-spiritual-gold rounded-lg bg-spiritual-gold/10">
                <div className="text-sm text-spiritual-gold font-bold mb-2">MOST POPULAR</div>
                <h3 className="text-2xl font-bold text-spiritual-purple mb-4">Transformation Package</h3>
                <div className="text-3xl font-bold text-spiritual-gold mb-4">$650</div>
                <ul className="text-cosmic-light/80 space-y-2 mb-6">
                  <li>• Everything in Awakening</li>
                  <li>• Vedic astrology reading</li>
                  <li>• 3 follow-up sessions</li>
                  <li>• Personalized meditation</li>
                  <li>• Email support for 30 days</li>
                </ul>
                <button className="cosmic-button w-full">Choose Package</button>
              </div>

              <div className="text-center p-6 border border-spiritual-gold/30 rounded-lg">
                <h3 className="text-2xl font-bold text-spiritual-purple mb-4">Mastery Package</h3>
                <div className="text-3xl font-bold text-spiritual-gold mb-4">$1,200</div>
                <ul className="text-cosmic-light/80 space-y-2 mb-6">
                  <li>• Everything in Transformation</li>
                  <li>• 6 months of mentoring</li>
                  <li>• Monthly group sessions</li>
                  <li>• Advanced healing techniques</li>
                  <li>• Ongoing spiritual guidance</li>
                </ul>
                <button className="cosmic-button w-full">Choose Package</button>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="cosmic-card text-center">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-cosmic-light/80 text-lg mb-8 max-w-2xl mx-auto">
              Take the first step towards healing and spiritual awakening. Book your consultation 
              today and discover the transformative power of cosmic healing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cosmic-button px-8 py-3">Schedule Consultation</button>
              <button className="cosmic-button-outline px-8 py-3">Contact Us</button>
            </div>
            <div className="mt-8 text-cosmic-light/60">
              <p>📧 info@neferkali.com | 📞 (555) 123-4567</p>
              <p className="mt-2">Sessions available in-person and online</p>
            </div>
          </div>
        </div>
      </main>
    </StandardLayout>
  );
}