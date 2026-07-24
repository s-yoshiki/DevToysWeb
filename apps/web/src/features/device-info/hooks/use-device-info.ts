'use client'

import { useEffect, useState } from 'react'

export type InfoRow = { label: { ja: string; en: string }; value: string }
export type InfoGroup = { title: { ja: string; en: string }; rows: InfoRow[] }

type BatteryLike = {
  level: number
  charging: boolean
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

type ConnectionLike = {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

const yesNo = (value: boolean) => (value ? 'Yes' : 'No')

const collect = (battery: BatteryLike | null): InfoGroup[] => {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: ConnectionLike
  }
  const connection = nav.connection

  const groups: InfoGroup[] = [
    {
      title: { ja: '画面', en: 'Screen' },
      rows: [
        {
          label: { ja: '解像度', en: 'Resolution' },
          value: `${window.screen.width} × ${window.screen.height}`,
        },
        {
          label: { ja: 'ビューポート', en: 'Viewport' },
          value: `${window.innerWidth} × ${window.innerHeight}`,
        },
        {
          label: { ja: 'ピクセル比', en: 'Pixel ratio' },
          value: String(window.devicePixelRatio),
        },
        { label: { ja: '色深度', en: 'Color depth' }, value: `${window.screen.colorDepth}-bit` },
        {
          label: { ja: '向き', en: 'Orientation' },
          value: window.screen.orientation?.type ?? '—',
        },
      ],
    },
    {
      title: { ja: 'ハードウェア', en: 'Hardware' },
      rows: [
        {
          label: { ja: 'CPU論理コア数', en: 'CPU cores' },
          value: String(navigator.hardwareConcurrency ?? '—'),
        },
        {
          label: { ja: 'メモリ (概算)', en: 'Device memory' },
          value: nav.deviceMemory ? `${nav.deviceMemory} GB` : '—',
        },
        {
          label: { ja: 'タッチポイント数', en: 'Touch points' },
          value: String(navigator.maxTouchPoints ?? 0),
        },
      ],
    },
    {
      title: { ja: 'ブラウザ', en: 'Browser' },
      rows: [
        { label: { ja: '言語', en: 'Language' }, value: navigator.language },
        {
          label: { ja: 'プラットフォーム', en: 'Platform' },
          value: navigator.platform || '—',
        },
        { label: { ja: 'オンライン', en: 'Online' }, value: yesNo(navigator.onLine) },
        {
          label: { ja: 'Cookie有効', en: 'Cookies enabled' },
          value: yesNo(navigator.cookieEnabled),
        },
        {
          label: { ja: 'タイムゾーン', en: 'Time zone' },
          value: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        { label: { ja: 'User Agent', en: 'User agent' }, value: navigator.userAgent },
      ],
    },
  ]

  if (connection) {
    groups.push({
      title: { ja: 'ネットワーク', en: 'Network' },
      rows: [
        { label: { ja: '接続種別', en: 'Effective type' }, value: connection.effectiveType ?? '—' },
        {
          label: { ja: '下り速度', en: 'Downlink' },
          value: connection.downlink != null ? `${connection.downlink} Mbps` : '—',
        },
        {
          label: { ja: 'RTT', en: 'Round-trip time' },
          value: connection.rtt != null ? `${connection.rtt} ms` : '—',
        },
        {
          label: { ja: 'データ節約', en: 'Save data' },
          value: yesNo(connection.saveData ?? false),
        },
      ],
    })
  }

  if (battery) {
    groups.push({
      title: { ja: 'バッテリー', en: 'Battery' },
      rows: [
        {
          label: { ja: '残量', en: 'Level' },
          value: `${Math.round(battery.level * 100)}%`,
        },
        { label: { ja: '充電中', en: 'Charging' }, value: yesNo(battery.charging) },
      ],
    })
  }

  return groups
}

export const useDeviceInfo = () => {
  const [groups, setGroups] = useState<InfoGroup[]>([])

  useEffect(() => {
    let active = true
    let battery: BatteryLike | null = null
    let onChange: (() => void) | null = null

    const refresh = () => {
      if (active) setGroups(collect(battery))
    }

    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryLike> }
    if (nav.getBattery) {
      nav
        .getBattery()
        .then((result) => {
          if (!active) return
          battery = result
          onChange = refresh
          result.addEventListener('levelchange', onChange)
          result.addEventListener('chargingchange', onChange)
          refresh()
        })
        .catch(refresh)
    } else {
      refresh()
    }

    window.addEventListener('resize', refresh)
    window.addEventListener('online', refresh)
    window.addEventListener('offline', refresh)

    return () => {
      active = false
      window.removeEventListener('resize', refresh)
      window.removeEventListener('online', refresh)
      window.removeEventListener('offline', refresh)
      if (battery && onChange) {
        battery.removeEventListener('levelchange', onChange)
        battery.removeEventListener('chargingchange', onChange)
      }
    }
  }, [])

  return groups
}
