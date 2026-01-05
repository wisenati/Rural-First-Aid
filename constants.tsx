
import { EmergencyGuide, HealthFacility, Broadcast } from './types';

export const EMERGENCY_GUIDES: EmergencyGuide[] = [
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'If the person is pale, cold, or confused, they may be in shock. Keep them warm and lie them down.',
    whenToCallSOS: 'If bleeding doesn\'t stop after 10 minutes of continuous pressure or if a limb is severed.',
    steps: [
      { 
        text: 'Apply direct pressure with a clean cloth or your hands.', 
        feedback: 'Great. Keep pressing firmly. Don\'t lift it to check if it stopped.',
        critical: true 
      },
      { 
        text: 'Maintain pressure until bleeding stops or help arrives.', 
        feedback: 'You are doing well. Consistency is key here.' 
      },
      { 
        text: 'Keep the injured area elevated above the level of the heart.', 
        feedback: 'This helps slow the blood flow to the wound.' 
      },
      { 
        text: 'If blood soaks through, add another cloth on top. Do not remove the first one.', 
        feedback: 'Removing the first cloth can disturb clots already forming.' 
      }
    ]
  },
  {
    id: 'heart-attack',
    title: 'Heart Attack',
    icon: '🫀',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Keep the person seated and calm. If they have prescribed heart medicine, help them take it.',
    whenToCallSOS: 'Call IMMEDIATELY if chest pain lasts more than a few minutes or spreads to arms/neck.',
    steps: [
      { text: 'Have the person sit down, rest, and try to keep calm.', feedback: 'Calmness reduces the strain on the heart.' },
      { text: 'Loosen any tight clothing.', feedback: 'This helps with breathing.' },
      { text: 'Ask if they take chest pain medication (like nitroglycerin) and help them take it.', feedback: 'Only help if it is THEIR prescribed medication.' },
      { text: 'If they are fully conscious, have them chew one adult aspirin slowly.', feedback: 'Chewing helps it enter the bloodstream faster.', critical: true }
    ]
  },
  {
    id: 'snakebite',
    title: 'Snake Bite',
    icon: '🐍',
    image: 'https://images.unsplash.com/photo-1531333348332-d625a61a0703?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Note the time of the bite and the snake\'s appearance if possible. Transport the victim as quickly as possible.',
    whenToCallSOS: 'Always call for help for snake bites, as venom effects can be delayed.',
    steps: [
      { text: 'Keep the victim calm and still to slow the spread of venom.', feedback: 'Movement increases heart rate and spreads venom.', critical: true },
      { text: 'Keep the bite area at or slightly below the level of the heart.', feedback: 'Prevents venom from moving toward the heart too quickly.' },
      { text: 'Remove any jewelry or tight clothing before swelling begins.', feedback: 'Swelling happens very fast with snake bites.' },
      { text: 'Clean the wound with water, but do not flush it with high pressure.', feedback: 'Gentle cleaning is enough.' },
      { text: 'DO NOT cut the wound or try to suck out the venom.', feedback: 'This is dangerous and does not work.', critical: true }
    ]
  },
  {
    id: 'fracture',
    title: 'Broken Bone',
    icon: '🦴',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Check for circulation (warmth/pulse) below the injury. If the limb is blue or cold, it is an emergency.',
    whenToCallSOS: 'If the bone is sticking out, the limb is deformed, or the person can\'t move it.',
    steps: [
      { text: 'Do not try to realign the bone or push it back in.', feedback: 'You could cause more damage to nerves or vessels.' },
      { text: 'Apply a cold pack wrapped in a cloth to reduce swelling.', feedback: 'Do not put ice directly on the skin.' },
      { text: 'Immobilize the area using a splint (cardboard, wood, or even a rolled-up newspaper).', feedback: 'Secure it above and below the joint of the break.', critical: true },
      { text: 'Keep the person still and comfortable.', feedback: 'Moving can cause severe pain and further injury.' }
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    icon: '👤',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'If the person becomes unconscious, start CPR immediately.',
    whenToCallSOS: 'If the person cannot breathe, cough, or speak at all.',
    steps: [
      { text: 'Lean the person forward and give 5 firm back blows between shoulder blades.', feedback: 'Use the heel of your hand.', critical: true },
      { text: 'If object isn\'t out, give 5 abdominal thrusts (Heimlich maneuver).', feedback: 'Stand behind them, wrap arms around waist, and pull inward and upward.' },
      { text: 'Repeat 5 blows and 5 thrusts until the object is forced out or help arrives.', feedback: 'Stay focused. You are saving a life.' }
    ]
  },
  {
    id: 'poisoning',
    title: 'Poisoning',
    icon: '🧪',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
    furtherHelp: 'Try to identify what was swallowed and how much. Keep the container if possible.',
    whenToCallSOS: 'If the person is unconscious, having seizures, or having trouble breathing.',
    steps: [
      { text: 'Check if the person is awake and breathing.', feedback: 'Safety first.' },
      { text: 'If the poison is on the skin or in the eyes, rinse with lukewarm water for 15 minutes.', feedback: 'Flush thoroughly.' },
      { text: 'Do not induce vomiting unless told to do so by a professional.', feedback: 'Vomiting some poisons can burn the throat twice.', critical: true },
      { text: 'Get the person to a health facility immediately.', feedback: 'Speed is essential for poisoning.' }
    ]
  }
];

export const HEALTH_DIRECTORY: HealthFacility[] = [
  {
    name: 'Rural Hope Clinic',
    type: 'Clinic',
    distance: '1.2 km',
    phone: '+234 801 234 5678',
    address: 'Main St, Village Square'
  },
  {
    name: 'St. Mary’s General Hospital',
    type: 'Hospital',
    distance: '5.4 km',
    phone: '+234 703 444 9999',
    address: 'Township Road, Block B'
  },
  {
    name: 'Community Health Volunteer - Ade',
    type: 'Volunteer',
    distance: '0.3 km',
    phone: '+234 902 111 2222',
    address: 'House 4, Green Lane'
  }
];

export const MOCK_BROADCASTS: Broadcast[] = [
  {
    id: '1',
    title: 'Cholera Prevention',
    content: 'Ensure all water is boiled before drinking due to local outbreak concerns.',
    date: '2023-10-25',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Vaccination Schedule',
    content: 'Polio vaccinations for children under 5 will take place at the Community Hall this Saturday.',
    date: '2023-10-26',
    priority: 'low'
  }
];
