import { TableSchema } from "@/types";

interface ColumnWithNarrative {
  name: string;
  type: string;
  narrative?: string;
}

export const TABLE_SCHEMAS: (TableSchema & { columns: ColumnWithNarrative[] })[] = [
  {
    name: "guest_scans",
    caseName: "Guest Scans",
    tagline: "Ticket scanner logs — everyone who badged into The Hollow.",
    taskIndex: 0,
    description: "Ticket scanner logs — everyone who badged into The Hollow tonight.",
    columns: [
      { name: "id", type: "INTEGER", narrative: "Unique identifier for each scan" },
      { name: "guest_name", type: "VARCHAR", narrative: "Who was scanned" },
      { name: "scan_time", type: "VARCHAR", narrative: "When they badged in" },
      { name: "role", type: "VARCHAR", narrative: "Staff, guest, or artist" },
    ],
  },
  {
    name: "staff_shifts",
    caseName: "Staff Shifts",
    tagline: "Who was scheduled to work, and what they claim happened.",
    taskIndex: 1,
    description: "Who was scheduled to work, and what they claim happened during their shift.",
    columns: [
      { name: "id", type: "INTEGER", narrative: "Unique identifier for each shift" },
      { name: "staff_name", type: "VARCHAR", narrative: "Who was working" },
      { name: "shift_start", type: "VARCHAR", narrative: "When they clocked in" },
      { name: "shift_end", type: "VARCHAR", narrative: "When they clocked out" },
      { name: "statement", type: "VARCHAR", narrative: "What they claim happened" },
    ],
  },
  {
    name: "rideshare_pickups",
    caseName: "Rideshare Pickups",
    tagline: "Pickup records from the rideshare app used outside the venue.",
    taskIndex: 1,
    description: "Pickup records from the rideshare app used outside the venue.",
    columns: [
      { name: "id", type: "INTEGER", narrative: "Unique identifier for each pickup" },
      { name: "passenger_name", type: "VARCHAR", narrative: "Who was picked up" },
      { name: "pickup_time", type: "VARCHAR", narrative: "When the pickup occurred" },
      { name: "booking_ref", type: "VARCHAR", narrative: "Booking reference number" },
    ],
  },
  {
    name: "people",
    caseName: "Guest List",
    tagline: "Everyone who attended the gala.",
    taskIndex: 1,
    description: "Everyone who attended the Vantage Gala the night of the theft.",
    columns: [
      { name: "id", type: "INTEGER", narrative: "Unique identifier for each guest" },
      { name: "name", type: "VARCHAR", narrative: "Who they are" },
      { name: "age", type: "INTEGER", narrative: "Their age in years" },
      { name: "occupation", type: "VARCHAR", narrative: "What they do for a living" },
      { name: "alibi", type: "VARCHAR", narrative: "What they claim happened" },
      { name: "last_seen_location", type: "VARCHAR", narrative: "Where they were actually seen" },
      { name: "last_seen_time", type: "VARCHAR", narrative: "When they were actually seen" },
      { name: "suspicious", type: "BOOLEAN", narrative: "Flagged by security — true/false" },
    ],
  },
  {
    name: "crimes",
    caseName: "Case Archive",
    tagline: "Department investigation records.",
    taskIndex: 0,
    contains: ["Case Name", "Status", "Lead Suspect", "Description"],
    description: "The case file archive, including tonight's heist.",
    columns: [
      { name: "id", type: "INTEGER", narrative: "Unique case identifier" },
      { name: "case_name", type: "VARCHAR", narrative: "The name of the investigation" },
      { name: "location", type: "VARCHAR", narrative: "Where the incident occurred" },
      { name: "case_date", type: "VARCHAR", narrative: "When the incident was reported" },
      { name: "status", type: "VARCHAR", narrative: "Current case status — open or closed" },
      { name: "suspect_id", type: "INTEGER", narrative: "ID of the primary suspect, if any" },
      { name: "description", type: "VARCHAR", narrative: "Details about what happened" },
    ],
  },
];

export const CREATE_TABLES_CASE2_SQL = `
CREATE TABLE guest_scans (
  id INTEGER,
  guest_name VARCHAR,
  scan_time VARCHAR,
  role VARCHAR
);

CREATE TABLE staff_shifts (
  id INTEGER,
  staff_name VARCHAR,
  shift_start VARCHAR,
  shift_end VARCHAR,
  statement VARCHAR
);

CREATE TABLE rideshare_pickups (
  id INTEGER,
  passenger_name VARCHAR,
  pickup_time VARCHAR,
  booking_ref VARCHAR
);
`;

