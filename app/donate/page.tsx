import StandardLayout from '@/components/StandardLayout';

export default function DonatePage() {
  return (
    <StandardLayout>
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-3d mb-6">
              Support Sacred Work
            </h1>
            <p className="text-xl text-cosmic-light/80 max-w-3xl mx-auto">
              Your generous contribution helps us continue our mission of healing, 
              spiritual education, and creating a more conscious world for all beings.
            </p>
          </div>

          {/* Impact Section */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Your Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Free Healing Sessions</h3>
                <p className="text-cosmic-light/80">
                  Your donations help us provide free healing sessions to those who cannot afford them, 
                  ensuring everyone has access to spiritual healing.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Educational Resources</h3>
                <p className="text-cosmic-light/80">
                  Support the creation of free spiritual education content, workshops, and resources 
                  that help seekers on their journey of awakening.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Global Outreach</h3>
                <p className="text-cosmic-light/80">
                  Help us expand our reach to serve communities worldwide, bringing healing and 
                  spiritual wisdom to those who need it most.
                </p>
              </div>
            </div>
          </div>

          {/* Donation Options */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Ways to Give</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* One-time Donations */}
              <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-4">One-Time Gift</h3>
                <div className="space-y-3 mb-6">
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-gold/30 rounded-lg text-cosmic-light hover:bg-spiritual-gold/20 transition-colors">
                    $25
                  </button>
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-gold/30 rounded-lg text-cosmic-light hover:bg-spiritual-gold/20 transition-colors">
                    $50
                  </button>
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-gold/30 rounded-lg text-cosmic-light hover:bg-spiritual-gold/20 transition-colors">
                    $100
                  </button>
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-gold/30 rounded-lg text-cosmic-light hover:bg-spiritual-gold/20 transition-colors">
                    Custom Amount
                  </button>
                </div>
              </div>

              {/* Monthly Giving */}
              <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300 border-2 border-spiritual-gold">
                <div className="text-sm text-spiritual-gold font-bold mb-2">MOST IMPACTFUL</div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-4">Monthly Giving</h3>
                <div className="space-y-3 mb-6">
                  <button className="w-full p-3 bg-spiritual-gold/20 border border-spiritual-gold/50 rounded-lg text-cosmic-light hover:bg-spiritual-gold/30 transition-colors">
                    $15/month
                  </button>
                  <button className="w-full p-3 bg-spiritual-gold/20 border border-spiritual-gold/50 rounded-lg text-cosmic-light hover:bg-spiritual-gold/30 transition-colors">
                    $30/month
                  </button>
                  <button className="w-full p-3 bg-spiritual-gold/20 border border-spiritual-gold/50 rounded-lg text-cosmic-light hover:bg-spiritual-gold/30 transition-colors">
                    $50/month
                  </button>
                  <button className="w-full p-3 bg-spiritual-gold/20 border border-spiritual-gold/50 rounded-lg text-cosmic-light hover:bg-spiritual-gold/30 transition-colors">
                    Custom Amount
                  </button>
                </div>
              </div>

              {/* Sponsor a Session */}
              <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🤲</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-4">Sponsor a Session</h3>
                <div className="space-y-3 mb-6">
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-purple/30 rounded-lg text-cosmic-light hover:bg-spiritual-purple/20 transition-colors">
                    Reiki Session - $120
                  </button>
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-purple/30 rounded-lg text-cosmic-light hover:bg-spiritual-purple/20 transition-colors">
                    Astrology Reading - $150
                  </button>
                  <button className="w-full p-3 bg-cosmic-deep/30 border border-spiritual-purple/30 rounded-lg text-cosmic-light hover:bg-spiritual-purple/20 transition-colors">
                    Mentoring Session - $100
                  </button>
                </div>
              </div>

              {/* Memorial Gifts */}
              <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🕊️</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-4">Memorial & Honor Gifts</h3>
                <p className="text-cosmic-light/80 text-sm mb-6">
                  Make a donation in memory of a loved one or to honor someone special in your life.
                </p>
                <button className="w-full cosmic-button">Make Memorial Gift</button>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Make Your Donation</h2>
            <div className="max-w-2xl mx-auto">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cosmic-light mb-2">
                      Donation Type
                    </label>
                    <select className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold">
                      <option>One-time donation</option>
                      <option>Monthly recurring</option>
                      <option>Sponsor a session</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cosmic-light mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cosmic-light mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cosmic-light mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-light mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cosmic-light mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share why you're supporting our mission..."
                    className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="h-4 w-4 text-spiritual-purple focus:ring-spiritual-purple border-cosmic-light/30 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-cosmic-light">
                    Make this donation anonymous
                  </label>
                </div>

                <button type="submit" className="w-full cosmic-button py-4 text-lg">
                  Complete Donation
                </button>
              </form>
            </div>
          </div>

          {/* Other Ways to Help */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Other Ways to Support</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">📢</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Spread the Word</h3>
                <p className="text-cosmic-light/80 mb-4">
                  Share our mission with friends and family. Follow us on social media and 
                  help us reach more souls seeking healing and growth.
                </p>
                <button className="cosmic-button-outline">Share Our Mission</button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Volunteer</h3>
                <p className="text-cosmic-light/80 mb-4">
                  Offer your time and skills to support our community events, workshops, 
                  and outreach programs. Every contribution matters.
                </p>
                <button className="cosmic-button-outline">Learn About Volunteering</button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-purple mb-3">Shop with Purpose</h3>
                <p className="text-cosmic-light/80 mb-4">
                  Purchase from our sacred shop. A portion of all proceeds supports our 
                  free healing programs and community outreach.
                </p>
                <button className="cosmic-button-outline">Visit Shop</button>
              </div>
            </div>
          </div>

          {/* Transparency */}
          <div className="cosmic-card text-center">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Our Commitment to Transparency</h2>
            <p className="text-cosmic-light/80 text-lg mb-8 max-w-3xl mx-auto">
              We believe in complete transparency about how your donations are used. Every contribution 
              directly supports our mission of healing, education, and spiritual service.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-spiritual-gold mb-2">70%</div>
                <p className="text-cosmic-light/80">Direct program services and free healing sessions</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-spiritual-purple mb-2">20%</div>
                <p className="text-cosmic-light/80">Educational resources and community outreach</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-spiritual-gold mb-2">10%</div>
                <p className="text-cosmic-light/80">Administrative costs and platform maintenance</p>
              </div>
            </div>
            <div className="text-cosmic-light/60">
              <p>All donations are tax-deductible. You will receive a receipt for your records.</p>
              <p className="mt-2">Questions about donations? Contact us at donate@neferkali.com</p>
            </div>
          </div>
        </div>
      </main>
    </StandardLayout>
  );
}