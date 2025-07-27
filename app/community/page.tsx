import StandardLayout from '@/components/StandardLayout';

export default function CommunityPage() {
  return (
    <StandardLayout>
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-3d mb-6">
              Sacred Community
            </h1>
            <p className="text-xl text-cosmic-light/80 max-w-3xl mx-auto">
              Join a vibrant community of spiritual seekers, healers, and conscious souls 
              on a shared journey of awakening and transformation.
            </p>
          </div>

          {/* Community Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Discussion Forums */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Discussion Forums</h3>
              <p className="text-cosmic-light/80 mb-6">
                Connect with like-minded souls in our sacred discussion spaces. Share experiences, 
                ask questions, and support each other on your spiritual journeys.
              </p>
              <button className="w-full cosmic-button">Join Discussions</button>
            </div>

            {/* Monthly Circles */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Monthly Circles</h3>
              <p className="text-cosmic-light/80 mb-6">
                Participate in our monthly new moon and full moon circles. Experience group 
                meditation, energy healing, and collective intention setting.
              </p>
              <button className="w-full cosmic-button">View Schedule</button>
            </div>

            {/* Study Groups */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Study Groups</h3>
              <p className="text-cosmic-light/80 mb-6">
                Deepen your knowledge through collaborative study groups focusing on ancient 
                wisdom, spiritual texts, and consciousness expansion practices.
              </p>
              <button className="w-full cosmic-button">Join Study Group</button>
            </div>

            {/* Healing Exchanges */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Healing Exchanges</h3>
              <p className="text-cosmic-light/80 mb-6">
                Practice and receive healing through our community exchange program. Share 
                your gifts while receiving support from fellow practitioners.
              </p>
              <button className="w-full cosmic-button">Learn More</button>
            </div>

            {/* Mentorship Program */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Mentorship Program</h3>
              <p className="text-cosmic-light/80 mb-6">
                Connect with experienced practitioners as mentors or offer your wisdom to 
                newcomers. Foster growth through sacred relationships.
              </p>
              <button className="w-full cosmic-button">Apply Now</button>
            </div>

            {/* Events & Retreats */}
            <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🏔️</span>
              </div>
              <h3 className="text-2xl font-bold text-spiritual-gold mb-4 text-center">Events & Retreats</h3>
              <p className="text-cosmic-light/80 mb-6">
                Join us for transformative retreats, workshops, and special events designed 
                to accelerate your spiritual growth and community connection.
              </p>
              <button className="w-full cosmic-button">View Events</button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8">Upcoming Community Events</h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-cosmic-deep/30 rounded-lg border border-spiritual-gold/20">
                <div>
                  <h3 className="text-xl font-bold text-spiritual-purple mb-2">New Moon Manifestation Circle</h3>
                  <p className="text-cosmic-light/80 mb-2">Join us for a powerful new moon ceremony focused on setting intentions and manifesting your dreams.</p>
                  <p className="text-cosmic-light/60 text-sm">📅 July 28, 2025 • 🕐 7:00 PM EST • 📍 Online & In-Person</p>
                </div>
                <button className="cosmic-button mt-4 md:mt-0 md:ml-6">Register</button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-cosmic-deep/30 rounded-lg border border-spiritual-gold/20">
                <div>
                  <h3 className="text-xl font-bold text-spiritual-purple mb-2">Chakra Healing Workshop</h3>
                  <p className="text-cosmic-light/80 mb-2">Learn advanced chakra healing techniques and practice with fellow community members.</p>
                  <p className="text-cosmic-light/60 text-sm">📅 August 5, 2025 • 🕐 2:00 PM EST • 📍 Healing Center</p>
                </div>
                <button className="cosmic-button mt-4 md:mt-0 md:ml-6">Register</button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-cosmic-deep/30 rounded-lg border border-spiritual-gold/20">
                <div>
                  <h3 className="text-xl font-bold text-spiritual-purple mb-2">Sacred Geometry Study Group</h3>
                  <p className="text-cosmic-light/80 mb-2">Explore the mysteries of sacred geometry and its applications in spiritual practice.</p>
                  <p className="text-cosmic-light/60 text-sm">📅 August 12, 2025 • 🕐 6:00 PM EST • 📍 Online</p>
                </div>
                <button className="cosmic-button mt-4 md:mt-0 md:ml-6">Register</button>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Sacred Community Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-4">Our Sacred Agreements</h3>
                <ul className="space-y-3 text-cosmic-light/80">
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Honor the sacred nature of our shared space
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Practice compassionate communication
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Respect diverse spiritual paths and beliefs
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Maintain confidentiality of personal shares
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Support each other's growth and healing
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-4">Community Values</h3>
                <ul className="space-y-3 text-cosmic-light/80">
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Authenticity and genuine expression
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Mutual support and encouragement
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Continuous learning and growth
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Service to the collective awakening
                  </li>
                  <li className="flex items-start">
                    <span className="text-spiritual-gold mr-2">✦</span>
                    Celebration of our spiritual journey
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Join Community */}
          <div className="cosmic-card text-center">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Ready to Join Our Sacred Community?</h2>
            <p className="text-cosmic-light/80 text-lg mb-8 max-w-2xl mx-auto">
              Become part of a supportive spiritual family dedicated to growth, healing, and 
              conscious evolution. Your journey is sacred, and you don't have to walk it alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="cosmic-button px-8 py-3">Join Community</button>
              <button className="cosmic-button-outline px-8 py-3">Learn More</button>
            </div>
            <div className="text-cosmic-light/60">
              <p>Free membership includes access to forums and monthly newsletters</p>
              <p className="mt-2">Premium membership: $29/month for full access to all community features</p>
            </div>
          </div>
        </div>
      </main>
    </StandardLayout>
  );
}