import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { BookingData } from '@features/booking/booking.config'
import tzStyles from '@features/booking/BookingModal.module.css'
import styles from '@features/booking/BookingModal.module.css'

// ── Timezone data ─────────────────────────────────────────────────────────────
export interface TimezoneEntry {
  value: string        // IANA key  e.g. "Asia/Kolkata"
  city: string         // e.g. "Mumbai / New Delhi"
  region: string       // e.g. "India"
  flag: string
  offset: string       // e.g. "GMT+5:30"
  label: string        // Full display label
  offsetMinutes: number // for sorting
}

const RAW_ZONES: Omit<TimezoneEntry, 'label'>[] = [
  { value: 'Pacific/Midway',         city: 'Midway Island',             region: 'Pacific',           flag: '🌊', offset: 'GMT-11:00', offsetMinutes: -660 },
  { value: 'Pacific/Honolulu',       city: 'Honolulu',                  region: 'Hawaii',            flag: '🌺', offset: 'GMT-10:00', offsetMinutes: -600 },
  { value: 'America/Anchorage',      city: 'Anchorage',                 region: 'Alaska',            flag: '🇺🇸', offset: 'GMT-9:00',  offsetMinutes: -540 },
  { value: 'America/Los_Angeles',    city: 'Los Angeles / Vancouver',   region: 'US / Canada West',  flag: '🇺🇸', offset: 'GMT-8:00',  offsetMinutes: -480 },
  { value: 'America/Denver',         city: 'Denver / Salt Lake City',   region: 'US Mountain',       flag: '🇺🇸', offset: 'GMT-7:00',  offsetMinutes: -420 },
  { value: 'America/Chicago',        city: 'Chicago / Mexico City',     region: 'US Central',        flag: '🇺🇸', offset: 'GMT-6:00',  offsetMinutes: -360 },
  { value: 'America/New_York',       city: 'New York / Toronto',        region: 'US / Canada East',  flag: '🇺🇸', offset: 'GMT-5:00',  offsetMinutes: -300 },
  { value: 'America/Caracas',        city: 'Caracas',                   region: 'Venezuela',         flag: '🇻🇪', offset: 'GMT-4:00',  offsetMinutes: -240 },
  { value: 'America/Sao_Paulo',      city: 'São Paulo / Buenos Aires',  region: 'South America',     flag: '🇧🇷', offset: 'GMT-3:00',  offsetMinutes: -180 },
  { value: 'Atlantic/Azores',        city: 'Azores',                    region: 'Portugal',          flag: '🇵🇹', offset: 'GMT-1:00',  offsetMinutes: -60  },
  { value: 'Europe/London',          city: 'London / Lisbon / Dublin',  region: 'UK / Ireland',      flag: '🇬🇧', offset: 'GMT+0:00',  offsetMinutes: 0    },
  { value: 'Europe/Paris',           city: 'Paris / Berlin / Rome',     region: 'Central Europe',    flag: '🇪🇺', offset: 'GMT+1:00',  offsetMinutes: 60   },
  { value: 'Europe/Athens',          city: 'Athens / Helsinki / Cairo', region: 'Eastern Europe',    flag: '🇬🇷', offset: 'GMT+2:00',  offsetMinutes: 120  },
  { value: 'Europe/Moscow',          city: 'Moscow / Nairobi',          region: 'Russia / Africa',   flag: '🇷🇺', offset: 'GMT+3:00',  offsetMinutes: 180  },
  { value: 'Asia/Dubai',             city: 'Dubai / Muscat',            region: 'Gulf',              flag: '🇦🇪', offset: 'GMT+4:00',  offsetMinutes: 240  },
  { value: 'Asia/Karachi',           city: 'Karachi / Islamabad',       region: 'Pakistan',          flag: '🇵🇰', offset: 'GMT+5:00',  offsetMinutes: 300  },
  { value: 'Asia/Kolkata',           city: 'Mumbai / New Delhi',        region: 'India',             flag: '🇮🇳', offset: 'GMT+5:30',  offsetMinutes: 330  },
  { value: 'Asia/Kathmandu',         city: 'Kathmandu',                 region: 'Nepal',             flag: '🇳🇵', offset: 'GMT+5:45',  offsetMinutes: 345  },
  { value: 'Asia/Dhaka',             city: 'Dhaka / Almaty',            region: 'Bangladesh',        flag: '🇧🇩', offset: 'GMT+6:00',  offsetMinutes: 360  },
  { value: 'Asia/Bangkok',           city: 'Bangkok / Hanoi / Jakarta', region: 'SE Asia',           flag: '🇹🇭', offset: 'GMT+7:00',  offsetMinutes: 420  },
  { value: 'Asia/Singapore',         city: 'Singapore / Kuala Lumpur',  region: 'Singapore',         flag: '🇸🇬', offset: 'GMT+8:00',  offsetMinutes: 480  },
  { value: 'Asia/Tokyo',             city: 'Tokyo / Seoul / Osaka',     region: 'Japan / Korea',     flag: '🇯🇵', offset: 'GMT+9:00',  offsetMinutes: 540  },
  { value: 'Australia/Adelaide',     city: 'Adelaide',                  region: 'Australia Central', flag: '🇦🇺', offset: 'GMT+9:30',  offsetMinutes: 570  },
  { value: 'Australia/Sydney',       city: 'Sydney / Melbourne',        region: 'Australia East',    flag: '🇦🇺', offset: 'GMT+10:00', offsetMinutes: 600  },
  { value: 'Pacific/Auckland',       city: 'Auckland / Wellington',     region: 'New Zealand',       flag: '🇳🇿', offset: 'GMT+12:00', offsetMinutes: 720  },
]

