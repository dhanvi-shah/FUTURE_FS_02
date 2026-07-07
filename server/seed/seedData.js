import { Admin } from '../models/Admin.js';
import { Lead, LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES } from '../models/Lead.js';

const companies = [
  'Google', 'Microsoft', 'Adobe', 'Spotify', 'Netflix',
  'Airbnb', 'Stripe', 'Figma', 'Slack', 'Notion',
  'Shopify', 'HubSpot', 'Salesforce', 'Zoom', 'Dropbox',
];

const firstNames = [
  'Sarah', 'James', 'Emily', 'Michael', 'Olivia', 'David', 'Sophia',
  'Daniel', 'Emma', 'Chris', 'Ava', 'Ryan', 'Mia', 'Alex', 'Liam',
  'Noah', 'Isabella', 'Ethan', 'Charlotte', 'Mason', 'Amelia', 'Lucas',
  'Harper', 'Benjamin', 'Evelyn', 'Henry', 'Abigail', 'Jack', 'Ella', 'Owen',
];

const lastNames = [
  'Chen', 'Patel', 'Johnson', 'Williams', 'Brown', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas',
  'Moore', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Walker',
];

const noteTemplates = [
  'Initial outreach sent via email. Awaiting response.',
  'Had a great discovery call. Very interested in our enterprise plan.',
  'Sent follow-up with case studies and pricing deck.',
  'Requested a demo for next week.',
  'Decision maker identified — VP of Engineering.',
  'Competitor evaluation in progress. Need to highlight our USPs.',
  'Budget approved. Moving to proposal stage.',
  'Scheduled technical review with their team.',
  'Positive feedback on the demo. Follow-up in 3 days.',
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (daysAgo, daysAhead = 0) => {
  const date = new Date();
  const offset = Math.floor(Math.random() * (daysAgo + daysAhead)) - daysAgo;
  date.setDate(date.getDate() + offset);
  date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
  return date;
};

export const generateLeads = (count) => {
  const leads = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const company = randomItem(companies);
    const status = randomItem(LEAD_STATUSES);
    const createdAt = randomDate(90);

    const noteCount = Math.floor(Math.random() * 4);
    const notes = Array.from({ length: noteCount }, () => ({
      text: randomItem(noteTemplates),
      createdBy: 'Admin',
      createdAt: randomDate(30),
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const hasFollowUp = Math.random() > 0.4;
    const followUpDate = hasFollowUp ? randomDate(-5, 14) : null;

    leads.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${company.toLowerCase().replace(/\s/g, '')}.com`,
      phone: `+1 (${200 + Math.floor(Math.random() * 800)}) ${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
      company,
      source: randomItem(LEAD_SOURCES),
      status,
      priority: randomItem(LEAD_PRIORITIES),
      notes,
      followUpDate,
      createdAt,
      updatedAt: createdAt,
      activities: [
        {
          type: 'lead_created',
          description: `Lead created for ${firstName} ${lastName}`,
          createdBy: 'Admin',
          createdAt,
        },
        ...(status !== 'New'
          ? [
              {
                type: 'status_change',
                description: `Status changed to ${status}`,
                createdBy: 'Admin',
                createdAt: randomDate(60),
              },
            ]
          : []),
      ],
    });
  }

  return leads;
};

export const seedDatabase = async ({ force = false } = {}) => {
  const adminCount = await Admin.countDocuments();

  if (adminCount > 0 && !force) {
    return { seeded: false, reason: 'Database already has data' };
  }

  if (force) {
    await Admin.deleteMany({});
    await Lead.deleteMany({});
  }

  const admin = await Admin.create({
    email: 'admin@crm.com',
    password: 'password123',
    name: 'Admin User',
  });

  const leads = generateLeads(30);
  await Lead.insertMany(leads);

  return {
    seeded: true,
    admin: admin.email,
    leadCount: leads.length,
  };
};
