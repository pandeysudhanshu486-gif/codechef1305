import Event from '../models/Event.js';
import Admin from '../models/Admin.js';
import Registration from '../models/Registration.js';

export const seedInitialData = async () => {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('[Seed] Seeding default admin account...');
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      console.log('[Seed] Admin account created: admin / admin123');
    }

    // 2. Seed Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('[Seed] Seeding initial campus events...');
      const createdEvents = await Event.create([
        {
          title: 'HackSphere 2026: Annual College Hackathon',
          description: 'A 24-hour campus hackathon organized by the Coding & Developer Club. Build projects across Web, AI, and Mobile tracks with peer teams and senior mentors.',
          category: 'Competition',
          date: '2026-10-15',
          time: '09:00 AM - 09:00 PM',
          venue: 'Computer Science Innovation Lab, Block A',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
          capacity: 150,
          registeredCount: 3,
          isFeatured: true,
          status: 'Upcoming'
        },
        {
          title: 'Modern Web Development & Cloud Workshop',
          description: 'Hands-on bootcamp covering React, Express API design, and containerized cloud deployments for college students. Bring your laptop.',
          category: 'Workshop',
          date: '2026-10-08',
          time: '02:00 PM - 05:00 PM',
          venue: 'Seminar Hall 2, CS Department',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          capacity: 100,
          registeredCount: 2,
          isFeatured: false,
          status: 'Upcoming'
        },
        {
          title: 'Algorithmic Arena: Inter-Branch Coding Contest',
          description: 'Competitive programming contest with algorithmic challenges in C++, Java, and Python. Open to all students across all engineering branches.',
          category: 'Technical',
          date: '2026-10-12',
          time: '04:00 PM - 06:30 PM',
          venue: 'Computing Center Lab 3',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
          capacity: 120,
          registeredCount: 1,
          isFeatured: false,
          status: 'Upcoming'
        },
        {
          title: 'Tarang: Annual College Cultural & Arts Night',
          description: 'An evening of live acoustic music, drama performances, and dance showcases presented by student clubs in the open amphitheater.',
          category: 'Cultural',
          date: '2026-10-20',
          time: '05:30 PM - 09:30 PM',
          venue: 'Campus Open Air Amphitheater',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
          capacity: 400,
          registeredCount: 0,
          isFeatured: false,
          status: 'Upcoming'
        },
        {
          title: 'Inter-Department E-Sports & Gaming Tournament',
          description: '5v5 tactical gaming showdown organized by the College Sports Council. Join with your branch squad for the campus trophy.',
          category: 'Sports',
          date: '2026-10-25',
          time: '11:00 AM - 05:00 PM',
          venue: 'Student Activity Center, 2nd Floor',
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
          capacity: 64,
          registeredCount: 0,
          isFeatured: false,
          status: 'Upcoming'
        },
        {
          title: 'Campus Startup Ideation & Pitch Session',
          description: 'Learn how to validate startup ideas, create a problem pitch, and connect with faculty coordinators and student founders at the E-Cell.',
          category: 'Workshop',
          date: '2026-10-28',
          time: '01:30 PM - 04:30 PM',
          venue: 'Executive Seminar Room, Block 1',
          image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop',
          capacity: 80,
          registeredCount: 0,
          isFeatured: false,
          status: 'Upcoming'
        }
      ]);

      // Seed initial sample registrations
      const firstEvent = createdEvents[0];
      const secondEvent = createdEvents[1];

      await Registration.create([
        {
          eventId: firstEvent._id,
          ticketId: 'CS-847291',
          name: 'Sarah Jenkins',
          email: 'sarah.j@tech.edu',
          college: 'Institute of Engineering',
          year: '3rd Year',
          phone: '+1 (555) 234-5678'
        },
        {
          eventId: firstEvent._id,
          ticketId: 'CS-192837',
          name: 'David Chen',
          email: 'david.c@cs.edu',
          college: 'City Tech University',
          year: '2nd Year',
          phone: '+1 (555) 345-6789'
        },
        {
          eventId: firstEvent._id,
          ticketId: 'CS-482019',
          name: 'Priya Sharma',
          email: 'priya.s@eng.edu',
          college: 'National Institute of Tech',
          year: '4th Year',
          phone: '+1 (555) 456-7890'
        },
        {
          eventId: secondEvent._id,
          ticketId: 'CS-930182',
          name: 'Marcus Vance',
          email: 'marcus.v@dev.edu',
          college: 'State University',
          year: '1st Year',
          phone: '+1 (555) 567-8901'
        }
      ]);

      console.log('[Seed] Default events and sample registrations seeded successfully.');
    }
  } catch (error) {
    console.error(`[Seed] Error seeding data: ${error.message}`);
  }
};
