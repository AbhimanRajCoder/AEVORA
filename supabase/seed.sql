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

-- Drill 1: Earthquake in Multi-Story College Lab (16 steps)
INSERT INTO public.drill_scenarios (id, title, steps)
VALUES
    (
        '66666666-6666-6666-6666-666666666601',
        'Earthquake During Chemistry Lab on 3rd Floor',
        '[
            {
                "step": 1,
                "scenario": "You are in a chemistry lab on the 3rd floor when the ground starts shaking violently. Beakers and equipment slide off tables and crash to the floor.",
                "options": [
                    {
                        "action": "Drop under the sturdy lab bench, cover your head and neck, and hold on to the bench legs tightly.",
                        "points": 30,
                        "feedback": "Correct! Drop, Cover, and Hold On is the proven immediate response. Lab benches provide strong overhead protection from falling debris."
                    },
                    {
                        "action": "Run toward the lab door immediately to get out of the building.",
                        "points": 5,
                        "feedback": "Dangerous! Running during active shaking exposes you to falling ceiling tiles, light fixtures, and chemical bottles. You are more likely to be injured while moving."
                    },
                    {
                        "action": "Try to catch and save the expensive lab equipment from falling off the tables.",
                        "points": 0,
                        "feedback": "Critical mistake! Equipment can be replaced, your life cannot. Reaching across tables during shaking risks cuts from broken glass and chemical exposure."
                    }
                ]
            },
            {
                "step": 2,
                "scenario": "The shaking intensifies. A heavy shelf loaded with chemical reagent bottles starts wobbling dangerously above your position.",
                "options": [
                    {
                        "action": "Crawl away from the shelf while staying low and move to a safer spot under another sturdy table further away.",
                        "points": 25,
                        "feedback": "Good decision! Relocating while staying low keeps you protected. Heavy shelves with chemicals are extremely dangerous if they topple."
                    },
                    {
                        "action": "Stand up and try to hold the shelf steady with both hands to prevent it from falling.",
                        "points": 0,
                        "feedback": "Extremely dangerous! A loaded chemical shelf can weigh over 100 kg. It will crush you if it falls, and broken reagent bottles can cause chemical burns."
                    },
                    {
                        "action": "Stay exactly where you are without moving and hope the shelf does not fall.",
                        "points": 10,
                        "feedback": "Risky. While staying still is generally advised, remaining directly under an unstable heavy object is an exception. Relocating while staying low is safer here."
                    }
                ]
            },
            {
                "step": 3,
                "scenario": "A classmate near the large window screams as the glass develops visible cracks. The window has not shattered yet but is bulging.",
                "options": [
                    {
                        "action": "Call out loudly to your classmate to move away from the window immediately and get under the nearest desk.",
                        "points": 25,
                        "feedback": "Correct! Windows can shatter inward with lethal force during earthquakes. Verbal alerts help others without putting you at risk."
                    },
                    {
                        "action": "Rush across the shaking lab to physically pull your classmate away from the window.",
                        "points": 10,
                        "feedback": "Brave but risky. Moving across a shaking lab exposes both of you to falling objects and broken glass. A loud verbal warning is safer and often equally effective."
                    },
                    {
                        "action": "Ignore your classmate and focus entirely on your own safety without saying anything.",
                        "points": 5,
                        "feedback": "Your own safety matters, but a simple verbal warning costs nothing and could save a life. Always alert others to danger when you safely can."
                    }
                ]
            },
            {
                "step": 4,
                "scenario": "The shaking stops after 40 seconds. You smell a sharp chemical odor from a broken bottle of acid on the floor near your bench. A small puddle is forming.",
                "options": [
                    {
                        "action": "Cover your nose and mouth with your lab coat or cloth, avoid touching the spill, step away carefully, and loudly alert others about the chemical hazard.",
                        "points": 30,
                        "feedback": "Excellent! Chemical spills after earthquakes are a serious secondary hazard. Protecting your airway and warning others prevents chemical burns and inhalation injuries."
                    },
                    {
                        "action": "Quickly grab paper towels and try to wipe up the acid spill before it spreads further.",
                        "points": 0,
                        "feedback": "Never clean acid with bare hands or paper towels! This causes severe chemical burns. Only trained personnel with proper neutralizing agents and PPE should handle acid spills."
                    },
                    {
                        "action": "Walk through the edge of the spill to reach the exit faster since time is critical.",
                        "points": 0,
                        "feedback": "Acid will burn through shoes and skin on contact. Even dilute acid puddles cause serious chemical burns. Always find a path around chemical spills."
                    }
                ]
            },
            {
                "step": 5,
                "scenario": "The lab instructor shouts to evacuate immediately. The main door and the emergency exit at the back of the lab are both visible. Students are crowding near the main door.",
                "options": [
                    {
                        "action": "Assess which exit is closer to you and less crowded, then proceed calmly to that exit in an orderly manner.",
                        "points": 25,
                        "feedback": "Smart thinking! Using the less crowded exit reduces stampede risk and gets you out faster. Always be aware of multiple exit routes in any room."
                    },
                    {
                        "action": "Rush to the main door where everyone else is crowding since it must be the safest exit.",
                        "points": 5,
                        "feedback": "Crowding at a single exit creates a dangerous bottleneck. People get crushed in stampedes. Always consider alternate exits during evacuations."
                    },
                    {
                        "action": "Wait inside the lab until everyone else has left before you start moving toward any exit.",
                        "points": 10,
                        "feedback": "Waiting avoids the crowd, but unnecessary delays in a chemically contaminated space increase your exposure to toxic fumes. Move promptly to the clearer exit."
                    }
                ]
            },
            {
                "step": 6,
                "scenario": "In the corridor outside the lab, ceiling tiles have fallen and fine dust fills the air. Debris is scattered on the floor. Visibility is reduced.",
                "options": [
                    {
                        "action": "Move carefully along the wall for guidance, watch your footing for debris, and cover your mouth and nose with your sleeve to filter dust.",
                        "points": 25,
                        "feedback": "Perfect technique! The wall provides orientation in low visibility. Covering your airway prevents inhaling concrete dust which can cause serious respiratory damage."
                    },
                    {
                        "action": "Run through the dusty corridor as fast as possible to minimize your time in the debris zone.",
                        "points": 5,
                        "feedback": "Running in reduced visibility with debris on the floor leads to trips, falls, and injuries. Inhaling dust at high breathing rates is also more harmful."
                    },
                    {
                        "action": "Go back into the lab and wait for the dust to settle before attempting to use the corridor.",
                        "points": 10,
                        "feedback": "The lab has chemical fumes making it more dangerous than a dusty corridor. Keep moving forward through the corridor carefully rather than returning to a contaminated room."
                    }
                ]
            },
            {
                "step": 7,
                "scenario": "You reach the staircase landing. Next to the stairs, the elevator doors are open and the elevator cabin appears to be at your floor and functional.",
                "options": [
                    {
                        "action": "Take the stairs down. Never use elevators during or after an earthquake due to power failure and shaft damage risks.",
                        "points": 30,
                        "feedback": "Absolutely correct! Elevators can lose power mid-ride, cables can snap, and shafts can deform during aftershocks. Stairs are always the safe choice after an earthquake."
                    },
                    {
                        "action": "Take the elevator since it is faster and appears to be working fine right now.",
                        "points": 0,
                        "feedback": "Fatal risk! Aftershocks can strike at any moment, causing power failure or shaft deformation while you are trapped inside. Never use elevators after an earthquake."
                    },
                    {
                        "action": "Wait at the landing and observe whether other people use the elevator first to see if it is safe.",
                        "points": 5,
                        "feedback": "Wasting time observing others taking a dangerous risk does not make it safer for you. Use the stairs immediately — every second counts during evacuation."
                    }
                ]
            },
            {
                "step": 8,
                "scenario": "On the staircase, a student ahead of you trips on debris and falls. Students behind you are pushing forward anxiously.",
                "options": [
                    {
                        "action": "Stop immediately, help the fallen student stand up, and firmly ask people behind to slow down and maintain order.",
                        "points": 30,
                        "feedback": "Excellent! A fallen person in a crowded staircase can trigger a deadly stampede. Helping them up and calming the crowd prevents a chain reaction of falls and crushings."
                    },
                    {
                        "action": "Step over the fallen student and keep moving to avoid slowing down the evacuation.",
                        "points": 0,
                        "feedback": "Stepping over a fallen person encourages others to do the same, and the person can be trampled. Staircase stampedes cause more casualties than many earthquakes."
                    },
                    {
                        "action": "Push past everyone to get down the stairs faster before more people fall.",
                        "points": 0,
                        "feedback": "Pushing causes panic and more falls. You could cause a stampede that injures dozens of people. Stay calm and help maintain orderly movement."
                    }
                ]
            },
            {
                "step": 9,
                "scenario": "Between the 2nd and 1st floor, you notice a visible crack running along the staircase wall. You hear faint creaking sounds from the structure.",
                "options": [
                    {
                        "action": "Continue moving quickly but carefully past the damaged section without stopping. Do not linger near compromised structures.",
                        "points": 25,
                        "feedback": "Correct! Move through damaged areas swiftly but carefully. Lingering near cracked walls increases your risk if an aftershock causes further collapse."
                    },
                    {
                        "action": "Stop and carefully inspect the crack to determine if the building is about to collapse.",
                        "points": 5,
                        "feedback": "You are not a structural engineer. Stopping to inspect delays your evacuation and keeps you in a danger zone longer. Leave assessment to professionals."
                    },
                    {
                        "action": "Turn around and go back upstairs to find a completely different staircase to use.",
                        "points": 10,
                        "feedback": "Going back up wastes critical time and you may encounter worse damage elsewhere. The crack is on the wall, not the stairs themselves. Keep moving down carefully."
                    }
                ]
            },
            {
                "step": 10,
                "scenario": "You reach the ground floor. The main exit door is partially blocked by fallen ceiling panels and a toppled display board. You can see daylight through gaps.",
                "options": [
                    {
                        "action": "Carefully move the loose panels just enough to squeeze through, watching for unstable debris above you as you pass.",
                        "points": 25,
                        "feedback": "Good approach! Creating a minimal passage reduces the risk of disturbing more debris. Always look up before moving anything to check for objects that might fall on you."
                    },
                    {
                        "action": "Kick and force your way aggressively through the blocked doorway to clear a path.",
                        "points": 5,
                        "feedback": "Aggressive force can destabilize surrounding debris, causing more material to fall on you. Careful, controlled movement is always safer around structural damage."
                    },
                    {
                        "action": "Search for an alternative ground floor exit through a classroom window or side door.",
                        "points": 15,
                        "feedback": "A reasonable alternative, but takes extra time. The partially blocked main exit is still passable with careful movement and is the most direct route out."
                    }
                ]
            },
            {
                "step": 11,
                "scenario": "Outside the building, you see a large group of students and staff gathered close to the building wall under a concrete overhang for shade.",
                "options": [
                    {
                        "action": "Move to the designated open assembly point at the sports ground, well away from all buildings, trees, and overhead power lines.",
                        "points": 30,
                        "feedback": "Perfect! Building perimeters are the most dangerous zones after an earthquake. Facades, parapets, glass, and overhangs can collapse during aftershocks. Open ground is the only safe assembly area."
                    },
                    {
                        "action": "Join the crowd near the building wall since so many people there means it must be safe.",
                        "points": 0,
                        "feedback": "A crowd near a building wall does not mean safety. Building facades, concrete canopies, and glass panels frequently collapse during aftershocks, causing mass casualties."
                    },
                    {
                        "action": "Stand under a large nearby tree for shelter from the sun while you wait for instructions.",
                        "points": 5,
                        "feedback": "Trees can be uprooted or have heavy branches break during aftershocks. Open ground away from trees, buildings, and power lines is the only safe post-earthquake position."
                    }
                ]
            },
            {
                "step": 12,
                "scenario": "An aftershock hits while you are outside. The ground shakes again for about 15 seconds. People around you start screaming and running.",
                "options": [
                    {
                        "action": "Drop to the ground in the open area, cover your head and neck with your arms, and stay low until the shaking stops.",
                        "points": 30,
                        "feedback": "Correct! Drop, Cover, and Hold On applies outdoors too. Dropping low prevents falls, and covering your head protects against any flying debris."
                    },
                    {
                        "action": "Run back toward the building entrance to seek shelter inside the structure.",
                        "points": 0,
                        "feedback": "Never re-enter a building during an aftershock! The structure is already compromised and could collapse. Stay in the open and drop low."
                    },
                    {
                        "action": "Stand still and try to maintain your balance while the ground shakes.",
                        "points": 10,
                        "feedback": "Standing during shaking risks falling and injury. Dropping low intentionally gives you a stable base and lets you protect your head from debris."
                    }
                ]
            },
            {
                "step": 13,
                "scenario": "After the aftershock, you notice a classmate with a deep bleeding cut on their forearm from broken lab glass. Blood is dripping steadily.",
                "options": [
                    {
                        "action": "Apply firm direct pressure to the wound with a clean cloth, keep their arm elevated above heart level, and call for first aid assistance.",
                        "points": 25,
                        "feedback": "Correct first aid! Direct pressure controls bleeding, elevation reduces blood flow to the wound, and professional help ensures proper treatment."
                    },
                    {
                        "action": "Pour water directly over the wound to wash out the glass fragments before doing anything else.",
                        "points": 10,
                        "feedback": "Washing can wait. For active bleeding, controlling blood loss with pressure is the immediate priority. Cleaning comes after bleeding is controlled."
                    },
                    {
                        "action": "Tell them it is just a small cut and they should ignore it until help arrives on its own.",
                        "points": 0,
                        "feedback": "A steady drip of blood indicates a significant cut that needs immediate pressure. Ignoring it risks dangerous blood loss, especially if help is delayed."
                    }
                ]
            },
            {
                "step": 14,
                "scenario": "You notice a gas pipe near the campus road appears to be leaking. You can smell the distinctive rotten-egg odor of the odorant added to natural gas.",
                "options": [
                    {
                        "action": "Move everyone at least 100 meters away from the area, do not use phones or any electrical switches nearby, and alert campus security from a safe distance.",
                        "points": 30,
                        "feedback": "Perfect response! Gas leaks can cause explosions. Even a phone spark can ignite gas. Evacuate the area and report from a safe distance."
                    },
                    {
                        "action": "Use your phone flashlight to inspect the pipe closely and take a photo to report the damage.",
                        "points": 0,
                        "feedback": "Deadly mistake! Phone electronics can create sparks that ignite leaking gas. Never use any electrical device near a gas leak."
                    },
                    {
                        "action": "Try to tighten the pipe fitting with your hands or a tool to stop the gas leak yourself.",
                        "points": 0,
                        "feedback": "Never attempt to repair a gas leak yourself. You could break the pipe further or create a spark. Only trained gas utility professionals should handle gas line repairs."
                    }
                ]
            },
            {
                "step": 15,
                "scenario": "The campus security team arrives and begins a headcount at the assembly point. You realize your lab partner is not in the crowd and they were near the chemical shelf when the quake started.",
                "options": [
                    {
                        "action": "Immediately report your lab partner as missing to the security team with their name, last known location in the lab, and a physical description.",
                        "points": 25,
                        "feedback": "Critical! Providing specific information helps rescue teams locate missing persons quickly. Every minute matters for someone who may be trapped or injured."
                    },
                    {
                        "action": "Run back into the damaged building to search for your lab partner yourself.",
                        "points": 0,
                        "feedback": "Never re-enter a damaged building! You risk becoming a second victim. Trained rescue teams have the equipment and skills for search operations."
                    },
                    {
                        "action": "Assume your lab partner already left through another exit and went home safely.",
                        "points": 5,
                        "feedback": "Assumptions about missing people during emergencies can be fatal. Always report anyone unaccounted for so rescue teams can verify their safety."
                    }
                ]
            },
            {
                "step": 16,
                "scenario": "Campus authorities announce that everyone must remain at the assembly point until structural engineers inspect the buildings. Some students are getting restless and want to leave or re-enter buildings.",
                "options": [
                    {
                        "action": "Stay at the assembly point as instructed, help keep others calm, share water if you have any, and wait for the official all-clear signal.",
                        "points": 25,
                        "feedback": "Correct! Structural damage is often invisible. Buildings that look fine can have compromised foundations. Only leave or re-enter after professional engineers confirm safety."
                    },
                    {
                        "action": "Leave campus immediately on your own to get home faster since you feel fine.",
                        "points": 10,
                        "feedback": "Roads and bridges may also be damaged. Leaving without authorization means you cannot be accounted for, and you miss important safety updates from authorities."
                    },
                    {
                        "action": "Sneak back into the building to quickly grab your bag, laptop, and phone charger from the lab.",
                        "points": 0,
                        "feedback": "Never re-enter a building until engineers declare it safe. Aftershocks can cause weakened buildings to collapse. No personal belonging is worth your life."
                    }
                ]
            }
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- Drill 2: Flash Flood on College Campus (15 steps)
INSERT INTO public.drill_scenarios (id, title, steps)
VALUES
    (
        '66666666-6666-6666-6666-666666666602',
        'Flash Flood Emergency on College Campus',
        '[
            {
                "step": 1,
                "scenario": "Heavy monsoon rain has been falling for 3 hours straight. Campus security sends an urgent SMS alert: Flash flood warning — water level rising rapidly near the main gate and low-lying areas.",
                "options": [
                    {
                        "action": "Stop all activities immediately, gather essential items like your ID card, phone, and water bottle, and move to the upper floors of your current building.",
                        "points": 30,
                        "feedback": "Correct! Flash floods can escalate in minutes. Moving to higher ground immediately with essentials is the top priority when a flood warning is issued."
                    },
                    {
                        "action": "Ignore the alert since you are safely inside a building and continue studying.",
                        "points": 5,
                        "feedback": "Dangerous complacency! Flash floods can inundate ground floors within minutes. Even being inside does not mean you are safe if you remain on a low floor."
                    },
                    {
                        "action": "Go outside to the campus gate to check how high the water actually is before deciding what to do.",
                        "points": 0,
                        "feedback": "Fatal mistake! Going toward rising floodwater is the most dangerous thing you can do. Flash flood currents can sweep away an adult in just 15 cm of moving water."
                    }
                ]
            },
            {
                "step": 2,
                "scenario": "Water starts seeping under the ground floor doors of your academic block. The depth inside is about 10 cm and visibly rising every few minutes.",
                "options": [
                    {
                        "action": "Move immediately to the first floor or higher using the staircase. Do not wait for the water to rise further.",
                        "points": 30,
                        "feedback": "Perfect! Vertical evacuation to higher floors is the correct response when floodwater enters a building. Every minute of delay makes stairs more dangerous as water rises."
                    },
                    {
                        "action": "Try to barricade the doors with bags, furniture, and towels to stop the water from entering.",
                        "points": 5,
                        "feedback": "Barricading cannot stop floodwater — water pressure will overwhelm any makeshift barrier. This wastes critical time you should use to move upstairs."
                    },
                    {
                        "action": "Wade through the 10 cm water to reach the parking lot and drive your vehicle to higher ground.",
                        "points": 0,
                        "feedback": "Extremely dangerous! Even shallow moving floodwater can knock you off your feet. Vehicles can be swept away in less than 30 cm of moving water. Never drive through floods."
                    }
                ]
            },
            {
                "step": 3,
                "scenario": "Before heading upstairs, you notice the electrical distribution panels on the ground floor wall are mounted about 30 cm above the floor. Water is approaching that level.",
                "options": [
                    {
                        "action": "If you can safely reach the main circuit breaker without stepping into deep water, turn off the ground floor electricity immediately, then head upstairs.",
                        "points": 30,
                        "feedback": "Critical safety step! Electrocution in floodwater is a major killer. Disconnecting power before water reaches electrical panels prevents fatal electric shock for everyone in the building."
                    },
                    {
                        "action": "Touch the electrical panel to check if it is still energized before deciding what to do about it.",
                        "points": 0,
                        "feedback": "Never touch electrical equipment near water! Even a quick touch can deliver a fatal shock if the panel is energized and your feet are in water."
                    },
                    {
                        "action": "Leave everything and just run upstairs without worrying about the electrical panels.",
                        "points": 10,
                        "feedback": "Getting upstairs is important, but energized electrical panels in floodwater can electrocute anyone on the ground floor later. Turning off power protects everyone if it can be done safely."
                    }
                ]
            },
            {
                "step": 4,
                "scenario": "On the first floor, about 30 students have gathered. Several are panicking and a group of 5 students insist on wading through the floodwater outside to reach the hostel building across the road.",
                "options": [
                    {
                        "action": "Firmly advise everyone to stay on the upper floor. Explain that crossing floodwater is extremely dangerous — even knee-deep flowing water can sweep an adult away.",
                        "points": 25,
                        "feedback": "Correct! Moving water as shallow as 15 cm can knock a person down. Knee-deep flowing water exerts hundreds of kilograms of force. The safest place during a flood is on a high floor."
                    },
                    {
                        "action": "Let them go since they are adults and can make their own decisions about the risk.",
                        "points": 5,
                        "feedback": "You have a responsibility to share life-saving knowledge. Many people underestimate floodwater. A firm warning could save multiple lives."
                    },
                    {
                        "action": "Join the group heading to the hostel since the hostel is a stronger concrete building and might be safer.",
                        "points": 0,
                        "feedback": "The building you are in is already safe on the upper floors. Crossing floodwater is the most dangerous action you can take. Stay where you are."
                    }
                ]
            },
            {
                "step": 5,
                "scenario": "From the first floor window, you see a fellow student in the floodwater outside trying to rescue a stray dog. The water is waist-deep and flowing fast.",
                "options": [
                    {
                        "action": "Shout from the window for the student to come back inside immediately. Animal rescue during active flooding must be left to trained disaster response teams.",
                        "points": 25,
                        "feedback": "Correct! Waist-deep flowing water is lethal even for strong swimmers. Attempting animal rescue in active floodwater risks drowning. Call them back and report to rescue teams."
                    },
                    {
                        "action": "Go outside yourself to help the student rescue the dog since two people are stronger than one.",
                        "points": 0,
                        "feedback": "Two people in lethal floodwater means two potential drowning victims. Never enter floodwater for any reason. You cannot fight the current."
                    },
                    {
                        "action": "Throw food from the window to lure the dog closer to the building so the student does not have to go deeper.",
                        "points": 15,
                        "feedback": "Creative thinking, but the student is already in danger. The priority is getting the human out of the water, not the dog closer. Call the student back first."
                    }
                ]
            },
            {
                "step": 6,
                "scenario": "The power goes out across the entire campus. It is mid-afternoon but the storm clouds make it very dark. Your phone has 40 percent battery remaining.",
                "options": [
                    {
                        "action": "Switch your phone to power saving mode immediately. Use it only for emergency calls and critical messages. Turn off Wi-Fi, Bluetooth, and background apps.",
                        "points": 25,
                        "feedback": "Smart! Your phone is your lifeline for emergency communication. Conserving battery ensures you can call for help when it matters most. Power may not return for hours or days."
                    },
                    {
                        "action": "Keep using your phone normally to post live updates and photos on social media about the flooding.",
                        "points": 5,
                        "feedback": "Social media updates drain battery quickly. If you need to call emergency services later and your phone is dead, you will be unable to get help."
                    },
                    {
                        "action": "Turn off your phone completely to save every bit of battery for later.",
                        "points": 15,
                        "feedback": "Turning off completely means you cannot receive emergency alerts or calls. Power saving mode is the better balance — you stay reachable while conserving battery."
                    }
                ]
            },
            {
                "step": 7,
                "scenario": "Hours have passed. A classmate is very thirsty and suggests scooping up and drinking the floodwater since you have very little clean drinking water left.",
                "options": [
                    {
                        "action": "Refuse and explain that floodwater is heavily contaminated with sewage, chemicals, mud, and bacteria. Share your remaining clean water in small careful sips.",
                        "points": 30,
                        "feedback": "Absolutely correct! Floodwater contains sewage, industrial chemicals, dead animals, and dangerous bacteria. Drinking it causes cholera, typhoid, leptospirosis, and severe diarrhea. Even boiling may not remove chemical contaminants."
                    },
                    {
                        "action": "Take a small sip of the floodwater since it looks relatively clear in this area.",
                        "points": 0,
                        "feedback": "Clear-looking floodwater is still deadly. Dissolved sewage, bacteria, and chemicals are invisible. A single sip can cause life-threatening waterborne disease."
                    },
                    {
                        "action": "Collect floodwater in a bottle, let the sediment settle, and then drink the clearer water from the top.",
                        "points": 5,
                        "feedback": "Settling removes only visible particles, not bacteria, viruses, or dissolved chemicals. Settled floodwater is still extremely dangerous to drink."
                    }
                ]
            },
            {
                "step": 8,
                "scenario": "The water continues to rise and has now reached the first floor corridor. About 5 cm of muddy water covers the floor where everyone has been sitting.",
                "options": [
                    {
                        "action": "Move everyone up to the second floor or the highest accessible floor immediately. The water may continue rising.",
                        "points": 30,
                        "feedback": "Correct! Always stay ahead of rising water. Moving to the highest floor gives you maximum safety margin. If water reaches the top floor, you can move to the roof."
                    },
                    {
                        "action": "Stay on the first floor since 5 cm is still very shallow and manageable.",
                        "points": 5,
                        "feedback": "5 cm can become 50 cm in minutes during a flash flood. Waiting until water is dangerously deep makes staircase evacuation extremely risky. Move up now while it is safe."
                    },
                    {
                        "action": "Climb out of the first floor window and jump into the floodwater below to swim to higher ground.",
                        "points": 0,
                        "feedback": "Never enter floodwater voluntarily! The building itself is high ground. Jumping into fast-moving water from a height almost guarantees drowning or serious injury."
                    }
                ]
            },
            {
                "step": 9,
                "scenario": "From the second floor, you can see emergency rescue boats in the distance on the flooded main road. They appear to be searching for stranded people.",
                "options": [
                    {
                        "action": "Wave a bright-colored cloth, towel, or dupatta from the window and use your phone flashlight to signal the rescue boats. Keep your body safely inside the window frame.",
                        "points": 25,
                        "feedback": "Excellent! Bright visual signals help rescuers locate you from a distance. Keeping your body inside prevents accidental falls. Continue signaling periodically."
                    },
                    {
                        "action": "Climb onto the narrow window ledge and lean far out while shouting for help as loudly as possible.",
                        "points": 5,
                        "feedback": "Leaning out of a window is extremely dangerous — wet surfaces are slippery and a fall into floodwater could be fatal. Signal from safely inside the window."
                    },
                    {
                        "action": "Do nothing and wait quietly since they will eventually come to check every building on their own.",
                        "points": 10,
                        "feedback": "Rescue teams prioritize buildings where they can see signs of people. Active signaling significantly increases your chances of being found and rescued quickly."
                    }
                ]
            },
            {
                "step": 10,
                "scenario": "A student is shivering uncontrollably and seems confused despite the warm weather. Their clothes are soaking wet from wading through water earlier.",
                "options": [
                    {
                        "action": "Help them remove wet clothing and wrap them in any dry cloth, curtains, or even newspaper for insulation. This could be early hypothermia even in warm climates.",
                        "points": 25,
                        "feedback": "Correct! Hypothermia can occur even at 25 degrees Celsius if a person is wet and exposed to wind. Wet clothing accelerates heat loss. Removing it and insulating the person is critical."
                    },
                    {
                        "action": "Tell them to stop overreacting since it is not even cold outside and they should just wait for their clothes to dry.",
                        "points": 0,
                        "feedback": "Dismissing symptoms of hypothermia is dangerous. Evaporation from wet clothes cools the body rapidly. Confusion and shivering are warning signs that need immediate action."
                    },
                    {
                        "action": "Give them cold floodwater to drink since dehydration might be causing their confusion.",
                        "points": 0,
                        "feedback": "Cold water worsens hypothermia, and floodwater is contaminated. The correct response is warmth and dry insulation, not fluids from a contaminated source."
                    }
                ]
            },
            {
                "step": 11,
                "scenario": "You hear a deep rumbling sound outside. Through the window, you see a large neem tree uprooting from the saturated soil and falling slowly toward the adjacent building wall.",
                "options": [
                    {
                        "action": "Immediately move everyone away from the windows to the inner corridor of the building. Falling trees can shatter windows and send debris flying inside.",
                        "points": 25,
                        "feedback": "Perfect response! Falling trees during floods can crash through walls and windows. Interior corridors without windows are the safest areas during such events."
                    },
                    {
                        "action": "Rush to the window to record a video of the tree falling since this would be amazing footage to share online.",
                        "points": 0,
                        "feedback": "Standing at a window while a tree falls toward the building is extremely dangerous. The tree, glass shards, and debris can cause fatal injuries."
                    },
                    {
                        "action": "Run downstairs to get outside and watch the tree fall from a better angle.",
                        "points": 0,
                        "feedback": "Going downstairs into floodwater and outdoors near falling trees combines two deadly hazards. Stay on the upper floor away from windows."
                    }
                ]
            },
            {
                "step": 12,
                "scenario": "After 5 hours, the rain slows and the floodwater begins to recede visibly. Excited students want to immediately go downstairs and leave the building.",
                "options": [
                    {
                        "action": "Advise everyone to wait until the water has substantially receded and authorities confirm it is safe. Receding floodwater still carries strong undercurrents and hidden hazards.",
                        "points": 25,
                        "feedback": "Correct! Receding floodwater can have powerful currents that drag people under. Submerged hazards like open manholes, sharp debris, and downed power lines are invisible. Wait for official clearance."
                    },
                    {
                        "action": "Go downstairs immediately to be the first to assess the damage and start cleaning up.",
                        "points": 5,
                        "feedback": "Receding water is deceptively dangerous. Hidden currents, submerged electrical wires, and open manholes have killed many people who ventured out too early."
                    },
                    {
                        "action": "Jump into the remaining water from the first floor to wade to the campus gate and go home.",
                        "points": 0,
                        "feedback": "Entering receding floodwater voluntarily is extremely dangerous. Open manholes create suction that can pull a person underground. Wait for safe conditions."
                    }
                ]
            },
            {
                "step": 13,
                "scenario": "The water has finally receded enough to walk on the ground floor. The floor is covered in thick mud, debris, and scattered objects. You need to reach the assembly point across campus.",
                "options": [
                    {
                        "action": "Wear sturdy closed shoes, walk slowly watching carefully for hidden nails, broken glass, and sharp debris in the mud. Avoid any standing water near electrical panels or outlets.",
                        "points": 25,
                        "feedback": "Correct! Post-flood debris hides sharp objects, exposed nails, and contaminated material. Closed shoes prevent puncture wounds that can cause tetanus. Standing water near electricity can be lethal."
                    },
                    {
                        "action": "Walk barefoot through the mud to avoid ruining your only pair of shoes.",
                        "points": 0,
                        "feedback": "Walking barefoot through flood debris is extremely dangerous. Hidden glass, nails, sharp metal, and contaminated sewage cause serious infections and tetanus."
                    },
                    {
                        "action": "Run quickly across the muddy ground floor to minimize your contact time with the contaminated surface.",
                        "points": 5,
                        "feedback": "Running on slippery mud causes falls. You cannot see hidden hazards at speed. Slow, careful walking while watching your footing is much safer."
                    }
                ]
            },
            {
                "step": 14,
                "scenario": "At the assembly point, a campus disaster coordinator asks you and other students about anyone who may still be trapped or injured in buildings you came from.",
                "options": [
                    {
                        "action": "Provide a clear and honest account of everyone you saw, their approximate locations, the floors they were on, and any injuries you noticed.",
                        "points": 25,
                        "feedback": "Critical! Accurate witness information guides rescue teams to the right locations. Honest reporting, even of uncertainty, helps responders prioritize their search efforts."
                    },
                    {
                        "action": "Say you did not see anyone to avoid getting involved in a lengthy debrief.",
                        "points": 0,
                        "feedback": "Withholding information during a disaster can cost lives. People may be trapped and waiting for rescue. Your information could be the difference between life and death."
                    },
                    {
                        "action": "Exaggerate the situation dramatically to make sure the rescue teams come faster with more resources.",
                        "points": 5,
                        "feedback": "Exaggeration wastes rescue resources and diverts teams from people who genuinely need urgent help. Always provide accurate information during emergencies."
                    }
                ]
            },
            {
                "step": 15,
                "scenario": "The flood has receded and rescue operations are wrapping up. Campus health authorities are distributing post-flood safety guidelines to all students.",
                "options": [
                    {
                        "action": "Follow all the post-flood instructions carefully: wash hands frequently with soap, avoid eating any food that contacted floodwater, do not drink tap water until declared safe, and report any illness symptoms immediately.",
                        "points": 25,
                        "feedback": "Excellent! Post-flood waterborne diseases like cholera, typhoid, and leptospirosis kill thousands every year. Strict hygiene and food safety are critical in the days following a flood."
                    },
                    {
                        "action": "Eat food from the ground floor canteen since you are very hungry and the packaged items look undamaged.",
                        "points": 0,
                        "feedback": "Even sealed food packages contaminated by floodwater exterior can transmit disease when you touch them and then eat. All flood-exposed food must be discarded."
                    },
                    {
                        "action": "Rush back to your hostel room immediately to check on your belongings, electronics, and important documents.",
                        "points": 10,
                        "feedback": "Your health comes first. Buildings need to be inspected for structural and electrical safety before re-entry. Follow the official re-entry timeline."
                    }
                ]
            }
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;


-- Drill 3: Hostel Electrical Fire & Smoke Evacuation Drill (16 steps)
INSERT INTO public.drill_scenarios (id, title, steps)
VALUES
    (
        '66666666-6666-6666-6666-666666666603',
        'Hostel Electrical Fire & Smoke Evacuation Drill',
        '[
            {
                "step": 1,
                "scenario": "It is 11:30 PM on the 4th floor of the student hostel. You smell burning plastic and notice thick smoke seeping out from the corridor electrical meter room.",
                "options": [
                    {
                        "action": "Immediately pull the nearest manual fire alarm call point and loudly shout FIRE to alert sleeping hostel residents on your floor.",
                        "points": 30,
                        "feedback": "Correct! Early warning saves lives, especially at night when residents are asleep. Activating the alarm alerts the entire building immediately."
                    },
                    {
                        "action": "Go back into your room and call your friend on the phone to ask if they also smell smoke.",
                        "points": 5,
                        "feedback": "Dangerous delay! Smoke and electrical fires spread rapidly. Every second wasted allows toxic fumes to fill escape corridors."
                    },
                    {
                        "action": "Open the electrical meter room door wide to see how large the fire is.",
                        "points": 0,
                        "feedback": "Extremely hazardous! Opening the door supplies oxygen to a smoldering electrical fire, which can cause a sudden flashover or backdraft explosion."
                    }
                ]
            },
            {
                "step": 2,
                "scenario": "A small flame bursts out of a faulty distribution box outside the meter room. An extinguisher cabinet with Water, Foam, and CO2 extinguishers is right beside you.",
                "options": [
                    {
                        "action": "Select the Carbon Dioxide (CO2) or Dry Chemical Powder (ABC) extinguisher — never use water on an energized electrical fire.",
                        "points": 30,
                        "feedback": "Spot on! CO2 and ABC dry powder are non-conductive and safely smother Class C electrical fires without electrocuting the operator."
                    },
                    {
                        "action": "Grab the pressurized Water extinguisher since water puts out fires fastest.",
                        "points": 0,
                        "feedback": "Lethal mistake! Water conducts electricity directly back through the stream to your body, causing severe or fatal electrocution."
                    },
                    {
                        "action": "Throw a bucket of wet mop water from the washroom onto the sparking meter panel.",
                        "points": 0,
                        "feedback": "Fatal electrocution hazard! Never throw water on live electrical panels or sparking wires."
                    }
                ]
            },
            {
                "step": 3,
                "scenario": "You hold the CO2 extinguisher ready to tackle the initial sparks before evacuating. What is the correct operating sequence?",
                "options": [
                    {
                        "action": "Follow PASS: Pull the safety pin, Aim the horn at the base of the flames, Squeeze the handle, and Sweep side-to-side.",
                        "points": 25,
                        "feedback": "Excellent! The PASS method targets the fuel source at the base of the fire while keeping you at a safe distance."
                    },
                    {
                        "action": "Hold the CO2 discharge horn directly with your bare hand and aim at the top of the smoke plume.",
                        "points": 0,
                        "feedback": "Two critical errors! CO2 discharge horns freeze to -78 degrees Celsius and cause severe frostbite if gripped bare-handed, and aiming at smoke wastes extinguishing gas."
                    },
                    {
                        "action": "Spray blindly into the room while walking backward without looking at the flames.",
                        "points": 5,
                        "feedback": "Ineffective and unsafe. You should always keep your eyes on the fire and maintain a clear exit path behind your back."
                    }
                ]
            },
            {
                "step": 4,
                "scenario": "Despite your initial effort, the fire jumps to wooden notice boards and overhead cable trays. Smoke thickens rapidly. What do you do next?",
                "options": [
                    {
                        "action": "Stop fighting the fire immediately, ensure an exit path is behind you, and begin evacuating the 4th floor.",
                        "points": 30,
                        "feedback": "Crucial judgment! Once a fire spreads beyond its point of origin or threatens your exit route, evacuate immediately and leave firefighting to professionals."
                    },
                    {
                        "action": "Keep searching for a second extinguisher on the 5th floor to keep fighting the blaze alone.",
                        "points": 0,
                        "feedback": "Fatal risk! Moving further into a burning building in search of equipment risks smoke asphyxiation and entrapment."
                    },
                    {
                        "action": "Wait in the corridor to film the spreading fire on your phone for hostel documentation.",
                        "points": 0,
                        "feedback": "Toxic smoke from burning plastics and cable insulation can cause unconsciousness in under 60 seconds."
                    }
                ]
            },
            {
                "step": 5,
                "scenario": "Dense, black, acrid smoke begins filling the upper half of the hostel corridor, obscuring the exit sign.",
                "options": [
                    {
                        "action": "Drop down low and crawl on your hands and knees close to the floor where air is cooler and visibility is better.",
                        "points": 30,
                        "feedback": "Correct! Hot toxic smoke and carbon monoxide rise to the ceiling. Crawling 30 to 60 cm above the floor keeps you in cleaner, cooler air."
                    },
                    {
                        "action": "Hold your breath and sprint upright at full speed down the smoky corridor.",
                        "points": 5,
                        "feedback": "Running upright puts your head directly in superheated toxic smoke. You risk scorching your lungs or collapsing from inhaling toxic gases."
                    },
                    {
                        "action": "Duck into the washroom and turn on the shower to wait out the fire.",
                        "points": 0,
                        "feedback": "Washrooms without exterior escape routes become smoke traps. Always evacuate the building if corridors remain passable."
                    }
                ]
            },
            {
                "step": 6,
                "scenario": "You reach a closed stairwell fire door. You cannot see what is on the other side.",
                "options": [
                    {
                        "action": "Feel the door surface and metal knob gently with the back of your hand before opening it.",
                        "points": 25,
                        "feedback": "Smart precaution! Testing with the back of your hand detects intense heat without risking your palm gripping a scorching handle."
                    },
                    {
                        "action": "Kick the door open forcefully and charge straight through into the stairwell.",
                        "points": 0,
                        "feedback": "Dangerous! If fire is raging directly behind the door, throwing it open can cause a lethal blast of flame and superheated air."
                    },
                    {
                        "action": "Assume the stairwell is blocked and break open a 4th-floor corridor window to jump outside.",
                        "points": 0,
                        "feedback": "Jumping from a 4th floor is almost certainly fatal. Check the fire door safely first."
                    }
                ]
            },
            {
                "step": 7,
                "scenario": "The fire door feels cool. You open it carefully and enter the stairwell, which is clear of heavy smoke. Other students are following behind you.",
                "options": [
                    {
                        "action": "Let the self-closing fire door shut firmly behind the evacuating group — never wedge or prop it open.",
                        "points": 30,
                        "feedback": "Vital rule! Closed fire doors block smoke and flames from turning the exit stairwell into a vertical chimney."
                    },
                    {
                        "action": "Wedge a shoe under the fire door so latecomers do not have to turn the handle.",
                        "points": 0,
                        "feedback": "Propping open a fire door allows toxic smoke to flood the entire staircase, trapping residents on upper floors."
                    },
                    {
                        "action": "Use the stairwell phone to call the hostel warden while standing in front of the open door.",
                        "points": 10,
                        "feedback": "Keep the door closed first and continue moving downstairs. Report details once safely outside."
                    }
                ]
            },
            {
                "step": 8,
                "scenario": "A panicked student on the 3rd-floor landing stops and tries to press the elevator call button because their ankle hurts.",
                "options": [
                    {
                        "action": "Pull them gently away from the elevator, remind them elevators are deadly in fires, and assist them down the stairs.",
                        "points": 30,
                        "feedback": "Correct! Elevators can automatically return to the fire floor, fail due to power loss, or act as smoke shafts. Always assist impaired peers down the stairs."
                    },
                    {
                        "action": "Let them take the elevator alone since they have a sore ankle and you need to hurry.",
                        "points": 0,
                        "feedback": "Never allow anyone to enter an elevator during a fire alarm. Power loss or smoke infiltration in the shaft can be fatal."
                    },
                    {
                        "action": "Wait with them in front of the elevator until the fire department arrives on the 3rd floor.",
                        "points": 5,
                        "feedback": "Unnecessary risk when the stairwell is clear and you can support them down to ground level."
                    }
                ]
            },
            {
                "step": 9,
                "scenario": "As you assist your peers down the 2nd floor, a resident rushes out of their room with their sleeve slightly on fire from a falling ember.",
                "options": [
                    {
                        "action": "Instruct them loudly to STOP, DROP to the landing floor, and ROLL back and forth while covering their face with their hands.",
                        "points": 30,
                        "feedback": "Textbook response! Running feeds oxygen to flames. Stop, Drop, and Roll smothers the fire against the floor."
                    },
                    {
                        "action": "Tell them to sprint outside as fast as possible to find a garden hose.",
                        "points": 0,
                        "feedback": "Running fans the flames upward toward the face and hair, dramatically worsening burn injuries."
                    },
                    {
                        "action": "Wave a dry paper notebook at their burning sleeve to fan the flames out.",
                        "points": 0,
                        "feedback": "Fanning supplies fresh oxygen and risks igniting the paper notebook as well."
                    }
                ]
            },
            {
                "step": 10,
                "scenario": "The hallway emergency lights flicker out on the ground floor exit corridor due to tripping breakers, leaving the path dim with light smoke.",
                "options": [
                    {
                        "action": "Use your phone flashlight pointed at the floor, keep one hand along the right wall, and follow glowing green exit signs.",
                        "points": 25,
                        "feedback": "Great technique! Staying oriented along a wall prevents disorientation in smoky, dimly lit corridors."
                    },
                    {
                        "action": "Light a cigarette lighter to illuminate the corridor more brightly.",
                        "points": 0,
                        "feedback": "Never ignite an open flame during an active fire emergency — leaked gases or vapors could explode."
                    },
                    {
                        "action": "Close your eyes and run straight ahead hoping you hit the exit door.",
                        "points": 0,
                        "feedback": "Running blind leads to collisions with furniture, walls, or other evacuees."
                    }
                ]
            },
            {
                "step": 11,
                "scenario": "You reach the ground floor emergency exit door, which is equipped with a horizontal panic crash bar.",
                "options": [
                    {
                        "action": "Push firmly on the horizontal crash bar so the outward-swinging door opens smoothly, then step out onto the lawn.",
                        "points": 25,
                        "feedback": "Correct! Outward-swinging fire doors with panic bars release immediately under forward pressure to prevent crowd crushes."
                    },
                    {
                        "action": "Pull the door handle violently inward toward yourself.",
                        "points": 0,
                        "feedback": "Fire exit doors swing outward in the direction of evacuation travel. Pulling wastes precious seconds."
                    },
                    {
                        "action": "Stop inside the doorway vestibule to put on extra shoes and check your backpack.",
                        "points": 0,
                        "feedback": "Stopping in an exit doorway blocks everyone behind you and creates a dangerous bottleneck."
                    }
                ]
            },
            {
                "step": 12,
                "scenario": "You step outside. Several hostel residents are standing right beneath the 4th-floor windows watching flames appear and taking videos.",
                "options": [
                    {
                        "action": "Move at least 50 meters away to the designated hostel assembly lawn and urge onlookers to step back from falling glass.",
                        "points": 25,
                        "feedback": "Smart safety leadership! Heat shatters glass windows outward, showering razor-sharp shards onto anyone standing near the building perimeter."
                    },
                    {
                        "action": "Stand next to the building driveway so you have a front-row view of the fire trucks arriving.",
                        "points": 0,
                        "feedback": "Standing in the driveway blocks fire tenders and exposes you to falling glass and debris."
                    },
                    {
                        "action": "Climb onto a parked motorcycle near the wall to get a higher camera angle.",
                        "points": 0,
                        "feedback": "Exposes you to thermal radiation, falling window glass, and exploding fuel tanks if flames drop."
                    }
                ]
            },
            {
                "step": 13,
                "scenario": "A student realizes they left their original passport and exam hall ticket on their desk on the 4th floor. They turn to run back inside.",
                "options": [
                    {
                        "action": "Physically block them from re-entering and explain firmly that no document is worth risking suffocation in a burning building.",
                        "points": 30,
                        "feedback": "Life-saving intervention! Once out, NEVER re-enter a burning building. Documents can be replaced; a life lost to smoke inhalation cannot."
                    },
                    {
                        "action": "Tell them to hold a wet handkerchief over their mouth and take no more than two minutes inside.",
                        "points": 0,
                        "feedback": "Wet cloth does not filter carbon monoxide or hydrogen cyanide from burning plastics. Two minutes inside a smoke-filled corridor is lethal."
                    },
                    {
                        "action": "Offer to run back inside with them so they are not alone.",
                        "points": 0,
                        "feedback": "Never re-enter a burning structure for property. Two people going back inside just doubles the potential fatalities."
                    }
                ]
            },
            {
                "step": 14,
                "scenario": "Municipal fire tenders arrive with sirens blaring, but panicked students and parked scooters partially block the campus access lane.",
                "options": [
                    {
                        "action": "Help clear uninjured students off the driveway and point firefighters toward the nearest water hydrant and main stairwell entrance.",
                        "points": 25,
                        "feedback": "Excellent support! Clearing access lanes and identifying hydrants saves firefighters vital minutes in setting up suppression lines."
                    },
                    {
                        "action": "Walk up to the fire engine pump operator and repeatedly ask how long it will take to save your laptop.",
                        "points": 0,
                        "feedback": "Distracting emergency responders during active firefighting operations delays life safety and rescue."
                    },
                    {
                        "action": "Crowd around the firefighters as they unroll hoses so you can watch up close.",
                        "points": 0,
                        "feedback": "High-pressure fire hoses and operating zones are hazardous to bystanders and impede emergency deployment."
                    }
                ]
            },
            {
                "step": 15,
                "scenario": "The hostel warden checks the floor register at the assembly area. Your neighbor from Room 408 is unaccounted for, and you remember they were wearing noise-canceling headphones earlier.",
                "options": [
                    {
                        "action": "Report immediately to the fire officer and warden: Student from Room 408 on the 4th floor may still be asleep with headphones on.",
                        "points": 30,
                        "feedback": "Critical intelligence! Firefighters prioritize search-and-rescue teams to specific rooms when given exact location details."
                    },
                    {
                        "action": "Stay quiet because you are not 100 percent sure whether they went out for dinner.",
                        "points": 0,
                        "feedback": "Never withhold uncertainty during a headcount. Firefighters will verify Room 408 immediately if informed."
                    },
                    {
                        "action": "Run up the exterior fire escape ladder yourself to knock on Room 408.",
                        "points": 0,
                        "feedback": "Trained firefighters with self-contained breathing apparatus (SCBA) must perform interior rescues."
                    }
                ]
            },
            {
                "step": 16,
                "scenario": "Two hours later, firefighters extinguish the fire and rescue the student from Room 408 safely. Some residents want to return to their rooms immediately to sleep.",
                "options": [
                    {
                        "action": "Wait in the designated safe zone until the Fire Marshal and electrical engineers inspect the building and issue an official safe re-entry clearance.",
                        "points": 25,
                        "feedback": "Correct! Hidden embers inside walls, toxic lingering smoke, and damaged electrical lines make premature re-entry dangerous."
                    },
                    {
                        "action": "Walk back into your 2nd-floor room since the fire was on the 4th floor and your room looks unaffected.",
                        "points": 5,
                        "feedback": "Smoke, water damage from firefighting, and compromised electrical wiring affect lower floors as well. Wait for official clearance."
                    },
                    {
                        "action": "Turn the floor electrical main switch back on yourself to restore room fans.",
                        "points": 0,
                        "feedback": "Turning on wet or fire-damaged electrical circuits can immediately ignite a secondary fire or cause electrocution."
                    }
                ]
            }
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- Drill 4: Cyclone & Severe Coastal Gale Storm Shelter Drill (16 steps)
INSERT INTO public.drill_scenarios (id, title, steps)
VALUES
    (
        '66666666-6666-6666-6666-666666666604',
        'Cyclone & Severe Coastal Gale Storm Shelter Drill',
        '[
            {
                "step": 1,
                "scenario": "The Meteorological Department issues a Cyclone Red Warning: a severe cyclonic storm with 150 km/h winds will make landfall near your coastal college within 12 hours.",
                "options": [
                    {
                        "action": "Follow campus alerts immediately, charge all phones and power banks, store clean drinking water, and help secure loose outdoor objects.",
                        "points": 30,
                        "feedback": "Excellent preparation! Securing loose items prevents lethal flying projectiles, and stored water and battery power sustain you through multi-day outages."
                    },
                    {
                        "action": "Ride down to the nearby beachfront to watch the giant waves and take photos before the wind picks up.",
                        "points": 0,
                        "feedback": "Extremely reckless! Pre-cyclone storm surges and rogue waves arrive hours before landfall and sweep spectators into the sea."
                    },
                    {
                        "action": "Wait until the storm actually hits campus before deciding whether to prepare.",
                        "points": 5,
                        "feedback": "Waiting until gale-force winds arrive makes outdoor preparation impossible and puts you at extreme risk."
                    }
                ]
            },
            {
                "step": 2,
                "scenario": "You are helping prepare the hostel wing before winds arrive. Several loose flowerpots, metal buckets, and plastic chairs sit on open balconies.",
                "options": [
                    {
                        "action": "Bring all loose pots, chairs, and buckets indoors immediately so they cannot become high-speed flying projectiles.",
                        "points": 25,
                        "feedback": "Correct! In 150 km/h winds, even a flower pot or plastic chair turns into a deadly missile capable of shattering reinforced glass."
                    },
                    {
                        "action": "Tie the chairs together with thin twine and leave them on the open balcony.",
                        "points": 5,
                        "feedback": "Thin twine snaps easily under sustained cyclonic gusts. Loose items must be brought inside or anchored in enclosed storage."
                    },
                    {
                        "action": "Leave them outside since the balcony concrete railing will block the wind.",
                        "points": 0,
                        "feedback": "Turbulent wind vortices lift objects straight up over balcony railings and hurl them across campus."
                    }
                ]
            },
            {
                "step": 3,
                "scenario": "You are assembling a 72-hour emergency go-bag before relocating to the campus cyclone shelter hall.",
                "options": [
                    {
                        "action": "Pack bottled water, dry ready-to-eat food, flashlight, spare batteries, whistle, first aid kit, essential medicines, and ID documents in a waterproof pouch.",
                        "points": 30,
                        "feedback": "Textbook survival kit! Waterproof pouches protect documents from torrential rain, and a whistle helps rescuers locate you if trapped."
                    },
                    {
                        "action": "Pack only your laptop, gaming headset, and heavy hardcover textbooks.",
                        "points": 0,
                        "feedback": "Heavy electronics without water, food, or first aid provide no survival value when grid power fails for days."
                    },
                    {
                        "action": "Bring no bag at all since the campus canteen will surely stay open during the cyclone.",
                        "points": 5,
                        "feedback": "Canteens lose power, gas, and water supply during severe cyclones. Always bring personal emergency rations."
                    }
                ]
            },
            {
                "step": 4,
                "scenario": "Cyclone winds now exceed 120 km/h outside. Large glass windows in your 2nd-floor common room are bowing inward and vibrating loudly.",
                "options": [
                    {
                        "action": "Close heavy curtains or blinds if already closed, move everyone immediately to an interior windowless hallway or stairwell away from glass.",
                        "points": 30,
                        "feedback": "Spot on! Interior windowless spaces protect you from shattered glass shards and airborne debris if an outer window fails."
                    },
                    {
                        "action": "Open all windows on the opposite side of the building to equalize air pressure.",
                        "points": 0,
                        "feedback": "Dangerous myth! Opening windows lets high-velocity wind pressurize the interior, which can blow the roof off the building."
                    },
                    {
                        "action": "Press your hands against the vibrating glass window to brace it and keep it from breaking.",
                        "points": 0,
                        "feedback": "Fatal hazard! If the pane shatters under wind pressure or debris impact, glass shards will cause severe arterial injuries."
                    }
                ]
            },
            {
                "step": 5,
                "scenario": "A flying roof sheet crashes through a window in an adjacent study room, allowing howling winds and torrential rain to pour inside.",
                "options": [
                    {
                        "action": "Keep the solid interior door to that study room tightly shut and latched to isolate the breach, and stay in the inner corridor.",
                        "points": 25,
                        "feedback": "Great structural containment! Isolating breached rooms stops wind pressure from building up inside the core of the building."
                    },
                    {
                        "action": "Run into the breached room to nail a wooden desk over the broken window while wind gusts inside.",
                        "points": 0,
                        "feedback": "Never enter a room during active window breach — flying glass and sudden pressure gusts can knock you down or pull you toward the opening."
                    },
                    {
                        "action": "Prop open all corridor doors to let the rushing wind pass cleanly through the hostel.",
                        "points": 0,
                        "feedback": "Creating wind tunnels inside the building accelerates ceiling collapse and damages interior structural partitions."
                    }
                ]
            },
            {
                "step": 6,
                "scenario": "The campus power grid fails completely after an electrical transformer flashes outside. Backup generator power is limited strictly to emergency corridor lights.",
                "options": [
                    {
                        "action": "Switch off room air conditioners, water heaters, and wall socket switches so power surges do not start fires when electricity returns.",
                        "points": 25,
                        "feedback": "Prudent precaution! Turning off heavy appliances prevents voltage-surge electrical fires when utility power is restored."
                    },
                    {
                        "action": "Light five wax candles on top of wooden bunk beds to brighten up the shelter space.",
                        "points": 0,
                        "feedback": "Major fire hazard! During a cyclone, fire trucks cannot reach campus due to blocked roads and 140 km/h winds."
                    },
                    {
                        "action": "Walk outside in the storm rain to check why the campus transformer sparked.",
                        "points": 0,
                        "feedback": "Deadly risk! Exposed live cables, flying sheet metal, and falling trees make going outside during a cyclone lethal."
                    }
                ]
            },
            {
                "step": 7,
                "scenario": "A terrified student in the interior shelter room begins hyperventilating and crying uncontrollably from the loud howling wind.",
                "options": [
                    {
                        "action": "Sit beside them calmly, speak in a steady reassuring voice, guide them through slow 4-second breathing, and offer a sip of water.",
                        "points": 25,
                        "feedback": "Excellent psychological first aid! Steady breathing and calm support reduce panic and keep the group stable."
                    },
                    {
                        "action": "Tell them sternly to be quiet because they are annoying everyone else in the room.",
                        "points": 0,
                        "feedback": "Harsh dismissal worsens panic attacks and escalates anxiety throughout the shelter."
                    },
                    {
                        "action": "Open an exterior door briefly so they can see the storm and realize there are no monsters outside.",
                        "points": 0,
                        "feedback": "Opening an exterior door during peak cyclone winds can rip the door off its hinges and endanger everyone inside."
                    }
                ]
            },
            {
                "step": 8,
                "scenario": "Rainwater driven by horizontal gale winds starts seeping heavily under the shelter exit door and soaking the corridor floor.",
                "options": [
                    {
                        "action": "Roll up old towels, rags, or sandbags along the bottom gap of the door and keep electrical power strips elevated off the wet floor.",
                        "points": 25,
                        "feedback": "Smart mitigation! Sealing bottom door gaps slows water ingress and keeping cords elevated prevents short circuits."
                    },
                    {
                        "action": "Unlock and open the door to sweep the puddle water back outside into the storm.",
                        "points": 0,
                        "feedback": "Never open exterior doors during peak cyclone winds! Wind blasts will flood the corridor instantly."
                    },
                    {
                        "action": "Ignore the spreading water even though live extension cords are lying directly in the puddle.",
                        "points": 0,
                        "feedback": "Water contacting live extension cords creates an immediate electrocution and fire hazard."
                    }
                ]
            },
            {
                "step": 9,
                "scenario": "Suddenly, after 2 hours of terrifying noise, the wind drops completely to dead calm. Sunlight breaks through a clear patch of sky overhead.",
                "options": [
                    {
                        "action": "Warn everyone strictly to remain inside the shelter! This is the Eye of the Cyclone, and violent winds will strike again from the opposite direction.",
                        "points": 30,
                        "feedback": "Critical knowledge! Many cyclone deaths occur when people step outside during the calm Eye, only to be caught defenseless when the rear eyewall hits."
                    },
                    {
                        "action": "Celebrate that the storm is over and walk out onto the campus lawn to inspect fallen trees.",
                        "points": 0,
                        "feedback": "Fatal trap! The Eye typically lasts 15 to 45 minutes before hurricane-force winds slam back from the opposite compass direction."
                    },
                    {
                        "action": "Hop on your motorbike and try to speed home before it starts raining again.",
                        "points": 0,
                        "feedback": "Being caught on open roads lined with damaged trees and dangling power lines when the eyewall returns is frequently fatal."
                    }
                ]
            },
            {
                "step": 10,
                "scenario": "Thirty minutes later, as predicted, ferocious winds slam back against the opposite side of the building with deafening force.",
                "options": [
                    {
                        "action": "Remain calm in the interior shelter away from windows on both sides, reassuring others that this second phase is normal and expected.",
                        "points": 25,
                        "feedback": "Correct! Staying sheltered through the trailing eyewall protects you from reversed wind loads and newly loosened debris."
                    },
                    {
                        "action": "Move to the previously wind-sheltered exterior balcony since winds used to be blocked on that side.",
                        "points": 0,
                        "feedback": "Because cyclonic circulation rotates, the trailing eyewall blows directly into the formerly sheltered side of the building."
                    },
                    {
                        "action": "Run to the top floor terrace to watch the directional shift of the storm clouds.",
                        "points": 0,
                        "feedback": "Exposed terraces during 140 km/h gusts expose you to airborne metal roofing sheets and fatal falls."
                    }
                ]
            },
            {
                "step": 11,
                "scenario": "Hours later, official radio and SMS bulletins confirm the cyclone has moved inland and winds have subsided below dangerous levels.",
                "options": [
                    {
                        "action": "Wait for campus safety wardens to conduct an initial perimeter sweep before stepping outdoors.",
                        "points": 25,
                        "feedback": "Prudent! Post-cyclone environments contain hidden hazards like downed live cables, undermined roads, and unstable hanging branches."
                    },
                    {
                        "action": "Rush outside immediately to climb onto the hostel roof and check the satellite dish.",
                        "points": 0,
                        "feedback": "Wet, debris-strewn roofs and damaged structural parapets cause frequent post-storm falls."
                    },
                    {
                        "action": "Walk barefoot through standing rainwater in the courtyard to cool off.",
                        "points": 0,
                        "feedback": "Post-storm puddles conceal broken glass, sharp metal roofing nails, and potentially energized downed wires."
                    }
                ]
            },
            {
                "step": 12,
                "scenario": "Once cleared to walk outside with sturdy shoes, you see an uprooted banyan tree with a thick black utility cable tangled in its wet branches across the footpath.",
                "options": [
                    {
                        "action": "Treat every downed wire as energized and lethal! Stay at least 10 meters back, keep others away, and report it to campus security.",
                        "points": 30,
                        "feedback": "Life-saving rule! Downed lines can be re-energized unexpectedly by backup generators or grid switching, electrifying wet ground and puddles."
                    },
                    {
                        "action": "Pick up the cable with a wooden cricket bat to toss it off the footpath so students can pass.",
                        "points": 0,
                        "feedback": "Wet wood conducts high voltage! Never touch or move any utility wire with any object."
                    },
                    {
                        "action": "Step briskly over the cable since the campus power went out hours ago.",
                        "points": 0,
                        "feedback": "Back-feed from portable generators or emergency lines can make a supposedly dead wire lethal at any second."
                    }
                ]
            },
            {
                "step": 13,
                "scenario": "You walk past the campus mess kitchen and notice a sharp smell of leaking LPG cooking gas from an overturned outdoor cylinder manifold.",
                "options": [
                    {
                        "action": "Keep everyone clear of the mess area, do not turn on any light switches, phones, or flames nearby, and alert maintenance staff immediately.",
                        "points": 30,
                        "feedback": "Correct! Even a tiny spark from a flashlight switch or mobile phone can ignite pooled heavy LPG vapor."
                    },
                    {
                        "action": "Turn on the mess exhaust fans immediately to blow the gas smell out of the kitchen.",
                        "points": 0,
                        "feedback": "Flipping electrical switches creates an internal arc spark that can trigger a devastating gas explosion."
                    },
                    {
                        "action": "Strike a match near the pipe joint to test whether gas is actually escaping.",
                        "points": 0,
                        "feedback": "Instant explosion hazard!"
                    }
                ]
            },
            {
                "step": 14,
                "scenario": "Fallen branches are blocking the campus service road needed for an incoming municipal medical ambulance.",
                "options": [
                    {
                        "action": "Under faculty supervision, verify there are no overhead wires involved, wear sturdy gloves, and help clear smaller branches to open a single vehicle lane.",
                        "points": 25,
                        "feedback": "Great community resilience! Safely opening emergency access corridors speeds up medical care and relief delivery."
                    },
                    {
                        "action": "Pour petrol over the fallen tree pile and burn it off the road quickly.",
                        "points": 0,
                        "feedback": "Uncontrolled burning with lingering gusty winds and damaged gas lines risks setting buildings ablaze."
                    },
                    {
                        "action": "Leave the road blocked and tell ambulance drivers to carry patients on foot for 2 kilometers.",
                        "points": 5,
                        "feedback": "Safely clearing light debris under supervision saves critical minutes for injured casualties."
                    }
                ]
            },
            {
                "step": 15,
                "scenario": "Campus overhead water tanks lost their lids during the cyclone and rainwater mixed with leaves has contaminated the tap supply.",
                "options": [
                    {
                        "action": "Use only sealed bottled water or water that has been brought to a rolling boil for at least 1 minute or treated with chlorine tablets.",
                        "points": 30,
                        "feedback": "Essential disease barrier! Post-cyclone water contamination triggers severe outbreaks of cholera, typhoid, and hepatitis A."
                    },
                    {
                        "action": "Filter the cloudy tap water through a cotton t-shirt and drink it straight away.",
                        "points": 0,
                        "feedback": "Cloth filtration catches leaves and dirt but does not remove microscopic bacteria, viruses, or parasites."
                    },
                    {
                        "action": "Drink rainwater collected from rusted metal roof gutters.",
                        "points": 5,
                        "feedback": "Roof runoff washes bird droppings, rust, and storm debris into collection containers — it must be boiled or disinfected first."
                    }
                ]
            },
            {
                "step": 16,
                "scenario": "A viral forward on student WhatsApp groups claims a 15-meter tsunami is about to strike the campus within 20 minutes, causing panic among exhausted students.",
                "options": [
                    {
                        "action": "Check official IMD, NDMA, and district collector bulletins before reacting, and advise peers not to spread unverified rumors.",
                        "points": 25,
                        "feedback": "Crucial digital hygiene! Cyclones do not trigger tsunamis (undersea earthquakes do). Verifying official sources prevents dangerous panic stampedes."
                    },
                    {
                        "action": "Forward the message immediately to every family and college group so people start running.",
                        "points": 0,
                        "feedback": "Spreading panic misinformation causes road accidents and stampedes across flooded streets."
                    },
                    {
                        "action": "Grab your things and run blindly toward the highway without checking any official source.",
                        "points": 0,
                        "feedback": "Abandoning safe campus shelter based on an unverified rumor exposes you to post-storm road hazards unnecessarily."
                    }
                ]
            }
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- Drill 5: Campus Auditorium Stampede & Mass Casualty Triage Drill (17 steps)
INSERT INTO public.drill_scenarios (id, title, steps)
VALUES
    (
        '66666666-6666-6666-6666-666666666605',
        'Campus Auditorium Stampede & Mass Casualty Triage Drill',
        '[
            {
                "step": 1,
                "scenario": "During an annual fest inside a packed 1,200-seat campus auditorium, an electrical spark from stage lights causes someone to scream FIRE and trigger sudden crowd panic.",
                "options": [
                    {
                        "action": "Stay calm on your feet, avoid joining the blind rush to the main double doors, and scan immediately for less crowded side or backstage emergency exits.",
                        "points": 30,
                        "feedback": "Life-saving awareness! Stampede fatalities occur overwhelmingly at familiar main entrances. Auxiliary side exits are typically much clearer."
                    },
                    {
                        "action": "Sprint full speed straight into the dense funnel of people pushing through the main entrance doors.",
                        "points": 0,
                        "feedback": "Deadly error! Main exit bottlenecks create fatal compressive forces where people get crushed against door frames."
                    },
                    {
                        "action": "Climb onto the top of folding auditorium chairs and jump across heads toward the exit.",
                        "points": 0,
                        "feedback": "Collapsing chairs and losing balance into a surging crowd almost guarantees severe trampling injuries."
                    }
                ]
            },
            {
                "step": 2,
                "scenario": "The crowd surges violently around you, compressing students tightly chest-to-back in the main aisle.",
                "options": [
                    {
                        "action": "Adopt the boxer stance: raise both forearms in front of your chest like a protective frame, keep feet planted slightly apart, and stay upright.",
                        "points": 30,
                        "feedback": "Vital crowd survival technique! Creating a rigid forearm cage around your ribcage preserves breathing room so your lungs can expand under pressure."
                    },
                    {
                        "action": "Let both arms hang straight down at your sides or keep hands in your pockets.",
                        "points": 0,
                        "feedback": "With arms pinned down, chest compression from the crowd prevents your ribcage from expanding, causing rapid compressive asphyxia."
                    },
                    {
                        "action": "Scream continuously at the top of your lungs while pushing against the person in front of you.",
                        "points": 0,
                        "feedback": "Screaming wastes vital oxygen and accelerates panic; pushing transfers shockwaves forward that knock people off their feet."
                    }
                ]
            },
            {
                "step": 3,
                "scenario": "A powerful crowd shockwave pushes laterally through the aisle, sweeping people sideways toward a wall.",
                "options": [
                    {
                        "action": "Move fluidly with the wave momentum while angling diagonally step-by-step toward the less congested outer edge or behind a sturdy pillar.",
                        "points": 25,
                        "feedback": "Smart physics! Never fight directly against mass crowd kinetic energy; angling diagonally lets you peel out of the main crush."
                    },
                    {
                        "action": "Plant your heels firmly and shove backward with all your strength against the oncoming crowd.",
                        "points": 0,
                        "feedback": "One person cannot stop the force of hundreds. Fighting directly against a crowd surge forces you backward off your balance."
                    },
                    {
                        "action": "Grab onto the clothing or backpack straps of strangers around you and pull them down for balance.",
                        "points": 0,
                        "feedback": "Pulling people down creates a human domino pileup, which is how lethal crowd crushes begin."
                    }
                ]
            },
            {
                "step": 4,
                "scenario": "Someone behind you accidentally steps on your heel and your shoe comes completely off in the moving crowd.",
                "options": [
                    {
                        "action": "Leave the shoe behind! Keep your head up, maintain your chest frame, and keep walking in step with the crowd.",
                        "points": 30,
                        "feedback": "Critical survival rule! Bending down to retrieve a dropped shoe or phone in a moving crowd almost guarantees being knocked down and trampled."
                    },
                    {
                        "action": "Stop and crouch down between people legs immediately to grab your shoe before it gets lost.",
                        "points": 0,
                        "feedback": "Fatal mistake! People behind cannot see you crouch and will surge right over you, burying you under fallen bodies."
                    },
                    {
                        "action": "Turn completely around against the crowd flow to shout at the person who stepped on your heel.",
                        "points": 0,
                        "feedback": "Turning against the flow breaks your balance and wastes critical seconds needed to exit safely."
                    }
                ]
            },
            {
                "step": 5,
                "scenario": "Despite staying alert, you trip over an overturned folding chair and fall onto the auditorium floor as people press forward.",
                "options": [
                    {
                        "action": "Curl immediately into a tight ball on your side: pull knees up to protect your stomach and ribs, and clasp hands firmly behind your head and neck.",
                        "points": 30,
                        "feedback": "Best defensive ground posture! Lying on your side prevents your chest from being crushed flat, while protecting your head, neck, and vital organs."
                    },
                    {
                        "action": "Lie completely flat on your back facing upward with arms spread wide.",
                        "points": 0,
                        "feedback": "Leaves your ribcage, sternum, face, and airway completely exposed to crushing foot impact."
                    },
                    {
                        "action": "Lie flat face-down on your stomach with your arms tucked underneath your chest.",
                        "points": 5,
                        "feedback": "Weight pressing directly on your back flattens your chest against the floor, rapidly preventing you from breathing. Curl onto your side instead."
                    }
                ]
            },
            {
                "step": 6,
                "scenario": "Seconds later, a brief gap opens in the crowd pressure right above you. What is your immediate priority?",
                "options": [
                    {
                        "action": "Push up rapidly using the seat legs or aisle barrier to get back onto your feet immediately in the direction of crowd movement.",
                        "points": 25,
                        "feedback": "Correct! Use every brief pause in crowd surge to regain your footing immediately before another wave hits."
                    },
                    {
                        "action": "Remain curled on the floor waiting until the entire auditorium empties completely.",
                        "points": 0,
                        "feedback": "Remaining on the floor increases the risk of suffocation if a crowd pileup forms over you."
                    },
                    {
                        "action": "Crawl slowly backward toward the stage against the incoming stream of evacuees.",
                        "points": 0,
                        "feedback": "Crawling against crowd momentum exposes you to repeated impacts from oncoming feet."
                    }
                ]
            },
            {
                "step": 7,
                "scenario": "You reach the auditorium side wall and spot a marked green Emergency Exit door with a panic bar that nobody is using yet.",
                "options": [
                    {
                        "action": "Push the crash bar wide open, wedge or hold the door open safely from the side, and call out clearly: SIDE EXIT OPEN HERE, WALK CALMLY!",
                        "points": 30,
                        "feedback": "Heroic leadership! Opening auxiliary exits instantly relieves pressure at congested bottlenecks and directs panicked crowds safely outward."
                    },
                    {
                        "action": "Slip out quietly by yourself and pull the door shut behind you so crowds do not follow you.",
                        "points": 0,
                        "feedback": "Leaving an emergency exit closed while others are crushed nearby costs lives."
                    },
                    {
                        "action": "Stand in the middle of the open doorway facing backward to wave people toward you.",
                        "points": 5,
                        "feedback": "Stand clear to the side of the door frame so rushing people do not slam you into the wall or block the opening."
                    }
                ]
            },
            {
                "step": 8,
                "scenario": "Once outside on the open campus plaza, you notice several injured and unconscious students lying on the pavement near the main doors.",
                "options": [
                    {
                        "action": "Ensure the immediate exit path is clear of ongoing crowd rush, dial national emergency number 112 / 102 and campus security, then begin rapid triage.",
                        "points": 30,
                        "feedback": "Proper mass-casualty protocol! Scene safety and calling professional emergency medical services (EMS) come before rendering first aid."
                    },
                    {
                        "action": "Pick up the nearest unconscious student under their arms and drag them quickly across the grass without checking injuries.",
                        "points": 0,
                        "feedback": "Never move an injured victim unnecessarily unless they are in immediate danger of fire or collapse — dragging can paralyze someone with a spinal injury."
                    },
                    {
                        "action": "Stand over the victims recording a live video stream to show how chaotic campus security is.",
                        "points": 0,
                        "feedback": "Filming victims delays life-saving basic first aid and crowds emergency treatment zones."
                    }
                ]
            },
            {
                "step": 9,
                "scenario": "You approach Victim A, who is lying motionless on the concrete plaza. They do not respond when you tap their shoulders and shout Are you okay?",
                "options": [
                    {
                        "action": "Open their airway carefully using head-tilt chin-lift (or jaw thrust if neck injury suspected) and look, listen, and feel for normal breathing for up to 10 seconds.",
                        "points": 30,
                        "feedback": "Textbook Basic Life Support! Checking responsiveness followed by a 10-second breathing check determines immediately whether CPR is needed."
                    },
                    {
                        "action": "Pour cold drinking water onto their face and into their mouth to wake them up.",
                        "points": 0,
                        "feedback": "Fatal choking risk! Never put fluids into the mouth of an unconscious person — they cannot swallow and will aspirate water into their lungs."
                    },
                    {
                        "action": "Walk away assuming they are deceased because they did not answer your shout.",
                        "points": 0,
                        "feedback": "Unresponsive victims may still be breathing or may be revivable immediately with CPR and defibrillation."
                    }
                ]
            },
            {
                "step": 10,
                "scenario": "Victim A is NOT breathing normally (only occasional gasping). Another student stands nearby ready to help.",
                "options": [
                    {
                        "action": "Point directly to the helper: You, call 102 and bring the campus AED from the sports block! Immediately start hard, fast chest compressions at 100 to 120 per minute.",
                        "points": 30,
                        "feedback": "Exemplary CPR response! Delegating specific tasks ensures an AED arrives rapidly while uninterrupted chest compressions circulate oxygen to the brain."
                    },
                    {
                        "action": "Wait peacefully beside the victim for 15 minutes until paramedics arrive with professional monitors.",
                        "points": 0,
                        "feedback": "Irreversible brain damage begins within 4 to 6 minutes of cardiac arrest without CPR. Immediate compressions double or triple survival chances."
                    },
                    {
                        "action": "Shake the victim vigorously and perform abdominal thrusts.",
                        "points": 0,
                        "feedback": "Abdominal thrusts are for conscious choking, not cardiac arrest. Chest compressions in the center of the chest are required."
                    }
                ]
            },
            {
                "step": 11,
                "scenario": "Another helper arrives with the Automated External Defibrillator (AED) while you perform chest compressions.",
                "options": [
                    {
                        "action": "Power on the AED immediately, expose and dry the victim chest, attach pads as pictured, and ensure nobody touches the victim during rhythm analysis or shock.",
                        "points": 30,
                        "feedback": "Flawless! AEDs automatically analyze heart rhythm and instruct you step-by-step. Ensuring everyone clears contact prevents accidental shocks."
                    },
                    {
                        "action": "Keep your hands pressing on the victim chest while the AED announces Analyzing rhythm, do not touch patient.",
                        "points": 0,
                        "feedback": "Movement or contact during rhythm analysis corrupts the ECG reading and risks shocking the rescuer."
                    },
                    {
                        "action": "Place the AED in your backpack because only licensed doctors are legally allowed to switch it on.",
                        "points": 0,
                        "feedback": "AEDs are specifically designed for trained and untrained bystanders during sudden cardiac arrest and save lives within critical early minutes."
                    }
                ]
            },
            {
                "step": 12,
                "scenario": "Nearby, Victim B is conscious and sitting up, clutching a deep glass cut on their forearm from a shattered exit door. Bright red blood is pulsing steadily out.",
                "options": [
                    {
                        "action": "Wear disposable gloves if available, place a clean cloth or sterile pad firmly over the wound, apply continuous direct pressure, and elevate the arm.",
                        "points": 30,
                        "feedback": "Gold-standard hemorrhage control! Sustained direct pressure is the fastest, safest way to stop life-threatening bleeding."
                    },
                    {
                        "action": "Pull the large glass shard out quickly, pour muddy fountain water on it, and leave it uncovered to dry.",
                        "points": 0,
                        "feedback": "Pulling out embedded objects can unleash massive arterial bleeding. Leave large embedded glass stabilized and apply pressure around the edges."
                    },
                    {
                        "action": "Wrap a loose handkerchief softly around the wrist without applying pressure so it does not hurt the student.",
                        "points": 0,
                        "feedback": "Without firm pressure over the bleeding site, bright red arterial blood loss can lead to hypovolemic shock within minutes."
                    }
                ]
            },
            {
                "step": 13,
                "scenario": "Victim C was trampled near the stairs. They are awake, complaining of sharp neck and upper back pain, and report tingling numbness in both hands.",
                "options": [
                    {
                        "action": "Tell them firmly not to move at all; kneel behind their head and gently hold their head and neck still in neutral alignment until paramedics apply a cervical collar.",
                        "points": 30,
                        "feedback": "Critical spinal precaution! Tingling and neck pain indicate possible spinal trauma. Manual in-line stabilization prevents permanent paralysis."
                    },
                    {
                        "action": "Help them stand up slowly and walk over to sit comfortably on a stone bench in the shade.",
                        "points": 0,
                        "feedback": "Moving a patient with an unstable cervical fracture can sever the spinal cord, causing irreversible quadriplegia or death."
                    },
                    {
                        "action": "Give them a gentle neck massage and rotate their head left and right to relieve muscle stiffness.",
                        "points": 0,
                        "feedback": "Never rotate or manipulate a painful neck after blunt trauma or trampling!"
                    }
                ]
            },
            {
                "step": 14,
                "scenario": "Victim D is breathing on their own but appears groggy and drowsy after fainting from heat exhaustion, with no suspected neck or back injuries.",
                "options": [
                    {
                        "action": "Place them gently onto their side in the Recovery Position so their tongue and fluids cannot block their airway, and monitor breathing continuously.",
                        "points": 25,
                        "feedback": "Correct! For a breathing unconscious or semi-conscious victim without spinal injury, the Recovery Position keeps the airway open and safe."
                    },
                    {
                        "action": "Leave them flat on their back with a thick backpack propped tightly under their chin.",
                        "points": 0,
                        "feedback": "Tucking the chin down against the chest blocks the airway, and lying flat on the back risks choking on vomit or the tongue."
                    },
                    {
                        "action": "Force them to drink strong black coffee immediately while half asleep.",
                        "points": 0,
                        "feedback": "Never force liquids into a drowsy or semi-conscious person due to high aspiration risk."
                    }
                ]
            },
            {
                "step": 15,
                "scenario": "Two campus ambulances and police emergency vehicles arrive at the main driveway, but uninjured onlookers are crowding around the casualty zone.",
                "options": [
                    {
                        "action": "Enlist uninjured volunteers to form a calm perimeter ring, clearing a wide unobstructed lane straight to the critical casualties.",
                        "points": 25,
                        "feedback": "Excellent crowd management! Keeping bystanders back protects victim privacy, prevents contamination, and speeds up stretcher loading."
                    },
                    {
                        "action": "Wave the ambulance driver away from the unconscious victim so they treat your scraped knee first.",
                        "points": 0,
                        "feedback": "Triage prioritizes life-threatening airway, breathing, and circulation emergencies over minor abrasions."
                    },
                    {
                        "action": "Let bystanders climb onto the ambulance bumper to watch paramedics load stretchers.",
                        "points": 0,
                        "feedback": "Obstructing emergency crews delays critical transport to trauma centers."
                    }
                ]
            },
            {
                "step": 16,
                "scenario": "The emergency paramedic leader asks you for a rapid handover summary for Victim B (the bleeding arm injury) before ambulance departure.",
                "options": [
                    {
                        "action": "Give a clear 15-second handover: Conscious 20-year-old, deep forearm glass laceration from exit door, direct pressure applied for 8 minutes, bleeding slowed, alert.",
                        "points": 25,
                        "feedback": "Professional clinical handover! Clear facts on mechanism of injury, interventions given, and response save emergency room triage time."
                    },
                    {
                        "action": "Launch into a 10-minute story about who shouted fire inside the auditorium and which band was performing.",
                        "points": 0,
                        "feedback": "Irrelevant background details delay life-saving medical transport and assessment."
                    },
                    {
                        "action": "Shrug and walk away without telling paramedics what first aid was already performed.",
                        "points": 5,
                        "feedback": "Paramedics need to know how long pressure or tourniquets have been applied and whether the patient lost consciousness."
                    }
                ]
            },
            {
                "step": 17,
                "scenario": "All casualties have been transported safely to the hospital. Many uninjured students are visibly shaken, crying, or repeating rumors about what caused the stampede.",
                "options": [
                    {
                        "action": "Participate in the official campus debriefing and counseling session, check on friends calmly, and share only verified facts with authorities.",
                        "points": 25,
                        "feedback": "Complete emergency recovery! Psychological first aid and factual post-incident reviews prevent acute trauma and improve future campus crowd safety."
                    },
                    {
                        "action": "Post dramatic exaggerated death counts on social media to gain followers before officials publish verified news.",
                        "points": 0,
                        "feedback": "Spreading false casualty numbers causes unbearable panic for parents and obstructs emergency command centers."
                    },
                    {
                        "action": "Mock classmates who are trembling or crying for being overly dramatic after a minor scare.",
                        "points": 0,
                        "feedback": "Dismissive mockery worsens post-traumatic stress. Compassion and peer support are vital after life-threatening crowd events."
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

