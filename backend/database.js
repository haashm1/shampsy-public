import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'psychologist.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Create psychologist profile table (allowing multiple entries)
  db.run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL,
      specialties TEXT NOT NULL,
      education TEXT NOT NULL,
      experience TEXT NOT NULL,
      photo_url TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      address TEXT,
      meet_link TEXT,
      available_slots TEXT,
      unavailable_dates TEXT
    )
  `, () => {
    // Self-healing schema migration: try to add the column to existing databases
    db.run("ALTER TABLE profile ADD COLUMN meet_link TEXT", (err) => {
      // Ignore "duplicate column name" error if it already exists
    });
    db.run("ALTER TABLE profile ADD COLUMN available_slots TEXT", (err) => {
      // Ignore "duplicate column name" error if it already exists
    });
    db.run("ALTER TABLE profile ADD COLUMN unavailable_dates TEXT", (err) => {
      // Ignore "duplicate column name" error if it already exists
    });
  });

  // Insert default seed data for profiles if empty
  db.get("SELECT COUNT(*) as count FROM profile", (err, row) => {
    if (err) {
      console.error("Error reading profile:", err);
      return;
    }
    if (row.count === 0) {
      // Seed Shamna
      db.run(`
        INSERT INTO profile (
          id, name, title, bio, specialties, education, experience, photo_url, contact_email, contact_phone, address
        ) VALUES (
          1,
          'Shamna',
          'Licensed Clinical Psychologist & Cognitive Behavioral Therapist',
          'With over 12 years of experience, Shamna specializes in helping clients navigate anxiety, stress, depression, and relationship dynamics using a compassionate, evidence-based approach.',
          'Anxiety,Depression,Relationship Counseling,CBT,Mindfulness-Based Therapy',
          'Ph.D. in Clinical Psychology - Stanford University',
          '12+ Years in Private Practice, Former Lead Therapist at Mindspace Clinic',
          '/uploads/default-doctor.jpg',
          'shamna@example.com',
          '+1 (555) 839-2810',
          'Suite 402, Oakwood Wellness Center, San Francisco, CA'
        )
      `);

      // Seed Arjun Mehta
      db.run(`
        INSERT INTO profile (
          id, name, title, bio, specialties, education, experience, photo_url, contact_email, contact_phone, address
        ) VALUES (
          2,
          'Arjun Mehta',
          'Licensed Counselor & Family Therapist',
          'Arjun specializes in child psychology, family therapy, and adolescent counseling, helping families build stronger connections and navigate stress.',
          'Child Therapy,Family Counseling,Adolescent Support,Anger Management',
          'M.S. in Counseling Psychology - Northwestern University',
          '8+ Years in Family Therapy and Educational Counseling',
          '/uploads/default-arjun.jpg',
          'arjun@example.com',
          '+1 (555) 124-7733',
          'Suite 405, Oakwood Wellness Center, San Francisco, CA'
        )
      `);
      console.log("Seeded default psychologist profiles.");
    }
  });

  // 2. Create bookings/slots table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      booking_date TEXT NOT NULL, -- YYYY-MM-DD
      booking_time TEXT NOT NULL, -- HH:MM (e.g., 09:00, 10:00)
      duration_minutes INTEGER DEFAULT 50,
      notes TEXT,
      status TEXT DEFAULT 'booked', -- booked, cancelled, rescheduled
      meet_link TEXT,
      psychologist_id INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Create case sheets table
  db.run(`
    CREATE TABLE IF NOT EXISTS case_sheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER,
      client_name TEXT NOT NULL,
      case_date TEXT NOT NULL, -- YYYY-MM-DD
      title TEXT NOT NULL,
      document_content TEXT, -- JSON or raw HTML containing Google Doc simulated formatting
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    )
  `);
});

export default db;
