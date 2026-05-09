export interface BookingData {
  timezone: string
  sessionType: string
  service: string
  date: string
  timeSlot: string
  name: string
  email: string
  phone: string
  message: string
}

export type StepId = 'timezone' | 'sessionType' | 'service' | 'date' | 'timeSlot' | 'review'

export interface BookingStep {
  id: StepId
  label: string
  description: string
}

export const BOOKING_STEPS: BookingStep[] = [
  { id: 'timezone',    label: 'Your Location',  description: 'Select your timezone so we schedule at the right time for you.' },
  { id: 'sessionType', label: 'Session Type',   description: "Choose the kind of wellness experience you're looking for." },
  { id: 'service',     label: 'Service Type',   description: 'Select the specific service you would like to book.' },
  { id: 'date',        label: 'Pick a Date',    description: 'Select a date that works for you.' },
  { id: 'timeSlot',    label: 'Choose Time',    description: 'Pick an available time slot.' },
  { id: 'review',      label: 'Review & Send',  description: 'Confirm your details and send the booking request.' },
]

export const TIMEZONES = [
  { value: 'Asia/Kolkata',       label: 'India (IST, UTC+5:30)',      flag: '🇮🇳' },
  { value: 'America/New_York',   label: 'US East (EST/EDT)',           flag: '🇺🇸' },
  { value: 'America/Los_Angeles',label: 'US West (PST/PDT)',           flag: '🇺🇸' },
  { value: 'America/Chicago',    label: 'US Central (CST/CDT)',        flag: '🇺🇸' },
  { value: 'Europe/London',      label: 'UK (GMT/BST)',                flag: '🇬🇧' },
  { value: 'Europe/Berlin',      label: 'Central Europe (CET/CEST)',   flag: '🇪🇺' },
  { value: 'Asia/Dubai',         label: 'Gulf (GST, UTC+4)',           flag: '🇦🇪' },
  { value: 'Asia/Singapore',     label: 'Singapore (SGT, UTC+8)',      flag: '🇸🇬' },
  { value: 'Australia/Sydney',   label: 'Australia East (AEST)',       flag: '🇦🇺' },
  { value: 'Asia/Tokyo',         label: 'Japan (JST, UTC+9)',          flag: '🇯🇵' },
  { value: 'America/Toronto',    label: 'Canada East (ET)',            flag: '🇨🇦' },
  { value: 'Asia/Karachi',       label: 'Pakistan (PKT, UTC+5)',       flag: '🇵🇰' },
]

export const SESSION_TYPES = [
  { id: 'corporate',    icon: '🏢', label: 'Corporate Sessions',          description: 'Wellness programs for teams and organizations',   duration: '60–90 min', format: 'Group'     },
  { id: 'online-1on1', icon: '🧘', label: 'Online 1-on-1',               description: 'Personal yoga & pranayama tailored to you',       duration: '45–60 min', format: 'Private'   },
  { id: 'online-group',icon: '🌐', label: 'Online Group Class',           description: 'Live virtual sessions with a small group',        duration: '60 min',    format: 'Group'     },
  { id: 'sound',       icon: '🎵', label: 'Offline Sound Healing',        description: 'In-person sound bath and healing session',        duration: '75 min',    format: 'In-person' },
  { id: 'offline',     icon: '🪷', label: 'Offline Individual / Group',   description: 'In-person yoga at a scheduled location',         duration: '60 min',    format: 'In-person' },
]

export const TIME_SLOTS = [
  { id: 'morning-1',   label: '6:00 AM',  period: 'Morning',   available: true  },
  { id: 'morning-2',   label: '7:30 AM',  period: 'Morning',   available: true  },
  { id: 'morning-3',   label: '9:00 AM',  period: 'Morning',   available: true  },
  { id: 'afternoon-1', label: '12:00 PM', period: 'Afternoon', available: false },
  { id: 'afternoon-2', label: '2:30 PM',  period: 'Afternoon', available: true  },
  { id: 'afternoon-3', label: '4:00 PM',  period: 'Afternoon', available: true  },
  { id: 'evening-1',   label: '5:30 PM',  period: 'Evening',   available: true  },
  { id: 'evening-2',   label: '7:00 PM',  period: 'Evening',   available: true  },
  { id: 'evening-3',   label: '8:30 PM',  period: 'Evening',   available: false },
]