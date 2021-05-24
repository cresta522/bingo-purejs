$(document).ready(() => {
  const bingo = new Bingo
  bingo.initialize()

  $('.btn-dice').on('click', () => {
    bingo.dice()
  })
  $('.btn-reset').on('click', () => {
    bingo.reset()
  })
})

class Bingo {


  /**
   * 選択されていない数字配列
   */
  unselected_numbers = []

  /**
   * 選ばれた数字配列
   */
  selected_numbers = []

  /**
   * ヒットした座標記録シート
   */
  hit_sheet = []

  /**
   * 現在何回目か
   */
  cur_count = 0

  /**
   * 現在のヒット数
   */
  hit_count = 0

  constructor() {
    this.initializeUnselectedNumbers()
  }

  /**
   * 初期化
   */
  initialize = () => {
    $('.reach-cnt').text(0)
    $('.try-cnt').text(0)
    $('.hit-cnt').text(0)
    $('.hit-rate').text(0)
    $('.text-bingo').text('')
    $('#diced_numbers').text('')
    $('.btn-dice').attr('disabled', false)

    this.cur_count = 0
    this.hit_count = 0

    this.initializeUnselectedNumbers()
    this.initializeDashboard()
    $('table').removeClass('d-none')
    $('td').removeClass('bg-success')
  }

  /**
   *
   */
  initializeDashboard = () => {

    for (let row = 1; row <= 5; row++) {
      this.hit_sheet[row - 1] = []
      for (let col = 1; col <= 5; col++) {
        const selected_number = this.getRundomNumber()

        $(`[data-row=${row}][data-col=${col}]`).text(selected_number).attr('data-value', selected_number)
        this.hit_sheet[row - 1][col - 1] = 0
      }
    }

    // 振り直すためにリセット
    this.initializeUnselectedNumbers()
  }

  dice = () => {
    this.cur_count++
    const selected_number = this.getRundomNumber()

    // hit チェック
    const $diced_elem = $(`[data-value=${selected_number}]`)
    if ($diced_elem.length) {
      this.hit_count++
      $diced_elem.addClass('bg-success')

      // ヒットシートに記録
      const row_idx = $diced_elem.data('row') - 1
      const col_idx = $diced_elem.data('col') - 1
      this.hit_sheet[row_idx][col_idx] = 1

    }

    this.setTryCount()
    this.setHitCount()
    this.setDicedNumbers()
    this.setReachCount()
    this.judgeBingo()

  }

  /**
   * リセット
   */
  reset = () => {
    this.initialize()
  }

  /**
   * リーチの数を数える
   */
  countReach = () => {
    return this.countLineSum(4);
  }

  /**
   * リーチの数の表示
   */
  setReachCount = () => {
    $('.reach-cnt').text(this.countReach())
  }

  setTryCount = () => {
    $('.try-cnt').text(this.cur_count)
  }

  setHitCount = () => {
    $('.hit-cnt').text(this.hit_count)
    // レート
    $('.hit-rate').text(parseInt((this.hit_count / this.cur_count) * 100))

  }

  setDicedNumbers = () => {
    $('#diced_numbers').text(this.selected_numbers.join(','))
  }

  /**
   * ビンゴ判定
   *
   */
  isBingo = () => {
    return this.countLineSum(5) > 0;
  }

  judgeBingo = () => {
    if (this.isBingo()) {
      $('.text-bingo').text('BINGO!!')
      $('.btn-dice').attr('disabled', true)
    }
  }

  // -------------数字に関して

  /**
   * 数字列の初期化
   */
  initializeUnselectedNumbers = () => {
    this.unselected_numbers = []
    this.selected_numbers = []
    for (let index = 1; index < 100; index++) {
      this.unselected_numbers.push(index)
    }
  }

  /**
   * 数字列の取得
   * @returns array
   */
  getUnselectedNumbers = () => {
    return this.unselected_numbers
  }

  /**
   * 乱数の取得
   * @returns number
   */
  getRundomNumber = () => {
    const selected_number = this.unselected_numbers[Math.floor(Math.random() * this.unselected_numbers.length)]
    this.removeNumber(selected_number)
    return selected_number
  }

  /**
   * 選択されていない数字列から選択された数値を除外
   * @param {number} num 除去する数値
   */
  removeNumber = (num) => {
    const index = this.unselected_numbers.indexOf(num)
    this.unselected_numbers.splice(index, 1)
    this.selected_numbers.push(num)
  }

  /**
   * 行・列・斜めの合計値が判定値かどうか判断する
   * @param {number} judgeline 判定する限界値
   * @returns number
   */
  countLineSum = (judgeline) => {
    let reached_count = 0
    for (let row = 0; row < 5; row++) {
      // 行
      const row_total = this.hit_sheet[row].reduce((sum, element) => {
        return sum + element;
      }, 0);
      if (row_total === judgeline) {
        reached_count++
      }

      // 列
      let col_total = 0
      for (let col = 0; col < 5; col++) {
        col_total += this.hit_sheet[col][row]
      }
      if (col_total === judgeline) {
        reached_count++
      }

      // 斜め
      let upper_left_count = 0
      upper_left_count += this.hit_sheet[row][row]
      if (upper_left_count === judgeline) {
        reached_count++
      }
      let upper_right_count = 0
      upper_right_count += this.hit_sheet[row][4 - row]
      if (upper_right_count === judgeline) {
        reached_count++
      }
    }

    return reached_count;
  }
}