export const SEED_GUEST_SCANS_SQL = `
INSERT INTO guest_scans VALUES
  (1, 'Kai Rivera', '21:38:00', 'artist'),
  (2, 'Marisol Diaz', '21:45:00', 'staff'),
  (3, 'Owen Pratt', '21:50:00', 'staff'),
  (4, 'Theo Banks', '21:52:00', 'staff'),
  (5, 'Nadia Cho', '22:05:00', 'guest'),
  (6, 'Renn Okafor', '22:10:00', 'staff'),
  (7, 'Priya Sharma', '22:15:00', 'guest');
`;

export const SEED_STAFF_SHIFTS_SQL = `
INSERT INTO staff_shifts VALUES
  (1, 'Marisol Diaz', '20:00:00', '02:00:00', 'Saw Kai leave in a rideshare at 10:15.'),
  (2, 'Owen Pratt', '20:00:00', '02:00:00', 'Was at the bar all night, did not see Kai leave.'),
  (3, 'Theo Banks', '19:00:00', '01:00:00', 'Was on the loading dock, no visibility on the front.'),
  (4, 'Renn Okafor', '20:30:00', '02:00:00', 'Confirms Marisol was near the front entrance around 10:15.');
`;

export const SEED_RIDESHARE_PICKUPS_SQL = `
INSERT INTO rideshare_pickups VALUES
  (1, 'Kai Rivera', '22:52:00', 'RS-88213'),
  (2, 'Priya Sharma', '23:40:00', 'RS-88240'),
  (3, 'Nadia Cho', '23:45:00', 'RS-88241');
`;

export const CREATE_TABLES_SQL = `
CREATE TABLE people (
  id INTEGER,
  name VARCHAR,
  age INTEGER,
  occupation VARCHAR,
  alibi VARCHAR,
  last_seen_location VARCHAR,
  last_seen_time VARCHAR,
  suspicious BOOLEAN
);

CREATE TABLE crimes (
  id INTEGER,
  case_name VARCHAR,
  location VARCHAR,
  case_date VARCHAR,
  status VARCHAR,
  suspect_id INTEGER,
  description VARCHAR
);
`;

export const SEED_PEOPLE_SQL = `
INSERT INTO people VALUES
  (1, 'Eleanor Frost', 52, 'Museum Curator', 'In the coat room all night', 'Coat Room', '22:10', false),
  (2, 'Victor Kane', 39, 'Antiques Dealer', 'Says he was in the garden', 'Vault Room', '23:45', true),
  (3, 'Priya Anand', 29, 'Journalist', 'Interviewing the mayor', 'Ballroom', '22:00', false),
  (4, 'Marcus Webb', 45, 'Security Consultant', 'Checking camera feeds', 'Vault Room', '23:10', true),
  (5, 'Sofia Reyes', 34, 'Jewelry Appraiser', 'At the bar with guests', 'Ballroom', '22:35', false),
  (6, 'Harold Lin', 61, 'Retired Judge', 'Napping in the lounge', 'Lounge', '21:40', false),
  (7, 'Nadia Osei', 27, 'Gala Planner', 'Coordinating catering staff', 'Kitchen', '23:15', false),
  (8, 'Diego Castillo', 30, 'Violinist', 'Performing on stage', 'Ballroom', '22:50', false),
  (9, 'Tom Reilly', 43, 'Valet', 'Parking cars out front', 'Vault Room', '22:55', true),
  (10, 'Wren Alsop', 58, 'Philanthropist', 'Chatting near the fountain', 'Courtyard', '22:20', false);
`;

export const SEED_CRIMES_SQL = `
INSERT INTO crimes VALUES
  (1, 'The Vantage Gala Heist', 'Grandview Museum', '2026-06-14', 'open', 2, 'The Vantage Diamond vanished from its case during the annual gala.'),
  (2, 'The Harborview Burglary', 'Harborview Docks', '2025-11-02', 'closed', NULL, 'A warehouse of imported art was emptied overnight.'),
  (3, 'The Missing Manuscript', 'City Library', '2026-01-20', 'closed', NULL, 'A 400 year old manuscript disappeared from the archive room.');
`;
