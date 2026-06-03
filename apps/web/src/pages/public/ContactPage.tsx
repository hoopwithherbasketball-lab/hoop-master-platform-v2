import { Link } from 'react-router-dom'
import { PageShell, PageSection, CTABanner } from '@hoop-master/ui'

export default function ContactPage() {
  return (
    <PageShell title="Contact Elite GBB" description="Connect with our team for recruiting, NIL, and development planning." badge="Contact">
      <PageSection className="max-w-2xl mx-auto" title="Get in Touch">
        <div className="bg-navy-800 p-8 rounded-lg shadow-md border border-white/10">
          <p className="text-slate-400 mb-8 leading-relaxed">
            Have questions about services, workshops, or player development strategy? Our team is ready to provide tailored guidance.
          </p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input data-testid="contact-name-input" type="text" className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input data-testid="contact-email-input" type="email" className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" placeholder="Your email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea data-testid="contact-message-input" rows={4} className="w-full p-2 border border-white/20 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" placeholder="How can we help?" />
            </div>
            <button data-testid="contact-send-message-button" className="bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-6 rounded-md font-semibold transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </PageSection>

      <CTABanner
        title="Need Help Selecting the Right Path?"
        description="Review service packages and workshops designed for athletes targeting competitive recruiting outcomes."
        actions={[
          { label: 'View our services', href: '/services', testId: 'contact-view-services-link' },
          { label: 'View workshops', href: '/workshops', variant: 'secondary', testId: 'contact-view-workshops-link' },
        ]}
        LinkComponent={Link}
      />
    </PageShell>
  )
}
