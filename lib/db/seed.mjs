import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

// Load .env from the repo root regardless of cwd this is run from
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const client = await pool.connect();
try {
  await client.query(`
    INSERT INTO recipes (title, summary, content, image_url, ingredients, prep_time, cook_time, servings, published)
    VALUES
    (
      'Turmeric & Lentil Soup',
      'A warming, anti-inflammatory soup packed with plant protein and healing spices.',
      E'This golden soup is a cornerstone of Dr. Tripathi''s metabolic reset protocols.\n\n**Method:**\n1. Rinse lentils until water runs clear.\n2. Sauté onion, garlic, and ginger until translucent.\n3. Add turmeric, cumin, and black pepper — toast for 1 minute.\n4. Add lentils and vegetable broth. Simmer 25 minutes.\n5. Blend partially. Season with salt and finish with lemon.',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      ARRAY['1/2 cup red lentils','1 medium onion, diced','3 cloves garlic','1 inch fresh ginger','1 tsp turmeric','1/2 tsp cumin','4 cups vegetable broth','Juice of 1/2 lemon','Salt & black pepper'],
      '10 minutes', '30 minutes', 2, true
    ),
    (
      'Overnight Oats with Ashwagandha',
      'A hormone-balancing breakfast that takes two minutes to prepare the night before.',
      E'Prepared the evening before, these oats deliver slow-release carbohydrates and adaptogenic support.\n\n**Method:**\n1. Add oats and chia seeds to a jar.\n2. Pour in milk and stir in ashwagandha powder and vanilla.\n3. Sweeten lightly with jaggery if desired.\n4. Seal and refrigerate overnight.\n5. Top with sliced banana and walnuts.',
      'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80',
      ARRAY['1/2 cup rolled oats','1 tbsp chia seeds','1 cup milk','1/2 tsp ashwagandha powder','1/4 tsp vanilla extract','1 tsp jaggery (optional)','1 banana, sliced','Small handful walnuts'],
      '5 minutes + overnight', 'No cooking', 1, true
    ),
    (
      'Methi Paratha with Curd',
      'A traditional Indian flatbread enriched with fresh fenugreek leaves — one of the most effective foods for blood sugar regulation.',
      E'Methi slows glucose absorption and improves insulin sensitivity.\n\n**Method:**\n1. Combine whole wheat flour, fresh methi leaves, ajwain, and salt.\n2. Add ghee and knead into a soft dough.\n3. Rest 15 minutes, divide into balls.\n4. Roll each ball thin.\n5. Cook on a hot tawa with ghee until golden.\n6. Serve with plain curd.',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
      ARRAY['1 cup whole wheat flour','1/2 cup fresh methi leaves, chopped','1/4 tsp ajwain','Salt to taste','1 tbsp ghee + extra for cooking','Water as needed','Plain curd, to serve'],
      '20 minutes', '15 minutes', 2, true
    )
    ON CONFLICT DO NOTHING;
  `);
  console.log("Recipes seeded.");

  await client.query(`
    INSERT INTO blogs (title, summary, content, image_url, author, tags, published)
    VALUES
    (
      'Why Calorie Counting Is Not the Answer',
      'After 21 years of clinical practice — counting calories creates a toxic relationship with food and rarely produces lasting change.',
      E'I have sat across from thousands of patients — many exhausted, confused, and convinced that willpower is what they lack. It is not.\n\n**The problem with calorie-as-currency thinking**\n\nWhen we reduce food to numbers, we strip away its cultural meaning and complexity. A 200-calorie slice of homemade mango pickle roti carries profoundly different metabolic information than 200 calories of a low-fat protein bar.\n\n**What actually works**\n\nFood quality over food quantity. Sleep. Stress regulation. Meal timing.',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      'Dr. Shweta Tripathi',
      ARRAY['Metabolic Health','Nutrition Philosophy','Lifestyle Medicine'],
      true
    ),
    (
      'The Gut–Hormone Connection Every Woman Should Know',
      'Your gut does not just digest food. It produces, activates, and regulates hormones — including oestrogen.',
      E'When a patient comes to me with PCOS or irregular cycles, my first questions are about her gut.\n\n**The estrobolome**\n\nA specific set of gut bacteria produces an enzyme that reactivates oestrogen the liver has packaged for elimination. When the microbiome is disrupted, oestrogen recirculates — contributing to PCOS, endometriosis, and perimenopausal symptoms.\n\n**Practical first steps**\n\n1. Eat at least 30 different plant foods per week.\n2. Prioritise fermented foods: curd, kanji, homemade pickles.\n3. Reduce ultra-processed food.\n4. Address stress — cortisol disrupts the gut lining.',
      'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?w=800&q=80',
      'Dr. Shweta Tripathi',
      ARRAY['Gut Health','Hormonal Health','PCOS'],
      true
    )
    ON CONFLICT DO NOTHING;
  `);
  console.log("Blogs seeded.");

  await client.query(`
    INSERT INTO timeslots (date, start_time, end_time, label, is_booked)
    VALUES
    ('2026-07-21', '10:00 AM', '11:00 AM', 'Initial Consultation', false),
    ('2026-07-21', '2:00 PM',  '3:00 PM',  'Initial Consultation', false),
    ('2026-07-23', '11:00 AM', '12:00 PM', 'Follow-up Session',    false),
    ('2026-07-25', '10:00 AM', '11:00 AM', 'Initial Consultation', false),
    ('2026-07-25', '3:00 PM',  '4:00 PM',  'Initial Consultation', false),
    ('2026-07-28', '10:00 AM', '11:00 AM', 'Follow-up Session',    false)
    ON CONFLICT DO NOTHING;
  `);
  console.log("Timeslots seeded.");
} finally {
  client.release();
  await pool.end();
}
