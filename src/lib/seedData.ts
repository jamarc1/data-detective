import { TableSchema } from "@/types";

interface ColumnWithNarrative {
  name: string;
  type: string;
  narrative?: string;
}

export const TABLE_SCHEMAS: (TableSchema & { columns: ColumnWithNarrative[] })[] = [
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
