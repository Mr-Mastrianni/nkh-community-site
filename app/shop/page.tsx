import StandardLayout from '@/components/StandardLayout';

export default function ShopPage() {
  return (
    <StandardLayout>
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-3d mb-6">
              Sacred Shop
            </h1>
            <p className="text-xl text-cosmic-light/80 max-w-3xl mx-auto">
              Discover carefully curated spiritual tools, healing crystals, and sacred items 
              to support your journey of transformation and awakening.
            </p>
          </div>

          {/* Featured Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-spiritual-gold mb-2">Crystals & Gems</h3>
              <p className="text-cosmic-light/70 text-sm">Healing stones and sacred crystals</p>
            </div>

            <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">📿</span>
              </div>
              <h3 className="text-xl font-bold text-spiritual-gold mb-2">Jewelry & Malas</h3>
              <p className="text-cosmic-light/70 text-sm">Sacred jewelry and prayer beads</p>
            </div>

            <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-spiritual-gold mb-2">Books & Guides</h3>
              <p className="text-cosmic-light/70 text-sm">Spiritual wisdom and teachings</p>
            </div>

            <div className="cosmic-card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                <span className="text-2xl">🕯️</span>
              </div>
              <h3 className="text-xl font-bold text-spiritual-gold mb-2">Ritual Items</h3>
              <p className="text-cosmic-light/70 text-sm">Candles, incense, and sacred tools</p>
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Featured Products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Crystal Set */}
              <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">💎</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-2">Chakra Crystal Set</h3>
                <p className="text-cosmic-light/80 text-sm mb-4">
                  Complete set of seven chakra stones for energy balancing and healing work.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-purple">$89</span>
                  <span className="text-cosmic-light/60 line-through">$120</span>
                </div>
                <button className="w-full cosmic-button">Add to Cart</button>
              </div>

              {/* Meditation Mala */}
              <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">📿</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-2">Rudraksha Meditation Mala</h3>
                <p className="text-cosmic-light/80 text-sm mb-4">
                  Traditional 108-bead mala made from sacred Rudraksha seeds for meditation.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-purple">$65</span>
                </div>
                <button className="w-full cosmic-button">Add to Cart</button>
              </div>

              {/* Oracle Cards */}
              <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🔮</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-2">Cosmic Wisdom Oracle Cards</h3>
                <p className="text-cosmic-light/80 text-sm mb-4">
                  44-card oracle deck with guidebook for divine guidance and insight.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-purple">$35</span>
                </div>
                <button className="w-full cosmic-button">Add to Cart</button>
              </div>

              {/* Sage Bundle */}
              <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🌿</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-2">White Sage Smudge Bundle</h3>
                <p className="text-cosmic-light/80 text-sm mb-4">
                  Ethically sourced white sage for cleansing and purification rituals.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-purple">$18</span>
                </div>
                <button className="w-full cosmic-button">Add to Cart</button>
              </div>

              {/* Essential Oil Set */}
              <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🌸</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-2">Sacred Essential Oil Set</h3>
                <p className="text-cosmic-light/80 text-sm mb-4">
                  Five pure essential oils for aromatherapy and spiritual practice.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-purple">$75</span>
                </div>
                <button className="w-full cosmic-button">Add to Cart</button>
              </div>

              {/* Singing Bowl */}
              <div className="cosmic-card group hover:scale-105 transition-transform duration-300">
                <div className="w-full h-48 bg-gradient-to-br from-spiritual-purple/20 to-spiritual-gold/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">🎵</span>
                </div>
                <h3 className="text-xl font-bold text-spiritual-gold mb-2">Tibetan Singing Bowl</h3>
                <p className="text-cosmic-light/80 text-sm mb-4">
                  Hand-crafted singing bowl with mallet for sound healing and meditation.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-spiritual-purple">$125</span>
                </div>
                <button className="w-full cosmic-button">Add to Cart</button>
              </div>
            </div>
          </div>

          {/* Special Offers */}
          <div className="cosmic-card mb-16">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-8 text-center">Special Offers</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-spiritual-gold/10 rounded-lg border border-spiritual-gold/30">
                <h3 className="text-2xl font-bold text-spiritual-purple mb-4">Beginner's Spiritual Kit</h3>
                <p className="text-cosmic-light/80 mb-4">
                  Everything you need to start your spiritual journey: crystal set, sage bundle, 
                  meditation guide, and oracle cards.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-spiritual-gold">$149</span>
                  <span className="text-cosmic-light/60 line-through text-lg">$200</span>
                </div>
                <button className="w-full cosmic-button">Get Started Kit</button>
              </div>

              <div className="p-6 bg-spiritual-purple/10 rounded-lg border border-spiritual-purple/30">
                <h3 className="text-2xl font-bold text-spiritual-gold mb-4">Advanced Practitioner Bundle</h3>
                <p className="text-cosmic-light/80 mb-4">
                  Professional-grade tools for experienced practitioners: premium crystals, 
                  singing bowl, essential oils, and sacred texts.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-spiritual-purple">$299</span>
                  <span className="text-cosmic-light/60 line-through text-lg">$400</span>
                </div>
                <button className="w-full cosmic-button">Get Bundle</button>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="cosmic-card mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-spiritual-gold mb-4">Stay Connected</h2>
              <p className="text-cosmic-light/80 mb-6">
                Subscribe to receive updates on new products, special offers, and spiritual insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold"
                />
                <button className="cosmic-button px-6">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Shopping Info */}
          <div className="cosmic-card text-center">
            <h2 className="text-3xl font-bold text-spiritual-gold mb-6">Sacred Shopping Experience</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-xl">🚚</span>
                </div>
                <h3 className="text-lg font-bold text-spiritual-purple mb-2">Free Shipping</h3>
                <p className="text-cosmic-light/70 text-sm">On orders over $75</p>
              </div>
              
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-spiritual-purple mb-2">Blessed Items</h3>
                <p className="text-cosmic-light/70 text-sm">All products energetically cleansed</p>
              </div>
              
              <div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-spiritual-purple to-spiritual-gold flex items-center justify-center">
                  <span className="text-xl">💝</span>
                </div>
                <h3 className="text-lg font-bold text-spiritual-purple mb-2">Gift Wrapping</h3>
                <p className="text-cosmic-light/70 text-sm">Beautiful sacred packaging available</p>
              </div>
            </div>
            
            <div className="text-cosmic-light/60">
              <p>Questions about our products? Contact us at shop@neferkali.com</p>
              <p className="mt-2">30-day return policy • Secure checkout • Worldwide shipping</p>
            </div>
          </div>
        </div>
      </main>
    </StandardLayout>
  );
}