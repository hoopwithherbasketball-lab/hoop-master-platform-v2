import { Link } from 'react-router-dom'
import PageShell from '../../components/ui/PageShell'

export default function ContactPage() {
  return (
    <PageShell title="Contact Us" description="Get in touch with the Elite GBB team." badge="Contact">
      <section className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#121B47] mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our services, workshops, or recruiting platform? We'd love to hear from you.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" placeholder="Your email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0134BD] focus:border-[#0134BD]" placeholder="How can we help?" />
            </div>
            <button className="bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-6 rounded-md font-semibold transition-colors">
              Send Message
            </button>
          </div>
        </div>
        <div className="text-center">
          <Link to="/services" className="text-[#0134BD] hover:text-[#FB6C1D] font-semibold transition-colors">
            View our services →
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
