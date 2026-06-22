import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Instagram } from 'lucide-react';

export default function AcademicPathwaySelector() {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Select Academic Pathway</h2>
        <p className="text-slate-600 mt-2">Choose the educational foundation that best supports your athlete's D1 goals.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* VIRTUAL PATHWAY CARD */}
        <Card className={`border-2 transition-all ${selectedPathway === 'virtual' ? 'border-orange-500 shadow-lg' : 'border-slate-200'}`}>
          <CardHeader>
            <Badge className="w-fit mb-2 bg-blue-900 text-white">Fully Immersive</Badge>
            <CardTitle className="text-2xl">Virtual / Homeschool</CardTitle>
            <p className="text-sm text-slate-500">Maximum flexibility for daytime training blocks.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-slate-800">Provided Resources:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Download size={16} className="text-orange-500"/> NC DNPE Registration Guide</li>
              <li className="flex items-center gap-2"><Download size={16} className="text-orange-500"/> NCAA Homeschool Transcript Template</li>
              <li className="flex items-center gap-2"><Download size={16} className="text-orange-500"/> Cognia Partner Enrollment Links</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              onClick={() => setSelectedPathway('virtual')}
            >
              Select Virtual Pathway
            </Button>
          </CardFooter>
        </Card>

        {/* HYBRID PATHWAY CARD */}
        <Card className={`border-2 transition-all ${selectedPathway === 'hybrid' ? 'border-orange-500 shadow-lg' : 'border-slate-200'}`}>
          <CardHeader>
            <Badge className="w-fit mb-2 bg-orange-500 text-white">Academy-Exclusive</Badge>
            <CardTitle className="text-2xl">Traditional High School</CardTitle>
            <p className="text-sm text-slate-500">Stay enrolled locally, play exclusively for HOOP WITH HER.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-slate-800">Provided Resources:</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Download size={16} className="text-blue-900"/> Exclusivity Agreement Overview</li>
              <li className="flex items-center gap-2"><Download size={16} className="text-blue-900"/> Local Counselor NCAA Alignment Sheet</li>
              <li className="flex items-center gap-2"><Download size={16} className="text-blue-900"/> Commuter Training Block Schedule</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              onClick={() => setSelectedPathway('hybrid')}
            >
              Select Hybrid Pathway
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* SUPPORT FOOTER */}
      <div className="mt-8 bg-slate-50 p-6 rounded-lg text-center border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-2">Need help deciding the best route for your athlete?</h4>
        <p className="text-slate-600 text-sm mb-4">Our coaching staff can review your current transcripts and help map out the optimal strategy.</p>
        <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" onClick={() => window.open('https://instagram.com/hoopwithher', '_blank')}>
          <Instagram className="mr-2" size={18} /> Direct Message Us on Instagram
        </Button>
      </div>
    </div>
  );
}