export const TIMEZONE_LIST: TimezoneEntry[] = RAW_ZONES.map(z => ({
  ...z,
  label: `${z.region} Standard Time (${z.offset})`,
}))

// ── Mobile full-screen sheet ──────────────────────────────────────────────────
function MobileSearchSheet({ query, filtered, selected, onQuery, onChoose, onClose }: {
  query: string
  filtered: TimezoneEntry[]
  selected: TimezoneEntry | null
  onQuery: (q: string) => void
  onChoose: (tz: TimezoneEntry) => void
  onClose: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className={tzStyles.mobileSheet} role="dialog" aria-modal="true" aria-label="Search timezone">
      <div className={tzStyles.mobileSheetHeader}>
        <div className={tzStyles.mobileSheetHandle} />
        <div className={tzStyles.mobileSearchRow}>
          <div className={tzStyles.mobileSearchWrap}>
            <svg className={tzStyles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              className={tzStyles.mobileSearchInput}
              type="search"
              inputMode="search"
              placeholder="Search country, city or GMT…"
              value={query}
              onChange={e => onQuery(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {query && (
              <button className={tzStyles.searchClear} onClick={() => onQuery('')} type="button" aria-label="Clear">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <button className={tzStyles.mobileCancelBtn} onClick={onClose} type="button">Cancel</button>
        </div>
      </div>

      <div className={tzStyles.mobileSheetList}>
        {filtered.length === 0 ? (
          <div className={tzStyles.emptyState}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            No results for "<strong>{query}</strong>"
          </div>
        ) : filtered.map(tz => (
          <button
            key={tz.value}
            className={`${tzStyles.mobileListItem} ${selected?.value === tz.value ? tzStyles.mobileListItemSelected : ''}`}
            onClick={() => onChoose(tz)}
            type="button"
          >
            <span className={tzStyles.itemFlag}>{tz.flag}</span>
            <span className={tzStyles.itemBody}>
              <span className={tzStyles.itemRegion}>{tz.region}</span>
              <span className={tzStyles.itemCity}>{tz.city}</span>
            </span>
            <span className={tzStyles.itemOffset}>{tz.offset}</span>
            {selected?.value === tz.value && (
              <svg className={tzStyles.itemCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  data: BookingData
  onNext: (d: Partial<BookingData>) => void
}

export function StepTimezone({ data, onNext }: Props) {
  const [selected, setSelected] = useState<TimezoneEntry | null>(
    () => data.timezone ? (TIMEZONE_LIST.find(z => z.value === data.timezone) ?? null) : null
  )
  // query always shows selected label if one is chosen, otherwise free text
  const [query, setQuery]             = useState(
    () => data.timezone ? (TIMEZONE_LIST.find(z => z.value === data.timezone)?.label ?? '') : ''
  )
  const [isDesktopOpen, setDesktopOpen] = useState(false)
  const [isMobileOpen, setMobileOpen]   = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLUListElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  // When user types in the desktop input, clear the selection
  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (selected) setSelected(null) // clear selection so they pick fresh
    setFocusedIndex(0)
    if (!isDesktopOpen) setDesktopOpen(true)
  }

  const filtered = useMemo(() => {
    // If a selection is made and query matches the label exactly, show all
    if (selected && query === selected.label) return TIMEZONE_LIST
    const q = query.toLowerCase().trim()
    if (!q) return TIMEZONE_LIST
    return TIMEZONE_LIST.filter(z =>
      z.region.toLowerCase().includes(q) ||
      z.city.toLowerCase().includes(q) ||
      z.offset.toLowerCase().includes(q) ||
      z.label.toLowerCase().includes(q)
    )
  }, [query, selected])

  // Close on outside click
  useEffect(() => {
    if (!isDesktopOpen) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        // If nothing selected, clear query too
        if (!selected) setQuery('')
        else setQuery(selected.label)
        setDesktopOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isDesktopOpen, selected])

  // Scroll focused item into view
  useEffect(() => {
    if (!listRef.current) return
    const item = listRef.current.children[focusedIndex] as HTMLElement
    item?.scrollIntoView({ block: 'nearest' })
  }, [focusedIndex])

  const choose = (tz: TimezoneEntry) => {
    setSelected(tz)
    setQuery(tz.label) // fill input with the selected label
    setDesktopOpen(false)
    setMobileOpen(false)
    setFocusedIndex(0)
  }

  // Mobile: when sheet closes after picking, sync query
  const chooseMobile = (tz: TimezoneEntry) => {
    setSelected(tz)
    setQuery(tz.label)
    setMobileOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDesktopOpen) {
      if (e.key === 'ArrowDown') { setDesktopOpen(true); setFocusedIndex(0) }
      return
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, filtered.length - 1)); break
      case 'ArrowUp':   e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); break
      case 'Enter':
        e.preventDefault()
        if (filtered[focusedIndex]) choose(filtered[focusedIndex])
        break
      case 'Escape':
        if (!selected) setQuery('')
        else setQuery(selected.label)
        setDesktopOpen(false)
        break
    }
  }

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIntro}>
        <h2 className={styles.stepTitle}>Your Timezone</h2>
        <p className={styles.stepDesc}>Search your country or city to find your timezone.</p>
      </div>

      {/* ── DESKTOP: single search input + inline dropdown ────────────── */}
      <div
        className={`${tzStyles.dropdownWrap} ${tzStyles.desktopOnly}`}
        ref={wrapRef}
        onKeyDown={handleKeyDown}
      >
        <div className={`${tzStyles.searchBoxWrap} ${isDesktopOpen ? tzStyles.searchBoxOpen : ''} ${selected ? tzStyles.searchBoxFilled : ''}`}>
          <svg className={tzStyles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          {selected && !isDesktopOpen && (
            <span className={tzStyles.selectedFlag}>{selected.flag}</span>
          )}
          <input
            ref={inputRef}
            className={tzStyles.searchBoxInput}
            type="text"
            placeholder="Search country, city or GMT offset…"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            onFocus={() => { setDesktopOpen(true); if (selected) { setQuery(''); setSelected(null) } }}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search timezones"
            aria-expanded={isDesktopOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          {(query || selected) && (
            <button
              className={tzStyles.searchClear}
              onClick={() => { setQuery(''); setSelected(null); setDesktopOpen(true); inputRef.current?.focus() }}
              type="button"
              aria-label="Clear"
              tabIndex={-1}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Selected chip — shown below input when something is chosen */}
        {selected && !isDesktopOpen && (
          <div className={tzStyles.selectedChip}>
            <span className={tzStyles.chipFlag}>{selected.flag}</span>
            <span className={tzStyles.chipBody}>
              <span className={tzStyles.chipRegion}>{selected.region}</span>
              <span className={tzStyles.chipOffset}>{selected.label}</span>
            </span>
            <svg className={tzStyles.chipCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}

        {/* Dropdown list */}
        {isDesktopOpen && (
          <div className={tzStyles.desktopDropdown}>
            <ul ref={listRef} className={tzStyles.desktopList} role="listbox">
              {filtered.length === 0 ? (
                <li className={tzStyles.emptyState}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  No results for "<strong>{query}</strong>"
                </li>
              ) : filtered.map((tz, i) => (
                <li
                  key={tz.value}
                  role="option"
                  aria-selected={selected?.value === tz.value}
                  className={`${tzStyles.listItem} ${selected?.value === tz.value ? tzStyles.listItemSelected : ''} ${focusedIndex === i ? tzStyles.listItemFocused : ''}`}
                  onClick={() => choose(tz)}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <span className={tzStyles.itemFlag}>{tz.flag}</span>
                  <span className={tzStyles.itemBody}>
                    <span className={tzStyles.itemRegion}>{tz.region}</span>
                    <span className={tzStyles.itemLabel}>{tz.label}</span>
                    <span className={tzStyles.itemCity}>{tz.city}</span>
                  </span>
                  <span className={tzStyles.itemOffset}>{tz.offset}</span>
                  {selected?.value === tz.value && (
                    <svg className={tzStyles.itemCheck} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── MOBILE: single tap-to-search button → full-screen sheet ──── */}
      <button
        type="button"
        className={`${tzStyles.mobileSearchTrigger} ${tzStyles.mobileOnly} ${selected ? tzStyles.searchBoxFilled : ''}`}
        onClick={() => setMobileOpen(true)}
      >
        <svg className={tzStyles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {selected ? (
          <span className={tzStyles.mobileTriggerFilled}>
            <span>{selected.flag}</span>
            <span>{selected.region} · {selected.offset}</span>
          </span>
        ) : (
          <span className={tzStyles.mobileTriggerPlaceholder}>Search country, city or GMT offset…</span>
        )}
        {selected && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </button>

      {isMobileOpen && (
        <MobileSearchSheet
          query={query}
          filtered={filtered}
          selected={selected}
          onQuery={q => { setQuery(q); if (selected) setSelected(null) }}
          onChoose={chooseMobile}
          onClose={() => {
            setMobileOpen(false)
            if (!selected) setQuery('')
          }}
        />
      )}

      <div className={styles.stepFooter}>
        <button
          className={styles.nextBtn}
          onClick={() => selected && onNext({ timezone: selected.value })}
          disabled={!selected}
          type="button"
        >
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
