import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { analyzeCron, cronFieldValues } from './cron'

const en = (expression: string) => analyzeCron(expression).description.en
const ja = (expression: string) => analyzeCron(expression).description.ja

describe('analyzeCron descriptions', () => {
  it('reads a fixed time as a clock reading', () => {
    assert.equal(en('0 9 * * *'), 'At 09:00.')
    assert.equal(ja('0 9 * * *'), '毎日09:00に実行')
    assert.equal(en('30 8 * * 1'), 'At 08:30 on Monday.')
    assert.equal(ja('30 8 * * 1'), '毎週月曜日の08:30に実行')
  })

  it('describes wildcards and steps', () => {
    assert.equal(en('* * * * *'), 'At every minute.')
    assert.equal(ja('* * * * *'), '毎分に実行')
    assert.equal(en('*/5 * * * *'), 'At every 5th minute.')
    assert.equal(ja('*/5 * * * *'), '5分ごとに実行')
    assert.equal(en('0 */2 * * *'), 'At minute 0 past every 2nd hour.')
    assert.equal(ja('0 */2 * * *'), '2時間ごとの0分に実行')
  })

  it('combines a stepped minute with an hour range', () => {
    assert.equal(
      en('*/15 9-17 * * 1-5'),
      'At every 15th minute past every hour from 9 through 17 on every day-of-week from Monday through Friday.',
    )
    assert.equal(ja('*/15 9-17 * * 1-5'), '毎週月曜日から金曜日の9時から17時の15分ごとに実行')
  })

  it('names months and merges a fixed date', () => {
    assert.equal(en('0 0 1 1 *'), 'At 00:00 on day-of-month 1 in January.')
    assert.equal(ja('0 0 1 1 *'), '毎年1月1日の00:00に実行')
    assert.equal(en('0 0 1 * *'), 'At 00:00 on day-of-month 1.')
    assert.equal(ja('0 0 1 * *'), '毎月1日の00:00に実行')
  })

  it('treats a restricted day-of-month and day-of-week as alternatives', () => {
    assert.equal(en('0 0 1 * 1'), 'At 00:00 on day-of-month 1 or on Monday.')
    assert.equal(ja('0 0 1 * 1'), '毎月1日または月曜日の00:00に実行')
    assert.ok(analyzeCron('0 0 1 * 1').note)
    assert.equal(analyzeCron('0 0 1 * *').note, null)
  })

  it('accepts name aliases and lists', () => {
    assert.equal(en('0 0 * * MON-FRI'), 'At 00:00 on every day-of-week from Monday through Friday.')
    assert.equal(en('0 0 * JAN,JUL *'), 'At 00:00 in January and July.')
    assert.equal(ja('0 0 * JAN,JUL *'), '毎年1月、7月の00:00に実行')
    assert.equal(en('0 9,17 * * *'), 'At minute 0 past hour 9 and hour 17.')
  })

  it('describes the L, W and # operators', () => {
    assert.equal(en('0 0 L * *'), 'At 00:00 on the last day of the month.')
    assert.equal(ja('0 0 L * *'), '毎月月末の00:00に実行')
    assert.equal(en('0 0 L-3 * *'), 'At 00:00 on 3 days before the last day of the month.')
    assert.equal(en('0 0 15W * *'), 'At 00:00 on the weekday nearest day-of-month 15.')
    assert.equal(en('0 0 * * 5L'), 'At 00:00 on the last Friday of the month.')
    assert.equal(en('0 9 ? * 2#1'), 'At 09:00 on the 1st Tuesday of the month.')
    assert.equal(ja('0 9 ? * 2#1'), '毎週第1火曜日の09:00に実行')
  })

  it('expands macros', () => {
    assert.equal(analyzeCron('@daily').normalized, '0 0 * * *')
    assert.equal(en('@daily'), 'At 00:00.')
    assert.equal(en('@weekly'), 'At 00:00 on Sunday.')
    assert.equal(analyzeCron('@hourly').fields.length, 5)
  })

  it('reads the optional seconds field', () => {
    const analysis = analyzeCron('30 0 9 * * *')
    assert.equal(analysis.hasSeconds, true)
    assert.equal(analysis.fields[0].name, 'second')
    assert.equal(analysis.description.en, 'At 09:00:30.')
    assert.equal(en('*/5 * * * * *'), 'At every 5th second.')
    assert.equal(ja('*/5 * * * * *'), '5秒ごとに実行')
  })

  it('rejects malformed expressions', () => {
    assert.throws(() => analyzeCron(''), /Enter a cron expression/)
    assert.throws(() => analyzeCron('* * *'), /Expected 5 fields/)
    assert.throws(() => analyzeCron('60 * * * *'), /out of the 0-59 range/)
    assert.throws(() => analyzeCron('* 24 * * *'), /out of the 0-23 range/)
    assert.throws(() => analyzeCron('* * 0 * *'), /out of the 1-31 range/)
    assert.throws(() => analyzeCron('* * * FOO *'), /not a valid month/)
    assert.throws(() => analyzeCron('* * * * 9'), /out of the 0-7 range/)
    assert.throws(() => analyzeCron('17-5 * * * *'), /ends before it starts/)
    assert.throws(() => analyzeCron('*/0 * * * *'), /not a valid step/)
    assert.throws(() => analyzeCron('* ? * * *'), /is only allowed/, 'the ? guard is field scoped')
    assert.throws(() => analyzeCron('@reboot'), /runs once at startup/)
  })
})

describe('cronFieldValues', () => {
  it('lists the instants a field matches', () => {
    const [minute, hour] = analyzeCron('*/20 9-11 * * *').fields
    assert.equal(cronFieldValues(minute, 'en'), '0, 20, 40')
    assert.equal(cronFieldValues(hour, 'en'), '9, 10, 11')
  })

  it('collapses a wildcard instead of listing every value', () => {
    const [, , dayOfMonth] = analyzeCron('0 0 * * *').fields
    assert.equal(cronFieldValues(dayOfMonth, 'en'), 'every value (1-31)')
    assert.equal(cronFieldValues(dayOfMonth, 'ja'), 'すべて (1-31)')
  })

  it('folds day-of-week 7 onto Sunday', () => {
    const dayOfWeek = analyzeCron('0 0 * * 0,7').fields[4]
    assert.equal(cronFieldValues(dayOfWeek, 'en'), 'Sunday')
  })

  it('truncates a long expansion', () => {
    const minute = analyzeCron('* 0 * * *').fields[0]
    assert.ok(cronFieldValues(minute, 'en').endsWith('every value (0-59)'))
    const listed = analyzeCron('0-20 0 * * *').fields[0]
    assert.ok(cronFieldValues(listed, 'en').endsWith('…'))
  })
})
