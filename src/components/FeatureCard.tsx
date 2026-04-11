import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, type MouseEvent } from "react";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  UserPlus, 
  ChevronRight, 
  Headphones,
  ShieldCheck,
  Globe
} from "lucide-react";

interface FeatureCardProps {
  icon: any;
  title: string;
  urduTitle: string;
  description: string;
  detailedDescription: string;
  delay?: number;
  category?: string;
  key?: string | number;
  onRequestAccess?: (title: string) => void;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  urduTitle, 
  description, 
  detailedDescription,
  delay = 0,
  category = "Core Module",
  onRequestAccess
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showAccessForm, setShowAccessForm] = useState(false);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <Dialog onOpenChange={(open) => {
      if (!open) {
        setShowContactOptions(false);
        setShowAccessForm(false);
      }
    }}>
      <DialogTrigger
        nativeButton={false}
        render={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="cursor-pointer group perspective-1000"
          >
            <Card className="h-full border border-slate-200/60 shadow-none hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm overflow-hidden relative group-hover:border-indigo-500/30">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{ transform: "translateZ(20px)" }}
              />
              <CardContent className="p-8 flex flex-col h-full relative z-10" style={{ transform: "translateZ(50px)" }}>
                <div className="mb-6 flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-sans font-semibold px-3 py-1">
                    {category}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 font-sans mb-1 group-hover:text-indigo-600 transition-colors tracking-tight">{title}</h3>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-400 font-urdu opacity-80" dir="rtl">{urduTitle}</span>
                  </div>
                </div>
                
                <p className="text-slate-500 leading-relaxed mb-8 flex-grow font-sans text-sm font-medium">
                  {description}
                </p>
                
                <div className="flex items-center text-indigo-600 font-bold text-sm font-sans group-hover:gap-3 transition-all">
                  Explore Intelligence
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        }
      />
      
      <DialogContent className="sm:max-w-[750px] font-sans rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <div className="p-10">
          <DialogHeader>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter">{title}</DialogTitle>
                <p className="text-xl font-urdu text-indigo-600 font-bold mt-1" dir="rtl">{urduTitle}</p>
              </div>
            </div>
            <DialogDescription className="text-slate-600 text-lg leading-relaxed font-medium">
              {detailedDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Capabilities</h4>
              <ul className="space-y-3">
                {["Neural Sync Engine", "Automated Logic Workflows", "Bilingual Cognitive Interface", "Predictive Performance Analytics"].map((item, index) => (
                  <li key={`cap-${index}`} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Integration Level</h4>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-indigo-600" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Grade</p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">95% Ready</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => setShowContactOptions(!showContactOptions)}
                  variant="outline" 
                  className="h-14 rounded-2xl font-bold border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all gap-2"
                >
                  <Headphones className="w-5 h-5" />
                  Contact
                </Button>
                <Button 
                  onClick={() => onRequestAccess?.(title)}
                  className="h-14 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Request Access
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showContactOptions && (
              <motion.div
                key="contact-options"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="p-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 grid grid-cols-3 gap-4">
                  <a 
                    href="https://wa.me/923005863032" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">WhatsApp</span>
                  </a>
                  <a 
                    href="tel:03005863032" 
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Phone className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Phone</span>
                  </a>
                  <a 
                    href="mailto:imtiazai004@gmail.com" 
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Email</span>
                  </a>
                </div>
              </motion.div>
            )}

            {showAccessForm && (
              <motion.div
                key="access-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
                  <h4 className="text-xl font-black tracking-tighter mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    Secure Module Provisioning
                  </h4>
                  <p className="text-slate-400 text-sm font-medium mb-6">
                    Request immediate access to the {title} module. Our security team will verify your institutional credentials.
                  </p>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Institutional ID" 
                      className="flex-grow h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <Button 
                      onClick={() => onRequestAccess?.(title)}
                      className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-6"
                    >
                      Submit Request
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Deployment Ready</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">PakEducate Pro v4.0</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}



