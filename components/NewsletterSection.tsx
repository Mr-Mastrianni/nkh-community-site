'use client';

import { useState } from 'react';

const NewsletterSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subscribed: false
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Email is required'
      });
      return;
    }

    // Check if user agreed to subscribe
    if (!formData.subscribed) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please check the subscription checkbox to continue'
      });
      return;
    }
    
    setIsSubmitting(true);
    setFormStatus({ submitted: false, success: false, message: '' });
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          message: data.message || 'Thank you for subscribing to our newsletter! 🌟'
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subscribed: false
        });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: data.error || 'Failed to subscribe. Please try again.'
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 cosmic-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-3d">
            Subscribe to our newsletter
          </h2>
          
          <p className="text-lg mb-8 text-cosmic-light/90">
            Stay connected with cosmic insights, healing wisdom, and community updates
          </p>
          
          {formStatus.submitted && (
            <div className={`mb-6 p-4 rounded-lg ${formStatus.success ? 'bg-spiritual-sage/20' : 'bg-red-500/20'}`}>
              {formStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors"
                />
              </div>
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full p-3 rounded-lg bg-cosmic-deep/50 border border-cosmic-light/20 text-cosmic-light focus:outline-none focus:border-spiritual-gold transition-colors"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="subscribed"
                id="subscribed"
                checked={formData.subscribed}
                onChange={handleChange}
                className="h-5 w-5 text-spiritual-purple focus:ring-spiritual-purple border-cosmic-light/30 rounded"
              />
              <label htmlFor="subscribed" className="ml-2 text-cosmic-light">
                Yes, subscribe me to your newsletter
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`cosmic-button flex items-center justify-center mx-auto ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <i className="fas fa-paper-plane ml-2"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;