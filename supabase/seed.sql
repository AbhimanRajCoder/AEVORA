-- ==============================================================================
-- Seed Data for Disaster Preparedness & Management Education System
-- ==============================================================================

-- 1. Insert Sample Institution
INSERT INTO public.institutions (id, name, state, district)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Apex Institute of Technology', 'Maharashtra', 'Pune')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert National Emergency Contacts (institution_id IS NULL)
INSERT INTO public.emergency_contacts (name, phone, institution_id)
VALUES
    ('National Emergency Number', '112', NULL),
    ('Fire Brigade', '101', NULL),
    ('Ambulance Service', '102', NULL),
    ('NDMA Disaster Helpline', '1078', NULL),
    ('Campus Security Desk', '020-27654321', '11111111-1111-1111-1111-111111111111'),
    ('Campus Medical Center', '020-27654322', '11111111-1111-1111-1111-111111111111');

-- 3. Insert 3 Disaster Learning Modules
INSERT INTO public.modules (id, title, disaster_type, description)
VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        'Earthquake Preparedness & Response',
        'earthquake',
        'Learn essential earthquake survival techniques, indoor hazard management, and proper evacuation protocol.'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Flood Safety & Emergency Action',
        'flood',
        'Understand warning indicators, water safety rules, and post-flood sanitation procedures.'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Fire Prevention & Evacuation Drills',
        'fire',
        'Master the PASS fire extinguisher technique, escape planning, and emergency smoke avoidance.'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Lessons for Each Module
-- Earthquake Lessons
INSERT INTO public.lessons (id, module_id, title, content, image_url)
VALUES
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '22222222-2222-2222-2222-222222222222',
        'Drop, Cover, and Hold On',
        'When the earth shakes, DROP to your hands and knees. COVER your head and neck under a sturdy table or desk. HOLD ON to your shelter until the shaking stops. If no shelter is nearby, drop down near an interior wall and cover your head.',
        'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '22222222-2222-2222-2222-222222222222',
        'Identifying Indoor Earthquake Hazards',
        'Identify hazards such as tall bookshelves, glass windows, heavy ceiling fans, and hanging fixtures. Secure heavy furniture to walls and keep hallways and exit doors free of obstructions at all times.',
        'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=800&q=80'
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        '22222222-2222-2222-2222-222222222222',
        'Post-Tremor Evacuation Protocol',
        'Once shaking stops, evaluate your immediate surroundings for fire or gas leaks. Use stairs only; never use elevators. Move carefully toward the designated open-ground assembly area away from power lines and glass facades.',
        'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
    ),

-- Flood Lessons
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '33333333-3333-3333-3333-333333333333',
        'Flood Warning Levels and Early Action',
        'Pay attention to local meteorological warnings. Yellow alert indicates watch, Orange indicates stay alert, and Red means take immediate evacuation action. Disconnect main electrical power switches before floodwaters enter buildings.',
        'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '33333333-3333-3333-3333-333333333333',
        'Turn Around, Do Not Drown',
        'Never walk, swim, or drive through flowing water. Just 15 centimeters (6 inches) of moving water can knock you down, and 30 centimeters can carry away a car. Always seek higher ground using established safe routes.',
        'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80'
    ),

-- Fire Lessons
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '44444444-4444-4444-4444-444444444444',
        'Stop, Drop, and Roll',
        'If your clothes catch fire, immediately STOP running, DROP to the ground, and ROLL back and forth to smother the flames. Cover your face with your hands to protect your airway and eyes.',
        'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '44444444-4444-4444-4444-444444444444',
        'Operating Fire Extinguishers (PASS Technique)',
        'Remember the PASS acronym: Pull the safety pin, Aim low at the base of the fire, Squeeze the handle evenly, and Sweep from side to side until extinguished. Always keep an unobstructed exit behind you.',
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Quiz Questions
-- Earthquake Quiz Questions
INSERT INTO public.quiz_questions (module_id, question, options, correct_answer)
VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        'What is the recommended immediate reaction when an earthquake tremor starts indoors?',
        '["Run outside as fast as possible", "Drop, Cover, and Hold On under a sturdy desk", "Take the elevator to the ground floor", "Stand next to a large glass window"]'::jsonb,
        'Drop, Cover, and Hold On under a sturdy desk'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Why should you avoid using elevators during or immediately after an earthquake?',
        '["Power outages or structural jamming can trap occupants inside", "Elevators move too slowly during drills", "Elevator alarms create unnecessary noise", "Elevator doors always stay locked during earthquakes"]'::jsonb,
        'Power outages or structural jamming can trap occupants inside'
    ),

