const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const QuoteRequest = require('../models/QuoteRequest');
const ContactMessage = require('../models/ContactMessage');

dotenv.config();

const sampleServices = [
  {
    title: 'Structural Steel Fabrication',
    description: 'Custom structural steel columns, beams, trusses, and girders built to exact engineering specifications for commercial, industrial, and infrastructure projects.',
    icon: 'Grid',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    order: 1
  },
  {
    title: 'Precision CNC Cutting',
    description: 'High-speed, high-precision CNC laser, plasma, and waterjet cutting for steel plates, sheets, and complex shapes with minimal tolerances.',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    order: 2
  },
  {
    title: 'Industrial Welding & Assembly',
    description: 'Certified MIG, TIG, and stick welding for carbon steel, stainless steel, and aluminum. Expert assembly services for heavy machinery, frames, and custom enclosures.',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    order: 3
  },
  {
    title: 'Custom Metal Work',
    description: 'Tailored architectural metal designs, including custom metal stairs, railings, commercial signage, furniture, and unique structural design concepts.',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    order: 4
  }
];

const sampleProjects = [
  {
    title: 'Metro Warehouse Structural Skeleton',
    category: 'Industrial',
    description: 'Fabrication and supply of over 50 tons of structural steel columns, roof trusses, and safety bracing for a 50,000 sq ft logistics warehouse facility.',
    client: 'LogiTrans Global',
    completedDate: new Date('2026-03-15'),
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'
    ]
  },
  {
    title: 'Downtown Plaza Custom Spiral Staircase',
    category: 'Commercial',
    description: 'Architectural design and fabrication of a double-helix structural steel staircase with glass tread mounts, finished with premium dark charcoal powder coating.',
    client: 'Apex Properties LLC',
    completedDate: new Date('2026-05-20'),
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ]
  },
  {
    title: 'CNC Precision Brackets for Auto Assembly',
    category: 'Custom',
    description: 'High-volume production run of 15,000 custom laser-cut and CNC-bent mounting brackets made of high-tensile galvanized steel.',
    client: 'VeloMotors Group',
    completedDate: new Date('2026-06-10'),
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
    ]
  },
  {
    title: 'Custom Modern Residential Steel Gates',
    category: 'Residential',
    description: 'Bespoke driveways gates crafted from laser-cut architectural steel panels, featuring custom geometric cutouts, corrosion-resistant primer, and powder coating.',
    client: 'Private Residence (Bel Air)',
    completedDate: new Date('2026-07-02'),
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800'
    ]
  }
];

const sampleTestimonials = [
  {
    clientName: 'Robert Vance',
    company: 'Vance Industrial Corp',
    message: 'The structural integrity and weld quality of the custom machinery frames they fabricated for us were outstanding. Delivered on time and perfectly matched our blueprint files.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    clientName: 'Helena Carter',
    company: 'Apex Design Architects',
    message: 'Their design team translated our complex spiral staircase concept into reality with precision. They are our go-to partner for architectural metal work in all commercial projects.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fab-company';
    console.log(`Seeding DB: ${mongoUri}`);

    await mongoose.connect(mongoUri);
    console.log('Connected to database...');

    // Clear all existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Service.deleteMany();
    await Testimonial.deleteMany();
    await QuoteRequest.deleteMany();
    await ContactMessage.deleteMany();
    console.log('Cleared existing data...');

    // Seed default admin
    const adminUser = await User.create({
      name: 'Site Administrator',
      email: 'admin@fabsteel.com',
      password: 'admin123', // Will be hashed via User pre-save hook
      role: 'admin'
    });
    console.log(`Seeded admin user: ${adminUser.email} / password: admin123`);

    // Seed Services
    await Service.insertMany(sampleServices);
    console.log(`Seeded ${sampleServices.length} services...`);

    // Seed Projects
    await Project.insertMany(sampleProjects);
    console.log(`Seeded ${sampleProjects.length} projects...`);

    // Seed Testimonials
    await Testimonial.insertMany(sampleTestimonials);
    console.log(`Seeded ${sampleTestimonials.length} testimonials...`);

    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error.message);
    process.exit(1);
  }
};

seedDB();
