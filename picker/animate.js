let running = {} // 运行
let counter = 1 // 计时器
let desiredFrames = 60 // 每秒多少帧
let millisecondsPerSecond = 1000 // 每秒的毫秒数

const Animate = {
  // 停止动画
  stop (id) {
    var cleared = running[id] != null
    if (cleared) {
      running[id] = null
    }
    return cleared
  },

  // 判断给定的动画是否还在运行
  isRunning (id) {
    return running[id] != null
  },
  start (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
    let start = Date.now()
    let percent = 0 // 百分比
    let id = counter++
    let dropCounter = 0

    let step = function () {
      let now = Date.now()

      if (!running[id] || (verifyCallback && !verifyCallback(id))) {
        running[id] = null
        completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false)
        return
      }

      if (duration) {
        percent = (now - start) / duration
        if (percent > 1) {
          percent = 1
        }
      }
      let value = easingMethod ? easingMethod(percent) : percent
      if (percent !== 1 && ( !verifyCallback || verifyCallback(id))) {
        stepCallback(value)
        window.requestAnimationFrame(step)
      }
    }

    running[id] = true
    window.requestAnimationFrame(step)
    return id
  }
}