-- Flood Quiz Questions
    (
        '33333333-3333-3333-3333-333333333333',
        'How much moving flood water is typically enough to sweep an adult off their feet?',
        '["6 inches (15 cm)", "3 feet (90 cm)", "5 feet (150 cm)", "10 feet (300 cm)"]'::jsonb,
        '6 inches (15 cm)'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'What should you immediately turn off before floodwaters enter a facility?',
        '["Air conditioning temperature settings", "Main electrical breaker switches and gas valves", "Fire alarm monitoring panels", "WiFi routers only"]'::jsonb,
        'Main electrical breaker switches and gas valves'
    ),

-- Fire Quiz Questions
    (
        '44444444-4444-4444-4444-444444444444',
        'What does the PASS acronym stand for when using a fire extinguisher?',
        '["Push, Alert, Spray, Stop", "Pull, Aim, Squeeze, Sweep", "Power, Assess, Seal, Stand", "Protect, Alert, Secure, Signal"]'::jsonb,
        'Pull, Aim, Squeeze, Sweep'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'If a room is filling with smoke during an evacuation, how should you exit?',
        '["Crawl low under the smoke where air is cleaner", "Run upright while covering ears", "Open all windows to let in air before leaving", "Hide under a blanket in the room"]'::jsonb,
        'Crawl low under the smoke where air is cleaner'
    );

-- 6. Insert Virtual Drill Scenario
INSERT INTO public.drill_scenarios (id, title, steps)
VALUES
    (
        '55555555-5555-5555-5555-555555555555',
        'Earthquake During Class Hours: Interactive Drill',
        '[
            {
                "step": 1,
                "scenario": "You are sitting in your classroom on the 2nd floor when you suddenly feel strong violent shaking. Ceiling tiles and light fixtures begin to rattle.",
                "options": [
                    {
                        "action": "Drop down on your knees, crawl under your desk, and firmly hold the desk legs.",
                        "points": 30,
                        "feedback": "Correct! Drop, Cover, and Hold On shields your head and vital organs from falling debris."
                    },
                    {
                        "action": "Rush toward the hallway exit to reach the stairs immediately.",
                        "points": 5,
                        "feedback": "Dangerous! Running during active tremors exposes you to falling fixtures and stampede risks."
                    },
                    {
                        "action": "Stand upright near the window to watch the ground outside.",
                        "points": 0,
                        "feedback": "Critical hazard! Glass windows can shatter inward with extreme force during tremors."
                    }
                ]
            },
            {
                "step": 2,
                "scenario": "The tremors cease after 45 seconds. The classroom is dusty and a small electrical spark is visible near the projector wall.",
                "options": [
                    {
                        "action": "Alert the instructor, avoid touching damaged wiring, and follow the teacher in single file toward the fire exit stairs.",
                        "points": 35,
                        "feedback": "Excellent decision. Calm, orderly evacuation via stairs prevents panic and injury."
                    },
                    {
                        "action": "Run to the hallway elevator to descend quickly before aftershocks happen.",
                        "points": 0,
                        "feedback": "Fatal risk! Elevators can experience power failure or shaft deformation during aftershocks."
                    },
                    {
                        "action": "Stay in the room to gather all backpacks and personal belongings.",
                        "points": 10,
                        "feedback": "Inadvisable. Delaying evacuation for personal possessions puts lives at risk from aftershocks or fires."
                    }
                ]
            },
            {
                "step": 3,
                "scenario": "You reach the ground floor exit door and step outside. Building walls are adjacent on both sides.",
                "options": [
                    {
                        "action": "Proceed directly to the open sports ground assembly zone, staying away from tall facades and overhead electrical lines.",
                        "points": 35,
                        "feedback": "Perfect! Designated open assembly zones keep you safe from falling glass, masonry, and power lines."
                    },
                    {
                        "action": "Wait right next to the entrance wall under the concrete canopy.",
                        "points": 10,
                        "feedback": "Hazardous! Building perimeters are high-risk zones for falling glass and parapet collapse."
                    },
                    {
                        "action": "Head back inside immediately because you left your phone on the desk.",
                        "points": 0,
                        "feedback": "Never re-enter a building after an earthquake until qualified structural inspectors declare it safe."
                    }
                ]
            }
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Sample Alert
INSERT INTO public.alerts (institution_id, title, message, severity)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Campus Drill Scheduled: Tomorrow 11:00 AM',
        'All departments will participate in a 15-minute earthquake response drill. Review the Earthquake module before 10:00 AM.',
        'info'
    );

