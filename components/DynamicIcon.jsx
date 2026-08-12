'use client';

import React from 'react';
import { 
  GraduationCap, Briefcase, Code, Award, Cpu, Users, 
  Target, FileText, Compass, HeartHandshake, CheckCircle2, 
  ShieldCheck, Layers, Clock, Star, BookOpen, MapPin, 
  Phone, Mail, Sparkles, Send, Handshake, ShieldAlert, Cloud, Database
} from 'lucide-react';

const ICON_REGISTRY = {
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Cpu,
  Users,
  Target,
  FileText,
  Compass,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Clock,
  Star,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Send,
  Handshake,
  ShieldAlert,
  Cloud,
  Database
};

export default function DynamicIcon({ name, size = 22, className = 'icon-orange' }) {
  if (!name) {
    return <Award size={size} className={className} />;
  }

  // Normalize name by removing special chars or whitespace if any
  const normalizedKey = Object.keys(ICON_REGISTRY).find(
    (k) => k.toLowerCase() === String(name).replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  );

  const IconComponent = normalizedKey ? ICON_REGISTRY[normalizedKey] : Award;
  return <IconComponent size={size} className={className} />;
}
