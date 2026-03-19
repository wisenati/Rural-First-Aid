
import { EmergencyGuide, HealthFacility, Broadcast } from './types';

export const EMERGENCY_GUIDES: EmergencyGuide[] = [
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    category: 'Trauma',
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'If the person is pale, cold, or confused, they may be in shock. Keep them warm and lie them down.',
    whenToCallSOS: 'If bleeding doesn\'t stop after 10 minutes of continuous pressure or if a limb is severed.',
    steps: [
      { 
        text: 'Apply direct pressure with a clean cloth or your hands.', 
        feedback: 'Great. Keep pressing firmly. Don\'t lift it to check if it stopped.',
        critical: true,
        mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'
      },
      { 
        text: 'Maintain pressure until bleeding stops or help arrives.', 
        feedback: 'You are doing well. Consistency is key here.',
        mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800'
      },
      { 
        text: 'Keep the injured area elevated above the level of the heart.', 
        feedback: 'This helps slow the blood flow to the wound.',
        mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
      },
      { 
        text: 'If blood soaks through, add another cloth on top. Do not remove the first one.', 
        feedback: 'Removing the first cloth can disturb clots already forming.',
        mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'heart-attack',
    title: 'Heart Attack',
    category: 'Medical',
    icon: '🫀',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Keep the person seated and calm. If they have prescribed heart medicine, help them take it.',
    whenToCallSOS: 'Call IMMEDIATELY if chest pain lasts more than a few minutes or spreads to arms/neck.',
    steps: [
      { text: 'Have the person sit down, rest, and try to keep calm.', feedback: 'Calmness reduces the strain on the heart.', mediaUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800' },
      { text: 'Loosen any tight clothing.', feedback: 'This helps with breathing.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'Ask if they take chest pain medication (like nitroglycerin) and help them take it.', feedback: 'Only help if it is THEIR prescribed medication.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'If they are fully conscious, have them chew one adult aspirin slowly.', feedback: 'Chewing helps it enter the bloodstream faster.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'burns',
    title: 'Severe Burns',
    category: 'Trauma',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Do not apply butter, grease, or ointments to the burn. Do not pop blisters.',
    whenToCallSOS: 'If the burn is larger than the person\'s palm, involves the face, hands, or genitals, or is deep.',
    steps: [
      { text: 'Stop the burning process. Remove the person from the heat source.', feedback: 'Safety first for both you and the victim.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
      { text: 'Cool the burn with cool (not cold) running water for at least 20 minutes.', feedback: 'This stops the heat from continuing to damage deeper tissues.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Remove jewelry or tight clothing before swelling occurs.', feedback: 'Swelling happens quickly and can cut off circulation.', mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Cover the burn loosely with a clean, non-stick bandage or plastic wrap.', feedback: 'This protects the area from infection and reduces pain.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'snakebite',
    title: 'Snake Bite',
    category: 'Environmental',
    icon: '🐍',
    image: 'https://images.unsplash.com/photo-1531333348332-d625a61a0703?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Note the time of the bite and the snake\'s appearance if possible. Transport the victim as quickly as possible.',
    whenToCallSOS: 'Always call for help for snake bites, as venom effects can be delayed.',
    steps: [
      { text: 'Keep the victim calm and still to slow the spread of venom.', feedback: 'Movement increases heart rate and spreads venom.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1531333348332-d625a61a0703?auto=format&fit=crop&q=80&w=800' },
      { text: 'Keep the bite area at or slightly below the level of the heart.', feedback: 'Prevents venom from moving toward the heart too quickly.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Remove any jewelry or tight clothing before swelling begins.', feedback: 'Swelling happens very fast with snake bites.', mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Clean the wound with water, but do not flush it with high pressure.', feedback: 'Gentle cleaning is enough.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'DO NOT cut the wound or try to suck out the venom.', feedback: 'This is dangerous and does not work.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'shock',
    title: 'Shock',
    category: 'Medical',
    icon: '😨',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Signs of shock include cold/clammy skin, rapid pulse, and confusion.',
    whenToCallSOS: 'Shock is a life-threatening emergency. Call for help immediately.',
    steps: [
      { text: 'Lay the person down and elevate their legs about 12 inches.', feedback: 'This helps blood flow to the vital organs.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'Keep the person warm with a blanket or extra clothing.', feedback: 'Maintaining body temperature is crucial.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Loosen tight clothing and keep them comfortable.', feedback: 'Ease their breathing.', mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Do not give them anything to eat or drink.', feedback: 'They may need surgery or could choke.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'fracture',
    title: 'Broken Bone',
    category: 'Trauma',
    icon: '🦴',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Check for circulation (warmth/pulse) below the injury. If the limb is blue or cold, it is an emergency.',
    whenToCallSOS: 'If the bone is sticking out, the limb is deformed, or the person can\'t move it.',
    steps: [
      { text: 'Do not try to realign the bone or push it back in.', feedback: 'You could cause more damage to nerves or vessels.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
      { text: 'Apply a cold pack wrapped in a cloth to reduce swelling.', feedback: 'Do not put ice directly on the skin.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Immobilize the area using a splint (cardboard, wood, or even a rolled-up newspaper).', feedback: 'Secure it above and below the joint of the break.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Keep the person still and comfortable.', feedback: 'Moving can cause severe pain and further injury.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    category: 'Medical',
    icon: '👤',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'If the person becomes unconscious, start CPR immediately.',
    whenToCallSOS: 'If the person cannot breathe, cough, or speak at all.',
    steps: [
      { text: 'Lean the person forward and give 5 firm back blows between shoulder blades.', feedback: 'Use the heel of your hand.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'If object isn\'t out, give 5 abdominal thrusts (Heimlich maneuver).', feedback: 'Stand behind them, wrap arms around waist, and pull inward and upward.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Repeat 5 blows and 5 thrusts until the object is forced out or help arrives.', feedback: 'Stay focused. You are saving a life.', mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'allergic-reaction',
    title: 'Allergic Reaction',
    category: 'Medical',
    icon: '🐝',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Anaphylaxis is a severe reaction that can close the airway.',
    whenToCallSOS: 'If the person has trouble breathing, swelling of the tongue/throat, or hives.',
    steps: [
      { text: 'Ask if the person has an epinephrine auto-injector (EpiPen) and help them use it.', feedback: 'Inject into the outer thigh and hold for 10 seconds.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Have the person sit up if they are having trouble breathing.', feedback: 'This position makes it easier to breathe.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'If they are dizzy or in shock, lay them flat with legs elevated.', feedback: 'Helps maintain blood pressure.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Remove the trigger if possible (e.g., a bee stinger).', feedback: 'Scrape it off with a card, don\'t squeeze it.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning',
    category: 'Environmental',
    icon: '🧪',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Try to identify what was swallowed and how much. Keep the container if possible.',
    whenToCallSOS: 'If the person is unconscious, having seizures, or having trouble breathing.',
    steps: [
      { text: 'Check if the person is awake and breathing.', feedback: 'Safety first.', mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'If the poison is on the skin or in the eyes, rinse with lukewarm water for 15 minutes.', feedback: 'Flush thoroughly.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'Do not induce vomiting unless told to do so by a professional.', feedback: 'Vomiting some poisons can burn the throat twice.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Get the person to a health facility immediately.', feedback: 'Speed is essential for poisoning.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'seizure',
    title: 'Seizure / Fits',
    category: 'Medical',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Most seizures last only a few minutes. Stay with the person until they are fully awake.',
    whenToCallSOS: 'If the seizure lasts more than 5 minutes, if they have another one immediately, or if they are pregnant/injured.',
    steps: [
      { text: 'Clear the area of any hard or sharp objects.', feedback: 'This prevents injury during the seizure.', mediaUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800' },
      { text: 'Place something soft (like a folded jacket) under their head.', feedback: 'Protects the head from hitting the ground.', mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'Do not restrain the person or try to stop their movements.', feedback: 'Restraining can cause bone or muscle injury.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'DO NOT put anything in the person\'s mouth.', feedback: 'They will not swallow their tongue, but they could choke on an object.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Time the seizure from start to finish.', feedback: 'This information is vital for medical professionals.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
      { text: 'Once the shaking stops, gently roll them onto their side (recovery position).', feedback: 'This keeps their airway clear.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1531333348332-d625a61a0703?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'cpr',
    title: 'CPR Basics',
    category: 'Medical',
    icon: '🫀',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'CPR helps keep oxygenated blood flowing to the brain and other vital organs.',
    whenToCallSOS: 'Call IMMEDIATELY if the person is unresponsive and not breathing or only gasping.',
    steps: [
      { text: 'Check for responsiveness. Tap their shoulder and shout.', feedback: 'Ensure they actually need help.', mediaUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800' },
      { text: 'Check for breathing for no more than 10 seconds.', feedback: 'If not breathing, start compressions immediately.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
      { text: 'Push hard and fast in the center of the chest (30 compressions).', feedback: 'Push at least 2 inches deep at a rate of 100-120 beats per minute.', critical: true, mediaUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800' },
      { text: 'Give 2 rescue breaths (if trained and comfortable).', feedback: 'Tilt the head back, lift the chin, and pinch the nose.', mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800' },
      { text: 'Continue cycles of 30 compressions and 2 breaths until help arrives.', feedback: 'Don\'t stop unless you are too exhausted to continue or help takes over.', mediaUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800' }
    ]
  }
];

// Baseline static facilities (Emergency Services only)
export const HEALTH_DIRECTORY: HealthFacility[] = [
  {
    name: 'National Emergency Service',
    type: 'Hospital',
    distance: 'Regional',
    phone: '112',
    address: 'National'
  }
];

export const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    content: 'Drink at least 8 glasses of water daily to keep your body functioning optimally.',
    date: 'Daily',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Hand Hygiene',
    content: 'Wash your hands frequently with soap and water for at least 20 seconds.',
    date: 'Daily',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Balanced Diet',
    content: 'Incorporate more fruits and vegetables into your meals for essential vitamins.',
    date: 'Daily',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Regular Exercise',
    content: 'Aim for at least 30 minutes of moderate physical activity most days of the week.',
    date: 'Daily',
    priority: 'high'
  },
  {
    id: '5',
    title: 'Sleep Well',
    content: 'Ensure you get 7-9 hours of quality sleep each night for mental and physical health.',
    date: 'Daily',
    priority: 'high'
  }
];
