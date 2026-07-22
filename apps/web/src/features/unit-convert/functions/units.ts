import type { Locale } from '@/i18n/dictionaries'

/**
 * Every unit is described by how it maps to its family's base unit, so a
 * conversion is always "into the base, then out of it". Temperature needs an
 * offset, which is why the mapping is a pair of functions rather than a factor.
 */
export type Unit = {
  id: string
  symbol: string
  name: Record<Locale, string>
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

export type UnitFamilyId =
  | 'length'
  | 'area'
  | 'volume'
  | 'weight'
  | 'temperature'
  | 'data'
  | 'speed'
  | 'time'
  | 'pressure'
  | 'angle'

export type UnitFamily = {
  id: UnitFamilyId
  name: Record<Locale, string>
  /** Unit selected when the family is opened. */
  defaultUnit: string
  units: Unit[]
}

const scaled = (id: string, symbol: string, ja: string, en: string, factor: number): Unit => ({
  id,
  symbol,
  name: { ja, en },
  toBase: (value) => value * factor,
  fromBase: (value) => value / factor,
})

const KIB = 1024

export const unitFamilies: UnitFamily[] = [
  {
    id: 'length',
    name: { ja: '長さ', en: 'Length' },
    defaultUnit: 'm',
    units: [
      scaled('nm', 'nm', 'ナノメートル', 'Nanometre', 1e-9),
      scaled('um', 'µm', 'マイクロメートル', 'Micrometre', 1e-6),
      scaled('mm', 'mm', 'ミリメートル', 'Millimetre', 0.001),
      scaled('cm', 'cm', 'センチメートル', 'Centimetre', 0.01),
      scaled('m', 'm', 'メートル', 'Metre', 1),
      scaled('km', 'km', 'キロメートル', 'Kilometre', 1000),
      scaled('in', 'in', 'インチ', 'Inch', 0.0254),
      scaled('ft', 'ft', 'フィート', 'Foot', 0.3048),
      scaled('yd', 'yd', 'ヤード', 'Yard', 0.9144),
      scaled('mi', 'mi', 'マイル', 'Mile', 1609.344),
      scaled('nmi', 'nmi', '海里', 'Nautical mile', 1852),
      scaled('shaku', '尺', '尺', 'Shaku', 10 / 33),
      scaled('ken', '間', '間', 'Ken', 60 / 33),
      scaled('ri', '里', '里', 'Ri', 43_200 / 11),
    ],
  },
  {
    id: 'area',
    name: { ja: '面積', en: 'Area' },
    defaultUnit: 'm2',
    units: [
      scaled('mm2', 'mm²', '平方ミリメートル', 'Square millimetre', 1e-6),
      scaled('cm2', 'cm²', '平方センチメートル', 'Square centimetre', 1e-4),
      scaled('m2', 'm²', '平方メートル', 'Square metre', 1),
      scaled('a', 'a', 'アール', 'Are', 100),
      scaled('ha', 'ha', 'ヘクタール', 'Hectare', 10_000),
      scaled('km2', 'km²', '平方キロメートル', 'Square kilometre', 1e6),
      scaled('in2', 'in²', '平方インチ', 'Square inch', 0.00064516),
      scaled('ft2', 'ft²', '平方フィート', 'Square foot', 0.09290304),
      scaled('yd2', 'yd²', '平方ヤード', 'Square yard', 0.83612736),
      scaled('acre', 'acre', 'エーカー', 'Acre', 4046.8564224),
      scaled('mi2', 'mi²', '平方マイル', 'Square mile', 2_589_988.110336),
      scaled('tsubo', '坪', '坪', 'Tsubo', 400 / 121),
      scaled('tatami', '畳', '畳（中京間）', 'Tatami', 200 / 121),
    ],
  },
  {
    id: 'volume',
    name: { ja: '体積', en: 'Volume' },
    defaultUnit: 'l',
    units: [
      scaled('ml', 'mL', 'ミリリットル', 'Millilitre', 0.001),
      scaled('dl', 'dL', 'デシリットル', 'Decilitre', 0.1),
      scaled('l', 'L', 'リットル', 'Litre', 1),
      scaled('m3', 'm³', '立方メートル', 'Cubic metre', 1000),
      scaled('cm3', 'cm³', '立方センチメートル', 'Cubic centimetre', 0.001),
      scaled('in3', 'in³', '立方インチ', 'Cubic inch', 0.016387064),
      scaled('ft3', 'ft³', '立方フィート', 'Cubic foot', 28.316846592),
      scaled('tsp', 'tsp', '小さじ', 'Teaspoon', 0.00492892159375),
      scaled('tbsp', 'tbsp', '大さじ', 'Tablespoon', 0.01478676478125),
      scaled('cup', 'cup', 'カップ（米）', 'Cup (US)', 0.2365882365),
      scaled('flozus', 'fl oz', '液量オンス（米）', 'Fluid ounce (US)', 0.0295735295625),
      scaled('ptus', 'pt', 'パイント（米）', 'Pint (US)', 0.473176473),
      scaled('galus', 'gal', 'ガロン（米）', 'Gallon (US)', 3.785411784),
      scaled('galuk', 'gal (UK)', 'ガロン（英）', 'Gallon (UK)', 4.54609),
      scaled('gou', '合', '合', 'Gou', 2401 / 13_310),
      scaled('sho', '升', '升', 'Sho', 24_010 / 13_310),
    ],
  },
  {
    id: 'weight',
    name: { ja: '重さ', en: 'Weight' },
    defaultUnit: 'kg',
    units: [
      scaled('mg', 'mg', 'ミリグラム', 'Milligram', 1e-6),
      scaled('g', 'g', 'グラム', 'Gram', 0.001),
      scaled('kg', 'kg', 'キログラム', 'Kilogram', 1),
      scaled('t', 't', 'トン', 'Tonne', 1000),
      scaled('gr', 'gr', 'グレーン', 'Grain', 0.00006479891),
      scaled('oz', 'oz', 'オンス', 'Ounce', 0.028349523125),
      scaled('lb', 'lb', 'ポンド', 'Pound', 0.45359237),
      scaled('stone', 'st', 'ストーン', 'Stone', 6.35029318),
      scaled('tonus', 'ton (US)', 'ショートトン', 'Short ton', 907.18474),
      scaled('tonuk', 'ton (UK)', 'ロングトン', 'Long ton', 1016.0469088),
      scaled('monme', '匁', '匁', 'Monme', 0.00375),
      scaled('kin', '斤', '斤', 'Kin', 0.6),
      scaled('kan', '貫', '貫', 'Kan', 3.75),
    ],
  },
  {
    id: 'temperature',
    name: { ja: '温度', en: 'Temperature' },
    defaultUnit: 'c',
    units: [
      {
        id: 'c',
        symbol: '°C',
        name: { ja: 'セルシウス度', en: 'Celsius' },
        toBase: (value) => value,
        fromBase: (value) => value,
      },
      {
        id: 'f',
        symbol: '°F',
        name: { ja: '華氏', en: 'Fahrenheit' },
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      {
        id: 'k',
        symbol: 'K',
        name: { ja: 'ケルビン', en: 'Kelvin' },
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
      {
        id: 'r',
        symbol: '°R',
        name: { ja: 'ランキン度', en: 'Rankine' },
        toBase: (value) => ((value - 491.67) * 5) / 9,
        fromBase: (value) => ((value + 273.15) * 9) / 5,
      },
    ],
  },
  {
    id: 'data',
    name: { ja: 'データ容量', en: 'Data' },
    defaultUnit: 'mb',
    units: [
      scaled('bit', 'bit', 'ビット', 'Bit', 0.125),
      scaled('byte', 'B', 'バイト', 'Byte', 1),
      scaled('kb', 'kB', 'キロバイト (10³)', 'Kilobyte (10³)', 1e3),
      scaled('mb', 'MB', 'メガバイト (10⁶)', 'Megabyte (10⁶)', 1e6),
      scaled('gb', 'GB', 'ギガバイト (10⁹)', 'Gigabyte (10⁹)', 1e9),
      scaled('tb', 'TB', 'テラバイト (10¹²)', 'Terabyte (10¹²)', 1e12),
      scaled('pb', 'PB', 'ペタバイト (10¹⁵)', 'Petabyte (10¹⁵)', 1e15),
      scaled('kib', 'KiB', 'キビバイト (2¹⁰)', 'Kibibyte (2¹⁰)', KIB),
      scaled('mib', 'MiB', 'メビバイト (2²⁰)', 'Mebibyte (2²⁰)', KIB ** 2),
      scaled('gib', 'GiB', 'ギビバイト (2³⁰)', 'Gibibyte (2³⁰)', KIB ** 3),
      scaled('tib', 'TiB', 'テビバイト (2⁴⁰)', 'Tebibyte (2⁴⁰)', KIB ** 4),
      scaled('pib', 'PiB', 'ペビバイト (2⁵⁰)', 'Pebibyte (2⁵⁰)', KIB ** 5),
    ],
  },
  {
    id: 'speed',
    name: { ja: '速さ', en: 'Speed' },
    defaultUnit: 'kmh',
    units: [
      scaled('ms', 'm/s', 'メートル毎秒', 'Metre per second', 1),
      scaled('kmh', 'km/h', 'キロメートル毎時', 'Kilometre per hour', 1 / 3.6),
      scaled('mph', 'mph', 'マイル毎時', 'Mile per hour', 0.44704),
      scaled('fts', 'ft/s', 'フィート毎秒', 'Foot per second', 0.3048),
      scaled('knot', 'kn', 'ノット', 'Knot', 1852 / 3600),
      scaled('mach', 'Mach', 'マッハ（海面）', 'Mach (sea level)', 340.29),
    ],
  },
  {
    id: 'time',
    name: { ja: '時間', en: 'Time' },
    defaultUnit: 's',
    units: [
      scaled('ns', 'ns', 'ナノ秒', 'Nanosecond', 1e-9),
      scaled('us', 'µs', 'マイクロ秒', 'Microsecond', 1e-6),
      scaled('ms', 'ms', 'ミリ秒', 'Millisecond', 0.001),
      scaled('s', 's', '秒', 'Second', 1),
      scaled('min', 'min', '分', 'Minute', 60),
      scaled('h', 'h', '時間', 'Hour', 3600),
      scaled('d', 'd', '日', 'Day', 86_400),
      scaled('week', 'week', '週', 'Week', 604_800),
      scaled('month', 'month', 'ヶ月（30日）', 'Month (30 days)', 2_592_000),
      scaled('year', 'year', '年（365日）', 'Year (365 days)', 31_536_000),
    ],
  },
  {
    id: 'pressure',
    name: { ja: '圧力', en: 'Pressure' },
    defaultUnit: 'hpa',
    units: [
      scaled('pa', 'Pa', 'パスカル', 'Pascal', 1),
      scaled('hpa', 'hPa', 'ヘクトパスカル', 'Hectopascal', 100),
      scaled('kpa', 'kPa', 'キロパスカル', 'Kilopascal', 1000),
      scaled('mpa', 'MPa', 'メガパスカル', 'Megapascal', 1e6),
      scaled('bar', 'bar', 'バール', 'Bar', 100_000),
      scaled('atm', 'atm', '気圧', 'Atmosphere', 101_325),
      scaled('mmhg', 'mmHg', '水銀柱ミリメートル', 'Millimetre of mercury', 133.322387415),
      scaled('psi', 'psi', 'ポンド毎平方インチ', 'Pound per square inch', 6894.757293168),
    ],
  },
  {
    id: 'angle',
    name: { ja: '角度', en: 'Angle' },
    defaultUnit: 'deg',
    units: [
      scaled('deg', '°', '度', 'Degree', 1),
      scaled('rad', 'rad', 'ラジアン', 'Radian', 180 / Math.PI),
      scaled('grad', 'grad', 'グラード', 'Gradian', 0.9),
      scaled('arcmin', "'", '分（角）', 'Arcminute', 1 / 60),
      scaled('arcsec', '"', '秒（角）', 'Arcsecond', 1 / 3600),
      scaled('turn', 'turn', '回転', 'Turn', 360),
    ],
  },
]

export const findFamily = (id: UnitFamilyId) =>
  unitFamilies.find((family) => family.id === id) ?? unitFamilies[0]

export const findUnit = (family: UnitFamily, unitId: string) =>
  family.units.find((unit) => unit.id === unitId) ?? family.units[0]

/** Converts through the family's base unit. */
export const convertUnit = (value: number, from: Unit, to: Unit) => to.fromBase(from.toBase(value))

/**
 * Readable across the ~30 orders of magnitude the data and length families span:
 * exponential notation at the extremes, trimmed fixed notation in between.
 */
export const formatUnitValue = (value: number) => {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  const magnitude = Math.abs(value)
  if (magnitude >= 1e15 || magnitude < 1e-6) return value.toExponential(6).replace(/e([+-])/, 'e$1')
  const decimals = magnitude >= 100 ? 4 : magnitude >= 1 ? 6 : 10
  return value
    .toFixed(decimals)
    .replace(/\.?0+$/, '')
    .replace(/^-0$/, '0')
}
